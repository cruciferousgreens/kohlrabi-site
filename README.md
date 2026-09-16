# getkohlrabi.com

The Kohlrabi marketing site — a plain static site (HTML + CSS + JS) built from
components + pages by `build.py`. Kohlrabi is the free workout-tracking app by
[Cruciferous Greens](https://cruciferousgreens.com); the app itself lives at
https://kohlrabi.us.

## How your changes go live

```
Edit src/pages/*.html (or src/components/*.html) → run python3 build.py → commit to main → auto-deploy → live on getkohlrabi.com
```

- **Hosting:** Cloudflare Pages (connect this repo; build command: `python3 build.py`).
- **Deploy trigger:** every push to the `main` branch. Nothing else deploys the site — other branches are safe to experiment in.
- **Build:** `python3 build.py` assembles root `*.html` from `src/` and regenerates sitemaps, `robots.txt`, and `llms.txt` via `tools/gen-sitemap.py`. Built root files are committed (same convention as the Cruciferous Greens site).

## Making changes

**Edit the source, not the built files.** Each `src/pages/<name>.html` is front-matter
(title, description, canonical, nav_page, …) plus the `<main>` inner content.
`src/components/` holds `head.html`, `nav.html`, `footer.html`, and the noscript nav fallbacks.

1. Edit a file under `src/pages/` or `src/components/`.
2. Run `python3 build.py` from the repo root and check it built cleanly.
3. Commit everything (including the regenerated root `*.html`) to `main`.

### Checking a change before it goes live (optional)

Open a **pull request** instead of committing straight to `main`. Cloudflare posts a preview link on the PR — open it to review your change on a real URL, then merge when it looks right.

### Working locally (optional)

```bash
git clone https://github.com/cruciferousgreens/kohlrabi-site.git
cd kohlrabi-site
# edit files, then:
python3 build.py
git add -A && git commit -m "Describe your change" && git push origin main
```

To preview locally before pushing, serve the folder with any static server, e.g. `python3 -m http.server`, then open http://localhost:8000.

## Where things live

| Path | What it is |
|---|---|
| `src/pages/` | Page sources: `index`, `features`, `examples`, `getting-started`, `switch`, `glossary`, `beta`, `trainers`, `pitch-in`, `credits`, `release-notes`, `privacy`, `terms`, `ai-disclosure`, `program`, `workout` |
| `src/components/` | `head.html`, `nav.html`, `footer.html`, noscript nav fallbacks |
| `assets/components.js` | **Shared header nav + footer** — `NAV_LINKS` and `footer()` render every page's chrome |
| `assets/site.css` | All styles |
| `assets/site.js` | Page behavior (theme toggle, mobile menu, forms…) |
| `assets/` | Images and icons |
| `build.py` | Assembles root `*.html` from `src/` |
| `tools/gen-sitemap.py` | Regenerates sitemaps, `robots.txt`, `llms.txt` |

Pages pull in the shared header/footer with two placeholder divs — you don't need to touch them:

```html
<div data-cg="nav" data-page="examples"></div>
...
<div data-cg="footer"></div>
```

- To change a nav link everywhere, edit the `NAV_LINKS` list at the top of `assets/components.js`.
- To change the footer columns, edit the `footer()` function in the same file.

## Things to know

- **Only `main` deploys.** Commits to other branches don't touch the live site.
- **No CNAME file needed.** The custom domain is managed in the Cloudflare dashboard, not the repo — don't add one.
- **No AI-generated imagery, ever.** Use standard emoji / system assets.
- **Links between pages use clean URLs** (`features`, not `features.html`), so internal clicks skip the `.html` → clean 308 hop. (Local `python3 -m http.server` previews don't resolve clean URLs — use a Pages preview deploy to click through.)
- **Cross-site links:** the app lives at https://kohlrabi.us; coaching and the blog stay on the Cruciferous Greens side (https://cruciferousgreens.com/training, https://blog.cruciferousgreens.com).
- **`/workouts/*` and `/programs/*`** are generated as static per-slug detail pages at build time (`workouts/<slug>.html`, `programs/<slug>.html`), each with a unique title/description, self-referential canonical, and `ExercisePlan` JSON-LD. The `_redirects` 200-rewrites to the generic `/workout` and `/program` pages remain as fallback for unknown slugs.
- **Mobile nav:** below 900px the header collapses to a hamburger menu automatically (handled by `site.css` + `site.js`).
- **The blog is separate.** The blog lives on Bearblog at blog.cruciferousgreens.com — its theme is managed in the Bearblog dashboard, not in this repo.
