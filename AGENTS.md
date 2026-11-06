# Azeroth Library — project instructions

## Product and ownership

This is the viewer/site for the WoW solo adventure, running locally on Windows with Markdown content. The owner plays and reads; they will **never author content themselves**. Writing happens in separate sessions and is stored outside this repository. Keep only small, clearly identified fixtures here. Do not import the canonical campaign into this repo.

## Working style

Keep it light. Prefer small changes to the existing VitePress/Vue implementation. No overengineering, framework rewrite, plugin architecture, exhaustive tests, mandatory CI, backend, accounts, Docker requirement, sync service or deployment. Existing useful tests may stay; add checks only for consequential behavior or a specific regression. A successful build plus focused checks is normally enough. If something later breaks, fix it.

Proceed autonomously with routine implementation choices. Involve the owner for real product decisions or a brief Windows trial, not Markdown authoring or detailed technical supervision. Do not delegate to subagents unless requested.

## Preserve the approved experience

Read design/DESIGN_DIRECTION.md. Keep exceptionally readable prose, warm parchment and dark stone, normal page links, the dedicated progressive glossary, manual story milestones and practical reference layouts. No popups, overlays, forced journal, generated artwork or runtime AI service.

## Content and persistence

Support an external content folder without editing, deleting, overwriting or committing its files. Generated build/staging output and machine-specific paths must be ignored by Git. Viewer updates must preserve content, browser progress, theme and text-size preferences. Keep stable chapter/milestone IDs and existing migration behavior unless a specific migration is necessary.

## Starting points

- docs-dev/FIRST_TASK.md — bounded next implementation task.
- docs-dev/TECHNICAL_HANDOFF.md — current architecture and known limits.
- docs-dev/CONTENT_FORMAT_BASELINE.md — current author-facing format; update after external-folder work.
- notes/VALIDATION.md — previous checks and Windows limitations.

Current baseline: Node.js 20+, VitePress 1.6.4, Vue 3.5.13, gray-matter 4.0.3. Use npm ci and preserve package-lock.json. Build before running the existing npm test suite. Do not claim Windows launcher validation from Linux execution.
