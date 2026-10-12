# Picking up humane-ts in a new Cowork session

Cross-project conventions (git locks, pushing, comments, code style,
publishing from GitHub Actions) are in `~/workspace/woodie/docs/COWORK.md`.

## What this is

The TypeScript member of the `humane` family: `humanSize`, `distanceInTime`
and `timeAgo`, with the same algorithm, wording, options and test cases as
`humane` (Go), `humane-ruby`, `humane-swift` and `humane-kotlin`. Created
2026-10-12 after checking npm: `date-fns`'s `formatDistance` matches the
relative-date wording on every shared test case, but no package matches
Finder's size rounding (`pretty-bytes` and `filesize` both round to
significant figures or fixed decimals and use SI labels). The npm names
`humane` and `humane-js` were taken, hence `humane-ts`.

## Design decisions

- **No dependencies.** The relative-date half is a direct port of the Go
  version rather than a `date-fns` wrapper, so all five libraries share one
  set of options (`approximate`, `includeSeconds`, `whenNil`) and one set of
  test cases.
- **ES module only, Node 18+ at runtime.** Dev tools (Vitest, ESLint) need
  Node 22.13+; `.mise.toml` pins `lts`.
- **Tests use `subject` plus `beforeEach`, not `justBeforeEach`.** Vitest has
  no `justBeforeEach`; a `subject()` function called inside each `it` keeps
  the same shape as `humane-ruby`'s specs. `context` is an alias for
  `describe`.
- **Lint is `neostandard`** (the maintained successor to `standard`, with
  TypeScript support), plus `tsc --noEmit`.

## Publishing

`CI.yml`'s `publish` job runs on a `v*` tag, after tests pass, using npm
trusted publishing (OIDC, no stored token). It first checks that the tag
matches `package.json`'s version. The very first release (`v0.1.0`) has to be
a manual `npm publish` from Woodie's Mac, because npm only lets a trusted
publisher be configured on a package that already exists; after that,
configure it on npmjs.com (package settings, "Trusted Publisher", GitHub
Actions: `woodie` / `humane-ts` / `ci.yml`).

## Current status

`v0.1.0`, being set up.
