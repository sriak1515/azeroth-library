# Content format — existing v0.2 behavior

This is a concise baseline for the first viewer task, **not yet an external-folder API**. Update it after external loading is implemented. Writers work in a separate context; they should receive the final version of this document and examples, not the full development chat.

## Existing paths

In the baseline, docs/index.md is Ban'ethil; docs/chronicle/shadowglen.md is a second chapter; docs/glossary/*.md are entries. Settings/search pages are viewer-owned. The cloud task should document the final external collection layout, home behavior and handling of optional class/help pages.

## Simple lore chapter

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

Required: title; layout lore; unique stable chapterId; unique numeric order. Without an explicit milestones list, a chapter gets one default `start` milestone and all ungated prose is readable. Optional navTitle, shortTitle and heroTitle override menu/breadcrumb/hero labels; otherwise title is used. If setting several labels, update them deliberately. An optional readingTime is a display string, not an automatic reading-time calculation.

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
```

A neutral title avoids a revealed name in the pre-rendered page title. entryTitle is the known name. requires gates the whole page; introducedIn only supplies its source-chapter link. Omit requires for an immediately available entry. A gate inside a glossary/reference page must include its chapter explicitly: `<StoryGate chapter="kal-02-banethil" milestone="charm-examined">`.

## Rules

- Keep chapterId and milestone IDs stable; rename visible labels freely. Milestones are ordered within their own chapter. requires maps chapter IDs to milestone IDs.
- Gates use named string attributes, with blank lines around their Markdown. Optional `until="later-id"` removes an introductory version at a later milestone. Nested gates are unsupported. Do not use old numeric :milestone or minMilestone.
- Ordinary Markdown links point to relative .md files. Keep linked files together in a collection. Use normal Markdown headings, paragraphs, lists and tables.
- Practical pages use layout reference, with group guide/help and optional kind/description. The first viewer task must document their navigation after removing fixed fixture paths.
- search: false excludes a page from search, not from access. UI spoiler filtering is casual protection: authored files and generated data remain locally readable.
- Build validation currently catches missing titles, invalid/duplicate chapter IDs/orders, unknown milestone references and missing Markdown destinations. Do not replace this small validation with a complex schema system.

The fixture source is the executable example. Actual writing should stay within the player's known story boundary and the agreed explanatory voice. No game state or synchronization is inferred from these files.
