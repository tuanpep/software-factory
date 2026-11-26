use serde_json::Value;
use std::{
    fs,
    path::Path,
    process::{Command, Output},
};
use tempfile::tempdir;

fn fixture() -> &'static Path {
    Path::new("tests/fixtures/docs-link")
}

fn factory(dir: &Path, args: &[&str]) -> Output {
    Command::new(env!("CARGO_BIN_EXE_factory"))
        .current_dir(dir)
        .args(args)
        .output()
        .unwrap()
}

fn assert_code(output: &Output, code: i32) -> Value {
    assert_eq!(
        output.status.code(),
        Some(code),
        "{}\n{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    serde_json::from_slice(&output.stdout).unwrap()
}

fn stage(dir: &Path) {
    fs::create_dir_all(dir.join("base/docs")).unwrap();
    for name in ["setup.md", "install.md", "overview.md"] {
        fs::copy(
            fixture().join("base/docs").join(name),
            dir.join("base/docs").join(name),
        )
        .unwrap();
    }
    for name in [
        "request.json",
        "wrong-destination.json",
        "unrelated-edit.json",
    ] {
        fs::copy(fixture().join(name), dir.join(name)).unwrap();
    }
}

const PREPARE: &[&str] = &[
    "prepare",
    "--request",
    "request.json",
    "--base",
    "base",
    "--out",
    "prepared",
];

fn verify(dir: &Path, candidate: &str, out: &str) -> Output {
    factory(
        dir,
        &[
            "verify",
            "--run-spec",
            "prepared/run.json",
            "--base",
            "base",
            "--candidate",
            candidate,
            "--out",
            out,
        ],
    )
}

#[test]
fn rejects_candidate_from_a_different_run() {
    let temp = tempdir().unwrap();
    let dir = temp.path();
    stage(dir);
    assert_code(&factory(dir, PREPARE), 0);
    let mut request: Value =
        serde_json::from_slice(&fs::read(dir.join("request.json")).unwrap()).unwrap();
    request["runId"] = 1043.into();
    fs::write(
        dir.join("other-request.json"),
        serde_json::to_vec(&request).unwrap(),
    )
    .unwrap();
    assert_code(
        &factory(
            dir,
            &[
                "prepare",
                "--request",
                "other-request.json",
                "--base",
                "base",
                "--out",
                "other",
            ],
        ),
        0,
    );
    assert_code(
        &factory(
            dir,
            &[
                "propose",
                "--run-spec",
                "other/run.json",
                "--base",
                "base",
                "--out",
                "other-candidate.json",
            ],
        ),
        0,
    );
    assert_eq!(
        assert_code(&verify(dir, "other-candidate.json", "rejected"), 3)["reason"],
        "candidate_intent_mismatch"
    );
    assert!(!dir.join("rejected/review.patch").exists());
}

#[test]
fn replay_matches_three_expected_verdicts() {
    let temp = tempdir().unwrap();
    let suite = fixture().canonicalize().unwrap();
    assert_code(
        &factory(
            temp.path(),
            &["replay", "--suite", suite.to_str().unwrap(), "--out", "out"],
        ),
        0,
    );
    let report: Value =
        serde_json::from_slice(&fs::read(temp.path().join("out/report.json")).unwrap()).unwrap();
    assert_eq!(report["passed"], true);
    assert_eq!(report["cases"].as_array().unwrap().len(), 3);
}

#[test]
fn prepare_propose_verify_and_reject_without_overwriting() {
    let temp = tempdir().unwrap();
    let dir = temp.path();
    stage(dir);
    assert_code(&factory(dir, PREPARE), 0);
    assert_eq!(
        assert_code(&factory(dir, PREPARE), 2)["reason"],
        "output_already_exists"
    );
    assert_code(
        &factory(
            dir,
            &[
                "propose",
                "--run-spec",
                "prepared/run.json",
                "--base",
                "base",
                "--out",
                "candidate.json",
            ],
        ),
        0,
    );
    for (candidate, reason) in [
        ("wrong-destination.json", "destination_not_approved"),
        ("unrelated-edit.json", "invalid_candidate_schema"),
    ] {
        let out = candidate.trim_end_matches(".json");
        assert_eq!(
            assert_code(&verify(dir, candidate, out), 3)["reason"],
            reason
        );
        assert!(dir.join(out).join("receipt.json").is_file());
        assert!(!dir.join(out).join("review.patch").exists());
    }
    assert_eq!(
        assert_code(&verify(dir, "candidate.json", "verified"), 0)["status"],
        "ready"
    );
    let patch = fs::read_to_string(dir.join("verified/review.patch")).unwrap();
    assert!(patch.contains("+Read the [installation guide](./install.md) first."));
    let receipt: Value =
        serde_json::from_slice(&fs::read(dir.join("verified/receipt.json")).unwrap()).unwrap();
    use sha2::{Digest, Sha256};
    assert_eq!(
        receipt["patchSha256"],
        format!("{:x}", Sha256::digest(patch.as_bytes()))
    );
    assert_eq!(
        fs::read(dir.join("base/docs/setup.md")).unwrap(),
        fs::read(fixture().join("base/docs/setup.md")).unwrap()
    );
    fs::write(
        dir.join("base/docs/install.md"),
        "Changed after preparation",
    )
    .unwrap();
    assert_eq!(
        assert_code(&verify(dir, "candidate.json", "stale"), 2)["reason"],
        "stale_or_invalid_run_spec"
    );
    assert!(!dir.join("stale").exists());
}

#[test]
fn refuses_unsupported_link_and_paths_outside_snapshot() {
    let temp = tempdir().unwrap();
    let dir = temp.path();
    stage(dir);
    fs::write(
        dir.join("base/docs/setup.md"),
        "[link][ref]\n\n[ref]: ./old-install.md\n",
    )
    .unwrap();
    assert_eq!(
        assert_code(&factory(dir, PREPARE), 2)["reason"],
        "unsupported_link_syntax"
    );
    let request_path = dir.join("request.json");
    let mut request: Value = serde_json::from_slice(&fs::read(&request_path).unwrap()).unwrap();
    request["destination"] = "../../outside.md".into();
    fs::write(&request_path, serde_json::to_vec(&request).unwrap()).unwrap();
    assert_eq!(
        assert_code(&factory(dir, PREPARE), 2)["reason"],
        "unsupported_relative_destination"
    );
    assert!(!dir.join("prepared").exists());
}

#[test]
fn rejects_missing_arguments_ambiguous_link_and_valid_baseline() {
    let temp = tempdir().unwrap();
    let dir = temp.path();
    stage(dir);
    assert_eq!(
        assert_code(&factory(dir, &["prepare"]), 2)["reason"],
        "invalid_arguments"
    );
    fs::write(
        dir.join("base/docs/setup.md"),
        "[one](./old-install.md) [two](./old-install.md)\n",
    )
    .unwrap();
    assert_eq!(
        assert_code(&factory(dir, PREPARE), 2)["reason"],
        "source_link_ambiguous"
    );
    fs::write(dir.join("base/docs/setup.md"), "[one](./old-install.md)\n").unwrap();
    fs::write(dir.join("base/docs/old-install.md"), "exists").unwrap();
    assert_eq!(
        assert_code(&factory(dir, PREPARE), 2)["reason"],
        "baseline_link_already_resolves"
    );
    assert!(!dir.join("prepared").exists());
}
