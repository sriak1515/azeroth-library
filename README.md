# Azeroth Library — viewer development starter

A lightweight local Windows companion for the WoW solo adventure. This repository owns the **viewer**. Actual campaign content is authored in a separate context and will live outside the repository.

Start with **START_HERE.md**. The first cloud task is in **docs-dev/FIRST_TASK.md**.

## What this starter contains

- The exact editable v0.2 viewer source, pinned dependencies and existing small test suite.
- Sample Markdown under `docs/`, retained as development fixtures. These are not canonical campaign files.
- Design decisions and a screenshot reference under `design/`.
- A focused implementation handoff and baseline content-format notes under `docs-dev/`.

This is a development starter, not a new installed viewer release. No external-content-folder support has been implemented here yet. In v0.2, VitePress reads the sample Markdown directly from `docs/`. Separating that content is the first task, not an already completed feature.

## Run the unchanged baseline

Node.js 20+ and npm:

```text
npm ci
npm run build
npm start
```

`npm start` opens the fixture reading version at http://127.0.0.1:4174/. Close its terminal before running `npm run edit`, which uses the same address. Build before running `npm test`, because one existing test exercises the built reading output.

The source starter omits build output and node_modules. The earlier v0.2 reading ZIP remains the ready-to-run pilot. Historical launchers, templates and page-creation helper are included to preserve the baseline; **the owner will never author pages manually**. Do not develop the authoring helper further.

## Development approach

Keep VitePress/Vue, the approved design and the dependency lock. Make small changes, run the build and relevant existing checks, and fix problems when reported. No framework rewrite, backend, accounts, cloud hosting, sync service or elaborate test infrastructure is needed.

Detailed baseline validation and content provenance remain in `notes/`. `notes/PILOT_V02_README.md` is the historical pilot manual, not the current product brief.
