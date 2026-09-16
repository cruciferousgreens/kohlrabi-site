#!/usr/bin/env python3
"""Regenerate assets/og-image.png (1200x630 social share preview).

Keeps the card's established layout language (warm off-white, pale green
bottom band, mark on the left, type on the right) and swaps in the current
brand mark + name.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
BG = (0xFA, 0xF8, 0xF3)
BAND = (0xDD, 0xEF, 0xDC)
INK = (0x1C, 0x1C, 0x1E)
GREEN = (0x2E, 0x7D, 0x32)
GRAY = (0x65, 0x64, 0x69)
BAND_H = 28

FONT_DIR = Path("/usr/share/fonts/truetype/liberation")
BOLD = str(FONT_DIR / "LiberationSans-Bold.ttf")
REG = str(FONT_DIR / "LiberationSans-Regular.ttf")

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
d.rectangle([0, H - BAND_H, W, H], fill=BAND)

# Brand mark (arrow logo), 340px, vertically centered
mark = Image.open(ROOT / "assets" / "logo-arrow.png").convert("RGBA")
mark = mark.resize((340, 340), Image.LANCZOS)
img.paste(mark, (140, (H - 340) // 2), mark)

# Type block (sub-lines shrink to fit the card)
x = 540
max_w = W - x - 60
d.text((x, 150), "Kohlrabi.", font=ImageFont.truetype(BOLD, 148), fill=INK)

def fit(text, path, size, fill, y):
    while size > 20:
        f = ImageFont.truetype(path, size)
        if d.textlength(text, font=f) <= max_w:
            break
        size -= 2
    d.text((x, y), text, font=ImageFont.truetype(path, size), fill=fill)

fit("Free workout tracker", BOLD, 56, GREEN, 330)
fit("Log every set. Share anything.", REG, 56, GRAY, 410)

out = ROOT / "assets" / "og-image.png"
img.save(out)
print("wrote", out)
