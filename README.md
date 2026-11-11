# chaoticlovers

A little website for the two of us — lieyabull (BenJoo) and hofi.

Not a portfolio, more of a shared place: things we want to keep, things we want to write, dates worth counting, and a few toys to poke at.

## Who's who

| Who                     | GitHub            | Branch | Owns                                                   |
| ----------------------- | ----------------- | ------ | ------------------------------------------------------ |
| BenJoo, alias lieyabull | `BenJooYT`        | `ben`  | `public/ben/`, `public/assets/ben/`, `content/ben/`    |
| hofi                    | `hofiszabi10-svg` | `hofi` | `public/hofi/`, `public/assets/hofi/`, `content/hofi/` |

`lieyabull` and `BenJooYT` are the same person.

## What's built, and what's planned

Built: the shared front page with the days-together counter and the wall, plus a personal corner each.

Still to come:

- **Time capsule / memories** — photos, notes, dated moments.
- **Shared journal** — entries from whoever feels like writing.
- **Writing** — blogs, stories, poems.
- **Milestones** — anniversaries and upcoming dates (the days counter is already live).
- **Playground** — mini games and small interactive toys.

## Stack

No build step today: the published site is static HTML, CSS and a little JS, so a push is all it takes to ship.

That is not a rule about what we may use. CDN libraries, hosted fonts, blinkie GIFs and other external assets are fine, and a per-person corner can be as elaborate as it likes. If a page outgrows static files, we add a framework and a build step to the Pages workflow; `AGENTS.md` says to ask Ben before introducing one.

## Layout

```
public/            what gets published
  index.html       the shared page: counter, wall, corner buttons
  assets/          tokens.css + base.css (shared), one folder per person
  ben/  hofi/      personal pages, owner-only
  wall/            ben.jsonl and hofi.jsonl — the streams the wall reads
content/           written material, split by owner
  ben/  hofi/  shared/
data/people.json   one entry per person
```

The rule that keeps this conflict-free: **your work lives in your own folder**. Adding a page, a poem, or a surprise means adding files under `public/<you>/`, `public/assets/<you>/`, or `content/<you>/` — nothing else in the repo has to change, so two agents can work at the same time without touching a shared line.

The shell (`public/index.html`, `assets/tokens.css`, `assets/base.css`, `data/`) is shared. Changes there are occasional and go through a PR.

## The shared page — the front page

The home page is ours together: <https://benjooyt.github.io/chaoticlovers/>

It shows the days-together counter, the wall, and the two corner buttons (`ben`, `hofi`) pinned to the top of the screen.

It is the exception to "stay in your own folder", and it still never causes a merge conflict, because nobody edits the same file. Each of us appends to our own stream:

- `public/wall/ben.jsonl`
- `public/wall/hofi.jsonl`

One entry per line, valid JSON, appended at the end of your own file:

```json
{ "date": "2026-11-11", "text": "the first line" }
```

The page reads both files and sorts by date, newest first. A malformed line is skipped silently, so keep each entry on a single line.

The counter counts the first day as day one. Its start date lives in `public/index.html` on the element carrying `data-since="2025-08-03"`, and the visible "since 3 August 2025" line sits right next to it — change both together.

Rules: append only — never rewrite, reorder or delete a line, not even your own (a correction is a new line); never touch the other person's file; and nothing secret goes there, because the page is public.

## Repo tour, in plain words

- `public/` — everything a visitor can see. Only this folder is published.
  - `public/index.html` — the shared page: the counter, the wall, and the corner buttons at the top.
  - `public/assets/tokens.css` — colours, fonts, spacing. Change a value here and the whole site follows.
  - `public/assets/base.css` — the shared layout for every page.
  - `public/assets/ben/`, `public/assets/hofi/` — personal styling, one owner each; `theme.css` holds that person's accent colour.
  - `public/ben/`, `public/hofi/` — personal pages. A new page is just a new file in your own folder.
  - `public/wall/` — `ben.jsonl` and `hofi.jsonl`, the two streams the wall reads. `assets/home.js` draws the wall and the counter; `assets/us.css` styles the page.
- `content/` — writing that isn't a web page yet: memories, journal, poems. `ben/` and `hofi/` are personal; `shared/` is added to by both and never rewritten.
- `data/people.json` — who is who: display name, GitHub login, folder, theme. One entry per person.
- `AGENTS.md` — the rules our AI agents follow: who they work for, which branch, when to ask before publishing.
- `.github/workflows/pages.yml` — publishes `public/` to the live site on every push to `main`.
- `.github/workflows/format.yml` — runs the formatting check on every push and pull request.
- `.github/CODEOWNERS` — who must review changes in which folder.
- `.editorconfig`, `.gitattributes`, `.prettierrc.json`, `.prettierignore` — formatting settings, so both agents write code the same way.
- `.gitignore` — files git should never track.

## Working together

- `main` is what visitors get. **Nobody commits to it directly.**
- One long-lived branch per person: `ben` and `hofi`. Work stays there.
- Merging to `main` is a PR, and only after the human says yes. Merging publishes, so it doubles as the reveal.
- This repo is **public**: anything pushed to a branch is visible on GitHub even though it isn't live. Truly secret work stays unpushed (or in the private vault, if we make one).
- `AGENTS.md` is the contract our agents follow — it tells them to check who they're working for, which branch to use, and when to ask before merging.

## Deployment — GitHub Pages (required)

`.github/workflows/pages.yml` publishes `public/` to GitHub Pages.

Live URL: <https://benjooyt.github.io/chaoticlovers/>

- **Runs on every push to `main`**, plus manual dispatch. Nothing else deploys.
- Only `public/` is served (`README.md`, `content/`, the rest stay out).
- **Required repo setting**: Settings → Pages → Build and deployment → Source must be **GitHub Actions** (already configured).
- Pages serves under `/chaoticlovers/`, so every link and asset path must be **relative** — a leading `/` 404s.

When a build step is added later, insert it into the workflow and point `path:` at its output (`_site` for Eleventy, `dist` for Astro, etc.).

## Formatting

Prettier 3.6.2, checked in CI on pushes and PRs:

```
npx prettier@3.6.2 --write <paths you changed>
```

Format only what you touched. Repo-wide reformatting is what turns two agents into constant merge conflicts.
