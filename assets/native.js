/* Cruciferous Greens site — native live components.
 *
 * Body maps and charts rebuilt from the workout app's own assets instead of
 * screenshots: the anatomical SVG, its heat classes and muscle aliases, and
 * real training data generated into assets/cg-data.js.
 *
 * Hosts:
 *   <div class="cg-map" data-cg-map data-muscles="chest,shoulders,triceps"></div>
 *   <div class="cg-map" data-cg-map data-primary="chest" data-secondary="shoulders,triceps"></div>
 *   <div class="cg-chart" data-cg-chart="squat-vol"></div>
 *   <div class="cg-logs" data-cg-logs></div>
 *
 * The asset root is derived from this script's own src, so detail pages in
 * subdirectories (workouts/, programs/) work without configuration. */

(function () {
  'use strict';

  var GREEN = '#2e7d32';
  var GREEN_SOFT = 'rgba(46,125,50,.14)';
  var INK = '#1c1c1e';
  var MUTED = '#6b6a6e';
  var LINE = '#e4e0da';

  function assetRoot() {
    var scripts = document.querySelectorAll('script[src*="native.js"]');
    if (scripts.length) {
      var src = scripts[scripts.length - 1].getAttribute('src');
      var i = src.lastIndexOf('assets/native.js');
      if (i >= 0) return src.slice(0, i);
    }
    return '';
  }
  var ROOT = assetRoot();

  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }
  function titleCase(s) {
    return String(s).replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }
  function fmtNum(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function fmtDate(iso) {
    var p = iso.split('-');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[Number(p[1]) - 1] + ' ' + Number(p[2]);
  }
  function fmtDateYear(iso) {
    return fmtDate(iso) + " '" + iso.slice(2, 4);
  }

  /* ---------- body maps (stolen from the workout app) ---------- */

  var BODY_ALIASES = {
    'upper-chest': ['chest'], 'lower-chest': ['chest'],
    'front-delts': ['shoulders', 'front delts', 'front delt', 'front deltoid', 'anterior delts', 'anterior deltoid'],
    'rear-delts': ['shoulders', 'rear delts', 'rear delt', 'rear deltoid', 'posterior delts', 'posterior deltoid'],
    'side-delts': ['shoulders', 'side delts', 'side delt', 'lateral delts', 'lateral deltoid', 'middle delts'],
    'quads': ['quadriceps', 'adductors'], 'hamstrings': ['hamstrings'],
    'glutes': ['glutes', 'abductors'], 'forearms': ['forearms'],
    'abs': ['abdominals'], 'lats': ['lats'], 'lower-back': ['lower back'],
    'traps': ['traps', 'upper back', 'rhomboids', 'rhomboid', 'middle back', 'neck'],
    'triceps': ['triceps'], 'biceps': ['biceps'], 'calves': ['calves'],
    'obliques': ['abdominals']
  };

  var bodyTemplatePromise;
  function loadBodyTemplate() {
    if (!bodyTemplatePromise) {
      bodyTemplatePromise = fetch(ROOT + 'assets/sasha-body.svg')
        .then(function (res) { if (!res.ok) throw new Error('unavailable'); return res.text(); })
        .catch(function () { return null; });
    }
    return bodyTemplatePromise;
  }

  function paintRegion(region, cls, label) {
    region.classList.add(cls);
    var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = label;
    region.prepend(title);
  }

  function hydrateMaps() {
    var hosts = Array.prototype.slice.call(document.querySelectorAll('[data-cg-map]:not([data-hydrated])'));
    if (!hosts.length) return;
    loadBodyTemplate().then(function (template) {
      hosts.forEach(function (host) {
        host.setAttribute('data-hydrated', 'true');
        if (!template) {
          host.innerHTML = '<p class="cg-empty">Body map unavailable.</p>';
          return;
        }
        host.setAttribute('aria-hidden', 'true');
        host.innerHTML = template;
        var svg = host.querySelector('svg');
        if (svg) { svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false'); }
        var regions = Array.prototype.slice.call(host.querySelectorAll('[data-muscle]'));
        if (host.hasAttribute('data-primary')) {
          var primary = new Set((host.getAttribute('data-primary') || '').split(',').filter(Boolean));
          var secondary = new Set((host.getAttribute('data-secondary') || '').split(',').filter(Boolean));
          regions.forEach(function (region) {
            var names = BODY_ALIASES[region.getAttribute('data-muscle')] || [];
            var kind = names.some(function (m) { return primary.has(m); }) ? 'primary'
              : names.some(function (m) { return secondary.has(m); }) ? 'secondary' : null;
            paintRegion(region, kind === 'primary' ? 'heat-5' : kind === 'secondary' ? 'heat-2' : 'heat-0',
              titleCase(names[0] || region.getAttribute('data-muscle')) + (kind ? ' · ' + kind : ' · not targeted'));
          });
        } else if (host.hasAttribute('data-heat')) {
          /* data-heat="quadriceps:5,glutes:4,front delts:3" — per-muscle heat
             levels 0-5 like the app's volume ramp; unmatched regions stay
             heat-0. Lets a mock vary transparencies and leave blind spots
             (e.g. rear delts, calves) inactive. */
          var heat = {};
          (host.getAttribute('data-heat') || '').split(',').forEach(function (pair) {
            var kv = pair.split(':');
            if (kv.length === 2) {
              var lv = parseInt(kv[1], 10);
              heat[kv[0].trim().toLowerCase()] = lv >= 0 && lv <= 5 ? lv : 0;
            }
          });
          regions.forEach(function (region) {
            var names = BODY_ALIASES[region.getAttribute('data-muscle')] || [];
            var level = 0, hit = null;
            for (var i = 0; i < names.length; i++) {
              if (Object.prototype.hasOwnProperty.call(heat, names[i].toLowerCase())) {
                level = heat[names[i].toLowerCase()]; hit = names[i]; break;
              }
            }
            paintRegion(region, 'heat-' + level,
              titleCase(hit || names[0] || region.getAttribute('data-muscle')) + (level ? '' : ' · not targeted'));
          });
        } else if (host.hasAttribute('data-muscles')) {
          var worked = new Set((host.getAttribute('data-muscles') || '').split(',').filter(Boolean));
          regions.forEach(function (region) {
            var names = BODY_ALIASES[region.getAttribute('data-muscle')] || [];
            var hit = null;
            for (var i = 0; i < names.length; i++) {
              if (worked.has(names[i])) { hit = names[i]; break; }
            }
            if (hit) paintRegion(region, 'heat-worked', titleCase(hit));
            else paintRegion(region, 'heat-0', '');
          });
        }
      });
    });
  }

  /* ---------- charts ---------- */

  function chartShell(el, label, viewBox, inner) {
    var svg = svgEl('svg', {
      viewBox: viewBox, role: 'img', 'aria-label': label,
      preserveAspectRatio: 'xMidYMid meet'
    });
    var bg = svgEl('rect', { x: 0, y: 0, width: 560, height: 300, fill: '#ffffff', rx: 12 });
    svg.appendChild(bg);
    svg.appendChild(inner);
    el.appendChild(svg);
  }

  function niceCeil(v) {
    if (v <= 10) return Math.ceil(v);
    var mag = Math.pow(10, Math.floor(Math.log10(v)));
    var n = v / mag;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 3 ? 3 : n <= 5 ? 5 : 10;
    return step * mag;
  }

  /* Vertical bars: recent squat volume sessions and weekly volume. */
  function renderBars(el, key, label, formatX, unit) {
    var data = window.CG_DATA.CHARTS[key];
    var W = 560, H = 300, padL = 48, padR = 14, padT = 20, padB = 34;
    var g = svgEl('g', {});
    var max = Math.max.apply(null, data.map(function (d) { return d.v; }));
    var yMax = niceCeil(max);
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var ticks = 4;
    for (var t = 0; t <= ticks; t++) {
      var tv = yMax * t / ticks;
      var ty = padT + plotH * (1 - t / ticks);
      g.appendChild(svgEl('line', { x1: padL, y1: ty, x2: W - padR, y2: ty, stroke: LINE, 'stroke-width': 1 }));
      var tl = svgEl('text', { x: padL - 8, y: ty + 4, 'text-anchor': 'end', 'font-size': 11, fill: MUTED });
      tl.textContent = tv >= 1000 ? Math.round(tv / 1000) + 'k' : Math.round(tv);
      g.appendChild(tl);
    }
    var n = data.length;
    var slot = plotW / n, bw = Math.min(slot * 0.58, 34);
    data.forEach(function (d, i) {
      var bh = Math.max(plotH * (d.v / yMax), 3);
      var bx = padL + slot * i + (slot - bw) / 2;
      var by = padT + plotH - bh;
      var bar = svgEl('rect', { x: bx.toFixed(1), y: by.toFixed(1), width: bw.toFixed(1), height: bh.toFixed(1), rx: 4, fill: i === n - 1 ? GREEN : GREEN_SOFT, stroke: GREEN, 'stroke-width': 1.5 });
      var tt = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      tt.textContent = fmtDate(d.d) + ': ' + fmtNum(d.v) + ' ' + unit;
      bar.appendChild(tt);
      g.appendChild(bar);
      if (n <= 16 && (i === 0 || i === n - 1 || i % Math.ceil(n / 6) === 0)) {
        var xl = svgEl('text', { x: (padL + slot * i + slot / 2).toFixed(1), y: H - 10, 'text-anchor': 'middle', 'font-size': 11, fill: MUTED });
        xl.textContent = formatX(d.d);
        g.appendChild(xl);
      }
    });
    chartShell(el, label, '0 0 560 300', g);
  }

  /* ---------- exercise Progress demo: heaviest weight + volume per day ---------- */

  function linePathD(data, field, X, Y) {
    var d = 'M ' + X(0).toFixed(1) + ' ' + Y(data[0][field]).toFixed(1);
    for (var i = 1; i < data.length; i++) {
      d += ' L ' + X(i).toFixed(1) + ' ' + Y(data[i][field]).toFixed(1);
    }
    return d;
  }

  function mountProgress(demo) {
    var all = window.CG_DATA && window.CG_DATA.CHARTS && window.CG_DATA.CHARTS.squatProgress;
    if (!all || !all.length) return;
    /* Optional data-window="a,b": render a slice of the series (e.g. a rising
       window for a hero card). Indices clamp to the array bounds. */
    var data = all;
    var win = String(demo.getAttribute('data-window') || '').split(',');
    if (win.length === 2) {
      var wa = Math.max(0, parseInt(win[0], 10) || 0);
      var wb = Math.min(all.length, parseInt(win[1], 10) || all.length);
      if (wb > wa + 1) data = all.slice(wa, wb);
    }
    var lineOnly = demo.hasAttribute('data-line-only');
    var state = { field: demo.hasAttribute('data-e1rm') ? 'e1rm' : 'heaviest', sel: data.length - 1, barSel: data.length - 1 };
    var lineHost = demo.querySelector('[data-cg-chart="progress-line"]');
    var barsHost = demo.querySelector('[data-cg-chart="progress-bars"]');
    var lineNum = demo.querySelector('[data-line-num]');
    var lineDate = demo.querySelector('[data-line-date]');
    var lineLabel = demo.querySelector('[data-line-label]');
    var barsNum = demo.querySelector('[data-bars-num]');
    var barsDate = demo.querySelector('[data-bars-date]');
    if (!lineHost || (!lineOnly && !barsHost)) return;

    function setLineReadout() {
      var d = data[state.sel];
      lineNum.textContent = fmtNum(d[state.field]) + ' lb';
      lineDate.textContent = fmtDate(d.d);
      lineLabel.textContent = state.field === 'e1rm' ? 'Estimated 1RM' : 'Heaviest weight';
    }

    function paintLine() {
      lineHost.innerHTML = '';
      var W = 360, H = 210, padL = 8, padR = 12, padT = 12, padB = 30;
      var g = svgEl('g', {});
      var vals = data.map(function (d) { return d[state.field]; });
      var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
      var yMin = Math.floor(lo * 0.92), yMax = niceCeil(hi * 1.02);
      if (yMax <= yMin) yMax = yMin + 10;
      var plotW = W - padL - padR, plotH = H - padT - padB, n = data.length;
      var X = function (i) { return padL + plotW * i / (n - 1); };
      var Y = function (v) { return padT + plotH * (1 - (v - yMin) / (yMax - yMin)); };
      for (var t = 0; t <= 3; t++) {
        var ty = padT + plotH * (1 - t / 3);
        g.appendChild(svgEl('line', { x1: padL, y1: ty.toFixed(1), x2: W - padR, y2: ty.toFixed(1), stroke: LINE, 'stroke-width': 1, opacity: .55 }));
      }
      var base = (padT + plotH).toFixed(1);
      g.appendChild(svgEl('path', {
        d: linePathD(data, state.field, X, Y) + ' L ' + X(n - 1).toFixed(1) + ' ' + base +
           ' L ' + X(0).toFixed(1) + ' ' + base + ' Z',
        fill: GREEN, opacity: .12, stroke: 'none'
      }));
      g.appendChild(svgEl('path', {
        d: linePathD(data, state.field, X, Y), fill: 'none', stroke: GREEN,
        'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round'
      }));
      data.forEach(function (d, i) {
        var cx = X(i).toFixed(1), cy = Y(d[state.field]).toFixed(1);
        var sel = i === state.sel;
        g.appendChild(svgEl('circle', {
          cx: cx, cy: cy, r: 5,
          fill: sel ? GREEN : '#ffffff', stroke: GREEN, 'stroke-width': 2
        }));
        var hit = svgEl('circle', { cx: cx, cy: cy, r: 18, fill: 'transparent', style: 'cursor:pointer' });
        (function (idx, dd) {
          hit.addEventListener('click', function () {
            state.sel = idx;
            paintLine();
            setLineReadout();
          });
        })(i, d);
        var tt = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        tt.textContent = fmtDate(d.d) + ': ' + fmtNum(d[state.field]) + ' lb';
        hit.appendChild(tt);
        g.appendChild(hit);
      });
      [0, Math.round((n - 1) / 3), Math.round(2 * (n - 1) / 3), n - 1].forEach(function (i) {
        var xl = svgEl('text', { x: X(i).toFixed(1), y: H - 9, 'text-anchor': i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle', 'font-size': 10, fill: MUTED, 'font-variant-numeric': 'tabular-nums' });
        xl.textContent = fmtDate(data[i].d);
        g.appendChild(xl);
      });
      chartShell(lineHost, 'Squat heaviest weight per session, pounds', '0 0 360 210', g);
    }

    function paintBars() {
      barsHost.innerHTML = '';
      var W = 360, H = 210, padL = 8, padR = 12, padT = 12, padB = 30;
      var g = svgEl('g', {});
      var max = Math.max.apply(null, data.map(function (d) { return d.vol; }));
      var yMax = niceCeil(max);
      var plotW = W - padL - padR, plotH = H - padT - padB, n = data.length;
      for (var t = 0; t <= 4; t++) {
        var ty = padT + plotH * (1 - t / 4);
        g.appendChild(svgEl('line', { x1: padL, y1: ty.toFixed(1), x2: W - padR, y2: ty.toFixed(1), stroke: LINE, 'stroke-width': 1, opacity: .55 }));
      }
      var slot = plotW / n, bw = Math.min(40, Math.max(10, slot * 0.55));
      data.forEach(function (d, i) {
        var bh = Math.max(plotH * (d.vol / yMax), 3);
        var bx = padL + slot * i + (slot - bw) / 2;
        var by = padT + plotH - bh;
        var sel = i === state.barSel;
        var bar = svgEl('rect', {
          x: bx.toFixed(1), y: by.toFixed(1), width: bw.toFixed(1), height: bh.toFixed(1),
          rx: 3, fill: sel ? GREEN : GREEN_SOFT, stroke: GREEN, 'stroke-width': 1.5,
          style: 'cursor:pointer'
        });
        (function (idx, dd) {
          bar.addEventListener('click', function () {
            state.barSel = idx;
            paintBars();
            barsNum.textContent = fmtNum(dd.vol) + ' lb';
            barsDate.textContent = fmtDate(dd.d);
          });
        })(i, d);
        var tt = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        tt.textContent = fmtDate(d.d) + ': ' + fmtNum(d.vol) + ' lb';
        bar.appendChild(tt);
        g.appendChild(bar);
      });
      [0, Math.round((n - 1) / 3), Math.round(2 * (n - 1) / 3), n - 1].forEach(function (i) {
        var xl = svgEl('text', {
          x: (padL + slot * i + slot / 2).toFixed(1), y: H - 9,
          'text-anchor': i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle',
          'font-size': 10, fill: MUTED, 'font-variant-numeric': 'tabular-nums'
        });
        xl.textContent = fmtDate(data[i].d);
        g.appendChild(xl);
      });
      chartShell(barsHost, 'Squat volume per day, pounds', '0 0 360 210', g);
    }

    var toggles = demo.querySelectorAll('[data-ptoggle]');
    Array.prototype.forEach.call(toggles, function (btn) {
      btn.addEventListener('click', function () {
        state.field = btn.getAttribute('data-ptoggle');
        Array.prototype.forEach.call(toggles, function (b) {
          var on = b === btn;
          b.classList.toggle('active', on);
          b.setAttribute('aria-pressed', String(on));
        });
        state.sel = data.length - 1;
        paintLine();
        setLineReadout();
      });
    });

    paintLine();
    if (!lineOnly && barsHost) {
      paintBars();
      setLineReadout();
      var bd = data[state.barSel];
      if (barsNum) barsNum.textContent = fmtNum(bd.vol) + ' lb';
      if (barsDate) barsDate.textContent = fmtDate(bd.d);
      barsHost.setAttribute('data-rendered', 'true');
    } else {
      setLineReadout();
    }
    lineHost.setAttribute('data-rendered', 'true');
  }

  function initProgress() {
    var demos = document.querySelectorAll('[data-progress]');
    Array.prototype.forEach.call(demos, function (demo) {
      if (demo.hasAttribute('data-rendered')) return;
      demo.setAttribute('data-rendered', 'true');
      try { mountProgress(demo); } catch (e) { /* leave the demo empty rather than breaking the page */ }
    });
  }

  /* ---------- recent workout log list ---------- */

  function renderLogs(el) {
    var logs = window.CG_DATA.CHARTS.recentLogs;
    var ul = document.createElement('ul');
    ul.className = 'cg-log-items';
    logs.forEach(function (l) {
      var li = document.createElement('li');
      li.innerHTML =
        '<div class="cg-log-top"><strong></strong><span class="cg-log-date"></span></div>' +
        '<div class="cg-log-meta"></div>';
      li.querySelector('strong').textContent = l.title;
      li.querySelector('.cg-log-date').textContent = fmtDate(l.d);
      li.querySelector('.cg-log-meta').textContent =
        l.sets + ' sets · ' + l.ex + ' exercises · ' + fmtNum(l.vol) + ' lb';
      ul.appendChild(li);
    });
    el.appendChild(ul);
  }

  /* ---------- mount ---------- */

  function initCharts() {
    if (!window.CG_DATA || !window.CG_DATA.CHARTS) return;
    var hosts = document.querySelectorAll('[data-cg-chart]');
    Array.prototype.forEach.call(hosts, function (el) {
      if (el.hasAttribute('data-rendered')) return;
      el.setAttribute('data-rendered', 'true');
      var key = el.getAttribute('data-cg-chart');
      try {
        if (key === 'weekly-vol') renderBars(el, 'weeklyVol', 'Total training volume per week, thousands of pounds', fmtDate, 'k lb');
        else if (key === 'weekly-sets') renderBars(el, 'weeklySets', 'Total sets lifted per week', fmtDate, 'sets');
      } catch (e) { /* leave the host empty rather than breaking the page */ }
    });
    var logHosts = document.querySelectorAll('[data-cg-logs]');
    Array.prototype.forEach.call(logHosts, function (el) {
      if (el.hasAttribute('data-rendered')) return;
      el.setAttribute('data-rendered', 'true');
      try { renderLogs(el); } catch (e) {}
    });
  }

  /* ---------- import-screen clones (switch.html): expander toggles ---------- */

  function initImportClones() {
    document.querySelectorAll('[data-ci-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = document.getElementById(btn.getAttribute('data-ci-toggle'));
        if (!t) return;
        var open = t.hidden;
        t.hidden = !open;
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  function init() {
    hydrateMaps();
    initCharts();
    initProgress();
    initImportClones();
    initGuide();
  }

  /* ---------- getting-started guide: suggestion card tap ---------- */

  function initGuide() {
    /* App skeleton: stamp the app's verbatim top-bar + bottom-nav markup into
       guide phones. Class names match the app for cut-and-paste. */
    var CG_SVG_BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>';
    var CG_SVG_GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
    var CG_NAV = [
      { key: 'home', label: 'Home', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12 12 4l9 8"></path><path d="M5 10v10h14V10"></path></svg>' },
      { key: 'exercises', label: 'Exercises', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 6.5C10 5 7.2 4.5 4 4.5v13.5c3.2 0 6 .5 8 2 2-1.5 4.8-2 8-2V4.5c-3.2 0-6 .5-8 2z"></path><path d="M12 6.5V20"></path></svg>' },
      { key: 'workout', label: 'Workout', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12h18"></path><path d="M7 8v8M17 8v8M4.5 10v4M19.5 10v4"></path></svg>' },
      { key: 'program', label: 'Program', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h14v16H5z"></path><path d="M8 8h8M8 12h8M8 16h5"></path></svg>' },
      { key: 'stats', label: 'Stats', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 20V10M12 20V4M19 20v-7"></path></svg>' }
    ];
    document.querySelectorAll('[data-cg-topbar]').forEach(function (slot) {
      var title = slot.getAttribute('data-cg-topbar') || '';
      var back = slot.hasAttribute('data-cg-back');
      var live = slot.hasAttribute('data-cg-live');
      slot.innerHTML =
        '<header class="top-bar">' +
          '<div class="top-bar-left"><button class="top-bar-btn" type="button" aria-label="Back" tabindex="-1"' + (back ? '' : ' hidden') + '>' + CG_SVG_BACK + '</button></div>' +
          '<h1 class="top-bar-title"><span class="top-bar-title-text">' + title + '<span class="live-title-dot" hidden aria-hidden="true"></span></span></h1>' +
          '<div class="top-bar-right">' +
            '<button class="live-chip" type="button" aria-label="Return to live workout"' + (live ? '' : ' hidden tabindex="-1"') + '><span class="live-dot" aria-hidden="true"></span>Live</button>' +
            '<button class="top-bar-btn" type="button" aria-label="Settings" tabindex="-1">' + CG_SVG_GEAR + '</button>' +
          '</div>' +
        '</header>';
    });
    document.querySelectorAll('[data-cg-nav]').forEach(function (slot) {
      var active = slot.getAttribute('data-cg-nav');
      var html = '<nav class="bottom-nav" aria-label="Primary navigation">';
      CG_NAV.forEach(function (item) {
        var isActive = item.key === active;
        html += '<button class="nav-item' + (isActive ? ' active' : '') + (item.key === 'workout' ? ' nav-workout' : '') + '" type="button" tabindex="-1"' + (isActive ? ' aria-current="page"' : '') + '>' + item.svg + '<span class="nav-label">' + item.label + '</span></button>';
      });
      slot.innerHTML = html + '</nav>';
    });
    /* Live chip: the dot flies to the title, then the phone shifts to the live editor. */
    document.querySelectorAll('[data-cg-live]').forEach(function (slot) {
      var chip = slot.querySelector('.live-chip');
      if (!chip) return;
      chip.addEventListener('click', function () {
        var phone = slot.closest('.gs-phone');
        if (!phone || phone.dataset.liveDone) return;
        phone.dataset.liveDone = '1';
        var dot = chip.querySelector('.live-dot');
        var title = slot.querySelector('.top-bar-title');
        function shift() {
          chip.hidden = true;
          var tdot = slot.querySelector('.live-title-dot');
          if (tdot) tdot.hidden = false;
          var s1 = phone.querySelector('[data-screen="tab"]');
          var s2 = phone.querySelector('[data-screen="live"]');
          if (s1) s1.hidden = true;
          if (s2) s2.hidden = false;
        }
        if (dot && title && dot.getBoundingClientRect && title.getBoundingClientRect) {
          var r1 = dot.getBoundingClientRect();
          var r2 = title.getBoundingClientRect();
          var fly = document.createElement('span');
          fly.className = 'live-dot-fly';
          fly.style.left = (r1.left + r1.width / 2 - 4) + 'px';
          fly.style.top = (r1.top + r1.height / 2 - 4) + 'px';
          document.body.appendChild(fly);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              var dx = (r2.left + r2.width / 2) - (r1.left + r1.width / 2);
              var dy = (r2.top + r2.height / 2) - (r1.top + r1.height / 2);
              fly.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
            });
          });
          setTimeout(function () {
            fly.style.opacity = '0';
            setTimeout(function () { if (fly.parentNode) fly.parentNode.removeChild(fly); }, 240);
          }, 430);
          setTimeout(shift, 440);
        } else {
          shift();
        }
      });
    });
    document.querySelectorAll('[data-gs-suggest]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var applied = btn.classList.toggle('applied');
        var change = btn.querySelector('.gs-sugg-change');
        var done = btn.querySelector('.gs-sugg-applied');
        if (change) change.hidden = applied;
        if (done) done.hidden = !applied;
      });
    });
    /* Warm-up ladder demo: the dashed pill inserts the ladder once, like the app. */
    document.querySelectorAll('[data-warmup-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.wu-card');
        var rows = card && card.querySelector('[data-warmup-rows]');
        if (!rows || !rows.hidden) return;
        rows.hidden = false;
        btn.style.display = 'none';
        var hint = card.querySelector('[data-warmup-hint]');
        if (hint) hint.style.display = 'none';
        /* Renumber: warm-up rows become 1, 2; working sets follow. */
        var nums = card.querySelectorAll('.wu-row .wu-num');
        Array.prototype.forEach.call(nums, function (n, i) { n.textContent = String(i + 1); });
        var items = rows.querySelectorAll('.wu-row');
        var reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
        Array.prototype.forEach.call(items, function (row, i) {
          if (reduced || !row.animate) return;
          var h = row.offsetHeight;
          row.animate(
            [{ height: '0px', opacity: '0' }, { height: h + 'px', opacity: '1' }],
            { duration: 320, delay: i * 90, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'backwards' }
          );
        });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.CG_NATIVE = { hydrateMaps: hydrateMaps, initCharts: initCharts, initProgress: initProgress };
})();
