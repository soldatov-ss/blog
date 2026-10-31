# Button
Crisp, poster-style action in three weights: primary (rose fill), outline (hairline) and ghost (text only).

**Consumer provides:** a short verb-first label (rendered uppercase: "Read the post", "Subscribe"), an `href` or `onClick`, optionally a trailing arrow at 14px.

- One primary per view. Everything else is outline or ghost.
- Classes: `sn-btn` + `--primary | --outline | --ghost`, `--sm` for dense rows.
- `ui` style: Jost 13px, uppercase, +1.6px tracking. `radius-sm` (2px) — buttons are sharp; curves belong to arches and ribbons.
- Primary: `accent` / `on-accent`; hover `accent-hover` plus `shadow-lift`. Outline: `border-strong` hairline, `ink` text, turns `accent` on hover.
- No second saturated button colour; status colours are for callouts.
