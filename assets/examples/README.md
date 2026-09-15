# Example workouts & programs

The cards on `examples.html` (and the detail pages under `workouts/` and `programs/`)
are rendered from the data files in this directory. To add a new one, you only
need to create ONE file — no HTML needed. Detail pages are generated
automatically from the data.

Each program lives in one file with its workouts: `programs/<id>.js` holds the
program block plus one `exampleWorkout({...})` call per workout. Standalone
workouts (not part of any program) are one file each in `workouts/`, named after
their slug. `manifest.js` lists the data files; files load in parallel and card
order on examples.html is alphabetical by title, so file order does not matter.

How it works: `workout.html` and `program.html` are generic pages. Cloudflare
Pages (`_redirects` at the repo root) serves them for every
`/workouts/<slug>.html` and `/programs/<pageSlug>.html` URL, and the JS reads
the slug from the URL to render the right workout or program. The tab title and
meta description are filled in from the data too.

## Add a workout to a program

1. Open `programs/<id>.js` and copy an `exampleWorkout({...})` block to the end.
2. Edit the fields:
   - `title` — shown on the card and the detail page.
   - `slug` — used for the detail-page URL (`workouts/<slug>.html`).
   - `share` — the `https://kohlrabi.us/s/...` link behind the
     Start and Copy buttons.
   - `program` — must match the program's `id` (keeps the workout inside the
     program's card and detail page).
   - `desc` — one or two sentences for the card.
   - `tags` / `tagLabel` — space-separated filter tags (e.g.
     `'strength beginner'`) and the small label shown on the card (e.g.
     `'Strength'`, `'Lower'`, `'Upper'`).
   - `exercises` — pairs of `[name, sets x reps]`, one per line.
   - `attr` — attribution line for the detail page (`'A Cruciferous Greens
     original.'` or `'Adapted from <a href="...">...</a>.'`).
3. Done — the detail page appears automatically at `workouts/<slug>.html`.

## Add a standalone workout

1. Copy an existing file in `workouts/` (e.g. `push-day.js`) to
   `workouts/<slug>.js` (filename = slug).
2. Edit the fields as above, omitting `program` — it gets its own card on
   examples.html.
3. Add one line to `manifest.js` pointing at the new file.
4. Done — the detail page appears automatically at `workouts/<slug>.html`.

## Add a program

1. Copy `programs/phraks.js` to `programs/<id>.js` (filename = program id).
2. Edit the program block: `id`, `pageSlug` (detail-page URL:
   `programs/<pageSlug>.html`), `title`, `share`, `blurb`, `schedule`,
   `progression`, and optionally `attr`. Delete the example workout blocks and
   add your own.
3. Add one line to `manifest.js` pointing at the new file.
4. Done — the program page appears at `programs/<pageSlug>.html` and each
   workout at `workouts/<slug>.html`.

## Notes

- Muscle maps and pills on detail/share cards come from `assets/cg-data.js`
  (`MUSCLES` keyed by workout slug, `PROGRAM_MUSCLES` keyed by program id).
  If you skip that entry, the card simply shows no map — nothing breaks.
- Every data file is loaded with the site's `?v=` cache key automatically, so
  no manual cache-busting is needed when you edit one.
