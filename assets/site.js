/* Cruciferous Greens site — shared behavior. */

const menuButton = document.querySelector('.menu-button');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
  navLinks?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
}

/* Current-page highlighting is baked into the nav markup by components.js
   (data-page on the data-cg="nav" slot) — no runtime marking needed. */

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

/* Examples pagination: 6 cards per page. */
let examplePage = 1;
let tagFilter = 'all';
let kindFilter = 'both';
function examplesPerPage() { return 6; }
function applyPagination() {
  const grid = document.querySelector('[data-cg="example-cards"]');
  const nav = document.querySelector('[data-pagination]');
  if (!grid || !nav) return;
  const cards = Array.from(grid.querySelectorAll('.workout-example')).filter(card => !card.hidden);
  const per = examplesPerPage();
  const pages = Math.max(1, Math.ceil(cards.length / per));
  if (examplePage > pages) examplePage = pages;
  if (examplePage < 1) examplePage = 1;
  cards.forEach((card, i) => {
    card.style.display = (i >= (examplePage - 1) * per && i < examplePage * per) ? '' : 'none';
  });
  if (pages <= 1) { nav.hidden = true; nav.innerHTML = ''; return; }
  nav.hidden = false;
  nav.innerHTML =
    '<button type="button" class="page-btn" data-page-nav="prev"' + (examplePage === 1 ? ' disabled' : '') + '>&larr; Previous</button>' +
    '<span class="page-status">Page ' + examplePage + ' of ' + pages + '</span>' +
    '<button type="button" class="page-btn" data-page-nav="next"' + (examplePage === pages ? ' disabled' : '') + '>Next &rarr;</button>';
}
/* Collapse any open exercise lists so expand state doesn't carry over when the
   Programs/Workouts/Both toggle changes which cards are visible. Instant close
   (no animation): the grid is re-filtering at the same moment. */
function closeAllExerciseLists() {
  document.querySelectorAll('details.exercise-list[open]').forEach(details => {
    const exBody = details.querySelector('.exercise-list-body');
    if (exBody) {
      if (exBody._anim) { clearTimeout(exBody._anim); exBody._anim = null; }
      exBody.style.transition = ''; exBody.style.height = ''; exBody.style.overflow = '';
    }
    details.open = false;
  });
}
/* Combined tag + kind filtering for the example cards (called on chip/toggle
   clicks and once after the async example data renders). */
function applyExampleFilters() {
  document.querySelectorAll('.workout-example').forEach(card => {
    const tags = (card.dataset.tags || '').split(' ');
    const kind = card.dataset.kind || 'workout';
    const tagOk = tagFilter === 'all' || tags.includes(tagFilter);
    const kindOk = kindFilter === 'both' || kind === kindFilter;
    card.hidden = !(tagOk && kindOk);
  });
  document.querySelectorAll('[data-examples-section]').forEach(section => {
    section.hidden = !section.querySelector('.workout-example:not([hidden])');
  });
  examplePage = 1;
  applyPagination();
}
applyPagination();
let paginationResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(paginationResizeTimer);
  paginationResizeTimer = setTimeout(applyPagination, 150);
});

const SETS_MUSCLE = {
  day: [['Chest', 12], ['Back', 9], ['Shoulders', 6], ['Triceps', 4], ['Biceps', 3]],
  week: [['Chest', 32], ['Back', 28], ['Legs', 24], ['Shoulders', 18], ['Biceps', 12], ['Triceps', 12]],
  month: [['Back', 96], ['Chest', 88], ['Legs', 76], ['Shoulders', 54], ['Biceps', 36], ['Triceps', 36], ['Calves', 12]]
};

