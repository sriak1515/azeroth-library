# First cloud implementation task — external content, simple local use

## Outcome

Turn the existing viewer into a small application that reads a separately stored Markdown collection. Preserve the approved appearance and working reading/glossary/progress behavior. The repository owns viewer code, design documentation and fixtures, not the actual campaign library.

## Implement

1. Separate viewer-owned pages/config/theme from sample content. Keep a small fixture collection in a clearly named location, with a fixture/demo development mode. The external-content mode must not mix those samples into the real collection.
2. Provide **one simple setting for the external folder path**. Use a lightweight ignored local config with a committed example, or an equally simple approach. Support ordinary Windows paths, including spaces. Keep configuration readable and explain where to set it once; the owner should not have to edit Vue or run Git to select content.
3. Keep VitePress. Use the simplest suitable arrangement, including an ignored generated staging directory if helpful. Never modify the selected source folder, copy real content into tracked source, or delete files outside generated output. Missing/invalid paths should give a useful error rather than silently displaying fixtures.
4. Make the ordinary Windows read/update workflow pick up content changes with minimal effort. A modest rebuild at startup is acceptable if it is fast enough; no sophisticated watcher/cache/update service is required. Reuse existing Node/npm launchers. State initial install requirements; do not add Docker, WSL or cloud dependencies to the reader.
5. Preserve stable chapter/milestone identities, browser preferences and return-to-reading behavior. Viewer updates must not overwrite the external collection or clear progress. Handle home/reference links when the collection lacks the original fixture guide/help pages; a small default/fallback is sufficient.
6. Update the short content-format reference so a separate authoring session can create compatible content without reading the viewer implementation. Include an example collection structure, chapter, glossary entry, named milestone gate and normal relative link. Label fixtures as examples, not canonical campaign writing.
7. Supply clear Windows run/update instructions and a small usable package or reproducible packaging command. Generated reading output belongs in the distributable, not necessarily in Git. No release automation is required.

## Proportionate verification

Run the build and relevant existing checks; adapt fixture assumptions if paths move. Use one temporary external folder with spaces in its path and confirm a sample chapter/glossary load without fixture leakage or changes to its source files. Check a gated discovery and ordinary navigation/return behavior if browser tools are available. If practical, also check a missing path produces a clear error. No broad new test suite, coverage target or CI system is needed. Stop once the requested behavior is established and checks pass.

## Out of scope

Campaign expansion or migration, content authoring UI, improving New-Page.cmd, AI generation, new imagery, synchronization, Obsidian integration, server/Zygor integration, accounts, public hosting/deployment, framework/dependency upgrades and broad visual redesign.

## Deliver

A focused reviewable change, concise description of the folder/config/run workflow, validation results and any Windows-only limitation. Use reasonable judgment for routine implementation choices; do not send the owner back to author Markdown or supervise technical details.
