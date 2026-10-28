// Site-wide responsive smoke test. Usage: start `npm run dev` (or `npm run preview`), then
//   BASE=http://localhost:5173 node scripts/responsive-check.mjs [--shots <dir>]
// Visits every route at common device widths in light and dark, failing on horizontal overflow or console errors.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:5173';
const shotsIdx = process.argv.indexOf('--shots');
const SHOTS = shotsIdx > -1 ? process.argv[shotsIdx + 1] : null;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1440, 1920];
const DS = ['overview', 'logo', 'colour', 'type', 'spacing', 'radius', 'motif', 'voice', 'components', 'slides', 'uikits', 'governance'];
const ROUTES = [
  '/', '/playbook', '/voice', '/assets', '/templates', '/templates#cat=all', '/templates#cat=editorial', '/templates#cat=mine',
  ...DS.map(s => '/design-system#ds-' + s),
  '/editor', '/editor#template=sq-announcement', '/editor#template=doc-ebook', '/editor#template=doc-presentation',
  '/gallery-test#square', '/does-not-exist'
];

const browser = await chromium.launch();
const failures = [];
for (const theme of ['light', 'dark']) {
  for (const w of WIDTHS) {
    const mobile = w < 768;
    const ctx = await browser.newContext({ viewport: { width: w, height: mobile ? 760 : 900 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
    await ctx.addInitScript(t => { try { localStorage.setItem('nnoo.theme', t); } catch (e) {} }, theme);
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => m.type() === 'error' && errs.push(m.text()));
    page.on('pageerror', e => errs.push(String(e)));
    for (const r of ROUTES) {
      errs.length = 0;
      await page.goto(BASE + r, { waitUntil: 'networkidle' });
      await page.waitForTimeout(r.startsWith('/editor') ? 900 : 300);
      const m = await page.evaluate(() => {
        const iw = window.innerWidth, sw = document.documentElement.scrollWidth;
        const off = [];
        if (sw > iw) for (const el of document.querySelectorAll('body *')) { const b = el.getBoundingClientRect(); if (b.right > iw + 1 && b.width > 0 && getComputedStyle(el).position !== 'fixed' && !el.closest('.scroll-x,.pill-row,[data-scroll-x]') && !el.closest('[style*="-200000"]')) { off.push((el.tagName + '.' + (el.className && el.className.baseVal === undefined ? el.className : '')).slice(0, 60) + ' r=' + Math.round(b.right)); if (off.length > 4) break; } }
        return { iw, sw, off };
      });
      const bad = m.sw > m.iw || errs.length;
      const tag = `${theme} ${w}px ${r}`;
      if (bad) failures.push(`${tag}: ${m.sw > m.iw ? `overflow ${m.sw}>${m.iw} [${m.off.join(', ')}]` : ''} ${errs.length ? 'errors: ' + errs.slice(0, 3).join(' | ') : ''}`);
      console.log((bad ? 'FAIL ' : 'ok   ') + tag);
      if (SHOTS && (w === 320 || w === 768 || w === 1440) && theme === 'light') await page.screenshot({ path: `${SHOTS}/${w}-${r.replace(/[^a-z0-9]+/gi, '_')}.png` });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(`\n${failures.length ? failures.length + ' failure(s):\n' + failures.join('\n') : 'All checks passed.'}`);
process.exit(failures.length ? 1 : 0);