function renderSetsMuscle(range) {
  const list = document.querySelector('[data-sets-muscle-list]');
  if (!list) return;
  const rows = SETS_MUSCLE[range] || SETS_MUSCLE.week;
  const max = rows.reduce((m, r) => Math.max(m, r[1]), 1);
  list.innerHTML = rows.map(r => {
    const pct = Math.max(3, (r[1] / max) * 100).toFixed(1);
    return '<div class="muscle-volume-row" role="img" aria-label="' + r[0] + ', ' + r[1] + ' sets">' +
      '<strong class="analysis-label">' + r[0] + '</strong>' +
      '<span class="analysis-track"><i class="analysis-fill" style="width:' + pct + '%"></i></span>' +
      '<span class="analysis-value">' + r[1] + ' sets</span></div>';
  }).join('');
  const note = document.querySelector('.sets-muscle-note');
  if (note) note.textContent = 'Completed sets per muscle, this ' + range + '.';
}

renderSetsMuscle('week');

/* Volume by muscle panel: verbatim from the app's stats tab (Volume|Sets
   toggle, tappable rows expanding to the top exercises driving the muscle). */
const MUSCLE_VOLUME = [
  ['Chest', 12400, 96, [['Bench Press (Barbell)', 48, 6200], ['Incline Dumbbell Press', 36, 4400]]],
  ['Quadriceps', 11800, 88, [['Squat (Barbell)', 52, 7800], ['Leg Press', 28, 2600]]],
  ['Back', 9600, 84, [['Barbell Row', 44, 5200], ['Lat Pulldown', 36, 3800]]],
  ['Shoulders', 7400, 76, [['Overhead Press (Barbell)', 40, 4200], ['Lateral Raise', 32, 1100]]],
  ['Glutes', 6800, 62, [['Hip Thrust', 36, 4800], ['Romanian Deadlift', 24, 3400]]],
  ['Hamstrings', 5600, 58, [['Romanian Deadlift', 24, 3400], ['Leg Curl', 28, 1600]]],
  ['Triceps', 4400, 54, [['Overhead Triceps Extension', 30, 1200], ['Triceps Pushdown', 24, 1000]]],
  ['Biceps', 4100, 52, [['Barbell Curl', 28, 1400], ['Hammer Curl', 22, 1100]]]
];
let muscleVolumeMode = 'volume';
let expandedMuscle = null;

function formatVolumeDemo(value) {
  const rounded = Math.round(value);
  return rounded >= 1000
    ? (rounded / 1000).toFixed(rounded >= 10000 ? 0 : 1) + 'k lb'
    : rounded.toLocaleString() + ' lb';
}

function renderMuscleVolume() {
  const list = document.querySelector('[data-mv-list]');
  if (!list) return;
  const bySets = muscleVolumeMode === 'sets';
  const rows = MUSCLE_VOLUME.map(m => [m[0], bySets ? m[2] : m[1], m[3]]).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...rows.map(r => r[1]));
  list.innerHTML = rows.map(r => {
    const pct = Math.max(3, (r[1] / max) * 100).toFixed(1);
    const valueLabel = bySets ? r[1] + ' set' + (r[1] === 1 ? '' : 's') : formatVolumeDemo(r[1]);
    const isOpen = expandedMuscle === r[0];
    const drill = isOpen && r[2].length
      ? '<div class="muscle-drilldown">' + r[2].map(d => {
          const setsLabel = d[1] + ' set' + (d[1] === 1 ? '' : 's');
          const volLabel = formatVolumeDemo(d[2]);
          return '<button class="drilldown-row" type="button"><span>' + d[0] + '</span>' +
            '<span class="drilldown-value">' + (bySets ? setsLabel + ' · ' + volLabel : volLabel + ' · ' + setsLabel) + '</span>' +
            '<span aria-hidden="true">›</span></button>';
        }).join('') + '</div>'
      : '';
    return '<div class="muscle-volume-group">' +
      '<button class="muscle-volume-row' + (isOpen ? ' is-open' : '') + '" type="button" data-muscle-drill="' + r[0] + '" aria-expanded="' + isOpen + '">' +
      '<strong class="analysis-label">' + r[0] + '</strong>' +
      '<span class="analysis-track"><i class="analysis-fill" style="width:' + pct + '%"></i></span>' +
      '<span class="analysis-value">' + valueLabel + '</span>' +
      '<span class="drill-chevron" aria-hidden="true">›</span></button>' + drill + '</div>';
  }).join('');
  const note = document.querySelector('[data-mv-note]');
  if (note) note.textContent = bySets
    ? 'Completed sets per muscle, primary and secondary.'
    : 'Weighted volume. Secondary muscles receive 45% of the set\u2019s volume.';
}

