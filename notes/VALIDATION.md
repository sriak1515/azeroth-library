# Validation — external collection pass, 6 November 2026

## Executed in the Linux cloud workspace

- Installed the existing pinned lockfile with `npm ci`; no dependency upgrades or added dependencies.
- Production demo build passed. Focused Node tests passed: six tests covering fixture passage/glossary boundaries, legacy preference migration and stable milestones, metadata errors, links, reading server/fonts/404/traversal, and external-folder isolation/errors. The obsolete page-authoring test was removed with that helper.
- Built a temporary external collection at `/tmp/Azeroth External Trial With Spaces`. It had one uniquely named lore chapter, one progressive glossary entry and one practical reference page, and no authored home. The generated home listed its chapter and the generated reference page listed its guide. All four URLs returned HTTP 200. The old Shadowglen URL returned 404; old glossary/class/help files were absent from the build. No demo notice was rendered.
- Compared SHA-256 hashes of every source file before and after the external production build: all unchanged, with no files added to the source collection. The test also exercised removed-page cleanup in staging.
- Confirmed the external glossary entry and gated passage are unknown initially and known at the named `token-found` milestone using the same catalog/disclosure code used by the UI. The initially rendered glossary did not list the gated entry.
- Tested the actual CLI with a configured nonexistent folder. It returned a nonzero status and a clear error naming the missing folder and stating that no demo fallback was used. Focused checks also cover blank settings and reserved viewer-page collisions.
- Prepared the Windows snapshot while an external folder was configured: packaging selected a fresh demo build explicitly. Inspected package contents for local config, external trial markers, dependencies and caches. They are excluded. Built HTML, fonts, sample content, launchers and the authoring contract are included.
- Reviewed changes for source-folder writes, hard-coded fixture navigation, preference keys, packaging leaks and unrelated design changes. The starter and implementation are separate commits for traceability.

The managed sandbox initially blocked network/loopback connections; installation and server tests passed with the execution tool's network permission enabled. This is a host restriction, not an application fallback or dependency failure.

## Remote publication

The task branch `work` is published in [pull request #1](https://github.com/sriak1515/azeroth-library/pull/1). Repository write access was restored after the initial HTTP 403 failures. At publication, no remote Actions run had been observed. The workflow is configured to build, test and package on Windows; that configuration is not evidence of an executed Windows check or an available artifact. Consult the PR checks for subsequent results. Nothing has been merged into main.

## Browser and Windows limits

The available browser automation repeatedly failed to create a tab with `Browser Use could not read requirements`. No successful interactive browser check was possible in this pass. The starter's historical notes reported successful browser Back/explicit passage return, both appearances and milestone filtering in v0.2; those observations are historical, not rerun evidence for this change. The same layout, theme CSS, gates and restoration code remain, with collection-aware navigation and first-chapter fallback.

Windows `.cmd` files were inspected and kept with CRLF checkout rules; they were not executed on Linux. The workflow is configured to build/test/package on Windows, but that alone is not a claim that a remote workflow ran. A Windows trial should:

1. Extract into a folder whose path has spaces, select a separately stored collection with spaces in its path, and double-click Open. Confirm first installation, rebuild and browser launch.
2. Visit a glossary entry from a scrolled chapter. Try Browser Back and “Back to your passage”; confirm the passage position.
3. Select a later story milestone. Confirm its passage, outline heading, glossary discovery and search result appear together.
4. Switch parchment/stone and text size, close and reopen the viewer. Confirm preferences and milestone selection persist.
5. Have an authoring session change content, then close/reopen Open. Confirm the update appears. Try a viewer snapshot update while retaining content-folder.txt and the same browser/profile/origin.

Acceptance is by using the viewer. Code inspection is not required of the player.
