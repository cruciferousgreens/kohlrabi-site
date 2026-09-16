#!/usr/bin/env python3
"""Regenerate sitemap.xml (+ index), robots.txt, and llms.txt for getkohlrabi.com.

Usage: run from ~/workspace/site/kohlrabi-site
Writes into the repo root (deployed): sitemap.xml, sitemap-pages.xml,
sitemap-workouts.xml, sitemap-programs.xml, robots.txt, llms.txt
"""
import json, os, re, subprocess, html

BASE = 'https://getkohlrabi.com'
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def lastmod(path):
    try:
        out = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', path],
                             capture_output=True, text=True).stdout.strip()
        return out or '2026-09-15'
    except Exception:
        return '2026-09-15'

def esc(s):
    return html.escape(s, quote=False)

# --- page URLs: (path, priority, changefreq) ---
PAGES = [
    ('', '1.0', 'weekly'),
    ('examples', '0.9', 'weekly'),
    ('features', '0.9', 'monthly'),
    ('getting-started', '0.9', 'monthly'),
    ('no-account', '0.8', 'monthly'),
    ('install', '0.8', 'monthly'),
    ('switch', '0.8', 'monthly'),
    ('trainers', '0.8', 'monthly'),
    ('release-notes', '0.6', 'monthly'),
    ('glossary', '0.5', 'monthly'),
    ('credits', '0.5', 'yearly'),
    ('pitch-in', '0.5', 'monthly'),
    ('ai-disclosure', '0.4', 'yearly'),
    ('privacy', '0.3', 'yearly'),
    ('terms', '0.3', 'yearly'),
]
# Note: /workout and /program (generic resolvers) and preview-hero.html are
# intentionally excluded — only canonical URLs belong in the sitemap.

# --- workout + program slugs from the example data files ---
node = subprocess.run(['node', '-e', r'''
var out = [];
global.exampleWorkout = w => out.push(['W', w.slug, w._file, w.title]);
global.exampleProgram = p => out.push(['P', (p.pageSlug || p.slug), p._file, p.title]);
var fs = require('fs'), path = require('path');
var files = JSON.parse(fs.readFileSync('assets/examples/manifest.js', 'utf8').match(/\[[\s\S]*\]/)[0]
  .replace(/'/g, '"').replace(/,\s*\]/, ']'));
files.forEach(f => {
  var src = fs.readFileSync(f, 'utf8') + '\n;global.__f=' + JSON.stringify(f) + ';';
  var wrap = src.replace(/exampleWorkout\(\(\{/, 'exampleWorkout(Object.assign({_file:global.__f},{')
                .replace(/exampleProgram\(\(\{/, 'exampleProgram(Object.assign({_file:global.__f},{');
  eval(wrap);
});
console.log(JSON.stringify(out));
'''], capture_output=True, text=True)
entries = json.loads(node.stdout)

workouts, programs = [], []
for kind, slug, srcfile, title in entries:
    lm = lastmod(srcfile)
    title = title or slug
    if kind == 'W':
        workouts.append((f'workouts/{slug}', lm, title))
    else:
        programs.append((f'programs/{slug}', lm, title))
workouts.sort(); programs.sort()

def urlset(items):
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lm, pr, cf in items:
        lines += ['  <url>',
                  f'    <loc>{esc(BASE + "/" + loc)}</loc>',
                  f'    <lastmod>{lm}</lastmod>',
                  f'    <changefreq>{cf}</changefreq>',
                  f'    <priority>{pr}</priority>',
                  '  </url>']
    lines.append('</urlset>')
    return '\n'.join(lines) + '\n'

page_items = [(p if p else '', lastmod(('index' if not p else p) + '.html'), pr, cf)
              for p, pr, cf in PAGES]
page_items = [((i[0]), i[1], i[2], i[3]) for i in page_items]
open('sitemap-pages.xml', 'w').write(urlset(list(page_items)))
open('sitemap-workouts.xml', 'w').write(
    urlset([(loc, lm, '0.7', 'monthly') for loc, lm, _t in workouts]))
open('sitemap-programs.xml', 'w').write(
    urlset([(loc, lm, '0.8', 'monthly') for loc, lm, _t in programs]))

today = subprocess.run(['date', '+%Y-%m-%d'], capture_output=True, text=True).stdout.strip()
index = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for name in ('sitemap-pages.xml', 'sitemap-workouts.xml', 'sitemap-programs.xml'):
    index += ['  <sitemap>',
              f'    <loc>{BASE}/{name}</loc>',
              f'    <lastmod>{today}</lastmod>',
              '  </sitemap>']
index.append('</sitemapindex>')
open('sitemap.xml', 'w').write('\n'.join(index) + '\n')

open('robots.txt', 'w').write(
    'User-agent: *\nAllow: /\n\n'
    f'Sitemap: {BASE}/sitemap.xml\n')

# --- llms.txt (Markdown links: Google's agentic-browsing audit requires
# real [title](url) link syntax, not bare URLs) ---
def md_link(title, url):
    t = (title or url).replace('[', '\\[').replace(']', '\\]')
    return f'- [{t}]({url})'

def page_title(p):
    path = ('index' if not p else p) + '.html'
    try:
        m = re.search(r'<title>(.*?)</title>', open(path, encoding='utf-8').read(), re.S)
        t = m.group(1).strip() if m else ''
    except Exception:
        t = ''
    t = re.sub(r'\s*[-\u2013\u2014]\s*Kohlrabi\s*$', '', t)
    return t or 'Home'

L = []
L.append('# Kohlrabi\n')
L.append('Kohlrabi is a free workout tracker by Cruciferous Greens: log every set, build flexible '
         'programs, and share workouts. No subscription, no account wall, works offline.\n')
L.append('## Key pages\n')
for p, _pr, _cf in PAGES:
    url = BASE + '/' + p
    L.append(md_link(page_title(p), url))
L.append('\n## Example workouts\n')
L.append('Full workout pages live at /workouts/<slug> (each lists its exercises, '
         'sets, and reps, with a share link into the app):\n')
for loc, _lm, title in workouts:
    L.append(md_link(title, f'{BASE}/{loc}'))
L.append('\n## Example programs\n')
L.append('Full program pages live at /programs/<slug> (overview plus every '
         'workout in the program):\n')
for loc, _lm, title in programs:
    L.append(md_link(title, f'{BASE}/{loc}'))
L.append('\n## Notes\n')
L.append('- Sitemap index: https://getkohlrabi.com/sitemap.xml '
         '(pages, workouts, and programs each have their own sitemap).')
L.append('- /workout and /program are generic resolvers, not canonical pages; '
         'always link the /workouts/<slug> or /programs/<slug> form.')
L.append('- The app itself lives at https://kohlrabi.us and requires '
         'JavaScript; the marketing pages above are static HTML (detail pages '
         'and example cards are server-rendered at build time).')
L.append('- Coaching and the blog live at https://cruciferousgreens.com (separate site).')
open('llms.txt', 'w').write('\n'.join(L) + '\n')

print(f'pages={len(page_items)} workouts={len(workouts)} programs={len(programs)}')
print('wrote sitemap.xml, sitemap-{pages,workouts,programs}.xml, robots.txt, llms.txt')
