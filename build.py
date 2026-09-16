#!/usr/bin/env python3
"""Build the site: src/pages/*.html + src/components/*.html -> root *.html.

Each page file is front-matter (title, description, canonical, nav_page, ...)
followed by the <main> inner content -- the part you'd actually edit.
Components hold the reusable shell: head, nav, footer.

Usage:  python3 build.py        (run from the repo root)
Cloudflare Pages runs this on every push (build command: python3 build.py).
"""
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / 'src'
PAGES = SRC / 'pages'
COMP = SRC / 'components'

OG_TAGS = '''<meta property="og:type" content="website">
<meta property="og:site_name" content="Kohlrabi">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="https://getkohlrabi.com/assets/og-image.png?v=4">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Kohlrabi - Free workout tracker">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="https://getkohlrabi.com/assets/og-image.png?v=4">
'''

EXAMPLES_LOADER_LINE = '  <script defer src="{ap}assets/examples-loader.js?v={v}"></script>\n'


# Mirrors the nav() function in assets/components.js. The nav is rendered at
# build time so it paints with first paint instead of waiting for the deferred
# JS. If the nav markup changes, update BOTH this function and components.js
# (and verify they match: see tools/check-nav-parity.py).
NAV_LINKS = [
    ('getting-started', 'getting-started.html', 'Get started'),
    ('switch', 'switch.html', 'Switch to Kohlrabi'),
    ('examples', 'examples.html', 'Example Programs'),
    ('glossary', 'glossary.html', 'Glossary of terms'),
]
_NAV_BRAND_SVG = ('<svg width="96" height="96" viewBox="0 0 192 192" aria-hidden="true" focusable="false">'
    '<rect width="192" height="192" rx="35" fill="#2e7d32"/>'
    '<path d="M95.0 127.5L105.9 103.5L141.9 89.1L146.7 81.3L138.9 69.6L60.7 45.6L48.3 46.6L45.6 60.7L70.6 141.6L85.7 145.7L95.0 127.9Z"'
    ' fill="none" stroke="#fff" stroke-width="10.6" stroke-linejoin="round" stroke-linecap="round"/></svg>')
_NAV_MENU_SVG = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"'
    ' stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>')
_NAV_HEART_SVG = ('<svg class="heart-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"'
    ' aria-hidden="true"><path d="M12 20.7C6.4 16.7 3 13.3 3 9.6 3 7 5 5 7.6 5c1.8 0 3.4 1 4.4 2.6C13 6 14.6 5 16.4 5 19 5 21 7 21 9.6c0 3.7-3.4 7.1-9 11.1z"/></svg>')


def render_nav(active_page):
    links = []
    for page, href, label in NAV_LINKS:
        if page == active_page:
            links.append(f'<a class="nav-current" aria-current="page" href="{href}">{label}</a>')
        else:
            links.append(f'<a href="{href}">{label}</a>')
    pitch_current = active_page == 'pitch-in'
    pitch_cls = 'button white nav-cta nav-current' if pitch_current else 'button white nav-cta'
    pitch_aria = ' aria-current="page"' if pitch_current else ''
    return (
        '<nav class="site-nav" aria-label="Primary navigation">'
        '<div class="nav-inner">'
        f'<a class="brand" href="index.html" aria-label="Kohlrabi home">{_NAV_BRAND_SVG}<span>Kohlrabi</span></a>'
        '<div class="nav-controls">'
        f'<button class="menu-button" type="button" aria-label="Open menu" aria-controls="navLinks" aria-expanded="false">{_NAV_MENU_SVG}</button>'
        '</div>'
        '<div class="nav-links" id="navLinks">'
        + ''.join(links) +
        f'<a class="{pitch_cls}"{pitch_aria} href="pitch-in.html" data-plausible="Pitch in">Pitch in {_NAV_HEART_SVG}</a>'
        '<a class="button primary nav-cta" data-plausible="Start tracking" href="https://kohlrabi.us">Start tracking <span class="arrow" aria-hidden="true">→</span></a>'
        '</div></div></nav>'
    )


def build_version():
    """Cache-busting marker for CSS/JS: the commit being built, else a timestamp."""
    sha = os.environ.get('CF_PAGES_COMMIT_SHA', '')
    if not sha:
        try:
            sha = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'],
                                 capture_output=True, text=True, cwd=ROOT
                                 ).stdout.strip()
        except Exception:
            sha = ''
    if sha:
        return sha
    return datetime.now(timezone.utc).strftime('%Y%m%d-%H%M')


