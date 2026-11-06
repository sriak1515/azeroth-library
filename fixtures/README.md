# Development samples only

`demo/` retains the approved v0.2 sample chapters, glossary, class guide and help page. It is not the canonical campaign library. The viewer labels this mode clearly.

When no local setting is present, this collection is selected by default. `npm run demo` explicitly selects it; `npm run build -- --demo` builds it for tests. A configured external collection replaces this collection completely, including its root chapter. Do not add the player's real campaign here.
