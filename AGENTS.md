# AGENTS.md

Read this before your first write. It is the contract between two people and their agents.

## Who you are working for

Two humans, one repo:

| Person               | GitHub login      | Working branch | Owns                                                   |
| -------------------- | ----------------- | -------------- | ------------------------------------------------------ |
| BenJoo ("lieyabull") | `BenJooYT`        | `ben`          | `public/ben/`, `public/assets/ben/`, `content/ben/`    |
| hofi                 | `hofiszabi10-svg` | `hofi`         | `public/hofi/`, `public/assets/hofi/`, `content/hofi/` |

`lieyabull` and `BenJooYT` are the same person. hofi's login is `hofiszabi10-svg` — note the `-svg` suffix; `hofiszabina10` is not a real account.

### Establish who you work for before writing anything

Check in this order:

1. An explicit instruction in the session ("work as hofi", "I'm hofi").
2. `gh auth status` — the logged-in login maps to a person in the table above.
3. `git config user.name` / `user.email` — weak evidence, use only as a hint.
4. Default when nothing else applies: the repo owner, `BenJooYT`, branch `ben`.
5. Still ambiguous — ask. Do not guess, and never split one task across both identities.

Open your first reply with the answer, e.g. `Working as hofi on branch hofi.` If a later instruction contradicts it, stop and confirm before acting.

## Docs

Detailed references live in [`docs/`](./docs/README.md). Read the relevant file before acting; it exists so you do not have to guess or ask. This applies to both people, Ben's agent and hofi's agent alike.

- [`docs/blinkies.md`](./docs/blinkies.md) — where to find blinkie GIFs, the crediting and self-hosting rules, and how to add one to a page.

When a task needs knowledge bigger than a paragraph, write it into `docs/`, link it from `docs/README.md`, and add it to the list above. Rules in this file always win over a doc; if they disagree, fix the doc.

## Talking to hofi — plain language, always

**This section applies whenever you are working for hofi.** She is new to GitHub, coding, and computer science in general. That is fine — you adjust to her, not the other way around.

- Use everyday words. If a technical word is needed, define it in the same sentence.
- Explain a term the first time it appears: branch, commit, push, pull request, merge, CI, deploy, YAML, repository.
- Keep replies short: a few lines, one idea at a time. Walls of text overwhelm her — split the work into steps instead of explaining everything up front.
- **Before running each command, say in a few simple words what it does and why**: "Checking whether your branch already exists." No syntax lecture unless she asks.
- Never paste raw command output. One line on what it said, then what happens next.
- Explain consequences before doing anything: "merging publishes the site — this is the moment it becomes visible to visitors."
- When asking to merge, describe what she will see on the site in plain words, not the diff or the file list.
- Never make her feel behind: no "as you know", no lecturing, no condescension.
- If she says she does not understand, re-explain with a different and simpler comparison — do not repeat the same sentence louder.
- If she asks "what does that mean", answer that question first, then continue the task.
- Leave the decision with her: give a recommendation and one line of reasoning, not a menu of ten options.

Vocabulary you can reuse, one plain line each:

- **repository (repo)** — the project's folder, stored on GitHub together with its full history.
- **branch** — a separate copy of the site where changes live until they are published.
- **commit** — a saved checkpoint of changes, with a short note about what changed.
- **push** — uploading your commits to GitHub.
- **pull request (PR)** — a request to bring your branch's changes into the main site, looked at before it happens.
- **merge** — accepting that request. On this repo, merging publishes the site.
- **CI / checks** — automatic checks GitHub runs after a push that report pass or fail.
- **deploy** — putting the site on the internet so anyone can open it.

### First visit — show her around

Your first task for hofi in a session counts as her first look at the repo, unless she says she already knows it. Before changing anything:

- Walk her through what exists, biggest picture first: `public/` is the site, `content/` is the writing, `data/` is who is who, `.github/` is the automation, `AGENTS.md` is the rules you follow.
- One short line per item. No file-by-file dump, no code, no history lesson. Details only if she asks.
- Point out the three places she will actually use: `public/hofi/` for pages, `public/assets/hofi/` for styling, `content/hofi/` for writing.
- Say plainly that `main` is the live site and her branch is where her work waits until it is published.
- Do it once per session, not before every task. If she says she remembers, drop it and get to work.

### When neither of you is sure — ask Ben

- Check the repo first: `README.md`, this file, and the code. Most questions are already answered there.
- If it is still unclear — an ambiguous request, two plausible readings, a change that could break the live site — **ask Ben** (GitHub `BenJooYT`, alias lieyabull) instead of guessing.
- Ask in a couple of lines: what is unclear, the options as you see them, and which you would pick. Then wait for the answer.
- Never guess on anything that publishes, deletes, or overwrites.

## Branch rule

Each person has exactly one long-lived branch: `ben` or `hofi`. Work only there; never commit to `main`.

**If no branch exists for your person**, create it from the latest `main`:

```
git fetch origin
git switch -c <branch> origin/main
git push -u origin <branch>
```

**If the branch already exists**, use it and rebase first:

```
git fetch origin
git switch <branch>
git rebase origin/main
```

