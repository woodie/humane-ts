# Comments

Notes too long for a one-line comment in the source, organized by file.

## src/size.ts

### `DECIMAL_PLACES`
Finder's fixed decimal places per unit, index-aligned with `SIZE_UNITS`: `KB`
0, `MB` 1, `GB` and above 2. This is `ByteCountFormatter`'s default
("adaptive") behavior, confirmed against real Finder output in `humane`
issue #3 (github.com/woodie/humane/issues/3).

### `humanSize`
- `0` reads `"Zero KB"`, and values under 1000 spell out `"byte"`/`"bytes"`.
- Everything else is scaled to its unit, rounded half up to that unit's
  decimal places, then has trailing fractional zeros trimmed.
- If rounding reaches 1000 of a unit, the value moves up to the next unit and
  is re-rounded there: `999_999` is `"1 MB"`, not `"1000 KB"`.

### `roundForUnit`
Rounds with `Math.round` on the scaled value rather than leaving it to
`toFixed`, whose rounding of exact ties depends on the binary representation.
`1_500` bytes is `"2 KB"` in Finder.

## src/time.ts

### `distanceInTime`
Buckets are chosen from `distanceInMinutes` (seconds / 60, rounded once), not
by re-dividing raw seconds per unit. Computing the minute count once and
switching on it is how ActionView's own `distance_of_time_in_words` works, and
is what produces its non-obvious cutoffs: the "about 1 hour" bucket starts at
44 minutes 30 seconds, and "about 2 hours" at 89:30. Re-dividing per unit lets
rounding carry across a bucket boundary on its own (`59:59:59` would read
`"60 minutes ago"` instead of `"1 hour ago"`).
