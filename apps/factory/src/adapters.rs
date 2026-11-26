use crate::factory::Snapshot;
use serde::{Serialize, de::DeserializeOwned};
use std::{
    fs::{self, File, OpenOptions},
    io::{self, Read, Write},
    path::{Path, PathBuf},
};

pub const JSON_LIMIT: u64 = 16 * 1024;
const FILE_LIMIT: u64 = 1024 * 1024;

pub struct DirectorySnapshot(PathBuf);

impl DirectorySnapshot {
    pub fn open(root: &Path) -> io::Result<Self> {
        let metadata = fs::symlink_metadata(root)?;
        if redirected(&metadata) || !metadata.is_dir() {
            return Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                "snapshot root must be a regular directory",
            ));
        }
        Ok(Self(fs::canonicalize(root)?))
    }
}

impl Snapshot for DirectorySnapshot {
    fn read_file(&self, path: &str) -> io::Result<Option<Vec<u8>>> {
        let mut full = self.0.clone();
        let mut parts = path.split('/').peekable();
        while let Some(part) = parts.next() {
            if part.is_empty()
                || matches!(part, "." | "..")
                || !part
                    .bytes()
                    .all(|b| b.is_ascii_alphanumeric() || matches!(b, b'.' | b'_' | b'-'))
            {
                return Err(io::Error::new(
                    io::ErrorKind::InvalidInput,
                    "invalid snapshot path",
                ));
            }
            // Compare directory names exactly, even on case-insensitive hosts.
            let mut matched = false;
            for entry in fs::read_dir(&full)? {
                if entry?.file_name() == part {
                    matched = true;
                    break;
                }
            }
            if !matched {
                return Ok(None);
            }
            full.push(part);
            let metadata = fs::symlink_metadata(&full)?;
            if redirected(&metadata)
                || (parts.peek().is_some() && !metadata.is_dir())
                || (parts.peek().is_none() && !metadata.is_file())
            {
                return Err(io::Error::new(
                    io::ErrorKind::InvalidData,
                    "unsupported snapshot entry",
                ));
            }
        }
        read_bounded(&full, FILE_LIMIT).map(Some)
    }
}

fn redirected(metadata: &fs::Metadata) -> bool {
    #[cfg(windows)]
    {
        use std::os::windows::fs::MetadataExt;
        metadata.file_attributes() & 0x400 != 0
    }
    #[cfg(not(windows))]
    metadata.file_type().is_symlink()
}

pub fn read_bounded(path: &Path, limit: u64) -> io::Result<Vec<u8>> {
    let metadata = fs::symlink_metadata(path)?;
    if redirected(&metadata) || !metadata.is_file() || metadata.len() > limit {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "expected a bounded regular file",
        ));
    }
    let mut bytes = Vec::new();
    File::open(path)?.take(limit + 1).read_to_end(&mut bytes)?;
    if bytes.len() as u64 > limit {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "file exceeds size limit",
        ));
    }
    Ok(bytes)
}

pub fn read_json<T: DeserializeOwned>(path: &Path) -> io::Result<T> {
    serde_json::from_slice(&read_bounded(path, JSON_LIMIT)?)
        .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))
}

pub fn write_new(path: &Path, bytes: &[u8]) -> io::Result<()> {
    OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(path)?
        .write_all(bytes)
}

pub fn write_json(path: &Path, value: &impl Serialize) -> io::Result<()> {
    let mut bytes = serde_json::to_vec_pretty(value)?;
    bytes.push(b'\n');
    write_new(path, &bytes)
}
