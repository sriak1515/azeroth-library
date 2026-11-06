# Azeroth Library

A lightweight local VitePress/Vue Markdown reader for a World of Warcraft solo adventure. Warm parchment and dark stone, composed lore chapters, persistent desktop chapter navigation, dedicated glossary pages and practical reference layouts. Story progress is selected manually; it controls passages, glossary discoveries, outlines and search.

The repository owns the **viewer**. Your campaign is written in separate sessions and kept in a separate folder. `fixtures/demo/` is a labelled development collection, not the canonical campaign.

## Windows quick start

1. Install a current **Node.js LTS (22 or newer recommended; minimum 20)** from https://nodejs.org/. No Docker, WSL or Git is required for a ZIP installation.
2. Extract the Windows snapshot to a writable folder. Open `START_HERE.md` for the short setup guide.
3. To select your existing campaign folder, copy `content-folder.example.txt` to `content-folder.txt` beside the launchers. Replace its one line with your folder's full path, for example `C:\Users\Jane Smith\Documents\Azeroth Campaign`. Use normal backslashes, no quotes and no JSON escaping. Enable filename extensions in Explorer so it is not accidentally named `content-folder.txt.txt`.
4. Double-click **Open-Azeroth-Library.cmd**. The first run installs pinned npm tools (Internet required); then every start rebuilds from the selected folder and opens http://127.0.0.1:4174/. Keep the console open while reading. Stop with Ctrl+C.

Without `content-folder.txt`, the viewer uses the visibly labelled demo. An empty setting, missing folder, empty collection or invalid content stops with an error; a configured campaign never silently falls back to samples. The source folder is only read. All staging and build writes go to ignored `.library/` inside the viewer.

## Content changes and viewer updates

After another authoring session updates the collection, close the viewer console and launch Open again. A rebuild at startup picks up changed and removed pages. No Markdown editing is required of the player. Editing/development mode also starts from a staged snapshot: restart it to ingest external changes.

For a viewer update, close the console and extract the new snapshot over the **same viewer folder**, replacing viewer files. Snapshots contain no `content-folder.txt`, dependencies or campaign content. Keep your existing setting. Run `npm ci` once in that folder after an update (or delete only `node_modules` and let Open reinstall), then launch Open. Never put campaign content inside the viewer folder.

Use the same browser/profile and exact address `http://127.0.0.1:4174/`. Progress, theme and text size live in browser storage and survive viewer updates; clearing site data or using a different browser loses that browser's choices. Chapter and milestone IDs remain stable, including the existing v1-to-v2 migration. Reading-position memory is tab-local; Browser Back and “Back to your passage” restore the passage during reading.

## Snapshots and development

One small [GitHub Actions workflow](.github/workflows/check-and-snapshot.yml) builds and runs the focused tests on pull requests. To obtain a Windows ZIP, open **Actions → Check and Windows snapshot → Run workflow**, choose the desired branch, and download **Azeroth-Library-Windows** from the completed run's Artifacts. Extract the artifact wrapper, then the included Windows ZIP. Pull request runs and version tags beginning with `v` also produce snapshots. No deployment or release publishing is configured.

Locally:

```text
npm ci
npm run build -- --demo
npm test
npm run snapshot
```

`npm run snapshot` prepares `.snapshots/Azeroth-Library/`, including a fresh demo build, viewer sources, local fonts, required launchers and clearly labelled fixtures. It always builds samples in isolation, even when local campaign configuration exists. On Windows, make the ZIP with:

```powershell
Compress-Archive -Path .snapshots/Azeroth-Library -DestinationPath .snapshots/Azeroth-Library-Windows.zip -Force
```

`npm start` rebuilds and opens the selected collection. `npm run demo` explicitly tries fixtures without changing the local setting. `npm run check` validates the selected collection. `npm run edit` serves a staged snapshot with development reload for viewer edits; restart after source-content changes. Build before `npm test` with `--demo`, because the retained server checks exercise the fixture build. Do not run multiple servers on port 4174.

The snapshot's bundled demo can also be previewed offline with `node scripts/serve.mjs --open` before installing npm dependencies; ordinary Open always rebuilds. Windows launchers require a hands-on Windows trial; Linux checks alone do not validate them.

Authoring sessions should use [the content contract](docs-dev/CONTENT_FORMAT_BASELINE.md). Implementation details and validation are in [the technical handoff](docs-dev/TECHNICAL_HANDOFF.md) and [validation notes](notes/VALIDATION.md).
