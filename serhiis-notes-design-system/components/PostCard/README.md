# PostCard
Link to an article: an arch-plated card for the home grid, or a compact row for the archive.

**Consumer provides:** title, one topic, a one-to-two sentence excerpt, date, reading time, the post URL, and optionally an illustration for the plate. The whole card is the link.

- Card: `surface`, 1px `border`, `radius-md`. Hover: `shadow-lift`, 2px rise, title turns `accent`.
- Plate: 140px tall with `radius-arch` top corners and a 1px `gold` inner line. Default fill is the silk gradient (`blush` → `pearl` → `lagoon`); `--night` is the spotlight variant (a `blush` glow on `night`). A post illustration replaces the fill, same arch.
- Title in `h3` (Cormorant 27px, `ink`), excerpt in `body-sm`, meta in `caption` `muted`.
- Grid `repeat(auto-fit, minmax(260px, 1fr))`, `space-24` gap. Archive rows: no box, `border` rule, 120px date column.
