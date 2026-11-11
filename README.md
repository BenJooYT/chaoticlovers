# chaoticlovers

A little website for the three of us — BenJoo, lieyabull, and hofi.

Not a portfolio, more of a shared place: things we want to keep, things we want to write, dates worth counting, and a few toys to poke at.

## Planned sections

Nothing is built yet — these are the placeholders we agreed on:

- **Time capsule / memories** — photos, notes, dated moments.
- **Shared journal** — entries from whoever feels like writing.
- **Writing** — blogs, stories, poems.
- **Milestones** — anniversaries, days-together counter, upcoming dates.
- **Playground** — mini games and small interactive toys.

## Stack

Deliberately undecided. The repo starts as a skeleton so we can pick a stack once we know what the first real page needs.

## Deployment — GitHub Pages (required)

The site is published with **GitHub Pages**, driven by `.github/workflows/pages.yml`.

Live URL: <https://benjooyt.github.io/chaoticlovers/>

- **Runs on every push** — no manual trigger, no separate deploy step to remember.
- **Deploy root is `public/`** — only what sits in that folder is published. `README.md`, `content/`, and the rest of the repo stay out of the served site.
- **Required repo setting**: Settings → Pages → Build and deployment → Source must be **GitHub Actions** (already configured). Without it the workflow fails at the deploy step.
- No build step today: `public/index.html` is a placeholder and is uploaded as-is.

This makes GitHub Pages part of the repo's dependencies: the push is what publishes, so the workflow and the Pages source setting both have to stay intact. When a stack is chosen, add its build to the workflow and point `path:` at the output directory (`_site` for Eleventy, `dist` for Astro, `public` for Hugo, etc.).

## Contributing

`main` is the shared branch. Small changes can go straight to it; anything that touches structure is worth a quick PR so all three of us see it.

Content lives under `content/` — the folders there are empty placeholders until the stack is chosen.
