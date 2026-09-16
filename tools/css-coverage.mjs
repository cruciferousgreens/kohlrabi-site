#!/usr/bin/env node
/* CSS coverage per page: loads each page (mobile + desktop), interacts
   (scroll, open hamburger menu), and reports used byte ranges of site.css.
   Usage: node tools/css-coverage.mjs <base-url>   (e.g. http://localhost:8901/) */
import puppeteer from '/home/hatch/.npm/_npx/1fc4933a57a44b8f/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';

const CHROME = '/home/hatch/workspace/.tools/chrome/linux-156.0.8060.2/chrome-linux64/chrome';
const base = process.argv[2] || 'http://localhost:8901/';
// 'program' and 'workout' are empty JS shells (/program.html, /workout.html);
// crawl real server-rendered detail pages for those CSS keys instead, or the
// splitter drops every detail-page rule (muscle pills, detail sections,
// heat-map fills).
// 'program' and 'workout' are empty JS shells (/program.html, /workout.html);
// crawl real server-rendered detail pages for those CSS keys instead, or the
// splitter drops every detail-page rule (muscle pills, detail sections,
// heat-map fills). A key may list several paths: no-account.html shares
// css_page 'examples' but uses homepage hero rules examples.html never hits.
const pages = [
  ['index', ['index']],
  ['examples', ['examples', 'no-account']],
  ['features', ['features']],
  ['getting-started', ['getting-started']],
  ['switch', ['switch']],
  ['glossary', ['glossary']],
  ['pitch-in', ['pitch-in']],
  ['beta', ['beta']],
  ['credits', ['credits']],
  ['privacy', ['privacy']],
  ['terms', ['terms']],
  ['trainers', ['trainers']],
  ['release-notes', ['release-notes']],
  ['ai-disclosure', ['ai-disclosure']],
  ['program', ['programs/arnold-blueprint-to-mass']],
  ['workout', ['workouts/arnold-golden-six']],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-gpu', '--headless=new'],
});

const result = {};
for (const vp of [{w:393,h:852,name:'mobile'},{w:800,h:1000,name:'tablet'},{w:1280,h:800,name:'desktop'},{w:1440,h:900,name:'wide'},{w:1600,h:900,name:'xwide'}]) {
  const page = await browser.newPage();
  await page.setViewport({width: vp.w, height: vp.h});
  for (const [key, paths] of pages) {
    for (const path of paths) {
    const url = base + path + '.html';
    await page.coverage.startCSSCoverage();
    await page.goto(url, {waitUntil: 'networkidle0', timeout: 30000}).catch(()=>{});
    // interact: scroll through, open the hamburger menu, close it
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 300));
      window.scrollTo(0, 0);
      const btn = document.querySelector('.menu-button');
      if (btn) { btn.click(); await new Promise(r => setTimeout(r, 300)); btn.click(); }
    });
    const cov = await page.coverage.stopCSSCoverage();
    for (const entry of cov) {
      if (!entry.url.includes('site.css')) continue;
      if (!result[key]) result[key] = {ranges: [], text: entry.text};
      result[key].ranges.push(...entry.ranges.map(r => ({...r, vp: vp.name})));
    }
    }
  }
  await page.close();
}
await browser.close();

// Merge ranges per page, report used bytes
import fs from 'node:fs';
fs.writeFileSync('/tmp/css-coverage.json', JSON.stringify(result));
for (const [key] of pages) {
  const r = result[key];
  if (!r) { console.log(key, 'NO DATA'); continue; }
  const used = new Set();
  for (const {start, end} of r.ranges) for (let i = start; i < end; i++) used.add(i);
  console.log(key, 'used bytes:', used.size, 'of', r.text.length);
}
