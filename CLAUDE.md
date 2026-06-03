# Project Instructions — Architecture Tradeoff Analysis Method (ATAM)

This is an intelligent textbook built with MkDocs Material on the CMU SEI
Architecture Tradeoff Analysis Method (ATAM). Audience: graduate students and
experienced software practitioners. Use the `book-installer` skill to add or
update features.

## Learning Mascot: Vista the Giraffe

### Mascot File Index

The canonical files for this mascot. When editing any of these, update the
others in the same turn so they stay in sync.

| File | Purpose |
|------|---------|
| [`docs/img/mascot/character-sheet.md`](docs/img/mascot/character-sheet.md) | Canonical identity document (name, species, colors, voice). Source of truth. |
| [`docs/img/mascot/image-prompts.md`](docs/img/mascot/image-prompts.md) | Self-contained AI prompts for regenerating each pose. |
| [`docs/img/mascot/neutral.png`](docs/img/mascot/neutral.png) | Default / general-purpose pose. |
| [`docs/img/mascot/welcome.png`](docs/img/mascot/welcome.png) | Chapter-opening pose. |
| [`docs/img/mascot/thinking.png`](docs/img/mascot/thinking.png) | Key-concept pose. |
| [`docs/img/mascot/tip.png`](docs/img/mascot/tip.png) | Hint / helpful-guidance pose. |
| [`docs/img/mascot/warning.png`](docs/img/mascot/warning.png) | Common-mistake / pitfall pose. |
| [`docs/img/mascot/encouraging.png`](docs/img/mascot/encouraging.png) | Difficult-content / struggle pose. |
| [`docs/img/mascot/celebration.png`](docs/img/mascot/celebration.png) | End-of-chapter / achievement pose. |
| [`docs/css/mascot.css`](docs/css/mascot.css) | Custom admonition styles for the seven pose contexts. |
| [`docs/learning-graph/mascot-test.md`](docs/learning-graph/mascot-test.md) | Rendering test page that exercises every admonition style. |

### Character Overview

- **Name**: Vista
- **Species**: Giraffe
- **Personality**: cheerful, playful, big-picture thinker, patient & encouraging
- **Catchphrase**: "Let's weigh the tradeoffs!"
- **Visual**: golden-amber giraffe with reddish-brown patches, round indigo glasses, and a small indigo bow tie; compact chibi proportions with a shortened neck so it reads at icon size

### Voice Characteristics

- Warm, casual, encouraging language; lowers the intimidation factor of a rigorous method
- Drops the occasional height/perspective pun ("from up here I can see the whole system", "let's rise above the details")
- Refers to students as "fellow architects"
- Signature phrases: "Let's weigh the tradeoffs!", "Let's take the high-level view!", "Every decision has a tradeoff."

Vista is gender-neutral. Always refer to the mascot by name or as "they/them" —
never use gendered pronouns.

### Mascot Admonition Format

Always place mascot images in the admonition body, never in the title bar:

    !!! mascot-welcome "Title Here"
        <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
        Admonition text goes here after the img tag.

**Image paths** are relative to the rendered page URL (MkDocs uses directory
URLs). For a chapter page at `chapters/01-intro/index.md`, use `../../img/mascot/`.
For `learning-graph/mascot-test.md`, use `../../img/mascot/`.

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General note / sidebar | mascot-neutral | As needed |
| Chapter opening | mascot-welcome | Every chapter |
| Key concept | mascot-thinking | 2-3 per chapter |
| Helpful tip | mascot-tip | As needed |
| Common mistake | mascot-warning | As needed |
| Difficult content | mascot-encourage | Where students may struggle |
| Section completion | mascot-celebration | End of major sections |

### Do's and Don'ts

**Do:**

- Use Vista to introduce new topics warmly
- Include the catchphrase in welcome admonitions
- Keep dialogue brief (1-3 sentences)
- Match the pose/image to the content type
- Lean on the giraffe's "high-level view" metaphor when introducing architecture-level thinking

**Don't:**

- Use Vista more than 5-6 times per chapter
- Put mascot admonitions back-to-back
- Use the mascot for purely decorative purposes
- Change Vista's personality or speech patterns
- Use gendered pronouns for Vista
