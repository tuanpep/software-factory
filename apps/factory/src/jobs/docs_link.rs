use crate::factory::{Failure, Request, Snapshot, Status};
use pulldown_cmark::{CowStr, Event, LinkType, Parser, Tag};
use similar::TextDiff;
use std::{io, ops::Range};

pub(crate) struct Inputs {
    pub source: String,
    pub target: Vec<u8>,
    destination: Range<usize>,
}

pub(crate) fn inspect(request: &Request, snapshot: &impl Snapshot) -> Result<Inputs, Failure> {
    let path = &request.markdown_path;
    if !path.starts_with("docs/") || !path.ends_with(".md") || !path.split('/').all(segment) {
        return Err(Failure::new(
            Status::PolicyRejected,
            "unsupported_markdown_path",
        ));
    }
    if request.broken_link.is_empty() || request.destination.is_empty() {
        return Err(Failure::new(
            Status::NeedsInput,
            "missing_link_or_destination",
        ));
    }
    let old = resolve(path, &request.broken_link)?;
    let new = resolve(path, &request.destination)?;
    let source =
        read(snapshot, path)?.ok_or(Failure::new(Status::NeedsInput, "markdown_file_missing"))?;
    let source = String::from_utf8(source)
        .map_err(|_| Failure::new(Status::PolicyRejected, "markdown_not_utf8"))?;
    if source.contains('\r') || source.contains('\0') {
        return Err(Failure::new(
            Status::PolicyRejected,
            "unsupported_markdown_encoding",
        ));
    }
    let destination = span(&source, &request.broken_link)
        .map_err(|reason| Failure::new(Status::NeedsInput, reason))?;
    if read(snapshot, &old)?.is_some() {
        return Err(Failure::new(
            Status::PolicyRejected,
            "baseline_link_already_resolves",
        ));
    }
    let target = read(snapshot, &new)?.ok_or(Failure::new(
        Status::NeedsInput,
        "approved_destination_missing",
    ))?;
    Ok(Inputs {
        source,
        target,
        destination,
    })
}

fn segment(s: &str) -> bool {
    !s.is_empty()
        && s != "."
        && s != ".."
        && !s.ends_with('.')
        && s.bytes()
            .all(|b| b.is_ascii_alphanumeric() || matches!(b, b'.' | b'_' | b'-'))
        && !matches!(
            s.split('.')
                .next()
                .unwrap_or("")
                .to_ascii_uppercase()
                .as_str(),
            "CON"
                | "PRN"
                | "AUX"
                | "NUL"
                | "COM1"
                | "COM2"
                | "COM3"
                | "COM4"
                | "COM5"
                | "COM6"
                | "COM7"
                | "COM8"
                | "COM9"
                | "LPT1"
                | "LPT2"
                | "LPT3"
                | "LPT4"
                | "LPT5"
                | "LPT6"
                | "LPT7"
                | "LPT8"
                | "LPT9"
        )
}

fn resolve(file: &str, link: &str) -> Result<String, Failure> {
    let denied = || Failure::new(Status::PolicyRejected, "unsupported_relative_destination");
    if link.len() > 512 || !link.ends_with(".md") {
        return Err(denied());
    }
    let mut parts: Vec<_> = file.split('/').collect();
    parts.pop();
    for component in link.split('/') {
        match component {
            "." => (),
            ".." if parts.pop().is_some() => (),
            value if segment(value) => parts.push(value),
            _ => return Err(denied()),
        }
    }
    Ok(parts.join("/"))
}

fn read(snapshot: &impl Snapshot, path: &str) -> Result<Option<Vec<u8>>, Failure> {
    snapshot.read_file(path).map_err(|err| match err.kind() {
        io::ErrorKind::InvalidData | io::ErrorKind::InvalidInput => {
            Failure::new(Status::PolicyRejected, "unsupported_snapshot_entry")
        }
        _ => Failure::new(Status::InfrastructureFailed, "snapshot_read_failed"),
    })
}

fn span(source: &str, expected: &str) -> Result<Range<usize>, &'static str> {
    let mut matches = spans(source, expected);
    let (kind, title, range) = matches.next().ok_or("source_link_not_found")?;
    if matches.next().is_some() {
        return Err("source_link_ambiguous");
    }
    destination_span(source, expected, kind, &title, range)
}

fn spans<'a>(
    source: &'a str,
    expected: &'a str,
) -> impl Iterator<Item = (LinkType, CowStr<'a>, Range<usize>)> {
    Parser::new(source)
        .into_offset_iter()
        .filter_map(move |(event, range)| match event {
            Event::Start(Tag::Link {
                link_type,
                dest_url,
                title,
                ..
            }) if dest_url.as_ref() == expected => Some((link_type, title, range)),
            _ => None,
        })
}

fn destination_span(
    source: &str,
    expected: &str,
    kind: LinkType,
    title: &str,
    range: Range<usize>,
) -> Result<Range<usize>, &'static str> {
    let suffix = format!("]({expected})");
    let raw = &source[range.clone()];
    if kind != LinkType::Inline
        || !title.is_empty()
        || !raw.starts_with('[')
        || !raw.ends_with(&suffix)
        || raw.contains('\n')
    {
        return Err("unsupported_link_syntax");
    }
    let end = range.end - 1;
    Ok(end - expected.len()..end)
}

pub(crate) fn make_patch(request: &Request, inputs: Inputs) -> Result<String, &'static str> {
    let mut changed = inputs.source.clone();
    let start = inputs.destination.start;
    changed.replace_range(inputs.destination, &request.destination);
    if spans(&changed, &request.destination)
        .filter_map(|(kind, title, range)| {
            destination_span(&changed, &request.destination, kind, &title, range).ok()
        })
        .all(|range| range != (start..start + request.destination.len()))
    {
        return Err("replacement_link_not_confirmed");
    }
    let path = &request.markdown_path;
    Ok(
        TextDiff::from_lines(inputs.source.as_str(), changed.as_str())
            .unified_diff()
            .header(&format!("a/{path}"), &format!("b/{path}"))
            .to_string(),
    )
}
