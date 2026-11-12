# MBC Pie

Eelslap-style site: a full-screen (cover) video scrubbed by moving the mouse
(or a finger on mobile) from left to right. Same layout and tooling as
`mata-zyklek` (chokibasic).

## Layout

Everything lives in `src/`:

- `src/index.html` - page, loads `scripts/mbcpie.core.min.js`
- `src/styles/main.scss` (+ partials) - compiled to `main.min.css` by `chokibasic`
- `src/assets/mbc-pie.mp4` - the video
- `src/scripts/mbcpie.core.js` - bundle entry, exposes `window.MbcPie(config)`
- `src/scripts/libraries/mbcpie.js` - video scrubbing logic
- `src/scripts/libraries/mbcpie.yaml` - config, compiled to `.json` by `chokibasic`
- `scripts/` - `build.js`, `watch.js`, `export.js`, `banner.txt`

## Commands

- `npm run build` - SCSS -> CSS, YAML -> JSON, then bundle/minify the JS
- `npm run export` - copy `src/` to `dist/` (GitHub Pages workflow)
- `node scripts/watch.js` - rebuild on change (VS Code task `build:watch`)

## Conventions

- Everything in the repo is in English; conversation with the user is in French.
- Generated files (`*.json` config, `*.min.js`, `*.min.css`) are rebuilt, never edited by hand.
