# Pilot v0.2 validation — 6 November 2026

Environment: Linux, Node.js 24.22.1, VitePress 1.6.4, Vue 3.5.13, Chrome browser QA.

Passed:

- Production client/server build and static-page rendering, including automatic content validation.
- Six Node test cases: independent real-chapter spoiler boundaries; legacy preference migration and stable saved IDs after milestone insertion; useful authoring errors; page creation and automatic discovery without overwrites; authored links and metadata; prebuilt server routes, fonts, 404s and path traversal.
- Browser navigation between Ban’ethil and Shadowglen retained the chapter panel, updated the active chapter, and rendered chapter-specific labels and headings.
- Shadowglen’s antidote milestone revealed Iverron without revealing Oben. Search for “Oben” still returned no results at Ban’ethil’s entrance milestone.
- Ban’ethil’s charm milestone revealed the later passage and outline heading, replacing its earlier introductory passage.
- Explicit glossary return and native browser Back restored Shadowglen at the recorded 828 px scroll position.
- Created a temporary third chapter and glossary entry using the supplied Node page-creation helper. Both appeared automatically in the running browser’s navigation/list and search. Editing only the new chapter’s Markdown changed its visible title, zone and prose.
- A production build also succeeded with those temporary additions: 16 pages and three chapters. They were removed afterwards; the deliverable contains 14 pages and two chapters.
- Parchment and dark-stone appearances checked in the browser.

Carried forward from v0.1 QA: practical guide/search/settings navigation, locally bundled fonts, live Markdown edits, and 375 px reading/guide layouts without horizontal overflow. v0.2 retains the same responsive layout rules, with an auto-height hero for new chapter titles.

Limits:

- Windows `.cmd` launchers use standard Node/npm commands, but cannot be executed on this Linux host. The owner reported v0.1 working on Windows; the new creation helper still needs its first Windows trial. Its Node implementation was exercised here in tests and in the live browser authoring check.
- This remains a small content and authoring pilot. Reference-menu destinations are the supplied practical examples; no complete campaign was imported.
- Browser-local, manually selected progress is not game synchronization or authentication. Authored files and bundled application data contain future pilot material; the UI and search apply casual spoiler filtering.
- No syncing, public deployment, server connection or addon change was performed.

The ZIP includes editable source, templates, launchers and a prebuilt reading version. `node_modules`, caches, disposable authoring checks and internal preview configuration are excluded. The dependency-free reading server binds only to 127.0.0.1:4174. The included `MANIFEST.sha256` lists archive file hashes, excluding itself.
