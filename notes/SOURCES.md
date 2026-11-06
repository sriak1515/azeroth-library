# Pilot content sources

Initial sources read on 5 November 2026; authoring pilot extended on 6 November 2026. This pilot is a small presentation layer; it does not edit the canonical campaign or addon.

- `/WoW Campaign Companion/Arcs/KAL-02-dolanaar-and-the-sleeping-druids/STORY.md`, version 2, modified 2 November 2026. The Ban’ethil opening and the four relic names come from sections II–III. Later parts of the chapter are outside this pilot.
- `/WoW Campaign Companion/Review/NARRATIVE_VOICE_WORKSHOP_2026-11-05.md`: the Oben request preserves the player-preferred information order. The reading boundary stops after Oben examines the charm, without asserting completion or its outcome.
- `/WoW Campaign Companion/THALOREN_BALANCE_DRUID_PLAYBOOK.md`, modified 4 November 2026: the class page adapts the early combat guidance and talent table through level 20. It is an excerpt, not a new talent audit or an endgame recommendation.
- The user’s AltBot and Questie playtest reports supply the troubleshooting examples. The Questie/TomTom clash is a reported local finding, not a claim about every client.
- Shadowglen’s second-chapter layout uses only the already-played opening and the antidote request from the narrative workshop. Iverron’s entry gives the reason for Dirania’s remedy, without asserting a later outcome. It is a small presentation sample, not a complete KAL-01 import.
- The approved `Azeroth_Library_Visual_Prototype.html` supplies the visual direction: no generated imagery, no artificial journal, normal linked glossary pages, one progress page, warm parchment and dark stone.

Technical references used during implementation:

- https://vuejs.github.io/vitepress/v1/guide/custom-theme
- https://vuejs.github.io/vitepress/v1/guide/using-vue
- https://vuejs.github.io/vitepress/v1/guide/data-loading
- https://vuejs.github.io/vitepress/v1/reference/runtime-api

Version: VitePress 1.6.4; Vue 3.5.13; exact dependency resolution is in `package-lock.json`.

Fonts are locally bundled URW P052 and Nimbus Sans subsets from the approved prototype. See `LICENSES/URW-fonts.txt` for copyright, upstream source and full terms. No remotely loaded fonts, images, analytics or AI services are used at runtime.
