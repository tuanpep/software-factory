use crate::jobs::docs_link;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::io;

const VERSION: u32 = 1;
const CANDIDATE_VERSION: u32 = 2;
const RECIPE: &str = "docs-link/v1";
const SELECTOR: &str = "approved-link";

#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Request {
    pub version: u32,
    pub run_id: u64,
    pub attempt: u32,
    pub issue_number: u64,
    pub base_revision: String,
    pub markdown_path: String,
    pub broken_link: String,
    pub destination: String,
}

#[derive(Debug, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RunSpec {
    request: Request,
    recipe: String,
    intent_digest: String,
    source_digest: String,
    target_digest: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct CandidateEdit {
    version: u32,
    intent_digest: String,
    selector_id: String,
    replacement_destination: String,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum Status {
    Ready,
    NeedsInput,
    PolicyRejected,
    VerificationFailed,
    InfrastructureFailed,
}

#[derive(Debug)]
pub struct Failure {
    pub status: Status,
    pub reason: &'static str,
}

impl Failure {
    pub fn new(status: Status, reason: &'static str) -> Self {
        Self { status, reason }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Receipt {
    version: u32,
    pub status: Status,
    pub reason: &'static str,
    run_id: u64,
    attempt: u32,
    base_revision: String,
    intent_digest: String,
    recipe: String,
    changed_paths: Vec<String>,
    before: &'static str,
    after: &'static str,
    patch_sha256: Option<String>,
    not_checked: [&'static str; 2],
}

pub struct Verification {
    pub receipt: Receipt,
    pub patch: Option<String>,
}

/// A staged snapshot, not an authority for GitHub identity or Git provenance.
pub trait Snapshot {
    fn read_file(&self, path: &str) -> io::Result<Option<Vec<u8>>>;
}

pub fn prepare(request: Request, snapshot: &impl Snapshot) -> Result<RunSpec, Failure> {
    Ok(prepare_inputs(request, snapshot)?.0)
}

fn prepare_inputs(
    request: Request,
    snapshot: &impl Snapshot,
) -> Result<(RunSpec, docs_link::Inputs), Failure> {
    if request.version != VERSION
        || request.run_id == 0
        || request.attempt != 1
        || request.issue_number == 0
        || request.base_revision.is_empty()
        || request.base_revision.len() > 128
    {
        return Err(Failure::new(
            Status::PolicyRejected,
            "invalid_request_metadata",
        ));
    }
    let inputs = docs_link::inspect(&request, snapshot)?;
    let spec =
        RunSpec {
            intent_digest: digest(&serde_json::to_vec(&request).map_err(|_| {
                Failure::new(Status::InfrastructureFailed, "intent_encoding_failed")
            })?),
            request,
            recipe: RECIPE.into(),
            source_digest: digest(inputs.source.as_bytes()),
            target_digest: digest(&inputs.target),
        };
    Ok((spec, inputs))
}

pub fn propose(spec: &RunSpec, snapshot: &impl Snapshot) -> Result<CandidateEdit, Failure> {
    check_spec(spec, snapshot)?;
    Ok(CandidateEdit {
        version: CANDIDATE_VERSION,
        intent_digest: spec.intent_digest.clone(),
        selector_id: SELECTOR.into(),
        replacement_destination: spec.request.destination.clone(),
    })
}

pub fn verify(
    spec: &RunSpec,
    snapshot: &impl Snapshot,
    candidate: Result<CandidateEdit, &'static str>,
) -> Result<Verification, Failure> {
    let inputs = check_spec(spec, snapshot)?;
    let accepted = candidate.and_then(|edit| {
        if edit.version != CANDIDATE_VERSION || edit.selector_id != SELECTOR {
            return Err("invalid_candidate_selector");
        }
        if edit.intent_digest != spec.intent_digest {
            return Err("candidate_intent_mismatch");
        }
        if edit.replacement_destination != spec.request.destination {
            return Err("destination_not_approved");
        }
        docs_link::make_patch(&spec.request, inputs)
    });
    let (status, reason, patch) = match accepted {
        Ok(patch) => (Status::Ready, "approved_link_repaired", Some(patch)),
        Err(reason) => (Status::VerificationFailed, reason, None),
    };
    Ok(Verification {
        receipt: Receipt {
            version: VERSION,
            status,
            reason,
            run_id: spec.request.run_id,
            attempt: spec.request.attempt,
            base_revision: spec.request.base_revision.clone(),
            intent_digest: spec.intent_digest.clone(),
            recipe: RECIPE.into(),
            changed_paths: patch
                .as_ref()
                .map(|_| vec![spec.request.markdown_path.clone()])
                .unwrap_or_default(),
            before: "original_destination_missing",
            after: if patch.is_some() {
                "approved_destination_resolves"
            } else {
                "not_accepted"
            },
            patch_sha256: patch.as_ref().map(|p| digest(p.as_bytes())),
            not_checked: [
                "linked content behavior",
                "GitHub identity and Git provenance (local snapshot)",
            ],
        },
        patch,
    })
}

fn check_spec(spec: &RunSpec, snapshot: &impl Snapshot) -> Result<docs_link::Inputs, Failure> {
    let (rebuilt, inputs) = prepare_inputs(spec.request.clone(), snapshot).map_err(|failure| {
        if failure.status == Status::InfrastructureFailed {
            failure
        } else {
            Failure::new(Status::PolicyRejected, "stale_or_invalid_run_spec")
        }
    })?;
    if &rebuilt != spec {
        return Err(Failure::new(
            Status::PolicyRejected,
            "stale_or_invalid_run_spec",
        ));
    }
    Ok(inputs)
}

fn digest(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}