renderMuscleVolume();

document.addEventListener('click', event => {
  /* Animated expand/collapse for the example-card exercise lists. */
  const exSummary = event.target.closest('details.exercise-list > summary');
  if (exSummary) {
    const details = exSummary.parentElement;
    const exBody = details.querySelector('.exercise-list-body');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (exBody && !reduceMotion) {
      event.preventDefault();
      const DURATION = 280;
      if (exBody._anim) { clearTimeout(exBody._anim); exBody._anim = null; }
      exBody.style.transition = '';
      if (details.open) {
        const startH = exBody.offsetHeight;
        exBody.style.height = startH + 'px';
        exBody.style.overflow = 'hidden';
        void exBody.offsetHeight;
        exBody.style.transition = 'height ' + DURATION + 'ms ease';
        exBody.style.height = '0px';
        exBody._anim = setTimeout(() => {
          details.open = false;
          exBody.style.transition = ''; exBody.style.height = ''; exBody.style.overflow = '';
          exBody._anim = null;
        }, DURATION);
      } else {
        details.open = true;
        const endH = exBody.scrollHeight;
        exBody.style.height = '0px';
        exBody.style.overflow = 'hidden';
        void exBody.offsetHeight;
        exBody.style.transition = 'height ' + DURATION + 'ms ease';
        exBody.style.height = endH + 'px';
        exBody._anim = setTimeout(() => {
          exBody.style.transition = ''; exBody.style.height = ''; exBody.style.overflow = '';
          exBody._anim = null;
        }, DURATION);
      }
      return;
    }
    return; /* reduced motion or unexpected markup: native instant toggle */
  }

  const demoSuggestion = event.target.closest('.suggestion-card:not(.suggestion-static)');
  if (demoSuggestion) {
    const kindEl = demoSuggestion.querySelector('.suggestion-name span:not(.suggestion-exercise)');
    if (kindEl && !demoSuggestion.dataset.kind) demoSuggestion.dataset.kind = kindEl.textContent;
    const applied = demoSuggestion.classList.toggle('applied');
    if (kindEl) kindEl.textContent = applied ? 'Applied ✓' : (demoSuggestion.dataset.kind || kindEl.textContent);
    return;
  }

  const setsRangeTab = event.target.closest('[data-sets-range]');
  if (setsRangeTab) {
    const scope = setsRangeTab.closest('section') || document;
    scope.querySelectorAll('[data-sets-range]').forEach(item => {
      const active = item === setsRangeTab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    renderSetsMuscle(setsRangeTab.dataset.setsRange);
    return;
  }

  const muscleModeBtn = event.target.closest('[data-mv-mode]');
  if (muscleModeBtn) {
    const mode = muscleModeBtn.dataset.mvMode;
    if (muscleVolumeMode === mode) return;
    muscleVolumeMode = mode;
    document.querySelectorAll('[data-mv-mode]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.mvMode === mode));
    });
    expandedMuscle = null;
    renderMuscleVolume();
    return;
  }

  const muscleDrill = event.target.closest('[data-muscle-drill]');
  if (muscleDrill) {
    const muscle = muscleDrill.dataset.muscleDrill;
    expandedMuscle = expandedMuscle === muscle ? null : muscle;
    renderMuscleVolume();
    return;
  }

  const switchTab = event.target.closest('.switch-tab[data-guide]');
  if (switchTab) {
    const scope = switchTab.closest('section') || document;
    const guide = switchTab.dataset.guide;
    scope.querySelectorAll('.switch-tab').forEach(item => {
      const active = item === switchTab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    scope.querySelectorAll('[data-guide-panel]').forEach(panel => {
      panel.hidden = panel.dataset.guidePanel !== guide;
    });
    return;
  }

  const modeButton = event.target.closest('.mode-button');
  if (modeButton) {
    const mode = modeButton.dataset.mode;
    document.querySelectorAll('.mode-button').forEach(item => {
      const active = item === modeButton;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-mode-panel]').forEach(panel => {
      panel.hidden = panel.dataset.modePanel !== mode;
    });
    return;
  }

  const filterChip = event.target.closest('.filter-chip');
  if (filterChip) {
    tagFilter = filterChip.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach(item => {
      item.classList.toggle('active', item === filterChip);
    });
    closeAllExerciseLists();
    applyExampleFilters();
    return;
  }

  const kindBtn = event.target.closest('[data-kind-filter]');
  if (kindBtn) {
    kindFilter = kindBtn.dataset.kindFilter;
    kindBtn.closest('.kind-toggle').querySelectorAll('.switch-tab').forEach(item => {
      item.classList.toggle('active', item === kindBtn);
    });
    closeAllExerciseLists();
    applyExampleFilters();
    return;
  }

  const pageNavButton = event.target.closest('[data-page-nav]');
  if (pageNavButton && !pageNavButton.disabled) {
    examplePage += pageNavButton.dataset.pageNav === 'next' ? 1 : -1;
    applyPagination();
    document.querySelector('.examples-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const copyButton = event.target.closest('.card-copy, .subtle-copy');
  if (copyButton) {
    const url = copyButton.dataset.share;
    if (!copyButton.dataset.label) copyButton.dataset.label = copyButton.textContent;
    const flash = (msg) => {
      copyButton.textContent = msg;
      clearTimeout(copyButton._copiedTimer);
      copyButton._copiedTimer = setTimeout(() => { copyButton.textContent = copyButton.dataset.label; }, 2000);
    };
    const legacyCopy = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch (e) { return false; }
    };
    if (url) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(
          () => flash('Copied'),
          () => flash(legacyCopy() ? 'Copied' : 'Copy failed')
        );
      } else {
        flash(legacyCopy() ? 'Copied' : 'Copy failed');
      }
    } else {
      flash('Copied');
    }
    return;
  }

  const link = event.target.closest('a');
  if (!link) return;

  if (link.matches('[data-placeholder-link]')) {
    event.preventDefault();
    const status = document.getElementById('articleStatus');
    if (status) status.textContent = 'Article link placeholder \u2014 copy will be added later.';
    return;
  }

  closeMenu();
});

(function initBugForm() {
  const form = document.getElementById('bugForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const val = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };
    const section = (heading, text) => `**${heading}**\n${text || '—'}`;
    const body = [
      section('What happened', val('bugWhat')),
      section('What I expected', val('bugExpected')),
      section('Steps to reproduce', val('bugSteps')),
      section('Device & browser', val('bugDevice')),
      section('App version', val('bugVersion'))
    ].join('\n\n');
    const title = val('bugTitle') || 'Bug report';
    const url = 'https://github.com/cruciferousgreens/workout-app-public/issues/new' +
      '?title=' + encodeURIComponent('[Bug] ' + title) +
      '&body=' + encodeURIComponent(body);
    window.open(url, '_blank', 'noopener');
  });
})();

