#!/usr/bin/env python3
"""Regenerate assets/og-image.png (1200x630 social share preview).

Card language: warm off-white, pale green bottom band, brand mark left,
type right. Headline matches the site hero h1 treatment (900-weight grotesk,
-0.06em tracking, tight leading).
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

BLACK = "/usr/share/fonts/truetype/noto/NotoSansDisplay-Black.ttf"
FONT_DIR = Path("/usr/share/fonts/truetype/liberation")
BOLD = str(FONT_DIR / "LiberationSans-Bold.ttf")
REG = str(FONT_DIR / "LiberationSans-Regular.ttf")


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

# Brand mark: smaller, hugging the left
MARK = 220
mark = Image.open(ROOT / "assets" / "logo-arrow.png").convert("RGBA")
mark = mark.resize((MARK, MARK), Image.LANCZOS)
img.paste(mark, (100, (H - MARK) // 2), mark)

# Type block
x = 100 + MARK + 60
max_w = W - x - 60

headline = "Kohlrabi."
hf = fit_font(d, headline, BLACK, 150, max_w, -0.06)
draw_tracked(d, (x, 168), headline, hf, INK, -0.06 * hf.size)

gf = fit_font(d, "Track a personal best", BOLD, 56, max_w, 0)
d.text((x, 348), "Track a personal best", font=gf, fill=GREEN)

sf = fit_font(d, "Free workout app", REG, 56, max_w, 0)
d.text((x, 428), "Free workout app", font=sf, fill=GRAY)

out = ROOT / "assets" / "og-image.png"
img.save(out)
print("wrote", out)
