# Technical handoff — external collection pass

The approved v0.2 VitePress 1.6.4 / Vue 3.5.13 theme remains in `docs/.vitepress/`; fonts and viewer-owned pages remain under `docs/`. No new dependencies or framework changes. `fixtures/demo/` holds the original two lore chapters, six glossary entries, one guide and one help example. The fixture root chapter retains its URL and all chapter/milestone IDs.

## Content pipeline

- `scripts/stage.mjs` reads one ignored raw path from `content-folder.txt`. Missing config selects labelled demo mode; present but invalid config fails closed. Explicit `--demo` bypasses the local setting for development/CI only. Paths resolve from the viewer root and are never interpolated into a shell command.
- Only a fixed ignored `.library/` tree is replaced. Source files are read/copied, never written. The collection must be outside the viewer folder; staging symlinks and source/output overlaps are rejected. Hidden files are skipped, content symlinks/reserved paths are rejected, and only Markdown and listed image types are staged. A source metadata check precedes staging replacement.
- Viewer pages/config/theme/fonts are copied first, then the chosen collection, with optional authored `index.md` replacing the generic home. Other viewer page collisions are errors. `.vitepress/collection.json` records demo mode for the visible notice. No machine path is written into site data.
- `scripts/run.mjs` stages, validates links/catalog, then invokes VitePress through Node with argument arrays. Build/dev commands use `.library/docs`. Start rebuilds before opening the loopback server, so changed or deleted content is picked up on every restart. A failure never launches the old build. Editing mode is also a staged snapshot: restart for external-source edits.
- `scripts/check-content.mjs` accepts a staged docs directory. `pages.data.mjs` discovers that same tree with createContentLoader. The existing shared content-tools catalog still governs gates, search and glossary.

## Navigation and persistence

The header has Chronicle, Reference and Glossary. Optional reference pages are discovered from the catalog with layout reference, search enabled and satisfied requires. No Druid/help URL assumptions remain. Generic home lists discovered chapters; authored index pages remain supported. Desktop lore sidebar and visible outline remain intact. Dedicated glossary links, reading-position code and manual milestone UI remain intact. First-chapter fallback now works when the collection has no lore page at `/`.

The key remains `azeroth-library-pilot-v2` with existing v1 migration. Stable milestone IDs are preserved; stored progress for temporarily absent chapters is retained so switching collections or temporarily removing a chapter does not erase it. Theme and text size use existing browser storage. Use the same browser/profile and origin `http://127.0.0.1:4174/`. Reading-position memory remains sessionStorage/tab-local. No browser data is shipped in snapshots or reset by an update.

## Launch, package and check

Windows Open calls `work.mjs`, installs pinned tools if missing, then `npm start`. Build and optional Edit use the same entry point/configuration. The obsolete player-facing New-Page helper was removed: content authoring belongs to separate sessions.

`npm run snapshot` copies an allowlist to ignored `.snapshots/Azeroth-Library/` and builds demo content there, independent of the local configuration and earlier builds. It includes built reading assets and sources for subsequent external rebuilds, but no node_modules, local config, credentials or real content. One small Windows GitHub Actions workflow runs build/tests on PRs and provides zipped snapshots on PRs, manual dispatch or `v*` tags. There is no hosting/deployment automation. Windows CI results are evidence only when a remote run has actually completed.

```text
npm ci
npm run build -- --demo
npm test
npm run snapshot
```

Do not run multiple servers on port 4174. Focused tests retain milestone/migration/catalog/link/server checks and add external path/read-only/isolation/error checks. The removed page-creation helper's test was retired with it. See `notes/VALIDATION.md` for actual execution results and remaining Windows/browser limitations. Give separate writing sessions `docs-dev/CONTENT_FORMAT_BASELINE.md`; do not bring the canonical campaign into this repository.
