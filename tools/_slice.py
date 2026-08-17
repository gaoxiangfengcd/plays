#!/usr/bin/env python3
"""Slice the sprite sheet into individual asset PNGs."""
import sys, os
from PIL import Image

SRC = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)
im = Image.open(SRC).convert("RGBA")

# (name, x0, y0, x1, y1) — cut lines taken at gutter centers, small inset to drop white edges
INSET = 4
CROPS = [
    # row1
    ("hero-carpet", 8, 12, 740, 316),
    ("ic-gamepad", 746, 12, 1012, 316),
    ("ic-bolt", 1012, 12, 1276, 316),
    ("ic-shield", 1276, 12, 1531, 316),
    # row2 icons
    ("ic-coin", 8, 322, 198, 462),
    ("ic-wheel", 198, 322, 388, 462),
    ("ic-card", 388, 322, 578, 462),
    ("ic-dice", 578, 322, 767, 462),
    ("ic-players", 767, 322, 956, 462),
    ("ic-question", 956, 322, 1146, 462),
    ("ic-memory", 1146, 322, 1336, 462),
    ("ic-heart", 1336, 322, 1524, 462),
    # row3 3D game covers
    ("cover-carpet", 8, 470, 295, 702),
    ("cover-carwash", 295, 470, 600, 702),
    ("cover-house", 600, 470, 945, 702),
    ("cover-treasure", 945, 470, 1241, 702),
    ("cover-door", 1241, 470, 1531, 702),
    # row4 icons
    ("ic-rocket", 8, 708, 194, 838),
    ("ic-map", 194, 708, 382, 838),
    ("ic-puzzle", 382, 708, 559, 838),
    ("ic-wheel2", 559, 708, 737, 838),
    ("ic-basketball", 737, 708, 916, 838),
    ("ic-redcar", 916, 708, 1094, 838),
    ("ic-pawn", 1094, 708, 1242, 838),
    ("ic-rook", 1242, 708, 1390, 838),
    ("ic-smile", 1390, 708, 1531, 838),
    # row5 new game covers
    ("new-bubble", 8, 844, 262, 1014),
    ("new-colormatch", 262, 844, 508, 1014),
    ("new-parking", 508, 844, 753, 1014),
    ("new-wordsearch", 753, 844, 990, 1014),
    ("new-stack", 990, 844, 1204, 1014),
    ("new-finddiff", 1204, 844, 1531, 1014),
]

for name, x0, y0, x1, y1 in CROPS:
    box = (x0 + INSET, y0 + INSET, x1 - INSET, y1 - INSET)
    crop = im.crop(box)
    crop.save(os.path.join(OUT, name + ".png"))
    print("saved", name, crop.size)
print("done", len(CROPS))