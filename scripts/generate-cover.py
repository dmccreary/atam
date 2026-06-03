#!/usr/bin/env python3
"""
Generate ATAM cover image.

Step 1 — Call the OpenAI image API to produce a 1200x630 architecture montage
         background with the title in the right 80%. The left 20% is kept clean.
Step 2 — Composite docs/img/mascot/welcome.png (Vista) into the left 20%.
Step 3 — Save to docs/img/cover.png.

Run from the project root:
    python scripts/generate-cover.py
"""

import base64
import io
import os
import sys
from pathlib import Path

try:
    from openai import OpenAI
    from PIL import Image
except ImportError as exc:
    sys.exit(f"Missing dependency: {exc}. Run: pip install openai Pillow")

PROJECT_ROOT = Path(__file__).parent.parent
MASCOT_PATH  = PROJECT_ROOT / "docs/img/mascot/welcome.png"
OUT_PATH     = PROJECT_ROOT / "docs/img/cover.png"

BACKGROUND_PROMPT = """\
Wide-landscape textbook cover for 'Architecture Tradeoff Analysis Method (ATAM)' — \
1536x1024 pixels, no crop needed.

OVERALL: Dark deep-indigo (#2C3E7A) to navy blue gradient background with very subtle \
blueprint grid lines at low opacity.

LEFT 20% (approximately 0px – 307px of total width): Clean indigo background area, \
slightly lighter than the right side. A thin vertical soft-glow separator line at x≈300px \
where the mascot zone ends. No characters, no text in this zone — it will be composited later.

RIGHT 80% (approximately 307px – 1536px): Rich collage of software architecture \
visual elements rendered in blueprint / schematic style:
  • System component boxes with labeled arrows (boxes unlabeled)
  • Quality-attribute radar/spider chart
  • Risk sensitivity matrix grid
  • Utility tree branching diagram
  • Distributed system topology — interconnected server and cloud nodes
  • Container/microservice icons
  • Abstract data-flow arrows in orange and teal accent colors

TITLE TEXT (centered in the right 80% zone, middle-height of the image):
  Line 1 — "Architecture Tradeoff" — large crisp bold white sans-serif, very readable
  Line 2 — "Analysis Method" — same style, same size
  Below the title — "ATAM" — in orange (#FF6D00), slightly smaller

COLOR PALETTE: Deep indigo/navy backgrounds, orange (#FF6D00) and teal (#20B2AA) \
accents, white title text. Golden-amber and warm tones only in the leftmost 20% gradient \
to suggest warmth where the mascot will sit.

STYLE: Modern professional technical textbook. Clean, not cluttered, blueprint-inspired.

STRICTLY NO: watermarks, logos, trademarks, giraffe or any animals, photographs.
"""


def crop_and_resize(pil_img: Image.Image,
                    target_w: int = 1200,
                    target_h: int = 630) -> Image.Image:
    """Center-crop to 1.91:1 then resize to target dimensions."""
    target_aspect = target_w / target_h
    w, h = pil_img.size
    current_aspect = w / h

    if current_aspect > target_aspect:
        new_w = int(h * target_aspect)
        left = (w - new_w) // 2
        pil_img = pil_img.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target_aspect)
        top = (h - new_h) // 2
        pil_img = pil_img.crop((0, top, w, top + new_h))

    return pil_img.resize((target_w, target_h), resample=Image.LANCZOS)


def composite_mascot(cover: Image.Image, mascot_path: Path) -> Image.Image:
    """Paste welcome.png into the left 20% of the cover, vertically centered."""
    with Image.open(mascot_path) as m:
        m = m.convert("RGBA")

        zone_w = int(cover.width * 0.20)   # 240 px for a 1200-wide cover
        zone_h = cover.height              # 630 px

        padding = 12
        max_w = zone_w - 2 * padding
        max_h = zone_h - 2 * padding

        mw, mh = m.size
        scale = min(max_w / mw, max_h / mh)
        m_resized = m.resize((int(mw * scale), int(mh * scale)), resample=Image.LANCZOS)

        x = padding + (max_w - m_resized.width)  // 2
        y = padding + (max_h - m_resized.height) // 2

        cover.paste(m_resized, (x, y), m_resized)

    return cover


def main() -> None:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        sys.exit("OPENAI_API_KEY is not set.")

    if not MASCOT_PATH.exists():
        sys.exit(f"Mascot image not found: {MASCOT_PATH}")

    client = OpenAI()

    print("=== ATAM Cover Image Generator ===")
    print(f"Mascot  : {MASCOT_PATH}")
    print(f"Output  : {OUT_PATH}")
    print()
    print("Step 1: Calling OpenAI image API for architecture background…")

    response = client.images.generate(
        model="gpt-image-1",
        prompt=BACKGROUND_PROMPT,
        size="1536x1024",
        quality="high",
        output_format="png",
        n=1,
    )

    b64 = response.data[0].b64_json
    png_bytes = base64.b64decode(b64)

    print("Step 2: Crop & resize background to 1200×630…")
    with Image.open(io.BytesIO(png_bytes)) as bg:
        cover = crop_and_resize(bg.convert("RGBA"))

    print("Step 3: Compositing Vista (welcome pose) into left 20%…")
    cover = composite_mascot(cover, MASCOT_PATH)

    print(f"Step 4: Saving to {OUT_PATH}…")
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    cover.convert("RGB").save(str(OUT_PATH), format="PNG")

    print()
    print(f"Done. Cover saved: {OUT_PATH}  ({cover.width}×{cover.height})")


if __name__ == "__main__":
    main()
