#!/usr/bin/env python3
"""Regenerate assets/og-image.png (1200x630 social share preview).

Card language: warm off-white, pale green bottom band, brand mark left,
type right. Headline matches the site hero h1 treatment (900-weight grotesk,
-0.06em tracking, tight leading). The mark is sized to the type block height.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
BG = (0xFA, 0xF8, 0xF3)
BAND = (0xDD, 0xEF, 0xDC)
INK = (0x1C, 0x1C, 0x1E)
GREEN = (0x2E, 0x7D, 0x32)
BAND_H = 28

BLACK = "/usr/share/fonts/truetype/noto/NotoSansDisplay-Black.ttf"
FONT_DIR = Path("/usr/share/fonts/truetype/liberation")
BOLD = str(FONT_DIR / "LiberationSans-Bold.ttf")


def draw_tracked(d, xy, text, font, fill, tracking):
    """Draw text with letter-spacing (tracking in px, may be negative)."""
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + tracking
    return x - tracking


def text_width(d, text, font, tracking):
    return sum(d.textlength(ch, font=font) + tracking for ch in text) - tracking


def fit_font(d, text, path, size, max_w, tracking_ratio):
    while size > 20:
        f = ImageFont.truetype(path, size)
        if text_width(d, text, f, tracking_ratio * size) <= max_w:
            return f
        size -= 4
    return ImageFont.truetype(path, size)


img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
d.rectangle([0, H - BAND_H, W, H], fill=BAND)

# --- measure the type block first ---
x = 160  # final x TBD after icon sizing; measure with provisional x
headline = "Kohlrabi."
hf = fit_font(d, headline, BLACK, 150, W - 420, -0.06)
hb = d.textbbox((0, 0), headline, font=hf)
head_h = hb[3] - hb[1]

gf = fit_font(d, "Track a personal best", BOLD, 56, W - 420, 0)
gb = d.textbbox((0, 0), "Track a personal best", font=gf)
green_h = gb[3] - gb[1]

GAP = 30
block_h = head_h + GAP + green_h

# --- icon matches the type block height ---
ICON_X = 100
mark = Image.open(ROOT / "assets" / "logo-arrow.png").convert("RGBA")
mark = mark.resize((block_h, block_h), Image.LANCZOS)

# --- lay out, vertically centered ---
top = (H - block_h) // 2
x = ICON_X + block_h + 60
max_w = W - x - 60
# re-fit against the real max width
hf = fit_font(d, headline, BLACK, 150, max_w, -0.06)
hb = d.textbbox((0, 0), headline, font=hf)
head_h = hb[3] - hb[1]
gf = fit_font(d, "Track a personal best", BOLD, 56, max_w, 0)
gb = d.textbbox((0, 0), "Track a personal best", font=gf)
green_h = gb[3] - gb[1]
block_h = head_h + GAP + green_h
mark = Image.open(ROOT / "assets" / "logo-arrow.png").convert("RGBA")
mark = mark.resize((block_h, block_h), Image.LANCZOS)
top = (H - block_h) // 2

img.paste(mark, (ICON_X, top), mark)
draw_tracked(d, (x, top - hb[1]), headline, hf, INK, -0.06 * hf.size)
d.text((x, top + head_h + GAP - gb[1]), "Track a personal best", font=gf, fill=GREEN)

out = ROOT / "assets" / "og-image.png"
img.save(out)
print("wrote", out)
