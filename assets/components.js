/* Kohlrabi site — shared components.
 *
 * Repeatable elements live here as data + template functions, so every page
 * keeps only its own content in HTML. A page drops in placeholders:
 *
 *   <div data-cg="nav" data-page="examples"></div>
 *   ...
 *   <div data-cg="footer"></div>
 *
 * `data-page` marks the current section in the nav (features, examples,
 * glossary, beta, pitch-in). Pages in a subdirectory (e.g. /workouts/) set
 * `data-root="../"` so asset and page links resolve from there.
 *
 * This script runs synchronously at the end of <body>, before site.js, so
 * behavior wiring in site.js sees the rendered markup. */

(function () {
  'use strict';

  var HEART_SVG = '<svg class="heart-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" aria-hidden="true"><path d="M12 20.7C6.4 16.7 3 13.3 3 9.6 3 7 5 5 7.6 5c1.8 0 3.4 1 4.4 2.6C13 6 14.6 5 16.4 5 19 5 21 7 21 9.6c0 3.7-3.4 7.1-9 11.1z"/></svg>';
  var MENU_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function rootOf(root) {
    return root ? String(root) : '';
  }

  /* ---------- navigation ---------- */

  var NAV_LINKS = [
    { page: 'getting-started', href: 'getting-started', label: 'Get started' },
    { page: 'switch', href: 'switch', label: 'Switch to Kohlrabi' },
    { page: 'examples', href: 'examples', label: 'Example Programs' },
    { page: 'glossary', href: 'glossary', label: 'Glossary of terms' }
  ];

  function nav(activePage, root) {
    var r = rootOf(root);
    var links = NAV_LINKS.map(function (link) {
      var current = link.page === activePage;
      var href = /^https?:\/\//.test(link.href) ? link.href : r + link.href;
      return '<a' + (current ? ' class="nav-current" aria-current="page"' : '') +
        ' href="' + href + '">' + esc(link.label) + '</a>';
    }).join('');
    var pitchCurrent = activePage === 'pitch-in';
    return '' +
      '<nav class="site-nav" aria-label="Primary navigation">' +
        '<div class="nav-inner">' +
          '<a class="brand" href="' + (r || '/') + '" aria-label="Kohlrabi home">' +
            '<svg width="96" height="96" viewBox="0 0 192 192" aria-hidden="true" focusable="false"><rect width="192" height="192" rx="35" fill="#2e7d32"/><path d="M95.0 127.5L105.9 103.5L141.9 89.1L146.7 81.3L138.9 69.6L60.7 45.6L48.3 46.6L45.6 60.7L70.6 141.6L85.7 145.7L95.0 127.9Z" fill="none" stroke="#fff" stroke-width="10.6" stroke-linejoin="round" stroke-linecap="round"/></svg>' +
            '<span>Kohlrabi</span>' +
          '</a>' +
          '<div class="nav-controls">' +
            '<button class="menu-button" type="button" aria-label="Open menu" aria-controls="navLinks" aria-expanded="false">' +
              MENU_SVG +
            '</button>' +
          '</div>' +
          '<div class="nav-links" id="navLinks">' +
            links +
            '<a class="button white nav-cta' + (pitchCurrent ? ' nav-current' : '') + '"' +
              (pitchCurrent ? ' aria-current="page"' : '') +
              ' href="' + r + 'pitch-in" data-plausible="Pitch in">Pitch in ' + HEART_SVG + '</a>' +
            '<a class="button primary nav-cta" data-plausible="Start tracking" href="https://kohlrabi.us">Start tracking <span class="arrow" aria-hidden="true">→</span></a>' +
          '</div>' +
        '</div>' +
      '</nav>';
  }

  /* ---------- footer ---------- */

  function footer(activeRoot) {
    var r = rootOf(activeRoot);
    return '' +
      '<footer>' +
        '<div class="footer-inner">' +
          '<div class="footer-brand-block">' +
            '<a class="footer-brand" href="' + r + 'index.html">Kohlrabi</a>' +
            '<p class="footer-copy">Free workout tracking, by <a href="https://cruciferousgreens.com">Cruciferous Greens</a>.</p>' +
            '<a class="button primary footer-train" data-plausible="Train now" href="https://kohlrabi.us">Train now</a>' +
          '</div>' +
          '<nav class="footer-cols" aria-label="Footer">' +
            '<div class="footer-col">' +
              '<h3>The app</h3>' +
              '<a href="' + r + 'getting-started.html">Getting started</a>' +
              '<a href="' + r + 'no-account">No account needed</a>' +
              '<a href="' + r + 'examples.html">Example workouts</a>' +
              '<a href="' + r + 'switch.html">Switch</a>' +
              '<a href="' + r + 'glossary.html">Glossary</a>' +
              '<a href="' + r + 'beta.html">Beta</a>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h3>About</h3>' +
              '<a href="' + r + 'credits.html">Credits</a>' +
              '<a href="' + r + 'release-notes.html">Release notes</a>' +
              '<a href="' + r + 'ai-disclosure.html">AI disclosure</a>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h3>Cruciferous Greens</h3>' +
              '<a href="https://cruciferousgreens.com/training">Coaching</a>' +
              '<a href="https://blog.cruciferousgreens.com">Blog</a>' +
              '<a href="https://buymeacoffee.com/cruciferousgreens">Donate</a>' +
              '<a href="' + r + 'pitch-in.html">Pitch in ' + HEART_SVG + '</a>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h3>Legal</h3>' +
              '<a href="' + r + 'privacy.html">Privacy policy</a>' +
              '<a href="' + r + 'terms.html">Terms &amp; conditions</a>' +
            '</div>' +
          '</nav>' +
        '</div>' +
        '<div class="footer-base">' +
          '<span>© 2026 <a href="https://cruciferousgreens.com">Cruciferous Greens</a></span>' +
        '</div>' +
      '</footer>';
  }

  /* ---------- example workout data + cards ---------- */

  var WORKOUTS = [];
  var PROGRAMS = [];

  function exerciseList(w) {
    var items = w.exercises.map(function (ex) {
      return '<li><span>' + esc(ex[0]) + '</span><strong>' + esc(ex[1]) + '</strong></li>';
    }).join('');
    return '<ol class="exercise-items">' + items + '</ol>';
  }

  function cardCta(shareUrl) {
    var url = esc(shareUrl || 'https://kohlrabi.us');
    var attr = shareUrl ? ' data-share="' + esc(shareUrl) + '"' : '';
    return '<div class="card-cta">' +
      '<a class="button primary card-start" data-plausible="Example: Start" href="' + url + '">Start <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
      '<button class="button secondary card-copy" type="button"' + attr + '>Copy</button>' +
    '</div>';
  }

  function creditBlock(kind, attr) {
    var noun = kind === 'program' ? 'program' : 'workout';
    var body;
    if (/^Adapted from/i.test(attr)) {
      body = 'This ' + noun + ' was adapted from ' + attr.replace(/^Adapted from\s*/i, '');
    } else if (/^Inspired by/i.test(attr)) {
      body = 'This ' + noun + ' was inspired by ' + attr.replace(/^Inspired by\s*/i, '');
    } else {
      body = 'This ' + noun + ' is a Kohlrabi original.';
    }
    return '<div class="training-note credit-note"><strong>Credit where it is due</strong><p>' + body + '</p></div>';
  }

  function copyCta(shareUrl) {
    return '<div class="detail-cta">' +
      '<a class="button primary" data-plausible="Example: Try it" href="' + esc(shareUrl || 'https://kohlrabi.us') + '">Try it in the app <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
      '<button class="subtle-copy" type="button" data-share="' + esc(shareUrl || '') + '">Copy link</button>' +
    '</div>';
  }

  function workoutCard(w) {
    return '' +
      '<article class="workout-example" data-kind="workout" data-tags="' + esc(w.tags) + '">' +
        '<div class="example-meta"><span>' + esc(w.tagLabel) + '</span><span>' + w.exercises.length + ' exercises</span></div>' +
        '<h2><a href="workouts/' + esc(w.slug) + '.html">' + esc(w.title) + '</a></h2>' +
        '<p>' + esc(w.desc) + '</p>' +
        cardCta(w.share) +
        '<details class="exercise-list"><summary>Show exercises (' + w.exercises.length + ')</summary>' +
          '<div class="exercise-list-body">' + exerciseList(w) + '</div>' +
        '</details>' +
      '</article>';
  }

  function workoutBySlug(slug) {
    for (var i = 0; i < WORKOUTS.length; i++) {
      if (WORKOUTS[i].slug === slug) return WORKOUTS[i];
    }
    return null;
  }

  /* Generic detail pages (workout.html / program.html) are served for every
     /workouts/<slug>.html and /programs/<pageSlug>.html URL via _redirects.
     The slug comes from the URL path when no data-workout/data-program is set. */
  function slugFromPath(prefix) {
    if (typeof location === 'undefined') return '';
    var m = String(location.pathname || '').match(new RegExp('^/' + prefix + '/([^/]+?)\\.html$'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  function programByPageSlug(pageSlug) {
    for (var i = 0; i < PROGRAMS.length; i++) {
      if (PROGRAMS[i].pageSlug === pageSlug) return PROGRAMS[i];
    }
    return null;
  }

  /* After a detail slot renders, sync the tab title + meta description from
     the rendered content (the generic pages ship with placeholder values).
     OG/Twitter tags and the canonical URL follow too, so the per-workout
     and per-program URLs share correctly after JS render. */
  function setMetaAttr(selector, attr, value) {
    var el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }
  function setDetailMeta(el) {
    if (typeof document === 'undefined') return;
    var h1 = el.querySelector('h1');
    var lede = el.querySelector('.subpage-lede');
    var title = (h1 && h1.textContent) ? h1.textContent.trim() + ' - Kohlrabi' : '';
    var desc = (lede && lede.textContent) ? lede.textContent.trim() : '';
    /* Canonical + og:url use the clean URL form (no .html), matching the
       server-rendered canonicals and the sitemap. */
    var url = String(location.href).split('#')[0].replace(/\.html$/, '');
    if (title) {
      document.title = title;
      setMetaAttr('meta[property="og:title"]', 'content', title);
      setMetaAttr('meta[name="twitter:title"]', 'content', title);
    }
    if (desc) {
      setMetaAttr('meta[name="description"]', 'content', desc);
      setMetaAttr('meta[property="og:description"]', 'content', desc);
      setMetaAttr('meta[name="twitter:description"]', 'content', desc);
    }
    setMetaAttr('meta[property="og:url"]', 'content', url);
    setMetaAttr('link[rel="canonical"]', 'href', url);
  }

  /* ---------- native muscle maps + pills (rebuilt from the app's SVG) ---------- */

  function titleCase(s) {
    return String(s).replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function musclesOf(kind, key) {
    if (typeof window === 'undefined' || !window.CG_DATA) return [];
    var table = kind === 'program' ? window.CG_DATA.PROGRAM_MUSCLES : window.CG_DATA.MUSCLES;
    return table[key] || [];
  }

  function musclePills(muscles) {
    if (!muscles.length) return '';
    return '<ul class="muscle-pills" aria-label="Muscles worked">' +
      muscles.map(function (m) { return '<li>' + esc(titleCase(m)) + '</li>'; }).join('') +
      '</ul>';
  }

  function bodyMap(muscles, extraClass) {
    if (!muscles.length) return '';
    return '<div class="cg-map' + (extraClass ? ' ' + extraClass : '') + '" data-cg-map data-muscles="' +
      esc(muscles.join(',')) + '" role="img" aria-label="Muscles worked: ' +
      esc(muscles.map(titleCase).join(', ')) + '"></div>';
  }

  function workoutShareCard(slug, root) {
    var w = workoutBySlug(slug);
    if (!w) return '';
    var muscles = musclesOf('workout', slug);
    return '' +
      '<article class="share-card">' +
        '<div class="share-card-head">' +
          '<div class="example-meta"><span class="pill">' + esc(w.tagLabel) + '</span></div>' +
          '<h3>' + esc(w.title) + '</h3>' +
          '<p>' + esc(w.desc) + '</p>' +
        '</div>' +
        '<div class="cg-map-frame">' + bodyMap(muscles) + '</div>' +
        '<div class="share-card-body">' +
          exerciseList(w) +
          musclePills(muscles) +
          cardCta(w.share) +
        '</div>' +
      '</article>';
  }

  function programShareCard(id, root) {
    var p = programById(id);
    if (!p) return '';
    var r = rootOf(root);
    var days = WORKOUTS.filter(function (w) { return w.program === p.id; });
    var muscles = musclesOf('program', id);
    var dayItems = days.map(function (w) {
      return '<li><a href="' + r + 'workouts/' + esc(w.slug) + '.html">' + esc(programDayLabel(w, p)) + '</a>' +
        '<p>' + esc(w.desc) + '</p></li>';
    }).join('');
    return '' +
      '<article class="share-card">' +
        '<div class="share-card-head">' +
          '<div class="example-meta"><span class="pill">Program</span><span>' + days.length + ' days</span></div>' +
          '<h3>' + esc(p.title) + '</h3>' +
          '<p>' + esc(p.blurb) + '</p>' +
        '</div>' +
        '<div class="cg-map-frame">' + bodyMap(muscles) + '</div>' +
        '<div class="share-card-body">' +
          '<ul class="share-days">' + dayItems + '</ul>' +
          musclePills(muscles) +
          cardCta(p.share) +
        '</div>' +
      '</article>';
  }

  function workoutDetail(slug, root) {
    var w = workoutBySlug(slug);
    var r = rootOf(root);
    if (!w) return '<p>Workout not found. <a href="' + r + 'examples.html">Back to all example workouts</a>.</p>';
    var muscles = musclesOf('workout', slug);
    return '' +
      '<p class="detail-back"><a href="' + r + 'examples.html">&larr; All example workouts</a></p>' +
      '<div class="example-meta"><span class="pill">' + esc(w.tagLabel) + '</span></div>' +
      '<h1>' + esc(w.title) + '</h1>' +
      '<p class="subpage-lede">' + esc(w.desc) + '</p>' +
      bodyMap(muscles, 'detail-map') +
      musclePills(muscles) +
      '<h2 class="detail-h2">The workout</h2>' +
      exerciseList(w) +
      copyCta(w.share) +
      creditBlock('workout', w.attr);
  }

  function workoutCards() {
    return WORKOUTS.filter(function (w) { return !w.program; }).map(workoutCard).join('');
  }

  function programById(id) {
    for (var i = 0; i < PROGRAMS.length; i++) {
      if (PROGRAMS[i].id === id) return PROGRAMS[i];
    }
    return null;
  }

  function programDayLabel(w, p) {
    var label = w.title.replace(p.title, '').replace(/^[—–\-:\s]+/, '').trim();
    return label || w.title;
  }

  function programCard(p) {
    var days = WORKOUTS.filter(function (w) { return w.program === p.id; });
    if (!days.length) return '';
    var tagSet = {};
    days.forEach(function (w) {
      (w.tags || '').split(' ').forEach(function (t) { if (t) tagSet[t] = 1; });
    });
    var dayItems = days.map(function (w) {
      return '<li><a href="workouts/' + esc(w.slug) + '.html">' + esc(programDayLabel(w, p)) + '</a></li>';
    }).join('');
    var dayWord = days.length === 1 ? 'day' : 'days';
    return '' +
      '<article class="workout-example program-card" data-kind="program" data-tags="' + esc(Object.keys(tagSet).join(' ')) + '">' +
        '<div class="example-meta"><span>' + esc(days[0].tagLabel) + '</span><span>' + days.length + ' ' + dayWord + '</span></div>' +
        '<span class="program-pill">Program</span>' +
        '<h2><a href="programs/' + esc(p.pageSlug) + '.html">' + esc(p.title) + '</a></h2>' +
        '<p>' + esc(p.blurb) + '</p>' +
        cardCta(p.share) +
        '<details class="exercise-list"><summary>Show workouts (' + days.length + ')</summary>' +
          '<div class="exercise-list-body"><ol class="exercise-items">' + dayItems + '</ol></div>' +
        '</details>' +
      '</article>';
  }

  function programCards() {
    return PROGRAMS.map(programCard).join('');
  }

  function allExampleCards() {
    var items = PROGRAMS.map(function (p) { return { title: p.title, kind: 'program', ref: p }; })
      .concat(WORKOUTS.filter(function (w) { return !w.program; }).map(function (w) { return { title: w.title, kind: 'workout', ref: w }; }));
    items.sort(function (a, b) {
      var at = a.title.toLowerCase(), bt = b.title.toLowerCase();
      return at < bt ? -1 : (at > bt ? 1 : 0);
    });
    return items.map(function (it) {
      return it.kind === 'program' ? programCard(it.ref) : workoutCard(it.ref);
    }).join('');
  }

  function programDetail(id, root) {
    var p = programById(id);
    var r = rootOf(root);
    if (!p) return '<p>Program not found. <a href="' + r + 'examples.html">Back to all example workouts</a>.</p>';
    var days = WORKOUTS.filter(function (w) { return w.program === p.id; });
    var dayItems = days.map(function (w) {
      return '<li><a href="' + r + 'workouts/' + esc(w.slug) + '.html">' + esc(programDayLabel(w, p)) + '</a>' +
        '<p>' + esc(w.desc) + '</p></li>';
    }).join('');
    var attr = p.attr || (days.length ? days[0].attr : '');
    var muscles = musclesOf('program', id);
    return '' +
      '<p class="detail-back"><a href="' + r + 'examples.html">&larr; All example workouts</a></p>' +
      '<div class="example-meta"><span class="pill">Program</span></div>' +
      '<h1>' + esc(p.title) + '</h1>' +
      '<p class="subpage-lede">' + esc(p.blurb) + '</p>' +
      bodyMap(muscles, 'detail-map') +
      musclePills(muscles) +
      '<h2 class="detail-h2">The schedule</h2>' +
      '<p>' + esc(p.schedule) + '</p>' +
      '<h2 class="detail-h2">How progression works</h2>' +
      '<p>' + esc(p.progression) + '</p>' +
      '<h2 class="detail-h2">The days</h2>' +
      '<ul class="program-day-list">' + dayItems + '</ul>' +
      copyCta(p.share) +
      (attr ? creditBlock('program', attr) : '');
  }

  /* ---------- mount ---------- */

  function mountSlot(el, examples) {
    var kind = el.getAttribute('data-cg');
    var root = el.getAttribute('data-root') || '';
    var isExample = kind === 'workout-cards' || kind === 'program-cards' || kind === 'example-cards' ||
      kind === 'program-detail' || kind === 'workout-detail' ||
      kind === 'workout-share' || kind === 'program-share';
    if (isExample !== examples) return;
    /* The nav is server-rendered by build.py for first paint; only render it
       here if the slot is empty (e.g. a stale cached page). */
    if (kind === 'nav') { if (!el.querySelector('nav.site-nav')) el.innerHTML = nav(el.getAttribute('data-page') || '', root); }
    else if (kind === 'footer') el.innerHTML = footer(root);
    else if (kind === 'workout-cards') el.innerHTML = workoutCards();
    else if (kind === 'program-cards') el.innerHTML = programCards();
    else if (kind === 'example-cards') el.innerHTML = allExampleCards();
    else if (kind === 'program-detail') {
      var prog = el.getAttribute('data-program') || '';
      if (!prog) { var bySlug = programByPageSlug(slugFromPath('programs')); if (bySlug) prog = bySlug.id; }
      el.innerHTML = programDetail(prog, root);
      setDetailMeta(el);
    }
    else if (kind === 'workout-detail') {
      el.innerHTML = workoutDetail(el.getAttribute('data-workout') || slugFromPath('workouts'), root);
      setDetailMeta(el);
    }
    else if (kind === 'workout-share') el.innerHTML = workoutShareCard(el.getAttribute('data-slug') || '', root);
    else if (kind === 'program-share') el.innerHTML = programShareCard(el.getAttribute('data-program') || '', root);
  }

  function mount() {
    if (typeof document === 'undefined') return;
    var slots = document.querySelectorAll('[data-cg]');
    for (var i = 0; i < slots.length; i++) mountSlot(slots[i], false);
  }

  /* Called by examples-loader.js once the data files in assets/examples/ arrive. */
  var examplesMounted = false;
  function mountExamples() {
    if (examplesMounted || typeof document === 'undefined') return;
    examplesMounted = true;
    var d = window.CG_EXAMPLES || { workouts: [], programs: [] };
    for (var i = 0; i < d.workouts.length; i++) WORKOUTS.push(d.workouts[i]);
    for (var j = 0; j < d.programs.length; j++) PROGRAMS.push(d.programs[j]);
    var slots = document.querySelectorAll('[data-cg]');
    var hasData = (WORKOUTS.length + PROGRAMS.length) > 0;
    for (var k = 0; k < slots.length; k++) {
      /* No data (e.g. the fetch failed): leave the skeleton cards shimmering
         instead of wiping the grid blank. */
      if (!hasData && slots[k].getAttribute('data-cg') === 'example-cards') continue;
      mountSlot(slots[k], true);
    }
    if (window.CG_NATIVE && typeof window.CG_NATIVE.hydrateMaps === 'function') window.CG_NATIVE.hydrateMaps();
    if (typeof window.applyExampleFilters === 'function') window.applyExampleFilters();
    else if (typeof window.applyPagination === 'function') window.applyPagination();
  }

  window.CG = {
    esc: esc,
    nav: nav,
    footer: footer,
    workoutCard: workoutCard,
    workoutCards: workoutCards,
    programCards: programCards,
    PROGRAMS: PROGRAMS,
    workoutBySlug: workoutBySlug,
    workoutDetail: workoutDetail,
    programDetail: programDetail,
    workoutShareCard: workoutShareCard,
    programShareCard: programShareCard,
    musclePills: musclePills,
    bodyMap: bodyMap,
    allExampleCards: allExampleCards,
    programCard: programCard,
    WORKOUTS: WORKOUTS,
    mount: mount,
    mountExamples: mountExamples
  };

  mount();
})();
