#!/usr/bin/env python3
"""Slice the coin-flip sprite sheet (_src-coin.png, 1306x1205) into assets."""
import sys, os
from PIL import Image

SRC = "assets/_src-coin.png"
OUT = "assets/img"
os.makedirs(OUT, exist_ok=True)
im = Image.open(SRC).convert("RGBA")
W, H = im.size
print("source size", W, H)

# (name, x0, y0, x1, y1) in pixels of the 1306x1205 sheet
CROPS = [
    # top-left hero: coin on glowing podium
    ("coin-hero",      6,   18,  686,  616),
    # top-right three coin views (heads / edge / tails)
    ("coin-heads",   712,   96,  912,  336),
    ("coin-edge",    952,   96, 1092,  336),
    ("coin-tails",  1096,   96, 1300,  336),
    # purple star result badge (mid card)
    ("coin-badge",   356,  656,  542,  818),
    # feature icons row (shield / bolt / phone / dice)
    ("feat-shield",  892,  648,  978,  734),
    ("feat-bolt",   1000,  648, 1086,  734),
    ("feat-phone",  1102,  648, 1188,  734),
    ("feat-dice",   1204,  648, 1300,  734),
    ("feat-gift",    892,  752,  978,  838),
    ("feat-flash",  1000,  752, 1086,  838),
    ("feat-monitor",1102,  752, 1188,  838),
    # bottom recommendation icons
    ("rec-wheel",     10, 1044,  208, 1200),
    ("rec-cards",    214, 1044,  420, 1200),
    ("rec-dice",     426, 1044,  620, 1200),
    ("rec-question", 660, 1044,  838, 1200),
    ("rec-gift",     930, 1044, 1096, 1200),
    ("rec-dare",    1140, 1044, 1300, 1200),
]

for name, x0, y0, x1, y1 in CROPS:
    box = (max(0, x0), max(0, y0), min(W, x1), min(H, y1))
    crop = im.crop(box)
    crop.save(os.path.join(OUT, name + ".png"))
    print("saved", name, crop.size)
print("done", len(CROPS))