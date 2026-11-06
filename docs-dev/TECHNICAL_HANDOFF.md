# Technical handoff — v0.2 baseline, 6 November 2026

## Current source

This starter's application code, fixtures, fonts, lockfile and launchers match the saved Azeroth_Library_VitePress_Pilot_v0.2.zip. Only handoff documentation and this starter README were added/replaced. The earlier ZIP also contained prebuilt reading output; this repo starter deliberately does not.

- `docs/.vitepress/config.mjs`: VitePress configuration.
- `docs/.vitepress/theme/Layout.vue` and `style.css`: custom layout/design.
- `pages.data.mjs`: VitePress createContentLoader over Markdown under docs/.
- `content-tools.mjs`: shared metadata validation, catalog, spoiler visibility and preference migration.
- `state.mjs`: browser-local theme, size and per-chapter progress. Current key `azeroth-library-pilot-v2`; migration reads `azeroth-library-pilot-v1`.
- `reading.mjs`: tab-local chapter/scroll memory and explicit glossary return.
- Components: StoryGate, LibrarySearch, GlossaryIndex, ProgressSettings and ReadingSettings.
- `scripts/content.mjs`, `check-content.mjs`: source scanning and lightweight build validation.
- `scripts/serve.mjs`: dependency-free server for prebuilt HTML; loopback only at 127.0.0.1:4174.
- Windows launchers: Open, Edit, Build-Reading-Version and the historical New-Page helper.

## Current behavior

Two lore fixture chapters: Shadowglen and Ban'ethil. Six glossary entries, one class guide and one troubleshooting example. Chapter order, titles, zones and milestones derive from frontmatter. Glossary list and local search derive from the same catalog. Stable string milestone IDs replace the earlier global numeric stage. There are no popup glossary interactions.

The top-level reference navigation still points to the supplied class/help paths. Root `/` currently hosts Ban'ethil. These fixture assumptions need a small solution during external-content support; do not show links to absent pages. Prefer simple optional configuration or discovery over a navigation-builder framework.

## What is not implemented

External-folder loading, content installation/update handling and a viewer/content boundary are the next task. Content currently lives directly in docs/, mixed with viewer-owned settings/search/index pages. `npm start` serves an existing build; it does not currently ingest changed external Markdown.

The owner will not use the manual page-creation helper. Keep/remove/move it only as needed for clarity; do not invest in it as a product feature.

## Verification already completed

The v0.2 production build and six small Node tests passed. Browser checks covered chapter navigation, independent milestone filtering/search, explicit return and browser Back to the correct Shadowglen scroll position, live creation/discovery of a temporary chapter and glossary term, and both appearances. Temporary authoring pages were removed. See notes/VALIDATION.md.

Windows launchers were not executed on the Linux host. The owner reported the earlier pilot working on Windows. Verify Windows-specific commands by inspection and relevant checks, then report the remaining hands-on trial honestly.

## Commands

```text
npm ci
npm run build
npm test
npm run edit
```

Build before tests. Do not run reading and editing servers on 4174 simultaneously. No dependency upgrade is needed for this first task. Package manager access is needed for initial npm ci; normal reading uses local assets.
