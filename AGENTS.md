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
- `data/` (identity and navigation)
- `.github/`, `README.md`, `AGENTS.md`

Rules:

- Never edit the other person's namespace. If something there must change, say so and let them do it.
- `content/shared/` is append-only: add new files, never rewrite or delete an existing entry.
- Creating new files inside your own namespace is always safe — that is the intended way to add things.
- Before touching a shared file, ask whether it needs to be shared at all, or whether it can live in your namespace.

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

## House rules

- No secrets, keys, or tokens in the repo. Never commit a `.env` file or paste a key into a page.
- Keep the site dependency-free unless the humans agreed to a stack.
- Do not rename, move, or delete another person's files, or edit `data/people.json` entries for the other person.
- Files are named lowercase-with-dashes: `first-snow.html`, `2026-11-11-first-page.md`.
- Place content by date when it is a moment: `content/<you>/memories/2026-11-11-first-page.md`.
