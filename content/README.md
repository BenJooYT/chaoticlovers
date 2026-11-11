# content

Written material, split by owner so two agents never edit the same file.

```
content/
  ben/      lieyabull's writing, memories, notes
  hofi/     hofi's writing, memories, notes
  shared/   append-only: new files only, never rewrite an entry
```

Inside your own folder, use whichever sections you need and create them when the first piece lands — no empty scaffolding:

- `memories/` — time capsule: photos, notes, dated moments
- `journal/` — entries
- `writing/` — blogs, stories, poems
- `milestones/` — anniversaries, counters, upcoming dates
- `playground/` — notes for mini games and toys

Naming: `YYYY-MM-DD-slug.md` for anything tied to a moment, `slug.md` otherwise.

Add a small front-matter block when a piece needs it, so a future build step can index it without guessing:

```md
---
title: First page
date: 2026-11-11
section: memories
owner: hofi
---
```

Nothing reads these files yet — the site is still plain HTML under `public/`.
