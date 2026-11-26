# Commits

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). **Create a commit only when the user asks.**

```text
type(scope): subject

why this change is needed
```

Use `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`. `style` means formatting, not CSS. Subject: imperative, lowercase, no trailing period; header ≤ 100 characters. Scope with the feature when helpful (`feat(support):`). Breaking changes: `!` before the colon or a `BREAKING CHANGE:` footer.

This repo has no Commitlint; match the format before committing. Do not commit secrets or `.env` files. Respect the user's git safety rules (no force-push, no hook skips unless they ask).

```text
feat(support): add the plain-text submit form

Keep the draft in the form until the server confirms creation.
```