def parse_page(path):
    text = path.read_text()
    assert text.startswith('---\n'), f'{path.name}: missing front-matter'
    end = text.index('\n---\n', 4)
    fm_text, content = text[4:end], text[end + 5:]
    meta, key, buf, is_block = {}, None, [], False
    def flush():
        nonlocal key, buf, is_block
        if key and is_block:
            meta[key] = '\n'.join(buf)
        key, buf, is_block = None, [], False
    for line in fm_text.splitlines():
        if line.startswith('  ') and key and is_block:
            buf.append(line[2:])
        elif line.endswith(': |'):
            flush()
            key, buf, is_block = line[:-3], [], True
        elif ': ' in line:
            flush()
            k, v = line.split(': ', 1)
            meta[k] = v
        else:
            raise ValueError(f'{path.name}: bad front-matter line: {line!r}')
    flush()
    for flag in ('root_relative', 'examples_loader', 'no_og'):
        meta[flag] = meta.get(flag) == 'true'
    # head_raw stays a string (the verbatim head) or missing
    return meta, content


def esc_attr(s):
    """Escape a value for a double-quoted HTML attribute."""
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def render(meta, content, v):
    ap = '/' if meta['root_relative'] else ''
    if meta.get('head_raw'):
        head_inner = re.sub(r'\?v=[\d-]+', f'?v={v}', meta['head_raw'])
        head = '<head>' + head_inner + '\n</head>'
    else:
        title, desc, can = esc_attr(meta['title']), esc_attr(meta['description']), esc_attr(meta['canonical'])
        head = (COMP / 'head.html').read_text()
        robots = meta.get('robots')
        head = head.replace('{{robots_tag}}',
                            f'  <meta name="robots" content="{robots}" />\n' if robots else '')
        head = head.replace('{{og_tags}}', '' if meta['no_og'] else
                            OG_TAGS.format(title=title, description=desc, canonical=can))
        head = head.replace('{{head_extra}}', meta.get('head_extra', ''))
        head = head.replace('{{title}}', title)
        head = head.replace('{{description}}', desc)
        head = head.replace('{{canonical}}', can)
        head = head.replace('{{asset_prefix}}', ap)
        head = head.replace('{{v}}', v)
        head = head.replace('{{css_page}}', meta['_name'].replace('.html', ''))

    nav_attrs = ''
    if meta.get('nav_page'):
        nav_attrs += f' data-page="{meta["nav_page"]}"'
    if meta.get('nav_root'):
        nav_attrs += f' data-root="{meta["nav_root"]}"'
    nav = (COMP / 'nav.html').read_text()
    nav = nav.replace('{{nav_attrs}}', nav_attrs).replace(
        '{{nav_html}}', render_nav(meta.get('nav_page') or ''))

    footer = (COMP / 'footer.html').read_text()
    footer = footer.replace('{{footer_attrs}}',
                            ' data-root="/"' if meta['root_relative'] else '')
    footer = footer.replace('{{examples_loader}}',
                            EXAMPLES_LOADER_LINE.format(ap=ap, v=v)
                            if meta['examples_loader'] else '')
    footer = footer.replace('{{asset_prefix}}', ap).replace('{{v}}', v)

    return ('<!doctype html>\n<!-- Generated by build.py from src/pages/' + meta['_name'] +
            ' -- edit the source, not this file. -->\n<html lang="en">\n' + head +
            '\n<body>\n' + nav +
            '\n\n  <main id="top">' + content + '</main>' +
            '\n\n' + footer + '\n</body>\n</html>\n')


def main():
    v = build_version()
    built = []
    for path in sorted(PAGES.glob('*.html')):
        meta, content = parse_page(path)
        meta['_name'] = path.name
        if not meta.get('head_raw'):
            for k in ('title', 'description', 'canonical'):
                assert meta.get(k), f'{path.name}: missing {k}'
        (ROOT / path.name).write_text(render(meta, content, v))
        built.append(path.name)
    print(f'built {len(built)} pages (v={v})')

    # Regenerate sitemaps/robots/llms from the built tree. Non-fatal: a stale
    # sitemap must never break a deploy (e.g. node missing in the build image).
    gen = ROOT / 'tools' / 'gen-sitemap.py'
    if gen.exists():
        try:
            r = subprocess.run([sys.executable, str(gen)], cwd=ROOT, timeout=120)
            if r.returncode != 0:
                print('warning: gen-sitemap.py failed; keeping previous sitemaps',
                      file=sys.stderr)
        except Exception as e:
            print(f'warning: gen-sitemap.py skipped ({e}); keeping previous sitemaps',
                  file=sys.stderr)


if __name__ == '__main__':
    main()
