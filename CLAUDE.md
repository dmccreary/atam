# CLAUDE.md — Selecting the Right Database

MkDocs Material intelligent textbook. 16 chapters on database architecture and ATAM-based selection.

- **Site:** https://dmccreary.github.io/right-database
- **Repo:** https://github.com/dmccreary/right-database
- **Build:** `mkdocs serve` (dev) · `mkdocs build` (prod)
- **Content guidelines:** `CONTENT-GENERATION-GUIDELINES.md` — read this before generating any chapter content, MicroSims, or mascot admonitions.

## Key conventions (summary — see guidelines for full detail)

**Mascot (Dex the Robot):** Steel-blue robot, poses in `docs/img/mascot/`. Max 5 admonitions per chapter, none back-to-back. `welcome` = chapter open only. `celebration` = chapter close only. Syntax: `!!! mascot-<pose> "Title"` with `<img src="../../img/mascot/<pose>.png" class="mascot-admonition-img">` inside.

**MicroSims:** Live in `docs/chapters/NN-name/microsims/<sim-id>/main.html` + `index.md`. Embed via iframe at 560 px height (default). For graph database models use **vis-network** (CDN: `cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.9/`). Node color conventions: entity = `#4682B4`, property = `#E65100`, index = `#28a745`, aggregate = `#6f42c1`, external = `#6c757d`.

**Chapter structure:** YAML frontmatter → Summary → Concepts Covered → Prerequisites → body sections → Key Takeaways. Each chapter covers concepts from the learning graph at `docs/learning-graph/`.

**Tone:** Precise, warm, occasionally funny. Write for working engineers. Active voice. No condescension — distributed systems are hard and that's okay.
