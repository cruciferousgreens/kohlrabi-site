/* examples-loader.js
   Loads the example workout/program data files listed in assets/examples/manifest.js,
   then asks components.js to render any example slots on the page.
   Include this BEFORE components.js on every page that shows example cards
   (examples.html, features.html, workout.html, program.html). */
(function () {
  var me = document.currentScript;
  if (!me) {
    var tags = document.getElementsByTagName('script');
    for (var k = tags.length - 1; k >= 0; k--) {
      if (tags[k].src.indexOf('examples-loader.js') !== -1) { me = tags[k]; break; }
    }
  }
  var src = (me && me.src) || '';
  var v = '';
  var qm = src.indexOf('?');
  if (qm !== -1) v = src.slice(qm); /* reuse the ?v= cache key on every data file */
  var base = src.slice(0, src.indexOf('assets/examples-loader.js'));

  window.CG_EXAMPLES = window.CG_EXAMPLES || { workouts: [], programs: [] };
  window.CG_EXAMPLE_FILES = window.CG_EXAMPLE_FILES || [];

  /* Easy-edit helpers for the data files: each file just calls
     exampleProgram({...}) / exampleWorkout({...}) with plain values.
     The detail pages are generated automatically — no HTML file needed. */
  window.exampleProgram = function (p) { window.CG_EXAMPLES.programs.push(p); };
  window.exampleWorkout = function (w) { window.CG_EXAMPLES.workouts.push(w); };

  function js(url, cb) {
    var s = document.createElement('script');
    s.src = url + v;
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  function ready() {
    window.CG_EXAMPLES_READY = true;
    try { document.dispatchEvent(new Event('cg-examples-ready')); } catch (e) {}
    if (window.CG && typeof window.CG.mountExamples === 'function') window.CG.mountExamples();
  }

  js(base + 'assets/examples/manifest.js', function () {
    var files = window.CG_EXAMPLE_FILES.slice();
    if (!files.length) { ready(); return; }
    /* Parallel load: fire all data scripts at once and render when the last
       one settles. Card order is alphabetical by title in components.js, so
       arrival order does not matter. */
    var pending = files.length;
    function oneDone() { if (--pending === 0) ready(); }
    for (var i = 0; i < files.length; i++) js(base + files[i], oneDone);
  });
})();
