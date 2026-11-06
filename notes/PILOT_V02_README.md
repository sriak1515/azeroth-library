# Azeroth Library — local pilot v0.2

The approved parchment/stone design, now with two proper lore chapters and a small authoring workflow. Chapter navigation, page headings, the glossary list, search and progress choices read the Markdown files. Includes Shadowglen, Ban’ethil, six progressive glossary entries, an early Druid playbook and troubleshooting.

This remains a pilot. The writing is a small sample of the campaign, and the general reference menu still points to the supplied guide, glossary and help pages. The chapter menu no longer includes a pretend, unwritten destination.

## Upgrade from v0.1

Extract v0.2 into a **new folder** and keep v0.1 as your fallback. Stop the old terminal before opening the new version. Use the same browser/profile and the same address, **http://127.0.0.1:4174/**: v0.1’s theme, text size and Ban’ethil milestone are imported automatically the first time v0.2 opens. Shadowglen starts at its own first milestone. The old preferences are retained.

If you have edited v0.1 Markdown, keep those files backed up. v0.2 does not import file changes automatically. The new chapter metadata and named milestone format below replace v0.1’s global numeric milestones; use the supplied v0.2 files as your starting point when bringing edits across.

## Read on Windows

1. Extract the entire ZIP into a normal folder, such as `C:\Games\Azeroth-Library-v0.2`.
2. Install Node.js 20 or newer if needed: https://nodejs.org/en/download
3. Double-click **Open-Azeroth-Library.cmd**.

The browser opens at **http://127.0.0.1:4174/**. Keep the small terminal window open while reading; close it or press Ctrl+C when finished. The included reading version needs no npm installation or internet connection. No Docker, WSL, account or cloud service is required.

## Add your first page

1. Double-click **New-Page.cmd**.
2. Choose **1** for a lore chapter or **2** for a glossary entry.
3. Enter its title and accept the suggested filename, or choose another.
4. Open the Markdown file at the path printed in the window. Replace “Write your text here” with your text, then save.
5. Double-click **Edit-Azeroth-Library.cmd** to see it. If editing mode is already running, the new file appears automatically.

A new chapter appears in the chapter menu and previous/next links. A new glossary entry appears in the glossary list. Both are searchable. You do **not** edit Vue, a sidebar configuration or a search index to register them. Existing files are never overwritten by the helper.

The first use of the editing or creation helpers installs the pinned tools, requiring internet. After installation they work locally. When finished, stop editing mode and double-click **Build-Reading-Version.cmd** so the normal reading launcher includes your changes. Opening the reading launcher alone does not rebuild anything.

Reading and editing use the same address: **stop one before starting the other**.

### A small first test

Create a chapter called “My test chapter”, add two paragraphs and a `## A heading`, then open it from the chapter list. Try a title change in its frontmatter. When finished, delete `docs/chronicle/my-test-chapter.md` and rebuild the reading version. Do this in your extracted copy; the supplied ZIP contains no disposable test chapter.

## Content map

| File | Purpose |
|---|---|
| `docs/chronicle/shadowglen.md` | Chapter I: Among the boughs |
| `docs/index.md` | Chapter II: Ban’ethil and its gated discoveries |
| `docs/chronicle/*.md` | Additional lore chapters |
| `docs/glossary/*.md` | Individual glossary entries; `index.md` is the automatic list |
| `docs/guides/druid.md` | Practical combat and talent guidance |
| `docs/help/altbot.md` | Troubleshooting examples |
| `docs/progress.md` | Story-progress page introduction |
| `templates/*.md` | Copyable starting points, kept outside the published pages |
| `docs/.vitepress/theme/style.css` | Shared visual design |

## Markdown and chapter details

Most writing is ordinary Markdown: paragraphs, headings, lists, tables and normal links. The frontmatter block supplies presentation details. A simple chapter needs:

```md
---
title: My next chapter
layout: lore
chapterId: my-next-chapter
order: 3
zone: Teldrassil
description: A short introduction to this part of the journey.
---

## Where we begin

Your text, with a [glossary link](../glossary/emerald-dream.md).
```

`chapterId` must be unique and should remain unchanged after you begin using a chapter. `order` sorts the chapter list; each chapter needs a different number. It can be changed without changing saved milestones. Optional `chapterNumber: III` controls the displayed chapter label; otherwise the order is displayed as a padded number. Optional `navTitle`, `shortTitle` and `heroTitle` provide shorter menu/breadcrumb labels or a special hero title. Leaving them out uses `title` throughout. Keep `heroTitle` in step with `title` if you set both.

The creation helper also fills in `region`, `collection`, `volume` and `volumeNumber`; these are editable labels, not hardcoded Ban’ethil headings. For manual authoring, copy `templates/chapter.md` into `docs/chronicle/` or `templates/glossary.md` into `docs/glossary/`, rename it, then replace its placeholder metadata. Templates themselves do not appear in the site.

## Story milestones and spoilers

**Story progress** has separate choices for each chapter. A chapter without a milestones list gets one “At the beginning” choice, and its whole text is readable. You do not need spoiler gates for a simple page.

For progressive writing, give milestones stable names in reading order:

```yaml
milestones:
  - id: arrival
    title: At the beginning
  - id: discovery
    title: I have made this discovery
    description: Adds the explanation learned at this point.
```

Then gate a passage in that chapter:

```md
<StoryGate milestone="discovery">

## A discovery

Write ordinary Markdown here.

</StoryGate>
```

Keep blank lines around the Markdown. An optional `until="later-milestone"` hides an introductory version once that later milestone is reached. Nested gates are not supported.

A glossary page can require a named milestone. Use a neutral `title` and a revealed `entryTitle` for a page whose name would be a spoiler:

```yaml
title: A discovery on the road
entryTitle: The discovered name
layout: glossary
group: glossary
requires:
  my-next-chapter: discovery
introducedIn: my-next-chapter
```

`introducedIn` supplies the “First encountered in” link; it does not gate the page on its own. A StoryGate within a glossary page must also name its source chapter, for example `<StoryGate chapter="kal-02-banethil" milestone="charm-examined">`.

Keep chapter and milestone IDs stable when renaming their visible labels. Adding a new earlier milestone does not reinterpret a saved name as a different event. Removing a saved milestone resets that chapter to its first choice. Invalid references, duplicate chapter IDs and duplicate chapter orders are reported during the build, alongside missing Markdown links.

The same rules filter chapter passages, outlines, glossary pages/list and local search. This is **casual spoiler protection**, not access control: the local files contain the authored material. It does not read the game, infer quest outcomes, sync devices or alter Zygor progress.

## Reading links

Lore terms open normal glossary pages. Browser Back or **Back to your passage** returns to the chapter you were reading, including Shadowglen. The explicit return link remembers the chapter’s scroll position for the current browser tab. Previous/next links follow the available chapters’ Markdown order.

## Command-line equivalents

```text
npm ci
npm run new:page
npm run edit
npm run check
npm run build
npm start
npm test
```

`npm run edit` and the reading launcher bind to **127.0.0.1**. The separate `npm run dev` command is for internal browser QA. VitePress is pinned to 1.6.4, Vue to 3.5.13, and the authoring parser gray-matter to 4.0.3; exact dependency resolution is in `package-lock.json`.

The ZIP includes editable source and a prebuilt reading version. See `notes/SOURCES.md` and `notes/VALIDATION.md` for provenance, checks and limits. Fonts and their license are bundled locally. No syncing, hosting, full campaign migration or addon integration is included.
