# Read on Windows

1. Install Node.js LTS from https://nodejs.org/ (22 or newer recommended).
2. Extract the snapshot to a writable folder, such as `Documents\Azeroth Library`.
3. Copy `content-folder.example.txt` to `content-folder.txt`. Put the full path to your separately supplied campaign folder on its single line. Paths with spaces and normal Windows backslashes work. Do not add quotes. Enable filename extensions in Explorer to check the filename.
4. Double-click **Open-Azeroth-Library.cmd**. Allow the first npm installation to finish; it needs Internet. After that, reading uses local files. Keep the console open while reading. It opens **http://127.0.0.1:4174/**.

At the end of a chapter’s visible text, **Reached this point** saves the next milestone and reveals its passages and glossary discoveries without leaving the chapter. Only click when that event has happened in your adventure. **Adjust progress** lets you go back or choose another point.

You do not need to write Markdown. Your content comes from separate authoring sessions. The viewer never edits that folder. With no local setting, you see the clearly labelled sample collection. A bad configured path stops with a useful error.

When content changes, close the console (Ctrl+C), then double-click Open again. Each start rebuilds. If the browser already has a tab open, refresh it after the build finishes.

## Viewer updates

Close the console. Extract the new viewer snapshot over the same viewer folder and replace its viewer files. Keep `content-folder.txt`; snapshots never include it. Your campaign must remain outside the viewer folder. After an update, open a terminal in the viewer folder and run `npm ci` once, or delete only `node_modules` and Open will reinstall it. Then double-click Open.

Use the same browser/profile at `http://127.0.0.1:4174/` to retain progress, theme and text size. Do not clear its site data. A viewer update does not reset those preferences. Browser Back and “Back to your passage” return you to your place in the current reading tab.

## If something goes wrong

- Missing Node: install Node LTS, then reopen the launcher.
- Missing content folder: correct the one path in `content-folder.txt`. A disconnected drive must be connected first.
- Content error: send the console error to your authoring/fix session. You do not have to repair Markdown yourself.
- Port 4174 in use: close the earlier viewer console, then try again.
- Browser did not open: open `http://127.0.0.1:4174/` yourself after the console says it is ready.

**Build-Reading-Version.cmd** rebuilds without opening a server. **Edit-Azeroth-Library.cmd** is an optional development launcher, not an authoring application. Both read the same folder setting. External content changes require a restart in this mode too.

A snapshot includes a built, labelled demo. For an offline first look with just Node installed, run `node scripts/serve.mjs --open` in its folder. Normal Open installs the build tools and always rebuilds your selected collection.

See README.md for GitHub Actions snapshot downloads and the separate authoring contract. Please try Open on Windows, visit a glossary entry and return to your passage, save a story milestone, switch appearance/text size, then restart after a content update. These are the remaining hands-on Windows checks.
