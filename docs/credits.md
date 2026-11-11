# Credits and forked looks

Where the visual borrowings come from, so nothing has to be reverse-engineered later.

## ben's corner

- **Layout:** [ray's "black/red vampire layout"](https://layouts.spacehey.com/layout?id=81296) on SpaceHey. What we took: the blood palette (`#5e0303`, `#b10707`), offset hard shadows (`4px 3px`), gradient heading bars, dashed struck-through links with red glow, the fixed photographic background, the boxed/sidebar structure, and the shake-on-hover gag. What we did **not** take: SpaceHey's DOM rules, the custom cursor file, and the typewriter `h1`.
- **Background:** `public/ben/media/vampire-forest.jpg`, the forest image the layout uses, self-hosted so a third-party host cannot break the page.
- **Fonts:** the layout's own three TTFs, self-hosted in `public/ben/media/fonts/`:
  - `black-demon.ttf` — Black Demon by Kong Font. Embedded metadata reads "All Rights Reserved".
  - `goth-stencil.ttf` — Goth Stencil Premium by Juan Casco. Embedded metadata reads "Free for personal use, personal use requires donation".
  - `mcr.ttf` — "My Chemical Romance" by Rob Jackson / TyphoonsVault. No license field; unofficial band lettering.

  **Status: personal use only, not licensed for redistribution.** These are the layout's own copies, and serving them from a public repo is technically redistribution, which none of the three licenses grants. This is a two-person site with no revenue, so the practical risk is close to zero, but if it ever goes public-facing or commercial, swap them for OFL equivalents (UnifrakturMaguntia, Grenze Gotisch, Cormorant Garamond) or buy the licenses. Written down so the decision is not forgotten.

- **Blinkies:** see [blinkies.md](./blinkies.md), including the per-image maker credits.

## Rules

1. Credit the original author in the page footer and in this file when forking a look.
2. Recreate the _style_ in our own CSS. Do not paste a layout's whole stylesheet: most of it targets another site's markup and will not apply.
3. Fonts: check the embedded license metadata (`fonttools`, or the `license` name record) before bundling. Personal-use fonts are acceptable here only while this stays a two-person private project, and that exception must be written down in this file.
4. Third-party images get downloaded into the repo, never hotlinked.