/* Guide: progression-mode picker — taps swap the description, card size stays put. */
(function () {
  const DESCS = {
    rpe: 'Reps first, then weight. Your top set at or under the RPE trigger earns the increment.',
    linear: 'The increment goes up every session. No RPE needed.',
    pct: 'Each session\u2019s loads come from a percent of your training max.'
  };
  document.querySelectorAll('.prog-pick').forEach(function (wrap) {
    const card = wrap.closest('.adv-card');
    const desc = card ? card.querySelector('.prog-desc') : null;
    const pills = Array.prototype.slice.call(wrap.querySelectorAll('.rep-preset'));
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); });
        if (desc && DESCS[pill.getAttribute('data-prog')]) {
          desc.innerHTML = DESCS[pill.getAttribute('data-prog')];
        }
      });
    });
  });
})();

/* Letterbird modals — [data-open-modal="id"] opens, [data-close-modal] / ESC closes. */
(function () {
  function closeModal(modal) {
    modal.hidden = true;
    if (!document.querySelector('.lb-modal:not([hidden])')) {
      document.body.classList.remove('modal-open');
    }
  }
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-open-modal]');
    if (opener) {
      var modal = document.getElementById(opener.getAttribute('data-open-modal'));
      if (modal) {
        modal.hidden = false;
        document.body.classList.add('modal-open');
      }
      return;
    }
    var closer = e.target.closest('[data-close-modal]');
    if (closer) {
      var m = closer.closest('.lb-modal');
      if (m) closeModal(m);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.lb-modal:not([hidden])').forEach(closeModal);
    }
  });
})();