Rebase only your own branch — never force-push the other person's branch or `main`.

Need to park unrelated work in parallel? Use a short-lived branch off your own (`hofi/poem-two`) and merge it back into `hofi`, never into `main`.

## Never merge to `main` without asking

Merging to `main` publishes the site, so it is always the human's decision.

- Ask the person you work for before any merge into `main`, and show exactly what would land.
- Open the PR, then ask; never open-and-merge on your own.
- Preferred form: PR `<branch>` → `main` (`gh pr create --base main --head <branch> --fill`).
- Never push directly to `main`, even for a one-line fix.

Ask **proactively when it feels right** — do not wait to be told:

- a piece is finished and looks right in the browser;
- a surprise is ready to be revealed;
- your branch has drifted far from `main` or has many commits piling up;
- you had to touch a shared file;
- roughly a week has passed with finished work sitting unmerged.

Keep merges small: one reveal or one feature per merge beats five at once.

## Shared vs owned files

**Owned — edit freely, no PR needed:** anything under `public/<you>/`, `public/assets/<you>/`, `content/<you>/`.

**Shared — change with intent, expect a PR and the other person's review:**

- `public/index.html`, `public/assets/tokens.css`, `public/assets/base.css`
- `public/wall/`, `public/assets/home.js`, `public/assets/us.css` — the shared page (see below)
- `data/` (identity and navigation)
- `.github/`, `README.md`, `AGENTS.md`

Rules:

- Never edit the other person's namespace. If something there must change, say so and let them do it.
- `content/shared/` is append-only: add new files, never rewrite or delete an existing entry.
- Creating new files inside your own namespace is always safe — that is the intended way to add things.
- Before touching a shared file, ask whether it needs to be shared at all, or whether it can live in your namespace.

### The shared page — the front page

The home page (`public/index.html`) is the deliberate exception to "everyone stays in their own folder". It belongs to both people: days-together counter, the wall, and the two corner buttons pinned to the top. It still never conflicts, because each person appends to their own stream:

- `public/wall/ben.jsonl` and `public/wall/hofi.jsonl` — one JSON object per line. Append to the end of **your own** file only:
  `{"date": "2026-11-11", "text": "first line"}`
- `public/assets/home.js` — draws the counter and the wall. Shared; do not change without agreement.
- `public/assets/us.css` — styling for the shared page. Shared; same rule.

Rules for the wall:

- Append only. Never rewrite, reorder, or delete lines — not even your own. A correction is a new line.
- Never touch the other person's `.jsonl`.
- Line order in the file does not matter; the page sorts by `date`, newest first.
- Keep one entry per line, valid JSON, on a single line. A broken line is skipped silently, so check your entry.
- This page is public and shared: nothing secret, nothing that reveals a surprise.

The counter's start date is the `data-since` attribute in `public/index.html`, with the human-readable "since …" text next to it. It counts the first day as day one. Changing it is a shared edit — say so before doing it, and change both the attribute and the visible line together.

## Surprises

This repo is public. **Anything you push to any branch is visible on GitHub**, even though only `main` deploys.

- Work that may be seen but must not be published yet → your personal branch.
- Work that must stay genuinely secret → keep it local and unpushed, or in the private vault repo if one exists. Never push it, and never name it in a commit message, PR, or reply.
- Never mention, spoil, or hint at the other person's unrevealed work anywhere in this repo.

## Formatting — two agents, one repo

- Prettier is the formatter. CI runs `npx prettier@3.6.2 --check .` on every push.
- Format what you changed: `npx prettier@3.6.2 --write <paths>`, then commit.
- **Never reformat a file you were not asked to change.** No repo-wide `--write`. Two agents rewriting each other's whitespace is the single biggest source of conflicts here.
- Follow `.editorconfig` and `.gitattributes`: LF endings, two-space indent, final newline.
- Run `git diff --stat` before committing. If a tiny change produced a huge diff, you reformatted something — undo it.

## Deployment

`.github/workflows/pages.yml` publishes `public/` to GitHub Pages on every push to `main`, and only `main`. The site lives under `https://benjooyt.github.io/chaoticlovers/`, so **use relative paths** (`assets/base.css`, `ben/`, `../`) — a leading `/` points at the wrong place and will 404.

The workflow also writes `public/stats.json` (tracked line and file counts) just before upload. It is generated and gitignored: never commit it, never hand-edit it, and read it defensively in the page (a missing file must not break anything).

## House rules

- No secrets, keys, or tokens in the repo. Never commit a `.env` file or paste a key into a page.
- No stack is locked in. Static HTML/CSS with a little JS, CDN libraries, hosted fonts, and external assets like blinkie GIFs are all fair game. If a page outgrows that, propose a framework and a build step to the human before adding one.
- Prefer self-hosted copies of things the page depends on; a dead third-party link must never be able to blank the page.
- Do not rename, move, or delete another person's files, or edit `data/people.json` entries for the other person.
- Files are named lowercase-with-dashes: `first-snow.html`, `2026-11-11-first-page.md`.
- Place content by date when it is a moment: `content/<you>/memories/2026-11-11-first-page.md`.
