// Document / page / element operations used by the editor. Pure where possible; DOM measurement helpers take nodes.
import * as T from '../../lib/templates.js';
import * as TK from '../../lib/tokens.js';

export const find = (doc, id) => { for (let pi = 0; pi < doc.pages.length; pi++) { const ei = doc.pages[pi].elements.findIndex(e => e.id === id); if (ei >= 0) return { pi, ei, el: doc.pages[pi].elements[ei], page: doc.pages[pi] }; } return null; };
// Size factor for free-layout graphics (designed at 1080).
export const sz = doc => (doc.kind === 'graphic' ? Math.min(doc.w, doc.h) / 1080 : 1);

export function blankPage(doc, pageIdx) {
  const cur = doc.pages[pageIdx];
  return { id: T.uid('p'), name: 'Blank page', kind: 'blank', layout: cur.layout, bg: cur.bg, pad: cur.pad ? cur.pad.slice() : undefined, justify: 'start', showNum: cur.showNum, runHead: '', h: cur.h || null, elements: [], user: true };
}
// Mutates `doc`: inserts a copy of page i after it.
export function duplicatePage(doc, i) {
  const p = JSON.parse(JSON.stringify(doc.pages[i])); p.id = T.uid('p'); p.name = p.name + ' (copy)'; p.user = true;
  p.elements.forEach(e => { e.id = T.uid(); if (e.slot) { e.slot = null; e.user = true; } });
  doc.pages.splice(i + 1, 0, p);
}
// Ebook: chapter opener + body page, inserted after the current section. Returns { at, pages }.
export function chapterPages(doc, pageIdx) {
  const n = doc.pages.filter(p => p.kind === 'chapter').length + 1;
  let at = pageIdx + 1; const sec = doc.pages[pageIdx].section;
  if (sec) { while (at < doc.pages.length && doc.pages[at].section === sec && doc.pages[at].kind !== 'chapter' && doc.pages[at].kind !== 'part') at++; }
  const ch = T.makePage('ebook', 'chapter', n); const body = T.makePage('ebook', 'body'); body.section = ch.section; body.runHead = ch.runHead;
  return { at, pages: [ch, body] };
}

// Build the element(s) for an "Add element" choice on page `pi`.
export function newElements(doc, pi, kind, opt) {
  const p = doc.pages[pi]; let els;
  if (p.layout === 'flow') {
    const dk = doc.docKind || 'report';
    if (kind === 'logo-variant') els = [T.logo(opt, { w: doc.w * 0.18, h: doc.w * 0.18 / (TK.LOGO_RATIO[opt] || 1) })];
    else if (kind === 'upload') els = [T.img(null, opt, { h: doc.w * 0.4, radius: 8 })];
    else els = T.makeBlock(dk, kind);
  } else {
    const s = sz(doc), W = doc.w, H = p.h || doc.h, cx = (w, h) => ({ x: (W - w) / 2, y: (H - h) / 2, w, h });
    const pal = T.PAL[doc.palette] || T.PAL.bone;
    const text = (role, t, size, o = {}) => { const e = T.txt(null, t, { role, size: size * s, color: pal.fg, font: role === 'title' || role === 'h2' ? 'display' : role === 'quote' ? 'archive' : 'body', weight: role === 'title' || role === 'h2' ? 700 : role === 'eyebrow' ? 600 : 400, upper: role === 'eyebrow', ls: role === 'eyebrow' ? 0.12 : role === 'title' ? -0.02 : 0, lh: role === 'body' ? 1.45 : 1.15, ...o }); const w = Math.min(W * 0.8, 900 * s); return Object.assign(e, cx(w, T.estH(e, w))); };
    const box = (w, h) => cx(w * s, h * s);
    const map = {
      heading: () => text('title', 'New heading', 72), subheading: () => text('h2', 'Subheading', 44), paragraph: () => text('body', 'New paragraph text.', 30, { color: pal.muted }), eyebrow: () => text('eyebrow', 'Label', 24, { color: pal.accent }),
      bullets: () => text('body', 'First point\nSecond point\nThird point', 32, { list: 'bullet' }), numbered: () => text('body', 'First step\nSecond step\nThird step', 32, { list: 'number' }),
      'pull-quote': () => text('quote', '“A quote goes here.”', 52), button: () => Object.assign(T.btn(null, 'Call to action', { size: 28 * s, fill: pal.btn, color: pal.btnFg, radius: 20 * s }), box(380, 92)),
      rect: () => Object.assign(T.shape('rect', { fill: pal.soft, radius: 24 * s }), box(400, 260)), ellipse: () => Object.assign(T.shape('ellipse', { fill: pal.accent }), box(260, 260)), line: () => Object.assign(T.shape('rect', { fill: pal.line }), box(500, 6)),
      arcs: () => Object.assign(T.shape('arc-top', { fill: null, stroke: pal.line, strokeW: 14 * s }), box(500, 250)), motif: () => Object.assign(T.shape('motif', { fill: null, stroke: pal.line, strokeW: 24 * s }), box(500, 500)),
      image: () => Object.assign(T.img(null, T.IMG.warm, { radius: 24 * s }), box(600, 450)), upload: () => Object.assign(T.img(null, opt, { radius: 24 * s }), box(600, 450)),
      'logo-variant': () => { const r = TK.LOGO_RATIO[opt] || 1; const w = (r > 1 ? 360 : 160) * s; return Object.assign(T.logo(opt), cx(w, w / r)); },
      pattern: () => T.img(null, T.IMG.pattern, { x: 0, y: 0, w: W, h: H, fit: 'tile', tile: 40 * Math.max(1, s * 2), name: 'Rhythm pattern' }),
      wave: () => Object.assign(T.img(null, T.IMG.wave, { fit: 'contain' }), box(500, 100)),
      pagenum: () => Object.assign(T.data('pagenum', [], { size: 24 * s, color: pal.muted, align: 'center' }), box(200, 40)),
      table: () => Object.assign(T.data('table', [['Column', 'Column'], ['Value', 'Value'], ['Value', 'Value']], { size: 26 * s }), box(700, 260)),
      'chart-bar': () => Object.assign(T.data('chart', [{ label: 'A', value: 10 }, { label: 'B', value: 18 }, { label: 'C', value: 14 }], { chart: 'bar', size: 24 * s, h: 360 * s, color: pal.accent === 'marigold-200' ? 'marigold-200' : 'clay-500', title: 'Sample data — replace' }), box(700, 460)),
      stats: () => Object.assign(T.data('stats', [{ value: '[00]', label: 'Metric' }, { value: '[00]', label: 'Metric' }], { size: 96 * s, cols: 2, accent: pal.accent }), box(800, 220)),
      callout: () => Object.assign(T.data('callout', [{ title: 'Note', body: 'Callout text.' }], { tone: 'brand', size: 28 * s }), box(700, 200)),
      tags: () => Object.assign(T.data('tags', ['Tag', 'Tag', 'Tag'], { size: 24 * s }), box(600, 60))
    };
    els = [(map[kind] || map.paragraph)()];
  }
  els.forEach(e => { e.user = true; });
  return els;
}

