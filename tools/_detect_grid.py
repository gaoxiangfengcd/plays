#!/usr/bin/env python3
"""Detect near-white gutter columns within a horizontal band."""
import sys
from PIL import Image

SRC = sys.argv[1]
im = Image.open(SRC).convert("RGB")
W, H = im.size
px = im.load()

def is_white(r, g, b):
    return r > 238 and g > 238 and b > 238

def col_white_frac(x, y0, y1):
    c = 0
    n = 0
    for y in range(y0, y1, 3):
        r, g, b = px[x, y]
        if is_white(r, g, b):
            c += 1
        n += 1
    return c / n

# bands: (name, y0, y1)
BANDS = [
    ("row1", 16, 316),
    ("row2", 330, 460),
    ("row3", 478, 700),
    ("row4", 710, 836),
    ("row5", 846, 1012),
]

def gutters(y0, y1):
    """return list of x where column is mostly white (gutter)."""
    res = []
    x = 0
    while x < W:
        f = col_white_frac(x, y0, y1)
        if f > 0.9:
            res.append(x)
        x += 2
    # compress consecutive x into ranges -> centers
    ranges = []
    if res:
        s = res[0]
        p = res[0]
        for v in res[1:]:
            if v - p <= 4:
                p = v
            else:
                ranges.append((s, p))
                s = v
                p = v
        ranges.append((s, p))
    return ranges

for name, y0, y1 in BANDS:
    print(name, y0, y1, "gutters:", gutters(y0, y1))