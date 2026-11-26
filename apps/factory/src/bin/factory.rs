use clap::{Parser, Subcommand};
use serde::{Deserialize, Serialize};
use software_factory::{
    adapters::{self, DirectorySnapshot},
    factory::{self, CandidateEdit, Failure, Request, RunSpec, Status},
};
use std::{
    fs, io,
    path::{Path, PathBuf},
    process::ExitCode,
};

#[derive(Parser)]
#[command(
    version,
    about = "Verify a bounded software factory edit",
    after_help = "Example: factory replay --suite tests/fixtures/docs-link --out ./replay"
)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Pin approved intent against a staged base.
    #[command(
        after_help = "Example: factory prepare --request request.json --base base --out prepared"
    )]
    Prepare {
        #[arg(long)]
        request: PathBuf,
        #[arg(long)]
        base: PathBuf,
        #[arg(long)]
        out: PathBuf,
    },
    /// Produce a deterministic structured edit.
    #[command(
        after_help = "Example: factory propose --run-spec prepared/run.json --base base --out candidate.json"
    )]
    Propose {
        #[arg(long)]
        run_spec: PathBuf,
        #[arg(long)]
        base: PathBuf,
        #[arg(long)]
        out: PathBuf,
    },
    /// Write a receipt and, only on success, a review patch.
    #[command(
        after_help = "Example: factory verify --run-spec prepared/run.json --base base --candidate candidate.json --out verified"
    )]
    Verify {
        #[arg(long)]
        run_spec: PathBuf,
        #[arg(long)]
        base: PathBuf,
        #[arg(long)]
        candidate: PathBuf,
        #[arg(long)]
        out: PathBuf,
    },
    /// Compare saved candidate verdicts with fixture expectations.
    #[command(after_help = "Example: factory replay --suite tests/fixtures/docs-link --out replay")]
    Replay {
        #[arg(long)]
        suite: PathBuf,
        #[arg(long)]
        out: PathBuf,
    },
}

#[derive(Serialize)]
struct Outcome {
    status: &'static str,
    reason: &'static str,
    output: Option<PathBuf>,
}

fn main() -> ExitCode {
    let cli = match Cli::try_parse() {
        Ok(cli) => cli,
        Err(err) if err.exit_code() == 0 => err.exit(),
        Err(err) => {
            let _ = err.print();
            return report(
                2,
                Outcome {
                    status: "needs_input",
                    reason: "invalid_arguments",
                    output: None,
                },
            );
        }
    };
    let (code, outcome) = match run(cli.command) {
        Ok(result) => result,
        Err(err) => (
            exit(err.status),
            Outcome {
                status: label(err.status),
                reason: err.reason,
                output: None,
            },
        ),
    };
    report(code, outcome)
}

fn report(code: u8, outcome: Outcome) -> ExitCode {
    println!("{}", serde_json::json!(outcome));
    ExitCode::from(code)
}

fn label(status: Status) -> &'static str {
    match status {
        Status::Ready => "ready",
        Status::NeedsInput => "needs_input",
        Status::PolicyRejected => "policy_rejected",
        Status::VerificationFailed => "verification_failed",
        Status::InfrastructureFailed => "infrastructure_failed",
    }
}

fn exit(status: Status) -> u8 {
    match status {
        Status::Ready => 0,
        Status::NeedsInput | Status::PolicyRejected => 2,
        Status::VerificationFailed => 3,
        Status::InfrastructureFailed => 4,
    }
}

fn io_failure(err: io::Error) -> Failure {
    let (status, reason) = match err.kind() {
        io::ErrorKind::AlreadyExists => (Status::PolicyRejected, "output_already_exists"),
        io::ErrorKind::InvalidData | io::ErrorKind::InvalidInput | io::ErrorKind::NotFound => {
            (Status::PolicyRejected, "invalid_or_missing_file")
        }
        _ => (Status::InfrastructureFailed, "filesystem_operation_failed"),
    };
    eprintln!("{err}");
    Failure::new(status, reason)
}

