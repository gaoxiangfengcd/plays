#!/usr/bin/env python3
"""Inject analytics.js into all pages (idempotent)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = [
    "index.html",
    "tools/spin-the-wheel/index.html",
    "tools/random-name-picker/index.html",
    "tools/mystery-box-picker/index.html",
    "tools/pick-a-card/index.html",
    "tools/flip-a-coin/index.html",
    "tools/dice-roller/index.html",
    "tools/decision-maker/index.html",
    "games/truth-or-dare/index.html",
    "games/would-you-rather/index.html",
    "games/memory-match/index.html",
]
TAG = '<script src="/assets/analytics.js"></script>'

for rel in PAGES:
    fp = ROOT / rel
    html = fp.read_text(encoding="utf-8")
    if "analytics.js" in html:
        print(f"skip: {rel}")
        continue
    # place analytics.js right before </body> (loads after app/pages scripts)
    html = html.replace("</body>", "    " + TAG + "\n  </body>", 1)
    fp.write_text(html, encoding="utf-8")
    print(f"updated: {rel}")
print("done")