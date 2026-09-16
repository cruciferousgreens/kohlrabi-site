#!/usr/bin/env python3
"""Split assets/site.css into per-page stylesheets using Chrome coverage data.

Usage:
  1. Serve the built site locally, e.g.:  python3 -m http.server 8901
  2. node tools/css-coverage.mjs http://localhost:8901/   # writes /tmp/css-coverage.json
  3. python3 tools/split-css.py                          # writes assets/css/<page>.css

Safety rules:
  - A CSS rule is kept for a page if Chrome saw it apply (mobile or desktop).
  - State-dependent selectors (:hover, :focus, :active, .open, .in, etc.) are
    ALWAYS kept — coverage can't reliably trigger every interaction state.
  - @media blocks are kept if any inner rule is kept (inner rules filtered).
  - site.css remains the source of truth; the per-page files are generated.

After regenerating, rebuild with python3 build.py so pages pick up the new CSS.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COVERAGE = Path('/tmp/css-coverage.json')
CSS_SRC = ROOT / 'assets' / 'site.css'
OUT_DIR = ROOT / 'assets' / 'css'

# Selectors that depend on user interaction / JS state: coverage may miss them,
# so never drop them.
STATE_PAT = re.compile(r':hover|:focus|:active|:visited|\.open\b|\.in\b|\.show\b|\[aria-expanded')


def parse_rules(css):
    """Yield (selector_or_atrule, full_text, start, end) for top-level rules."""
    rules = []
    i, n = 0, len(css)
    while i < n:
        # skip whitespace/comments between rules
        if css[i] in ' \t\n\r':
            i += 1
            continue
        if css.startswith('/*', i):
            end = css.index('*/', i) + 2
            i = end
            continue
        # rule starts here: find the block
        brace = css.find('{', i)
        semi = css.find(';', i)
        if brace == -1:
            break
        if semi != -1 and semi < brace:
            # at-rule without block (@import etc.) — skip
            i = semi + 1
            continue
        depth = 0
        j = brace
        while j < n:
            if css[j] == '{':
                depth += 1
            elif css[j] == '}':
                depth -= 1
                if depth == 0:
                    break
            j += 1
        rules.append((css[i:brace].strip(), css[i:j + 1], i, j + 1))
        i = j + 1
    return rules


def main():
    cov = json.loads(COVERAGE.read_text())
    css = CSS_SRC.read_text()
    rules = parse_rules(css)
    OUT_DIR.mkdir(exist_ok=True)

    # minifier (same as the one-off used for site.css)
    def minify(s):
        s = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
        s = re.sub(r'\s+', ' ', s)
        s = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', s)
        s = s.replace(';}', '}')
        s = re.sub(r'\)and\(', ') and (', s)
        return s.strip()

    for page, data in cov.items():
        used = set()
        for r in data['ranges']:
            used.update(range(r['start'], r['end']))
        kept = []
        for selector, text, start, end in rules:
            if STATE_PAT.search(selector):
                kept.append(text)
                continue
            if selector.startswith('@media'):
                # keep the block if any inner rule is used; filter inner rules
                inner = parse_rules(text[text.index('{') + 1:text.rindex('}')])
                offset = text.index('{') + 1
                kept_inner = []
                for isel, itext, istart, iend in inner:
                    abs_start = start + offset + istart
                    abs_end = start + offset + iend
                    if STATE_PAT.search(isel) or any(b in used for b in range(abs_start, abs_end)):
                        kept_inner.append(itext)
                if kept_inner:
                    kept.append(selector + '{' + ''.join(kept_inner) + '}')
                continue
            if any(b in used for b in range(start, end)):
                kept.append(text)
        out = minify(''.join(kept))
        (OUT_DIR / f'{page}.css').write_text(out + '\n')
        print(f'{page}.css: {len(out)} bytes (from {len(css)})')

    print('done.')


if __name__ == '__main__':
    main()