fn run(command: Command) -> Result<(u8, Outcome), Failure> {
    let (status, reason, out) = match command {
        Command::Prepare { request, base, out } => {
            let request = adapters::read_json::<Request>(&request).map_err(io_failure)?;
            let snapshot = DirectorySnapshot::open(&base).map_err(io_failure)?;
            let spec = factory::prepare(request, &snapshot)?;
            fs::create_dir(&out).map_err(io_failure)?;
            let output = out.join("run.json");
            adapters::write_json(&output, &spec).map_err(io_failure)?;
            ("prepared", "intent_pinned", output)
        }
        Command::Propose {
            run_spec,
            base,
            out,
        } => {
            let spec = adapters::read_json::<RunSpec>(&run_spec).map_err(io_failure)?;
            let snapshot = DirectorySnapshot::open(&base).map_err(io_failure)?;
            adapters::write_json(&out, &factory::propose(&spec, &snapshot)?).map_err(io_failure)?;
            ("proposed", "candidate_created", out)
        }
        Command::Verify {
            run_spec,
            base,
            candidate,
            out,
        } => {
            let spec = adapters::read_json::<RunSpec>(&run_spec).map_err(io_failure)?;
            let snapshot = DirectorySnapshot::open(&base).map_err(io_failure)?;
            let result = factory::verify(&spec, &snapshot, read_candidate(&candidate)?)?;
            let status = result.receipt.status;
            let reason = result.receipt.reason;
            fs::create_dir(&out).map_err(io_failure)?;
            if let Some(patch) = result.patch {
                adapters::write_new(&out.join("review.patch"), patch.as_bytes())
                    .map_err(io_failure)?;
            }
            let output = out.join("receipt.json");
            adapters::write_json(&output, &result.receipt).map_err(io_failure)?;
            return Ok((
                exit(status),
                Outcome {
                    status: label(status),
                    reason,
                    output: Some(output),
                },
            ));
        }
        Command::Replay { suite, out } => return replay(&suite, &out),
    };
    Ok((
        0,
        Outcome {
            status,
            reason,
            output: Some(out),
        },
    ))
}

fn read_candidate(path: &Path) -> Result<Result<CandidateEdit, &'static str>, Failure> {
    match adapters::read_json(path) {
        Ok(edit) => Ok(Ok(edit)),
        Err(err) if err.kind() == io::ErrorKind::InvalidData => Ok(Err("invalid_candidate_schema")),
        Err(err) => Err(io_failure(err)),
    }
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Suite {
    version: u32,
    cases: Vec<Case>,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Case {
    name: String,
    expected: Status,
    reason: String,
}

fn replay(suite: &Path, out: &Path) -> Result<(u8, Outcome), Failure> {
    let manifest: Suite = adapters::read_json(&suite.join("suite.json")).map_err(io_failure)?;
    if manifest.version != 1 || manifest.cases.is_empty() || manifest.cases.len() > 100 {
        return Err(Failure::new(Status::PolicyRejected, "invalid_replay_suite"));
    }
    let mut results = Vec::new();
    let mut all_match = true;
    let request = adapters::read_json(&suite.join("request.json")).map_err(io_failure)?;
    let snapshot = DirectorySnapshot::open(&suite.join("base")).map_err(io_failure)?;
    let spec = factory::prepare(request, &snapshot)?;
    for case in manifest.cases {
        if case.name.is_empty()
            || !case
                .name
                .bytes()
                .all(|b| b.is_ascii_lowercase() || b == b'-')
        {
            return Err(Failure::new(Status::PolicyRejected, "invalid_fixture_name"));
        }
        let candidate = suite.join(format!("{}.json", case.name));
        let verdict = factory::verify(&spec, &snapshot, read_candidate(&candidate)?)?;
        let matched = verdict.receipt.status == case.expected
            && verdict.receipt.reason == case.reason
            && verdict.patch.is_some() == (case.expected == Status::Ready);
        all_match &= matched;
        results.push(
            serde_json::json!({"name": case.name, "matched": matched, "receipt": verdict.receipt}),
        );
    }
    fs::create_dir(out).map_err(io_failure)?;
    let output = out.join("report.json");
    adapters::write_json(
        &output,
        &serde_json::json!({"version": 1, "passed": all_match, "cases": results}),
    )
    .map_err(io_failure)?;
    Ok((
        if all_match { 0 } else { 3 },
        Outcome {
            status: if all_match {
                "replayed"
            } else {
                "verification_failed"
            },
            reason: if all_match {
                "all_fixture_verdicts_matched"
            } else {
                "fixture_verdict_mismatch"
            },
            output: Some(output),
        },
    ))
}