// Ids of flow-page elements whose bottom edge falls below the page's bottom margin.
export function overflowIds(root, page, doc, zoom) {
  const rr = root.getBoundingClientRect(); const limit = (page.h || doc.h) - (page.pad ? page.pad[2] : 0);
  return page.elements.filter(e => { const n = root.querySelector(`[data-el-id="${e.id}"]`); if (!n) return false; const b = n.getBoundingClientRect(); return (b.bottom - rr.top) / zoom > limit + 1; }).map(e => e.id);
}
// Mutates doc: moves `ids` from page i to a new continuation page after it.
export function splitOverflow(doc, i, ids) {
  const pg = doc.pages[i];
  const np = { ...JSON.parse(JSON.stringify(pg)), id: T.uid('p'), name: pg.name + ' (cont.)', kind: 'body', toc: false, user: true, justify: 'start' };
  np.elements = pg.elements.filter(e => ids.includes(e.id)); if (np.elements[0]) np.elements[0].mt = 0;
  pg.elements = pg.elements.filter(e => !ids.includes(e.id)); doc.pages.splice(i + 1, 0, np);
}
// Rendered boxes (page px) of each element of a flow page, for converting it to free layout.
export function measureBoxes(root, page, zoom) {
  const rr = root.getBoundingClientRect(), boxes = {};
  page.elements.forEach(e => { const n = root.querySelector(`[data-el-id="${e.id}"]`); if (n) { const b = n.getBoundingClientRect(); boxes[e.id] = { x: (b.left - rr.left) / zoom, y: (b.top - rr.top) / zoom, w: b.width / zoom, h: b.height / zoom }; } });
  return boxes;
}
export function toFree(pg, boxes) { pg.layout = 'free'; pg.elements.forEach(e => { Object.assign(e, boxes[e.id] || { x: 40, y: 40, w: 300, h: 60 }); e.mt = 0; e.push = false; }); }
export function toFlow(pg) {
  pg.layout = 'flow'; pg.pad = pg.pad || [64, 64, 64, 64]; pg.elements.sort((a, b) => (a.y - b.y) || (a.x - b.x));
  let last = pg.pad[0];
  pg.elements.forEach(e => { e.mt = Math.max(0, Math.round(e.y - last)); last = e.y + e.h; if (e.type === 'text' || e.type === 'table' || e.type === 'chart') e.w = null; });
}

// Read an uploaded image as a data URL, downscaled to 1800px on the long edge (SVG/GIF kept as-is).
export function readImage(file) {
  return new Promise((res, rej) => {
    if (!file) return rej(new Error('No file'));
    if (!/^image\//.test(file.type)) return rej(new Error('Please choose an image file.'));
    const fr = new FileReader(); fr.onerror = () => rej(new Error('Could not read the file.'));
    fr.onload = () => {
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') return res(fr.result);
      const im = new Image();
      im.onload = () => { const k = Math.min(1, 1800 / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(file.type === 'image/png' && c.width * c.height < 600000 ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.86)); };
      im.onerror = () => rej(new Error('That image could not be decoded.')); im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
