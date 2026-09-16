#!/usr/bin/env python3
"""Verify build.py's render_nav() matches assets/components.js nav() exactly.

The nav is server-rendered at build time for first paint, with components.js
as a fallback for stale pages. If either copy changes, run this to catch drift:
    python3 tools/check-nav-parity.py   (run from the repo root)
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from build import render_nav  # noqa: E402

PAGES = ['', 'getting-started', 'switch', 'examples', 'glossary', 'pitch-in', 'beta']

ok = True
for page in PAGES:
    js = subprocess.run(
        ['node', '-e',
         "const fs=require('fs');const window={};"
         "eval(fs.readFileSync('assets/components.js','utf8'));"
         f"console.log(window.CG.nav('{page}',''));"],
        capture_output=True, text=True, cwd=ROOT).stdout.strip()
    py = render_nav(page)
    match = py == js
    ok = ok and match
    print(f"{page or '(none)':16} {'MATCH' if match else 'DIFFER'}")
    if not match:
        for i, (a, b) in enumerate(zip(py, js)):
            if a != b:
                print(f"  first diff at char {i}:\n  py: ...{py[max(0,i-40):i+40]}...\n  js: ...{js[max(0,i-40):i+40]}...")
                break
print('PARITY:', 'OK' if ok else 'FAILED')
sys.exit(0 if ok else 1)
