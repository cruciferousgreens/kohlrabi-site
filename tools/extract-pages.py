#!/usr/bin/env python3
"""One-time: split the 19 built site pages into src/pages/ + src/components/.

Reads each root *.html, extracts front-matter (title, description, canonical,
nav attrs, scripts, head extras) and the <main> inner content, and writes:
  src/pages/<name>.html        front-matter + main content (the part you'd edit)
  src/components/head.html     full <head> with {{placeholders}}
  src/components/nav.html      nav slot with {{nav_attrs}} / {{noscript_nav}}
  src/components/footer.html   footer slot + scripts with placeholders

After this runs once, build.py (repo root) is the way to rebuild pages.
"""
import re
import pathlib

SITE = pathlib.Path('/home/hatch/workspace/site/cruciferousgreens-site')
SRC = SITE / 'src'
PAGES = SRC / 'pages'
COMP = SRC / 'components'

BASE = 'https://getkohlrabi.com'

HEAD_TOP = '''<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="color-scheme" content="light dark" />
{{robots_tag}}  <meta name="theme-color" content="#faf4ed" />
  <link rel="icon" type="image/png" href="{{asset_prefix}}assets/icon-mark.png" />
  <title>{{title}}</title>
  <meta name="description" content="{{description}}" />
<link rel="canonical" href="{{canonical}}">
{{og_tags}}  <link rel="stylesheet" href="{{asset_prefix}}assets/site.css?v={{v}}" />
  <script>try{if(localStorage.getItem('cg-theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}</script>
{{head_extra}}
<!-- Privacy-friendly analytics by Plausible -->
<script async src="https://plausible.io/js/pa-LP_xeCxd20Jub1_kcCzzn.js"></script>
<script>
  window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
  plausible.init()
</script>
</head>'''

OG_TAGS = '''<meta property="og:type" content="website">
<meta property="og:site_name" content="Cruciferous Greens">
<meta property="og:title" content="{{title}}">
<meta property="og:description" content="{{description}}">
<meta property="og:url" content="{{canonical}}">
<meta property="og:image" content="https://getkohlrabi.com/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Cruciferous Greens - Free workout tracker">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{title}}">
<meta name="twitter:description" content="{{description}}">
<meta name="twitter:image" content="https://getkohlrabi.com/assets/og-image.png">
'''

NAV = '''<div data-cg="nav"{{nav_attrs}}>
  {{noscript_nav}}
</div>'''

NOSCRIPT_STD = '<noscript><nav class="site-nav" aria-label="Primary navigation"><div class="nav-inner"><a class="brand" href="index.html">Cruciferous Greens</a><div class="nav-links"><a href="features.html">Features</a><a href="examples.html">Example workouts</a><a href="switch.html">Switch from another app</a><a href="training.html">Training</a><a href="pitch-in.html">Pitch in</a></div></div></nav></noscript>'
NOSCRIPT_ROOT = '<noscript><nav class="site-nav" aria-label="Primary navigation"><div class="nav-inner"><a class="brand" href="/index.html">Cruciferous Greens</a><div class="nav-links"><a href="/examples.html">Example workouts</a><a href="/switch.html">Switch from another app</a><a href="/training.html">Training</a><a href="/pitch-in.html">Pitch in</a></div></div></nav></noscript>'

FOOTER = '''<div data-cg="footer"{{footer_attrs}}></div>

  <script src="{{asset_prefix}}assets/cg-data.js?v={{v}}"></script>
{{examples_loader}}  <script src="{{asset_prefix}}assets/components.js?v={{v}}"></script>
  <script src="{{asset_prefix}}assets/native.js?v={{v}}"></script>
  <script src="{{asset_prefix}}assets/site.js?v={{v}}"></script>'''

EXAMPLES_LOADER_LINE = '  <script src="{{asset_prefix}}assets/examples-loader.js?v={{v}}"></script>\n'


def parse_page(path):
    s = path.read_text()
    head = re.search(r'<head>(.*?)</head>', s, re.S).group(1)
    title = re.search(r'<title>(.*?)</title>', head).group(1)
    desc = re.search(r'<meta name="description" content="(.*?)" />', head).group(1)
    canm = re.search(r'<link rel="canonical" href="([^"]+)">', head)
    canonical = canm.group(1) if canm else None
    robots = re.search(r'<meta name="robots" content="([^"]+)"', head)
    robots = robots.group(1) if robots else None
    no_og = 'og:title' not in head
    style = re.search(r'(<style>.*?</style>)', head, re.S)
    style = style.group(1) if style else None

    navm = re.search(r'<div data-cg="nav"([^>]*)>', s)
    nav_attrs = navm.group(1)
    nav_page = re.search(r'data-page="([^"]+)"', nav_attrs)
    nav_page = nav_page.group(1) if nav_page else None
    nav_root = '/ ' in nav_attrs or nav_attrs.strip().endswith('/')
    nav_root = re.search(r'data-root="([^"]+)"', nav_attrs)
    nav_root = nav_root.group(1) if nav_root else None

    root_relative = 'href="/assets/' in head
    examples_loader = 'examples-loader.js' in s.split('</main>')[1]

    content = s.split('<main id="top">', 1)[1].rsplit('</main>', 1)[0]

    fm = ['---', f'title: {title}', f'description: {desc}']
    if no_og:
        # preview-hero: draft page with a bespoke head; keep it verbatim.
        fm.append('head_raw: |')
        for line in head.splitlines():
            fm.append('  ' + line)
        fm.append('---')
        return '\n'.join(fm) + '\n' + content, {
            'title': title, 'canonical': canonical, 'nav_page': nav_page,
            'nav_root': nav_root, 'root_relative': root_relative,
            'examples_loader': examples_loader, 'robots': robots,
            'no_og': no_og, 'head_extra': style, 'head_raw': True,
        }
    if canonical:
        fm.append(f'canonical: {canonical}')
    if nav_page:
        fm.append(f'nav_page: {nav_page}')
    if nav_root:
        fm.append(f'nav_root: {nav_root}')
    if root_relative:
        fm.append('root_relative: true')
    if examples_loader:
        fm.append('examples_loader: true')
    if robots:
        fm.append(f'robots: {robots}')
    if no_og:
        fm.append('no_og: true')
    if style and not no_og:
        fm.append('head_extra: |')
        for line in style.splitlines():
            fm.append('  ' + line)
    fm.append('---')
    return '\n'.join(fm) + '\n' + content, {
        'title': title, 'canonical': canonical, 'nav_page': nav_page,
        'nav_root': nav_root, 'root_relative': root_relative,
        'examples_loader': examples_loader, 'robots': robots,
        'no_og': no_og, 'head_extra': style, 'head_raw': bool(no_og),
    }


def main():
    PAGES.mkdir(parents=True, exist_ok=True)
    COMP.mkdir(parents=True, exist_ok=True)
    (COMP / 'head.html').write_text(HEAD_TOP)
    (COMP / 'nav.html').write_text(NAV)
    (COMP / 'footer.html').write_text(FOOTER)
    (COMP / 'noscript-standard.html').write_text(NOSCRIPT_STD + '\n')
    (COMP / 'noscript-root.html').write_text(NOSCRIPT_ROOT + '\n')
    for path in sorted(SITE.glob('*.html')):
        page_text, meta = parse_page(path)
        (PAGES / path.name).write_text(page_text)
        print(f'{path.name}: nav_page={meta["nav_page"]} root={meta["root_relative"]} '
              f'examples={meta["examples_loader"]} robots={meta["robots"]} no_og={meta["no_og"]} '
              f'extra={bool(meta["head_extra"])}')


if __name__ == '__main__':
    main()