/* Comparison tables (switch.html): on narrow screens show the feature column
   plus one app column at a time, switched with a segmented control above the
   table. Built from the thead so it follows the markup; hidden on desktop
   via CSS (.col-toggle). */
(function () {
  const wraps = document.querySelectorAll('.compare-wrap');
  if (!wraps.length) return;
  wraps.forEach((wrap) => {
    const table = wrap.querySelector('.compare-table');
    const scroller = wrap.querySelector('.table-scroll');
    if (!table || !scroller) return;
    const heads = table.querySelectorAll('thead th');
    if (heads.length < 3) return;
    const altName = heads[2].textContent.trim();
    if (!altName) return;
    table.setAttribute('data-show', 'cg');

    const group = document.createElement('div');
    group.className = 'col-toggle switcher';
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-label', 'Choose which app to compare');

    const options = [
      { value: 'cg', label: 'Kohlrabi' },
      { value: 'alt', label: altName },
    ];
    const buttons = options.map((opt) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'switch-tab' + (opt.value === 'cg' ? ' active' : '');
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', opt.value === 'cg' ? 'true' : 'false');
      b.dataset.value = opt.value;
      b.textContent = opt.label;
      b.addEventListener('click', () => select(opt.value));
      group.appendChild(b);
      return b;
    });

    function select(value) {
      table.setAttribute('data-show', value);
      buttons.forEach((b) => {
        const on = b.dataset.value === value;
        b.classList.toggle('active', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    }
    group.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = table.getAttribute('data-show') === 'cg' ? 'alt' : 'cg';
      select(next);
      const btn = buttons.find((b) => b.dataset.value === next);
      if (btn) btn.focus();
    });

    wrap.insertBefore(group, scroller);
  });
})();

/* Hero charts: draw the line and grow the bars shortly after load. */
(function () {
  document.documentElement.classList.add('js');
  const charts = document.querySelectorAll('.mock-chart');
  if (!charts.length) return;
  const reveal = () => charts.forEach((c) => c.classList.add('in'));
  if (document.readyState === 'complete') {
    requestAnimationFrame(() => setTimeout(reveal, 250));
  } else {
    window.addEventListener('load', () => setTimeout(reveal, 250), { once: true });
  }
})();

/* Plausible click tracking: every link click plus named CTA events.
   The head snippet defines a window.plausible queue, so these calls are
   safe even before the Plausible script loads (or when it's blocked). */
(function () {
  function track(name, props) {
    try {
      if (typeof window.plausible === 'function') {
        if (props) window.plausible(name, { props: props });
        else window.plausible(name);
      }
    } catch (e) {}
  }
  function linkLabel(el) {
    var t = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ');
    return t.length > 60 ? t.slice(0, 57) + '...' : t;
  }
  document.addEventListener('click', function (e) {
    var cta = e.target.closest('[data-plausible]');
    if (cta) {
      track('CTA click', { cta: cta.getAttribute('data-plausible') });
      // CTA links count as both a CTA click and a link click;
      // non-link CTA buttons (e.g. modal openers) stop here.
      if (!cta.closest('a[href]')) return;
    }
    if (e.target.closest('button[data-share]')) { track('CTA click', { cta: 'Copy link' }); return; }
    var link = e.target.closest('a[href]');
    if (link) {
      var href = link.getAttribute('href') || '';
      var dest = href;
      try {
        var u = new URL(href, location.href);
        dest = u.hostname === location.hostname ? u.pathname + u.search : u.hostname;
      } catch (err) {}
      track('Link click', { label: linkLabel(link), destination: dest });
    }
  });
})();
