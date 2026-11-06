# External collection contract

Give this document to the separate authoring session. The player reads and plays; they never have to author Markdown. Actual campaign writing stays outside this viewer repository. `fixtures/demo/` contains executable examples only, not canonical campaign content. This pass does not expand or migrate the campaign.

## Folder and page ownership

Point the viewer's ignored `content-folder.txt` at the collection root. It contains just one raw Windows path, for example `D:\Solo Adventure\Azeroth Campaign`; no quotes, JSON or escaped backslashes. Relative paths resolve from the viewer folder. Keep the collection outside the viewer folder so updates cannot overwrite it.

```text
Azeroth Campaign/
  index.md                    optional authored home OR lore chapter
  chronicle/
    shadowglen.md
  glossary/
    iverron.md
  guides/
    druid.md
  help/
    controls.md
  assets/                     optional local images; no new art required
```

The viewer supplies `/progress.html`, `/preferences.html`, `/search.html`, `/reference.html` and `/glossary/`. Do not create `progress.md`, `preferences.md`, `search.md`, `reference.md` or `glossary/index.md` in the collection: collisions produce an error. The viewer supplies a home page at `/` if the collection has no `index.md`. An authored index may be a reference page or a lore chapter, retaining its existing URL. Do not copy the viewer's old settings or glossary index into a collection.

Content pages, glossary entries and optional assets belong to the collection. Reference pages are discovered automatically by `layout: reference`; they appear in Within reach and the reference index. Lore chapters are discovered and sorted by `order`. Only discovered chapters/references appear in navigation. The viewer supplies generic reference navigation even when there are no class/help pages. `search: false` excludes reference pages from both search and discovered reference lists (use it for an optional authored home).

Use lower-case, hyphenated filenames/IDs and ordinary Markdown. Local PNG/JPEG/GIF/WebP/SVG images are copied with Markdown. Place assets under `assets/`, referenced relatively; `public/` is reserved for viewer fonts. Hidden files/folders are ignored. Symlinks, `node_modules/` and `public/` are rejected. No configuration, credentials or scripts belong in a collection. Files are copied only to generated ignored staging; the viewer never writes to the source. Restart the viewer to pick up changed or removed files.

## Lore chapter

```md
---
title: Among the boughs
layout: lore
chapterId: kal-01-shadowglen
order: 1
chapterNumber: I
region: Kalimdor
zone: Shadowglen
description: Your first steps beneath Aldrassil.
collection: The Kalimdor Chronicle
volume: Roots & awakenings
volumeNumber: I
milestones:
  - id: arrival
    title: Arrived in Shadowglen
  - id: diranias-request
    title: Dirania has asked for antidote ingredients
---

## Beneath Aldrassil

Ordinary Markdown prose.

<StoryGate milestone="diranias-request">

## An antidote

A passage with a [normal glossary link](../glossary/iverron.md).

</StoryGate>
```

Required: title; layout lore; unique stable chapterId; unique numeric order. Without milestones, a chapter gets a single `start` milestone. The first listed milestone is selected initially; all ungated prose is readable. Later milestones can be confirmed one at a time with “Reached this point” at the end of the visible chapter, or adjusted in Story progress. The in-page control uses the next milestone’s title as its prompt, so keep titles short, recognizable and limited to the event being confirmed; descriptions are not displayed there. No extra gate syntax or metadata is needed. Optional navTitle, shortTitle and heroTitle override menu/breadcrumb/hero labels; otherwise title is used. Optional readingTime is a display string. Do not renumber IDs when inserting chapters or milestones; labels may change.

## Progressive glossary entry

```md
---
title: Someone in Shadowglen
entryTitle: Iverron
layout: glossary
group: glossary
kind: Person · Shadowglen
description: The explorer who needs Dirania's antidote.
requires:
  kal-01-shadowglen: diranias-request
introducedIn: kal-01-shadowglen
---

## Why Dirania needs your help

Your explanation here.

[Return to the chapter](../chronicle/shadowglen.md).
```

`requires` gates the entire page and its appearance in glossary, navigation and search. Use a neutral title so the static page title does not reveal the name. `entryTitle` is the known name; `introducedIn` supplies the source-chapter link but does not gate access. Omit requires for an immediately available entry. On glossary/reference pages, a passage gate must name its chapter: `<StoryGate chapter="kal-01-shadowglen" milestone="diranias-request">`.

## Practical reference page

```md
---
title: Druid essentials
layout: reference
group: guide
kind: Class guide
description: Practical reminders for the road.
---

## Before setting out

- A short, useful checklist.

| Situation | Reminder |
| --- | --- |
| A difficult pull | Leave room to retreat. |

[Related chapter](../chronicle/shadowglen.md)
```

Use `group: help` for troubleshooting if useful. Guide/help groups are labels, not mandatory directory names or fixed menu destinations. Both use the practical layout and automatic reference listing. Requires/gates can use the same named milestones as lore.

## Rules and validation

- Keep chapterId and milestone IDs stable, unique within their scope, using lower-case hyphenated strings. Milestones are ordered within their own chapter. Requires maps chapter IDs to milestone IDs.
- Gates use literal named attributes with blank lines around their Markdown. Optional `until="later-id"` removes an introductory version at a later milestone. Nested gates and old numeric `:milestone`/`minMilestone` are unsupported.
- Use ordinary relative `.md` links. Link to viewer pages with root URLs such as `/glossary/` or `/progress.html`. Keep collection links inside the collection. No popup syntax is needed.
- Builds validate titles, layouts, unique chapter IDs/orders, milestone references, reserved filenames and Markdown destinations. Missing/invalid collections stop startup without demo fallback.
- UI spoiler filtering is casual protection, not access control. Authored files, generated data and static HTML remain locally readable. Another authoring session must keep writing within the agreed story boundary and voice.
