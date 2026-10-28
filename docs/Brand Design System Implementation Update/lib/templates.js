// Template engine: formats, palettes, layout builders (free-positioned graphics) and
// document page/block builders (flow layout). Templates are pure functions of
// (format, palette, layout, content) so reset and re-layout are deterministic.
import { resolveColor } from './tokens.js';

let _n = 0;
export const uid = (p = 'e') => p + Date.now().toString(36) + (++_n).toString(36) + Math.random().toString(36).slice(2, 5);
export const clone = o => JSON.parse(JSON.stringify(o));

export const IMG = { warm: 'assets/brand/imagery/placeholder-warm.svg', cool: 'assets/brand/imagery/placeholder-cool.svg', pattern: 'assets/brand/motifs/pattern-rhythm.svg', wave: 'assets/brand/graphics/waveform.svg' };

export const PAL = {
  bone: { name: 'Bone', bg: 'bone', fg: 'ink-900', muted: 'ink-700', accent: 'clay-500', soft: 'clay-100', card: 'paper', cardFg: 'ink-900', line: 'clay-300', btn: 'clay-500', btnFg: 'bone', mark: 'mark-clay', lockup: 'lockup' },
  cream: { name: 'Cream (archival)', bg: 'cream', fg: 'ink-900', muted: 'ink-700', accent: 'forest-500', soft: 'forest-100', card: 'paper', cardFg: 'ink-900', line: 'forest-300', btn: 'forest-500', btnFg: 'bone', mark: 'mark-clay', lockup: 'lockup' },
  clay: { name: 'Clay', bg: 'clay-500', fg: 'bone', muted: 'clay-100', accent: 'marigold-200', soft: 'clay-600', card: 'clay-600', cardFg: 'bone', line: 'clay-300', btn: 'bone', btnFg: 'clay-700', mark: 'mark-bone', lockup: 'lockup-reversed' },
  ink: { name: 'Ink', bg: 'ink-900', fg: 'bone', muted: 'ink-100', accent: 'marigold-300', soft: '#2a1f15', card: '#2a1f15', cardFg: 'bone', line: 'clay-400', btn: 'marigold-300', btnFg: 'ink-900', mark: 'mark-clay', lockup: 'lockup-dark' },
  plum: { name: 'Plum (community)', bg: 'plum-500', fg: 'bone', muted: 'plum-100', accent: 'marigold-200', soft: 'plum-700', card: 'plum-700', cardFg: 'bone', line: 'plum-300', btn: 'bone', btnFg: 'plum-700', mark: 'mark-bone', lockup: 'wordmark-bone' },
  forest: { name: 'Forest (archive)', bg: 'forest-500', fg: 'bone', muted: 'forest-100', accent: 'marigold-200', soft: 'forest-700', card: 'forest-700', cardFg: 'bone', line: 'forest-300', btn: 'bone', btnFg: 'forest-700', mark: 'mark-bone', lockup: 'wordmark-bone' },
  marigold: { name: 'Marigold', bg: 'marigold-300', fg: 'ink-900', muted: 'marigold-700', accent: 'clay-700', soft: 'marigold-200', card: 'marigold-100', cardFg: 'ink-900', line: 'clay-500', btn: 'ink-900', btnFg: 'bone', mark: 'mark-ink', lockup: 'wordmark' }
};

const F = (id, label, w, h, extra) => ({ id, label, w, h, ...extra });
export const FORMATS = {
  square: F('square', 'Square post', 1080, 1080), story: F('story', 'Story / reel', 1080, 1920, { safe: { x: 80, y: 250, w: 920, h: 1420 } }), portrait: F('portrait', 'Portrait feed', 1080, 1350),
  yt: F('yt', 'YouTube thumbnail', 1280, 720), avatar: F('avatar', 'Avatar', 400, 400),
  'x-header': F('x-header', 'X header', 1500, 500, { safe: { x: 420, y: 70, w: 1000, h: 340 } }), 'li-personal': F('li-personal', 'LinkedIn personal banner', 1584, 396, { safe: { x: 520, y: 60, w: 980, h: 276 } }),
  'li-company': F('li-company', 'LinkedIn company cover', 1128, 191), 'fb-cover': F('fb-cover', 'Facebook cover (2×)', 1640, 624, { safe: { x: 120, y: 90, w: 1400, h: 380 } }),
  'yt-channel': F('yt-channel', 'YouTube channel art', 2560, 1440, { safe: { x: 507, y: 508, w: 1546, h: 423 } }), twitch: F('twitch', 'Twitch banner', 1200, 480),
  podcast: F('podcast', 'Podcast cover', 3000, 3000), 'nl-header': F('nl-header', 'Newsletter header', 1200, 400), 'web-banner': F('web-banner', 'Website banner', 1920, 600),
  'event-banner': F('event-banner', 'Event banner', 1920, 1080), community: F('community', 'Community banner (Discord)', 960, 540),
  'ad-feed': F('ad-feed', 'Meta feed ad', 1080, 1080), 'ad-story': F('ad-story', 'Meta story ad', 1080, 1920, { safe: { x: 80, y: 250, w: 920, h: 1420 } }), 'ad-li': F('ad-li', 'LinkedIn sponsored', 1200, 628),
  'ad-mrec': F('ad-mrec', 'Medium rectangle', 300, 250), 'ad-leader': F('ad-leader', 'Leaderboard', 728, 90), 'ad-sky': F('ad-sky', 'Wide skyscraper', 160, 600),
  'ad-mobile': F('ad-mobile', 'Mobile banner', 320, 50), 'ad-billboard': F('ad-billboard', 'Billboard', 970, 250),
  'em-header': F('em-header', 'Email header', 600, 200), 'em-hero': F('em-hero', 'Email hero', 600, 320), 'em-sig': F('em-sig', 'Email signature banner', 600, 120),
  'web-hero': F('web-hero', 'Website hero', 1440, 720), og: F('og', 'Open Graph / share', 1200, 630), 'web-feature': F('web-feature', 'Feature section', 1440, 900),
  'app-store': F('app-store', 'App Store screenshot (6.7")', 1290, 2796), 'web-mobile': F('web-mobile', 'Mobile hero', 390, 844),
  'x-article': F('x-article', 'X article image (5:2)', 1500, 600), 'li-article': F('li-article', 'LinkedIn article cover', 1920, 1080), 'li-post': F('li-post', 'LinkedIn post image', 1200, 627),
  medium: F('medium', 'Medium article', 1400, 788), 'web-article': F('web-article', 'Website article hero', 1600, 900), blog: F('blog', 'Blog promotion', 1200, 630),
  'nl-promo': F('nl-promo', 'Newsletter promotion', 1200, 600), substack: F('substack', 'Substack header', 1456, 816), pinterest: F('pinterest', 'Pinterest pin', 1000, 1500)
};

// ---------- element factories ----------
export function txt(slot, text, o = {}) { return { id: uid(), type: 'text', slot: slot || null, text: text || '', role: 'body', font: 'body', size: 32, weight: 400, color: 'ink-900', align: 'left', lh: 1.35, ls: 0, upper: false, italic: false, valign: 'top', list: null, bg: null, pad: 0, radius: 0, opacity: 1, mt: 0, ...o }; }
export function btn(slot, text, o = {}) { return { id: uid(), type: 'button', slot: slot || null, text, fill: 'clay-500', color: 'bone', size: 28, weight: 600, radius: 16, padX: 1.1, align: 'left', opacity: 1, mt: 0, ...o }; }
export function shape(kind, o = {}) { return { id: uid(), type: 'shape', shape: kind, fill: 'clay-100', stroke: null, strokeW: 0, radius: 0, opacity: 1, mt: 0, ...o }; }
export function img(slot, src, o = {}) { return { id: uid(), type: 'image', slot: slot || null, src, fit: 'cover', pos: 'center', radius: 0, overlay: null, overlayOpacity: 0, opacity: 1, alt: '', caption: '', mt: 0, ...o }; }
export function logo(variant, o = {}) { return { id: uid(), type: 'logo', variant, opacity: 1, mt: 0, align: 'left', ...o }; }
export function data(type, items, o = {}) { return { id: uid(), type, items, mt: 0, opacity: 1, ...o }; }

const CW = { display: 0.54, body: 0.5, archive: 0.5, mono: 0.6 };
export function estH(el, w) {
  const cw = CW[el.font] * (el.upper ? 1.18 : 1) * (1 + (el.ls || 0) * 1.2) * (el.weight >= 700 ? 1.04 : 1);
  const per = Math.max(1, Math.floor((w - 2 * (el.pad || 0)) / (el.size * cw)));
  let lines = 0; String(el.text).split('\n').forEach(p => { lines += Math.max(1, Math.ceil(p.length / per)); });
  return Math.ceil(lines * el.size * el.lh + 2 * (el.pad || 0) + 4);
}

// ---------- free-layout composer ----------
function aspect(w, h) { const r = w / h; return r >= 2.6 ? 'banner' : r >= 1.4 ? 'wide' : r >= 0.9 ? 'square' : r >= 0.72 ? 'portrait' : 'tall'; }
function scaleFor(c, w, h) { if (c === 'banner') return h / 420; if (c === 'wide') return h / 720; if (c === 'tall') return Math.max(w / 1080, h / 1920 * 0.9) * 1.18; return w / 1080; }

const ROLE = {
  eyebrow: (s, P) => ({ role: 'eyebrow', font: 'body', size: 24 * s, weight: 600, upper: true, ls: 0.12, color: P.accent, lh: 1.3 }),
  title: (s, P, t) => ({ role: 'title', font: 'display', size: (t.length > 70 ? 64 : t.length > 42 ? 78 : 94) * s, weight: 700, lh: 1.06, ls: -0.02, color: P.fg }),
  display: (s, P) => ({ role: 'title', font: 'display', size: 150 * s, weight: 800, lh: 1, ls: -0.03, color: P.fg }),
  subtitle: (s, P) => ({ role: 'subtitle', font: 'body', size: 36 * s, weight: 400, lh: 1.4, color: P.muted }),
  body: (s, P) => ({ role: 'body', font: 'body', size: 30 * s, weight: 400, lh: 1.45, color: P.muted }),
  quote: (s, P, t) => ({ role: 'quote', font: 'archive', size: (t.length > 120 ? 44 : t.length > 70 ? 54 : 64) * s, weight: 500, lh: 1.18, ls: -0.01, color: P.fg }),
  igbo: (s, P) => ({ role: 'quote', font: 'archive', size: 84 * s, weight: 500, lh: 1.08, ls: -0.015, color: P.fg }),
  stat: (s, P) => ({ role: 'stat', font: 'display', size: 230 * s, weight: 800, lh: 0.95, ls: -0.04, color: P.accent }),
  label: (s, P) => ({ role: 'label', font: 'display', size: 40 * s, weight: 600, lh: 1.2, color: P.fg }),
  meta: (s, P) => ({ role: 'meta', font: 'body', size: 24 * s, weight: 500, lh: 1.35, color: P.muted }),
  name: (s, P) => ({ role: 'label', font: 'display', size: 34 * s, weight: 600, lh: 1.2, color: P.fg }),
  list: (s, P) => ({ role: 'body', font: 'body', size: 34 * s, weight: 500, lh: 1.45, color: P.fg, list: 'number' })
};

function decor(kind, W, H, P, c) {
  if (kind === 'none') return [];
  const out = [];
  if (kind === 'arcs') {
    const d = c === 'banner' ? H * 1.3 : c === 'wide' ? H * 0.95 : Math.min(W, H) * 0.92;
    const x = c === 'banner' ? W - d * 0.78 : W - d * 0.62, y = c === 'banner' ? (H - d) / 2 : c === 'tall' ? H - d * 0.78 : H - d * 0.66;
    out.push(shape('motif', { x, y, w: d, h: d, fill: null, stroke: P.line, strokeW: Math.max(3, d * 0.05), opacity: 0.5, deco: true, name: 'Brand motif' }));
  } else if (kind === 'pattern') {
    out.push(img(null, IMG.pattern, { x: 0, y: 0, w: W, h: H, fit: 'tile', tile: 40 * Math.max(1, Math.min(W, H) / 540), opacity: P.bg === 'bone' || P.bg === 'cream' ? 1 : 0.5, deco: true, name: 'Rhythm pattern' }));
  } else if (kind === 'band') {
    out.push(shape('rect', { x: 0, y: H - Math.min(W, H) * 0.035, w: W, h: Math.min(W, H) * 0.035, fill: P.accent, deco: true, name: 'Accent band' }));
  }
  return out;
}

// rows: [{slot, role, text}] or {group: fn(x,y,w,s,P) => {els, h}}
export function compose(f, palId, rows, o = {}) {
  const P = PAL[palId] || PAL.bone, W = f.w, H = f.h;
  const safe = f.safe;
  const base = safe || { x: 0, y: 0, w: W, h: H };
  const c = aspect(base.w, base.h); const s = scaleFor(c, base.w, base.h) * (o.scale || 1);
  const mx = safe ? 0 : Math.round(c === 'banner' ? Math.max(H * 0.16, W * 0.04) : Math.min(W, H) * 0.08);
  const my = safe ? 0 : Math.round(c === 'banner' ? H * 0.16 : Math.min(W, H) * 0.08);
  let box = { x: base.x + mx, y: base.y + my, w: base.w - 2 * mx, h: base.h - 2 * my };
  const els = [];
  let onPhoto = false;
  if (o.media === 'full') {
    els.push(img('image', o.src || IMG.warm, { x: 0, y: 0, w: W, h: H, overlay: 'ink-900', overlayOpacity: 0.45, name: 'Background image' }));
    onPhoto = true;
  } else els.push(...decor(o.decor || 'arcs', W, H, P, c));
  const Pt = onPhoto ? { ...P, fg: 'bone', muted: 'clay-100', accent: 'marigold-200', btn: 'clay-500', btnFg: 'bone', mark: 'mark-bone', lockup: 'wordmark-bone' } : P;
  // media regions
  if (o.media === 'split') {
    if (c === 'square' || c === 'portrait' || c === 'tall') {
      const ih = Math.round(H * (c === 'tall' ? 0.42 : 0.44));
      els.push(img('image', o.src || IMG.warm, { x: 0, y: 0, w: W, h: ih, name: 'Image' }));
      box = { ...box, y: ih + my * 0.8, h: H - ih - my * 1.8 };
    } else {
      const iw = Math.round(W * (c === 'banner' ? 0.34 : 0.42));
      els.push(img('image', o.src || IMG.warm, { x: W - iw, y: 0, w: iw, h: H, name: 'Image' }));
      box = { ...box, w: W - iw - mx * 2 };
    }
    els.splice(0, els.length - 1, ...els.slice(0, -1).filter(e => !e.deco));
  }
  if (o.media === 'circle') {
    const d = Math.round(Math.min(box.w, box.h) * (c === 'banner' ? 0.9 : c === 'wide' ? 0.62 : 0.34));
    if (c === 'banner' || c === 'wide') { els.push(img('image', o.src || IMG.warm, { x: box.x + box.w - d, y: box.y + (box.h - d) / 2, w: d, h: d, radius: 9999, name: 'Portrait' })); box = { ...box, w: box.w - d - mx * 0.6 }; }
    else { els.push(img('image', o.src || IMG.warm, { x: box.x, y: box.y, w: d, h: d, radius: 9999, name: 'Portrait' })); box = { ...box, y: box.y + d + 40 * s, h: box.h - d - 40 * s }; }
  }
  if (o.media === 'mark' && (c === 'wide' || c === 'banner')) {
    const d = Math.round(Math.min(box.h * (c === 'banner' ? 0.8 : 0.62), box.w * 0.34));
    els.push(logo(Pt.mark, { x: box.x + box.w - d, y: box.y + (box.h - d) / 2, w: d, h: d, name: 'Large mark' })); box = { ...box, w: box.w - d - mx };
  }
  // brand header
  const markSize = Math.round((c === 'banner' ? Math.min(box.h * 0.36, 96 * s) : 76 * s));
  const showMark = o.mark !== false && !(o.media === 'mark' && (c === 'wide' || c === 'banner'));
  let header = 0;
  if (showMark && c !== 'banner') { els.push(logo(Pt.mark, { x: box.x, y: box.y, w: markSize, h: markSize, name: 'Brand mark' })); header = markSize + 48 * s; }
  if (showMark && c === 'banner' && box.h > 120) { els.push(logo(Pt.mark, { x: box.x, y: box.y + (box.h - markSize) / 2, w: markSize, h: markSize, name: 'Brand mark' })); box = { ...box, x: box.x + markSize + 36 * s, w: box.w - markSize - 36 * s }; }
  // footer: cta / lockup
  let footer = 0, footEls = [];
  if (o.cta) {
    const bs = (c === 'banner' ? 26 : 28) * s, bh = Math.round(bs * 2.3), bw = Math.round(Math.min(box.w, o.cta.length * bs * 0.56 + bs * 2.4));
    if (c === 'banner') { footEls.push(btn('cta', o.cta, { x: box.x + box.w - bw, y: box.y + (box.h - bh) / 2, w: bw, h: bh, size: bs, fill: Pt.btn, color: Pt.btnFg, radius: Math.round(bh * 0.32), name: 'Call to action' })); box = { ...box, w: box.w - bw - 40 * s }; }
    else { footEls.push(btn('cta', o.cta, { x: box.x, y: box.y + box.h - bh, w: bw, h: bh, size: bs, fill: Pt.btn, color: Pt.btnFg, radius: Math.round(bh * 0.32), name: 'Call to action' })); footer = bh + 40 * s; }
  }
  if (o.footer && c !== 'banner') {
    const fe = txt('footer', o.footer, { ...ROLE.meta(s, Pt), x: box.x, w: box.w, name: 'Footer' });
    fe.h = estH(fe, box.w); fe.y = box.y + box.h - fe.h - (footer ? footer : 0); footEls.push(fe); footer += fe.h + 24 * s;
  }
  // stack rows
  const area = { x: box.x, y: box.y + header, w: box.w, h: box.h - header - footer };
  const placed = []; let total = 0;
  rows.filter(Boolean).forEach((r, i) => {
    const gap = i === 0 ? 0 : (r.gap != null ? r.gap : (r.role === 'title' || r.role === 'stat' ? 22 : 26)) * s;
    if (r.group) { const g = r.group(area.x, 0, area.w, s, Pt); placed.push({ g, gap }); total += gap + g.h; return; }
    const st = ROLE[r.role](s, Pt, r.text || '');
    if (r.size) st.size *= r.size;
    const el = txt(r.slot, r.text, { ...st, ...r.style, x: area.x, w: area.w, name: r.name || r.slot });
    el.h = estH(el, area.w); placed.push({ el, gap }); total += gap + el.h;
  });
  if (total > area.h * 1.01 && (o._fit || 0) < 4 && area.h > 0) return compose(f, palId, rows, { ...o, scale: (o.scale || 1) * Math.max(0.5, Math.sqrt(area.h / total) * 0.97), _fit: (o._fit || 0) + 1 });
  const v = o.valign || (c === 'banner' || c === 'wide' ? 'middle' : c === 'tall' ? 'middle' : 'bottom');
  let y = v === 'top' ? area.y : v === 'middle' ? area.y + Math.max(0, (area.h - total) / 2) : area.y + Math.max(0, area.h - total);
  placed.forEach(p => { y += p.gap; if (p.g) { p.g.els.forEach(e => { e.y += y; els.push(e); }); y += p.g.h; } else { p.el.y = Math.round(y); els.push(p.el); y += p.el.h; } });
  els.push(...footEls);
  els.forEach(e => { ['x', 'y', 'w', 'h', 'size', 'strokeW'].forEach(k => { if (typeof e[k] === 'number') e[k] = Math.round(e[k] * 10) / 10; }); });
  return { id: uid('p'), name: o.pageName || 'Page', layout: 'free', bg: o.bg || P.bg, elements: els };
}

// ---------- group builders (poll options, comparisons, dates, lists) ----------
const G = {
  options: (opts, slotBase) => (x, y, w, s, P) => {
    const els = []; const h = 96 * s, gap = 20 * s; const two = opts.length === 4 && w > 700 * s;
    opts.forEach((t, i) => {
      const col = two ? i % 2 : 0, row = two ? Math.floor(i / 2) : i, ww = two ? (w - gap) / 2 : w;
      const xx = x + col * (ww + gap), yy = row * (h + gap);
      els.push(shape('rect', { x: xx, y: yy, w: ww, h, fill: P.card, stroke: P.line, strokeW: 2 * s, radius: 24 * s, name: 'Option ' + (i + 1) + ' box' }));
      els.push(txt(slotBase + (i + 1), t, { font: 'display', size: 34 * s, weight: 600, color: P.cardFg, x: xx + 36 * s, y: yy, w: ww - 72 * s, h, valign: 'middle', lh: 1.2, name: 'Option ' + (i + 1) }));
    });
    const rowsN = two ? Math.ceil(opts.length / 2) : opts.length; return { els, h: rowsN * h + (rowsN - 1) * gap };
  },
  compare: (a, b) => (x, y, w, s, P) => {
    const gap = 24 * s, cw = (w - gap) / 2, pad = 36 * s, els = [];
    const hs = [a, b].map(col => estH(txt(null, col.body, { size: 28 * s, lh: 1.4 }), cw - 2 * pad) + 34 * s * 1.3 + 20 * s + 2 * pad);
    const h = Math.max(...hs);
    [a, b].forEach((col, i) => {
      const xx = x + i * (cw + gap);
      els.push(shape('rect', { x: xx, y: 0, w: cw, h, fill: i ? P.btn : P.card, radius: 28 * s, name: (i ? 'Right' : 'Left') + ' card' }));
      els.push(txt(col.slot + 'Title', col.title, { font: 'display', size: 34 * s, weight: 700, color: i ? P.btnFg : P.cardFg, x: xx + pad, y: pad, w: cw - 2 * pad, h: 34 * s * 1.3, lh: 1.2, name: col.slot + ' title' }));
      els.push(txt(col.slot + 'Body', col.body, { size: 28 * s, lh: 1.4, color: i ? P.btnFg : P.cardFg, x: xx + pad, y: pad + 34 * s * 1.3 + 20 * s, w: cw - 2 * pad, h: h - 2 * pad - 60 * s, name: col.slot + ' body' }));
    });
    return { els, h };
  },
  date: (day, month, slot) => (x, y, w, s, P) => {
    const d = 170 * s; return { h: d, els: [
      shape('rect', { x, y: 0, w: d, h: d, fill: P.btn, radius: 28 * s, name: 'Date tile' }),
      txt(slot + 'Day', day, { font: 'display', size: 76 * s, weight: 800, color: P.btnFg, align: 'center', x, y: 14 * s, w: d, h: d * 0.6, valign: 'middle', lh: 1, name: 'Day' }),
      txt(slot + 'Month', month, { font: 'body', size: 22 * s, weight: 600, upper: true, ls: 0.12, color: P.btnFg, align: 'center', x, y: d * 0.62, w: d, h: d * 0.28, lh: 1.2, name: 'Month' })
    ] };
  },
  chip: (text, slot) => (x, y, w, s, P) => { const fs = 24 * s, cw = text.length * fs * 0.6 + fs * 2; return { h: fs * 2.1, els: [txt(slot, text, { font: 'body', size: fs, weight: 600, color: P.btnFg, bg: P.btn, radius: 999, pad: 0, align: 'center', valign: 'middle', x, y: 0, w: cw, h: fs * 2.1, lh: 1, name: 'Badge' })] }; },
  wave: () => (x, y, w, s) => ({ h: 80 * s, els: [img(null, IMG.wave, { x, y: 0, w: Math.min(w, 400 * s), h: 80 * s, fit: 'contain', pos: 'left', name: 'Waveform' })] })
};

// ---------- graphic layouts ----------
const r = (slot, role, text, extra) => text ? { slot, role, text, ...extra } : null;
export const LAYOUTS = {
  headline: { name: 'Headline', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'title', c.title), r('body', 'subtitle', c.body)], { cta: c.cta, footer: c.footer, decor: c.decor }) },
  split: { name: 'Image + text', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'title', c.title), r('body', 'subtitle', c.body)], { media: 'split', src: c.image, cta: c.cta, valign: 'middle' }) },
  photo: { name: 'Full-bleed photo', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'title', c.title), r('body', 'subtitle', c.body)], { media: 'full', src: c.image, cta: c.cta, footer: c.footer }) },
  bigmark: { name: 'Text + large mark', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'title', c.title), r('body', 'subtitle', c.body)], { media: 'mark', cta: c.cta, decor: c.decor || 'pattern' }) },
  quote: { name: 'Quote / testimonial', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'quote', c.title), r('name', 'name', c.name, { gap: 40 }), r('body', 'meta', c.body, { gap: 8 })], { decor: c.decor || 'band', cta: c.cta }) },
  proverb: { name: 'Proverb (archival)', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'igbo', c.title), r('translation', 'subtitle', c.translation, { gap: 32 }), r('gloss', 'meta', c.gloss, { gap: 18 }), r('name', 'meta', c.name, { gap: 30, style: { weight: 600 } })], { decor: 'band' }) },
  stat: { name: 'Statistic', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'stat', c.title), r('body', 'label', c.body), r('footer', 'meta', c.source, { gap: 30 })], { decor: c.decor || 'arcs' }) },
  list: { name: 'Numbered list', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'title', c.title, { size: 0.8 }), r('body', 'list', c.body, { gap: 36 })], { cta: c.cta, decor: c.decor || 'none', valign: 'top' }) },
  compare: { name: 'Comparison', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'title', c.title, { size: 0.8 }), { group: G.compare({ slot: 'left', title: c.leftTitle, body: c.leftBody }, { slot: 'right', title: c.rightTitle, body: c.rightBody }), gap: 44 }], { decor: 'none', valign: 'middle' }) },
  poll: { name: 'Poll', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'title', c.title, { size: 0.85 }), { group: G.options(c.options || ['Option A', 'Option B'], 'option'), gap: 44 }, r('footer', 'meta', c.footer, { gap: 32 })], { decor: 'none', valign: 'middle' }) },
  event: { name: 'Event', build: (f, p, c) => compose(f, p, [{ group: G.date(c.day || '00', c.month || 'Month', 'date') }, r('eyebrow', 'eyebrow', c.eyebrow, { gap: 44 }), r('title', 'title', c.title), r('body', 'subtitle', c.body)], { cta: c.cta, decor: 'arcs' }) },
  spotlight: { name: 'Spotlight (portrait)', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'title', c.title, { size: 0.78 }), r('body', 'body', c.body), r('name', 'name', c.name, { gap: 34 }), r('meta', 'meta', c.meta, { gap: 6 })], { media: 'circle', src: c.image, decor: 'none', valign: 'top' }) },
  word: { name: 'Word of the day', build: (f, p, c) => compose(f, p, [r('eyebrow', 'eyebrow', c.eyebrow), r('title', 'display', c.title), r('body', 'subtitle', c.body), { group: G.wave(), gap: 40 }, r('footer', 'meta', c.footer, { gap: 30 })], { decor: 'pattern', cta: c.cta }) },
  slide: { name: 'Carousel slide', build: (f, p, c) => compose(f, p, [r('num', 'stat', c.num, { size: 0.6 }), r('title', 'title', c.title, { size: 0.8, gap: 30 }), r('body', 'body', c.body)], { decor: 'none', valign: 'middle', mark: false, footer: c.footer }) }
};

// avatar is its own builder (centred mark)
function buildAvatar(f, v) {
  const W = f.w, d = W * (v.scale || 0.62);
  const els = [];
  if (v.ring) els.push(shape('ellipse', { x: W * 0.06, y: W * 0.06, w: W * 0.88, h: W * 0.88, fill: null, stroke: v.ring, strokeW: W * 0.02, name: 'Ring' }));
  if (v.letter) els.push(txt('title', v.letter, { font: 'display', size: W * 0.56, weight: 800, color: v.fg, align: 'center', valign: 'middle', x: 0, y: 0, w: W, h: W * 0.96, lh: 1, ls: -0.03, name: 'Monogram' }));
  else els.push(logo(v.mark, { x: (W - d) / 2, y: (W - d) / 2, w: d, h: d, name: 'Mark' }));
  return { id: uid('p'), name: 'Avatar', layout: 'free', bg: v.bg, elements: els };
}

// ---------- template catalogue (graphics) ----------
export const CATEGORIES = [
  { id: 'square', name: 'Square posts', note: '1080 × 1080' }, { id: 'engagement', name: 'Engagement posts', note: '1080 × 1080' },
  { id: 'carousel', name: 'Carousels', note: '1080 × 1080, multi-slide' }, { id: 'story', name: 'Stories & reels', note: '1080 × 1920' },
  { id: 'portrait', name: 'Portrait feed', note: '1080 × 1350' }, { id: 'youtube', name: 'YouTube thumbnails', note: '1280 × 720' },
  { id: 'banner', name: 'Banners & covers', note: 'Per platform' }, { id: 'avatar', name: 'Avatars', note: '400 × 400' },
  { id: 'ads', name: 'Advertising', note: 'Multi-format' }, { id: 'email', name: 'Email graphics', note: 'Multi-format' },
  { id: 'web', name: 'Web graphics', note: 'Multi-format' }, { id: 'editorial', name: 'Article banners & editorial', note: 'X 5:2, LinkedIn, Medium, blog…' },
  { id: 'documents', name: 'Documents', note: 'Multi-page' }
];

const T = (id, cat, name, formats, layout, palette, content, extra) => ({ id, cat, name, formats, layout, palette, content, kind: 'graphic', ...extra });
const SQ = ['square'], EN = ['square'], ST = ['story'], PT = ['portrait'], YT = ['yt'];
const ADS = ['ad-feed', 'ad-story', 'ad-li', 'ad-mrec', 'ad-leader', 'ad-sky', 'ad-mobile', 'ad-billboard'];
const ED = ['x-article', 'li-article', 'li-post', 'medium', 'web-article', 'blog', 'nl-promo', 'substack', 'pinterest'];
const PROVERB = { eyebrow: 'Ilu — proverb', title: 'Onye aghụghọ na-ebi n’ọhịa.', translation: '[English translation — confirm with the contributing elder]', gloss: '[One-line meaning — confirm before publishing]', name: 'Umudioka dialect, Anambra' };

export const TEMPLATES = [
  // Square posts
  T('sq-announcement', 'square', 'Announcement', SQ, 'headline', 'clay', { eyebrow: 'Announcement', title: 'Nnọọ. Welcome home.', body: 'A place to hear our elders, learn our words, and keep each other’s stories.', cta: 'Learn more' }),
  T('sq-product-update', 'square', 'Product update', SQ, 'split', 'bone', { eyebrow: 'Product update', title: '[Feature name] is here', body: '[One sentence on what changed and why it helps learners.]', image: IMG.warm }),
  T('sq-testimonial', 'square', 'Testimonial', SQ, 'quote', 'cream', { eyebrow: 'From a learner', title: '“[Learner’s words, quoted exactly and with permission.]”', name: '[Learner name]', body: '[City] · Nnọọ Learn' }),
  T('sq-educational', 'square', 'Educational post', SQ, 'list', 'bone', { eyebrow: 'How it works', title: 'Learning a word with Nnọọ', body: 'Listen to an elder say it\nSay it back, at your own pace\nSee how close your tone was\nCome back tomorrow — the words wait for you' }),
  T('sq-word', 'square', 'Word of the day', SQ, 'word', 'bone', { eyebrow: 'Word of the day', title: 'Nnọọ', body: 'Welcome.', footer: 'Hear it from an elder in Nnọọ Learn' }),
  T('sq-statistic', 'square', 'Statistic', SQ, 'stat', 'ink', { eyebrow: 'By the numbers', title: '[00]', body: '[What the number counts — e.g. elder recordings archived]', source: 'Source: [verified source, date]' }),
  T('sq-launch', 'square', 'Launch', SQ, 'bigmark', 'marigold', { eyebrow: 'Now available', title: 'Nnọọ Learn is here.', body: '[Availability — confirm platforms and regions before posting.]', cta: 'Get the app' }),
  T('sq-cta', 'square', 'Call to action', SQ, 'headline', 'forest', { eyebrow: 'Facilitators', title: 'Sit with an elder. Keep their words.', body: 'Become a facilitator and record with care, consent and provenance.', cta: 'Become a facilitator' }),
  T('sq-comparison', 'square', 'Comparison', SQ, 'compare', 'bone', { eyebrow: 'Two hands, one body', title: 'An archive and a classroom that feed each other', leftTitle: 'Ọbá — the archive', leftBody: 'Elder recordings, stored with who, where, when and dialect.', rightTitle: 'Nnọọ Learn', rightBody: 'Lessons with tonal feedback, built from those recordings.' }),
  T('sq-founder', 'square', 'Founder story', SQ, 'spotlight', 'cream', { eyebrow: 'Why we started', title: '“[A sentence from the founder, in their own words.]”', body: '[Two sentences of context. Confirm all facts with the founder.]', name: '[Founder name]', meta: '[Role] · [Hometown]', image: IMG.warm }),
  T('sq-community', 'square', 'Community spotlight', SQ, 'spotlight', 'plum', { eyebrow: 'Ọha spotlight', title: '[Name] keeps the [Hometown] meetups going', body: '[What they do for the community, in their words.]', name: '[Name]', meta: '[State] · [LGA] · [Dialect]', image: IMG.warm }),
  T('sq-proverb', 'square', 'Proverb', SQ, 'proverb', 'cream', PROVERB),
  T('sq-event', 'square', 'Event', SQ, 'event', 'bone', { day: '[00]', month: '[Month]', eyebrow: 'Ọha meetup', title: '[Event name]', body: '[Venue] · [Time]', cta: 'Save your seat' }),
  T('sq-photo', 'square', 'Photo feature', SQ, 'photo', 'ink', { eyebrow: 'From Ọbá', title: '[Elder name], [Hometown]', body: 'Recorded [Month Year] · [Dialect]', image: IMG.warm, footer: 'Shared with consent.' }),
  // Engagement
  T('en-poll', 'engagement', 'Poll — two options', EN, 'poll', 'bone', { eyebrow: 'Poll', title: 'Where did you first hear Igbo spoken?', options: ['At home', 'Somewhere else'], footer: 'Tell us in the comments.' }),
  T('en-poll-4', 'engagement', 'Poll — four options', EN, 'poll', 'clay', { eyebrow: 'Poll', title: 'What would you most like to learn next?', options: ['Greetings', 'Proverbs', 'Recipes', 'Songs'], footer: 'Vote in the comments.' }),
  T('en-question', 'engagement', 'Question prompt', EN, 'headline', 'plum', { eyebrow: 'Ọha asks', title: 'Which word from home do you never want to forget?', body: 'Share it below. We’ll gather them for the community.', decor: 'arcs' }),
  T('en-this-or-that', 'engagement', 'This or that', EN, 'compare', 'marigold', { eyebrow: 'This or that', title: 'How do you learn best?', leftTitle: 'Listening first', leftBody: 'Hear it many times, then speak.', rightTitle: 'Speaking first', rightBody: 'Try it out loud, then refine.' }),
  T('en-fill-blank', 'engagement', 'Fill in the blank', EN, 'headline', 'bone', { eyebrow: 'Fill in the blank', title: 'The first word I taught my child was ______.', body: 'Answer in the comments.', decor: 'pattern' }),
  T('en-quiz', 'engagement', 'Guess the meaning', EN, 'poll', 'cream', { eyebrow: 'Quiz', title: 'What does “Ọbá” mean?', options: ['A. Storehouse, treasury', 'B. Gathering', 'C. Welcome'], footer: 'Answer: A — Ọbá is our archive.' }),
  // Carousels
  T('car-educational', 'carousel', 'Educational carousel', SQ, 'carousel', 'bone', null, { pages: [
    ['headline', 'clay', { eyebrow: 'Swipe', title: 'How a word reaches you', body: 'From an elder’s voice to your lesson.' }],
    ['slide', 'bone', { num: '01', title: 'An elder is recorded', body: 'A facilitator sits with them. Consent first. There is no hurry.' }],
    ['slide', 'bone', { num: '02', title: 'It is kept with provenance', body: 'Who, where, when and which dialect — stored in Ọbá.' }],
    ['slide', 'bone', { num: '03', title: 'You learn it, tone and all', body: 'Nnọọ Learn plays it back and gives feedback on your tone.' }],
    ['headline', 'forest', { eyebrow: 'Your turn', title: 'Hear it from an elder.', cta: 'Start a lesson' }]] }),
  T('car-product', 'carousel', 'Product walkthrough', SQ, 'carousel', 'bone', null, { pages: [
    ['bigmark', 'bone', { eyebrow: 'Meet Nnọọ', title: 'One platform, five ways in', body: 'Swipe to see each part.' }],
    ['slide', 'clay', { num: 'Learn', title: 'Nnọọ Learn', body: 'Lessons, tonal pronunciation feedback, a daily proverb and flashcards.' }],
    ['slide', 'cream', { num: 'Ọbá', title: 'The archive', body: 'Listen to elder recordings with full provenance — who, where, when, dialect.' }],
    ['slide', 'plum', { num: 'Ọha', title: 'The community', body: 'Find people by state, LGA, hometown and dialect. Threads and local meetups.' }],
    ['slide', 'forest', { num: 'Record', title: 'Facilitator Mode', body: 'Sit with an elder and capture audio and metadata cleanly.' }],
    ['headline', 'clay', { eyebrow: 'Nnọọ', title: 'Welcome home.', cta: 'Learn more' }]] }),
  T('car-story', 'carousel', 'Story carousel', SQ, 'carousel', 'cream', null, { pages: [
    ['photo', 'ink', { eyebrow: 'A story from Ọbá', title: '[Elder name], [Hometown]', image: IMG.warm }],
    ['slide', 'cream', { num: '01', title: '[Where the story begins]', body: '[Two sentences, in the elder’s words where possible.]' }],
    ['slide', 'cream', { num: '02', title: '[What they remember]', body: '[Two sentences.]' }],
    ['slide', 'cream', { num: '03', title: '[What they want kept]', body: '[Two sentences.]' }],
    ['headline', 'forest', { eyebrow: 'Listen', title: 'Hear the full recording in Ọbá.', cta: 'Open Ọbá' }]] }),
  T('car-proverb', 'carousel', 'Proverb breakdown', SQ, 'carousel', 'cream', null, { pages: [
    ['proverb', 'cream', { ...PROVERB, translation: '', gloss: '', eyebrow: 'Ilu — swipe to learn it' }],
    ['slide', 'bone', { num: 'Say it', title: PROVERB.title, body: 'Listen to the elder recording in Ọbá before you try it aloud.' }],
    ['slide', 'bone', { num: 'Means', title: PROVERB.translation, body: PROVERB.gloss }],
    ['slide', 'bone', { num: 'From', title: PROVERB.name, body: 'Proverbs are attributed to their dialect and region whenever known.' }],
    ['headline', 'clay', { eyebrow: 'Ilu every day', title: 'A new proverb, every morning.', cta: 'Open Nnọọ Learn' }]] }),
  // Stories
  T('st-announcement', 'story', 'Story — announcement', ST, 'headline', 'clay', { eyebrow: 'News', title: 'Something new is coming to Nnọọ', body: '[One line of detail.]', cta: 'Swipe up' }),
  T('st-proverb', 'story', 'Story — proverb', ST, 'proverb', 'cream', PROVERB),
  T('st-poll', 'story', 'Story — poll', ST, 'poll', 'plum', { eyebrow: 'Ọha asks', title: 'Do you speak Igbo at home?', options: ['Every day', 'Sometimes', 'Not yet'], footer: 'Use the poll sticker here.' }),
  T('st-event', 'story', 'Story — event', ST, 'event', 'bone', { day: '[00]', month: '[Month]', eyebrow: 'Ọha meetup', title: '[Event name]', body: '[Venue] · [Time]', cta: 'RSVP' }),
  T('st-lesson', 'story', 'Story — lesson teaser', ST, 'word', 'bone', { eyebrow: 'Today’s word', title: 'Ọ dị mma', body: 'Well done.', footer: 'Practise your tone in Nnọọ Learn', cta: 'Start lesson' }),
  T('st-cta', 'story', 'Story — call to action', ST, 'photo', 'ink', { eyebrow: 'Facilitators', title: 'There is no hurry. Their words can wait for you.', body: 'Become a facilitator.', cta: 'Learn how', image: IMG.warm }),
  // Portrait
  T('pt-announcement', 'portrait', 'Portrait — announcement', PT, 'headline', 'clay', { eyebrow: 'Announcement', title: 'Nnọọ. Welcome home.', body: 'Hear our elders. Learn our words. Keep each other’s stories.', cta: 'Learn more' }),
  T('pt-testimonial', 'portrait', 'Portrait — testimonial', PT, 'quote', 'cream', { eyebrow: 'From a learner', title: '“[Learner’s words, quoted exactly and with permission.]”', name: '[Learner name]', body: '[City] · Nnọọ Learn' }),
  T('pt-educational', 'portrait', 'Portrait — educational', PT, 'list', 'bone', { eyebrow: 'Before you record', title: 'Sitting with an elder', body: 'Ask for consent, in their language\nTell them who will hear it\nTake your time — there is no hurry\nNote the place, date and dialect' }),
  T('pt-statistic', 'portrait', 'Portrait — statistic', PT, 'stat', 'ink', { eyebrow: 'By the numbers', title: '[00]', body: '[What the number counts]', source: 'Source: [verified source, date]' }),
  T('pt-photo', 'portrait', 'Portrait — photo feature', PT, 'photo', 'ink', { eyebrow: 'From Ọbá', title: '[Elder name], [Hometown]', body: 'Recorded [Month Year] · [Dialect]', image: IMG.warm, footer: 'Shared with consent.' }),
  // YouTube
  T('yt-lesson', 'youtube', 'Thumbnail — lesson', YT, 'bigmark', 'clay', { eyebrow: 'Lesson [00]', title: 'Say it with the right tone' }),
  T('yt-elder', 'youtube', 'Thumbnail — elder story', YT, 'photo', 'ink', { eyebrow: 'From Ọbá', title: '[Elder name] remembers [topic]', image: IMG.warm }),
  T('yt-interview', 'youtube', 'Thumbnail — interview', YT, 'spotlight', 'plum', { eyebrow: 'Conversation', title: '[Guest name] on [topic]', name: '[Guest name]', meta: '[Role]', image: IMG.warm }),
  T('yt-explainer', 'youtube', 'Thumbnail — explainer', YT, 'headline', 'marigold', { eyebrow: 'Explainer', title: 'What is Ọbá?', decor: 'arcs' })
];
// Banners: two variations per platform
const BANNERS = [['x-header', 'X header'], ['li-personal', 'LinkedIn personal'], ['li-company', 'LinkedIn company'], ['fb-cover', 'Facebook cover'], ['yt-channel', 'YouTube channel art'], ['twitch', 'Twitch'], ['podcast', 'Podcast cover'], ['nl-header', 'Newsletter header'], ['web-banner', 'Website banner'], ['event-banner', 'Event banner'], ['community', 'Community banner']];
BANNERS.forEach(([f, n]) => {
  const pod = f === 'podcast';
  TEMPLATES.push(T('bn-' + f + '-brand', 'banner', n + ' — brand', [f], f === 'event-banner' ? 'event' : 'bigmark', 'clay', f === 'event-banner' ? { day: '[00]', month: '[Month]', eyebrow: 'Ọha gathering', title: '[Event name]', body: '[Venue] · [Time]', cta: 'Register' } : { eyebrow: pod ? 'Podcast' : '', title: pod ? '[Podcast name]' : 'Nnọọ. Welcome home.', body: pod ? 'Stories from our elders' : 'Hear our elders. Learn our words.' }));
  TEMPLATES.push(T('bn-' + f + '-pattern', 'banner', n + ' — pattern', [f], 'headline', 'bone', { eyebrow: f === 'community' ? 'Ọha' : 'Nnọọ', title: f === 'community' ? 'Welcome to Ọha' : 'Two hands, one body.', body: pod ? '[Podcast name]' : 'Preserving and teaching the living culture of Ndị Igbo.', decor: 'pattern' }));
});
// Avatars
[['av-clay-bone', 'Mark on bone', { bg: 'bone', mark: 'mark-clay' }], ['av-bone-clay', 'Mark on clay', { bg: 'clay-500', mark: 'mark-bone' }], ['av-ink-marigold', 'Ink mark on marigold', { bg: 'marigold-300', mark: 'mark-ink' }],
 ['av-outline-ink', 'Outline on ink', { bg: 'ink-900', mark: 'mark-outline-bone' }], ['av-plum', 'Community (plum)', { bg: 'plum-500', mark: 'mark-bone' }], ['av-forest', 'Archive (forest)', { bg: 'forest-500', mark: 'mark-bone' }],
 ['av-monogram', 'Monogram N', { bg: 'clay-500', letter: 'N', fg: 'bone' }], ['av-ring', 'Mark with ring', { bg: 'bone', mark: 'mark-clay', ring: 'marigold-300', scale: 0.56 }], ['av-cream', 'Mark on cream', { bg: 'cream', mark: 'mark-clay', scale: 0.7 }]
].forEach(([id, n, v]) => TEMPLATES.push(T(id, 'avatar', 'Avatar — ' + n, ['avatar'], 'avatar', 'bone', {}, { avatar: v })));
// Ads
TEMPLATES.push(
  T('ad-download', 'ads', 'Ad — download the app', ADS, 'headline', 'clay', { eyebrow: 'Nnọọ Learn', title: 'Learn Igbo from the voices that kept it.', cta: 'Get the app' }),
  T('ad-facilitator', 'ads', 'Ad — become a facilitator', ADS, 'headline', 'forest', { eyebrow: 'Volunteer', title: 'Record an elder. Keep their words.', cta: 'Become a facilitator' }),
  T('ad-donate', 'ads', 'Ad — support the archive', ADS, 'split', 'bone', { eyebrow: 'Ọbá', title: 'Help keep every recording safe.', cta: 'Support Ọbá', image: IMG.warm }),
  T('ad-event', 'ads', 'Ad — community meetup', ADS, 'headline', 'plum', { eyebrow: 'Ọha', title: 'Meet people from home, near you.', cta: 'Find a meetup' })
);
// Email
TEMPLATES.push(
  T('em-newsletter-header', 'email', 'Email — newsletter header', ['em-header', 'em-hero'], 'headline', 'clay', { eyebrow: '[Issue 00] · [Month Year]', title: 'Letters from Ọbá' }),
  T('em-welcome', 'email', 'Email — welcome hero', ['em-hero', 'em-header'], 'headline', 'bone', { eyebrow: 'Nnọọ', title: 'Welcome home.', body: 'The words waited for you.', decor: 'arcs' }),
  T('em-event', 'email', 'Email — event invite', ['em-hero', 'em-header'], 'event', 'plum', { day: '[00]', month: '[Month]', eyebrow: 'You’re invited', title: '[Event name]', body: '[Venue] · [Time]' }),
  T('em-thanks', 'email', 'Email — thank-you hero', ['em-hero', 'em-header'], 'headline', 'forest', { eyebrow: 'Thank you', title: 'You helped keep a voice.', body: '[What the contribution supports — confirm wording.]' }),
  T('em-signature', 'email', 'Email — signature banner', ['em-sig'], 'headline', 'bone', { title: 'Nnọọ — Two hands, one body.', body: '[website]', decor: 'none' })
);
// Web
TEMPLATES.push(
  T('web-hero', 'web', 'Website hero', ['web-hero', 'web-mobile'], 'split', 'bone', { eyebrow: 'Nnọọ', title: 'Hear our elders. Learn our words.', body: 'A voice-first archive and a learning app that feed each other.', cta: 'Learn more', image: IMG.warm }),
  T('web-og', 'web', 'Open Graph share image', ['og'], 'bigmark', 'clay', { eyebrow: 'Nnọọ', title: 'Welcome home.', body: 'Two hands, one body.' }),
  T('web-feature', 'web', 'Feature section', ['web-feature', 'web-mobile'], 'compare', 'cream', { eyebrow: 'Two hands, one body', title: 'Preservation and learning, together', leftTitle: 'Ọbá — the archive', leftBody: 'Recordings kept with provenance and consent.', rightTitle: 'Nnọọ Learn', rightBody: 'Lessons and tonal feedback built from them.' }),
  T('web-mission', 'web', 'Mission banner', ['web-banner', 'web-hero'], 'headline', 'ink', { eyebrow: 'Our mission', title: 'Keep the living culture of Ndị Igbo — and pass it on.', decor: 'arcs' }),
  T('web-app-store', 'web', 'App Store screenshot', ['app-store'], 'split', 'clay', { eyebrow: 'Nnọọ Learn', title: 'Hear it. Say it. Keep it.', body: '[Replace image with a real app screenshot]', image: IMG.cool })
);
// Editorial — every layout across every channel
[['ed-type', 'Article — type only', 'headline', 'bone', {}], ['ed-clay', 'Article — clay', 'headline', 'clay', { decor: 'arcs' }], ['ed-image', 'Article — image split', 'split', 'bone', {}],
 ['ed-overlay', 'Article — photo overlay', 'photo', 'ink', {}], ['ed-mark', 'Article — brand mark', 'bigmark', 'cream', {}], ['ed-archive', 'Article — archival', 'quote', 'cream', {}]
].forEach(([id, n, l, p, x]) => TEMPLATES.push(T(id, 'editorial', n, ED, l, p, { eyebrow: 'Nnọọ Journal', title: 'Why we record elders before we teach', body: 'On consent, provenance and patience.', image: IMG.warm, footer: l === 'photo' ? 'nnoo · [site]' : '', name: l === 'quote' ? 'Nnọọ Journal' : '', ...x }, { editorial: true })));

export const TEMPLATE_BY_ID = () => Object.fromEntries(TEMPLATES.concat(DOC_TEMPLATES).map(t => [t.id, t]));

// ---------- build a graphic document ----------
export function buildGraphic(t, formatId, palette, layout, content) {
  const f = FORMATS[formatId || t.formats[0]];
  const pal = palette || t.palette, lay = layout || t.layout;
  if (t.avatar) return [buildAvatar(f, t.avatar)];
  if (t.pages) return t.pages.map(([l, p, c], i) => {
    const cc = {}; Object.keys(c).forEach(k => { cc[k] = content && content['p' + i + '.' + k] != null ? content['p' + i + '.' + k] : c[k]; });
    const pg = LAYOUTS[i === 0 && layout && layout !== 'carousel' ? layout : l].build(f, i === 0 && palette ? palette : p, cc);
    pg.elements.forEach(e => { if (e.slot) e.slot = 'p' + i + '.' + e.slot; }); pg.name = i === 0 ? 'Cover' : i === t.pages.length - 1 ? 'Closing' : 'Slide ' + (i + 1);
    return pg;
  });
  const c = { ...t.content, ...(content || {}) };
  const pg = (LAYOUTS[lay] || LAYOUTS.headline).build(f, pal, c); pg.name = t.name;
  return [pg];
}
export function contentOf(doc) {
  const c = { ...(doc.content || {}) };
  doc.pages.forEach(p => p.elements.forEach(e => { if (e.slot && (e.type === 'text' || e.type === 'button')) c[e.slot] = e.text; if (e.slot === 'image' && e.type === 'image') c.image = e.src; }));
  return c;
}

// ======================================================================
// DOCUMENTS — flow layout pages built from blocks
// ======================================================================
export const DOC_KINDS = {
  ebook: { name: 'Book / ebook', sizes: [{ id: '6x9', label: 'Trade 6 × 9 in', w: 576, h: 864 }, { id: '5.5x8.5', label: 'Digest 5.5 × 8.5 in', w: 528, h: 816 }, { id: 'a5', label: 'A5', w: 559, h: 794 }], ty: { title: 40, h1: 28, h2: 18, h3: 15, body: 12.5, small: 10, quote: 20, eyebrow: 9 }, pad: [64, 56, 64, 56], exports: ['pdf', 'epub', 'docx', 'html', 'md', 'txt'] },
  report: { name: 'Report', sizes: A4L(), ty: { title: 52, h1: 32, h2: 20, h3: 16, body: 13, small: 10.5, quote: 24, eyebrow: 10 }, pad: [72, 64, 72, 64], exports: ['pdf', 'docx', 'html', 'md', 'txt'] },
  whitepaper: { name: 'Whitepaper', sizes: A4L(), ty: { title: 50, h1: 30, h2: 20, h3: 16, body: 13, small: 10.5, quote: 24, eyebrow: 10 }, pad: [72, 64, 72, 64], exports: ['pdf', 'docx', 'html', 'md', 'txt'] },
  proposal: { name: 'Proposal', sizes: A4L(), ty: { title: 50, h1: 30, h2: 20, h3: 16, body: 13, small: 10.5, quote: 22, eyebrow: 10 }, pad: [72, 64, 72, 64], exports: ['pdf', 'docx', 'html', 'md', 'txt'] },
  casestudy: { name: 'Case study', sizes: A4L(), ty: { title: 48, h1: 30, h2: 20, h3: 16, body: 13, small: 10.5, quote: 24, eyebrow: 10 }, pad: [72, 64, 72, 64], exports: ['pdf', 'docx', 'html', 'md', 'txt'] },
  presentation: { name: 'Presentation', sizes: [{ id: '16x9', label: '16:9 — 1920 × 1080', w: 1920, h: 1080 }, { id: '4x3', label: '4:3 — 1440 × 1080', w: 1440, h: 1080 }], ty: { title: 104, h1: 72, h2: 44, h3: 34, body: 30, small: 24, quote: 64, eyebrow: 24 }, pad: [110, 130, 110, 130], exports: ['pptx', 'pdf', 'html', 'md', 'txt'] },
  article: { name: 'Article / blog post', sizes: [{ id: 'web', label: 'Web 1200 wide', w: 1200, h: 1500 }], ty: { title: 64, h1: 40, h2: 30, h3: 24, body: 20, small: 15, quote: 34, eyebrow: 14 }, pad: [96, 180, 96, 180], exports: ['html', 'md', 'pdf', 'docx', 'txt'], continuous: true },
  newsletter: { name: 'Newsletter', sizes: [{ id: 'email', label: 'Email 600 wide', w: 600, h: 520 }], ty: { title: 34, h1: 26, h2: 20, h3: 17, body: 15, small: 12, quote: 20, eyebrow: 11 }, pad: [36, 40, 36, 40], exports: ['html', 'md', 'pdf', 'txt'], continuous: true },
  resume: { name: 'Resume / CV', sizes: A4L(), ty: { title: 36, h1: 22, h2: 15, h3: 13, body: 11.5, small: 10, quote: 14, eyebrow: 9.5 }, pad: [56, 56, 56, 56], exports: ['pdf', 'docx', 'html', 'md', 'txt'] }
};
function A4L() { return [{ id: 'a4', label: 'A4 210 × 297 mm', w: 794, h: 1123 }, { id: 'letter', label: 'US Letter 8.5 × 11 in', w: 816, h: 1056 }]; }

// block factory bound to a doc kind's type scale + palette
function B(kind, palId) {
  const ty = DOC_KINDS[kind].ty, P = PAL[palId] || PAL.bone;
  const t = (role, o) => (text, x) => txt(null, text, { role, ...o, ...x });
  return {
    P, ty,
    eyebrow: t('eyebrow', { font: 'body', size: ty.eyebrow, weight: 600, upper: true, ls: 0.12, color: P.accent, lh: 1.4 }),
    title: t('title', { font: 'display', size: ty.title, weight: 700, lh: 1.06, ls: -0.02, color: P.fg }),
    h1: t('h1', { font: 'display', size: ty.h1, weight: 700, lh: 1.12, ls: -0.02, color: P.fg }),
    h2: t('h2', { font: 'display', size: ty.h2, weight: 600, lh: 1.25, ls: -0.01, color: P.fg }),
    h3: t('h3', { font: 'display', size: ty.h3, weight: 600, lh: 1.3, color: P.fg }),
    lead: t('lead', { font: 'body', size: ty.body * 1.25, lh: 1.55, color: P.muted }),
    body: t('body', { font: 'body', size: ty.body, lh: 1.65, color: P.muted }),
    just: t('body', { font: 'body', size: ty.body, lh: 1.65, color: P.muted, align: 'justify' }),
    small: t('caption', { font: 'body', size: ty.small, lh: 1.5, color: P.muted }),
    quote: t('quote', { font: 'archive', size: ty.quote, weight: 500, lh: 1.25, color: P.fg }),
    list: (text, numbered, x) => txt(null, text, { role: 'list', font: 'body', size: ty.body, lh: 1.6, color: P.muted, list: numbered ? 'number' : 'bullet', ...x }),
    pull: (text, x) => txt(null, text, { role: 'quote', font: 'archive', size: ty.quote, weight: 500, lh: 1.25, color: P.accent === 'clay-500' ? 'clay-700' : P.fg, borderL: P.accent, pad: ty.body * 1.4, ...x }),
    callout: (title, body, tone, x) => data('callout', [{ title, body }], { tone: tone || 'brand', size: ty.body, ...x }),
    img: (src, h, caption, x) => img(null, src, { h, caption: caption || '', radius: ty.body * 0.6, ...x }),
    table: (rows, x) => data('table', rows, { size: ty.small * 1.05, header: true, accent: P.accent, ...x }),
    chart: (title, items, ct, x) => data('chart', items, { title, chart: ct || 'bar', size: ty.small, color: 'clay-500', h: ty.body * 18, ...x }),
    stats: (items, x) => data('stats', items, { size: ty.h1 * 1.3, cols: Math.min(items.length, 3), accent: P.accent === 'clay-500' ? 'clay-500' : P.accent, ...x }),
    cols: (items, cols, x) => data('columns', items, { size: ty.body, cols: cols || items.length, ...x }),
    entries: (items, x) => data('entries', items, { size: ty.body, ...x }),
    timeline: (items, x) => data('timeline', items, { size: ty.body, accent: P.accent, ...x }),
    people: (items, x) => data('people', items, { size: ty.body, accent: P.accent, ...x }),
    tags: (items, x) => data('tags', items, { size: ty.small, ...x }),
    gallery: (items, x) => data('gallery', items, { h: ty.body * 16, radius: ty.body * 0.6, ...x }),
    toc: (x) => data('toc', [], { size: ty.body, ...x }),
    divider: (x) => shape('line', { h: Math.max(1, ty.body * 0.08), fill: P.line, mt: ty.body * 1.4, ...x }),
    spacer: (h, x) => shape('spacer', { h, fill: null, ...x }),
    button: (text, x) => btn(null, text, { size: ty.body * 1.05, fill: P.btn, color: P.btnFg, radius: ty.body * 0.8, ...x }),
    mark: (size, x) => logo(P.mark, { w: size, h: size, ...x }),
    lockup: (h, x) => logo(P.lockup, { w: h * 3.5, h, ...x })
  };
}
// spacing helper: m(el, multiplier of body size)
const sp = (b, el, k) => { el.mt = Math.round(b.ty.body * k); return el; };
function page(kind, name, els, o = {}) {
  return { id: uid('p'), name, kind: o.kind || slug(name), layout: 'flow', bg: o.bg || 'bone', pad: o.pad || DOC_KINDS[kind].pad.slice(), justify: o.justify || 'start', showNum: o.showNum != null ? o.showNum : true, runHead: o.runHead != null ? o.runHead : '', toc: !!o.toc, tocTitle: o.tocTitle || '', section: o.section || '', h: o.h || null, elements: els };
}
function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
const stack = (b, items) => items.map(([el, k]) => sp(b, el, k == null ? 1 : k));

// ---------- page library per kind ----------
// Each entry: [id, name, (b, n) => page]. n = seed number for chapters etc.
const P_BOOK = [
  ['cover', 'Front cover', b => page('ebook', 'Front cover', stack(b, [[b.mark(56), 0], [b.eyebrow('[Series or imprint]'), 'auto'], [b.title('Keeping the Words', { color: 'bone', size: b.ty.title * 1.2 }), 1], [b.lead('A guide for families recording their elders', { color: 'clay-100' }), 1.2], [b.small('[Author name]', { color: 'bone', weight: 600, size: b.ty.body }), 'auto']]).map(fixAuto(b)), { bg: 'clay-500', justify: 'between', showNum: false })],
  ['title-page', 'Title page', b => page('ebook', 'Title page', stack(b, [[b.title('Keeping the Words', { align: 'center' }), 0], [b.lead('A guide for families recording their elders', { align: 'center' }), 1], [b.small('[Author name]', { align: 'center', weight: 600 }), 4], [b.lockup(28, { align: 'center' }), 6]]), { justify: 'center', showNum: false })],
  ['copyright', 'Copyright page', b => page('ebook', 'Copyright', stack(b, [[b.small('Copyright © [Year] [Rights holder]. All rights reserved.'), 0], [b.small('No part of this publication may be reproduced without permission, except brief quotations in reviews.'), 0.8], [b.small('Recordings quoted in this book are used with the consent of the elders and communities who own them.'), 0.8], [b.small('ISBN [000-0-00-000000-0]\nFirst edition [Year]\nPublished by [Publisher]'), 0.8]]), { justify: 'end', showNum: false })],
  ['dedication', 'Dedication', b => page('ebook', 'Dedication', [b.quote('For the elders who waited for us to listen.', { align: 'center', size: b.ty.quote * 0.9 })], { justify: 'center', showNum: false })],
  ['epigraph', 'Epigraph', b => page('ebook', 'Epigraph', stack(b, [[b.quote('Onye aghụghọ na-ebi n’ọhịa.', { align: 'center' }), 0], [b.small('[Translation — confirm with contributing elder]', { align: 'center' }), 1], [b.small('— Umudioka dialect, Anambra', { align: 'center', weight: 600 }), 0.6]]), { justify: 'center', showNum: false })],
  ['toc', 'Table of contents', b => page('ebook', 'Contents', stack(b, [[b.h1('Contents'), 0], [b.toc(), 1.6]]), { showNum: false })],
  ['foreword', 'Foreword', b => page('ebook', 'Foreword', stack(b, [[b.eyebrow('Foreword'), 0], [b.h1('[Foreword title]'), 0.6], [b.just('[Written by someone other than the author. Two or three paragraphs on why this book matters and who it is for.]'), 1.4], [b.small('— [Name], [Role]', { weight: 600 }), 1.2]]), { toc: true, tocTitle: 'Foreword', runHead: 'Foreword' })],
  ['preface', 'Preface', b => page('ebook', 'Preface', stack(b, [[b.eyebrow('Preface'), 0], [b.h1('How this book came to be'), 0.6], [b.just('[In the author’s voice: what led to this book, and how it was made. Keep facts confirmed.]'), 1.4]]), { toc: true, tocTitle: 'Preface', runHead: 'Preface' })],
  ['introduction', 'Introduction', b => page('ebook', 'Introduction', stack(b, [[b.eyebrow('Introduction'), 0], [b.h1('Two hands, one body'), 0.6], [b.just('An archive and a classroom can feed each other. When we record an elder with care — with consent, and with the place, date and dialect written down — we keep more than a voice. We keep a way back home for the children who will hear it.'), 1.4], [b.just('This book walks through that work slowly. Take your time. There is no hurry.'), 0.8]]), { toc: true, tocTitle: 'Introduction', runHead: 'Introduction' })],
  ['part', 'Part divider', (b, n = 1) => page('ebook', 'Part ' + roman(n), stack(b, [[b.eyebrow('Part ' + roman(n), { align: 'center', color: 'marigold-200' }), 0], [b.title('[Part title]', { align: 'center', color: 'bone' }), 0.8]]), { bg: 'clay-500', justify: 'center', showNum: false, toc: true, tocTitle: 'Part ' + roman(n) + ' — [Part title]', section: 'Part ' + roman(n) })],
  ['chapter', 'Chapter opener', (b, n = 1) => page('ebook', 'Chapter ' + n, stack(b, [[b.eyebrow('Chapter ' + n), 4], [b.h1('[Chapter title]', { size: b.ty.h1 * 1.25 }), 0.6], [b.divider({ w: 48 }), 1.2], [b.just('[Opening paragraph of the chapter. Set the scene in two or three sentences before the first section.]'), 1.6], [b.just('[Continue the chapter here.]'), 0.8]]), { toc: true, tocTitle: 'Chapter ' + n + ' — [Chapter title]', section: 'Chapter ' + n, runHead: 'Chapter ' + n })],
  ['body', 'Body text', b => page('ebook', 'Body', stack(b, [[b.just('[Body paragraph. Body text is justified with hyphenation in books; keep paragraphs to four to six sentences for comfortable reading on small screens.]'), 0], [b.just('[Second paragraph.]'), 0.8], [b.just('[Third paragraph.]'), 0.8]]))],
  ['section', 'Section', b => page('ebook', 'Section', stack(b, [[b.h2('[Section heading]'), 0], [b.just('[Section text.]'), 0.8], [b.h3('[Subsection heading]'), 1.6], [b.just('[Subsection text.]'), 0.6]]))],
  ['pull-quote', 'Pull quote', b => page('ebook', 'Pull quote', stack(b, [[b.just('[Paragraph before the quote.]'), 0], [b.pull('“Take your time. There is no hurry.”'), 1.6], [b.just('[Paragraph after the quote.]'), 1.6]]))],
  ['callout', 'Callout / note', b => page('ebook', 'Callout', stack(b, [[b.just('[Paragraph.]'), 0], [b.callout('Note', 'Always ask for consent in the elder’s own language, and tell them who will hear the recording.', 'archival'), 1.4], [b.just('[Paragraph.]'), 1.4]]))],
  ['figure', 'Figure', b => page('ebook', 'Figure', stack(b, [[b.img(IMG.warm, b.ty.body * 18, 'Figure [0.0] — [Caption. Credit the photographer and the person pictured.]'), 0], [b.just('[Paragraph referring to the figure.]'), 1.6]]))],
  ['table', 'Table', b => page('ebook', 'Table', stack(b, [[b.h3('Table [0.0] — Recording checklist'), 0], [b.table([['Step', 'What to record', 'Why'], ['Consent', 'Spoken permission', 'The recording belongs to the elder'], ['Place', 'Town, LGA, state', 'Provenance'], ['Dialect', 'As the elder names it', 'Accurate teaching']]), 0.8]]))],
  ['list', 'List', b => page('ebook', 'List', stack(b, [[b.h3('[List heading]'), 0], [b.list('[First item]\n[Second item]\n[Third item]'), 0.6], [b.h3('[Numbered list]'), 1.6], [b.list('[Step one]\n[Step two]\n[Step three]', true), 0.6]]))],
  ['notes', 'Notes', b => page('ebook', 'Notes', stack(b, [[b.h2('Notes'), 0], [b.list('[Note 1 — source, page]\n[Note 2 — source, page]\n[Note 3 — source, page]', true, { size: b.ty.small }), 0.8]]), { runHead: 'Notes' })],
  ['case-study', 'Case study', b => page('ebook', 'Case study', stack(b, [[b.eyebrow('Case study'), 0], [b.h2('[Family or community name]'), 0.6], [b.just('[What they set out to do, what happened and what they learned. Use only details they have agreed to share.]'), 0.8], [b.callout('What worked', '[One or two lines.]', 'brand'), 1.2]]))],
  ['exercise', 'Exercise', b => page('ebook', 'Exercise', stack(b, [[b.eyebrow('Exercise'), 0], [b.h2('[Exercise title]'), 0.6], [b.list('[Step one]\n[Step two]\n[Step three]', true), 0.8], [b.callout('Time', '[About 20 minutes.]', 'accent'), 1.2]]))],
  ['reflection', 'Reflection', b => page('ebook', 'Reflection', stack(b, [[b.eyebrow('Reflection'), 0], [b.h2('Before you move on'), 0.6], [b.list('[Question to sit with]\n[Question to sit with]\n[Question to sit with]'), 0.8], [b.spacer(b.ty.body * 10), 0.8]]))],
  ['takeaways', 'Key takeaways', b => page('ebook', 'Key takeaways', stack(b, [[b.callout('Key takeaways', '[Takeaway one]\n[Takeaway two]\n[Takeaway three]', 'brand'), 0]]))],
  ['summary', 'Chapter summary', b => page('ebook', 'Chapter summary', stack(b, [[b.eyebrow('Summary'), 0], [b.h2('In this chapter'), 0.6], [b.just('[A short summary paragraph.]'), 0.8], [b.list('[Point]\n[Point]\n[Point]'), 0.8]]))],
  ['conclusion', 'Conclusion', b => page('ebook', 'Conclusion', stack(b, [[b.eyebrow('Conclusion'), 0], [b.h1('The words waited for you'), 0.6], [b.just('[Closing thoughts.]'), 1.4]]), { toc: true, tocTitle: 'Conclusion', runHead: 'Conclusion' })],
  ['appendix', 'Appendix', b => page('ebook', 'Appendix', stack(b, [[b.eyebrow('Appendix A'), 0], [b.h1('[Appendix title]'), 0.6], [b.just('[Supporting material.]'), 1.2]]), { toc: true, tocTitle: 'Appendix A — [Title]', runHead: 'Appendix' })],
  ['references', 'References', b => page('ebook', 'References', stack(b, [[b.h1('References'), 0], [b.list('[Author, A. (Year). Title. Publisher.]\n[Author, B. (Year). Title. Publisher.]', false, { size: b.ty.small }), 1]]), { toc: true, tocTitle: 'References', runHead: 'References' })],
  ['bibliography', 'Bibliography', b => page('ebook', 'Bibliography', stack(b, [[b.h1('Bibliography'), 0], [b.list('[Author. Title. City: Publisher, Year.]\n[Author. Title. City: Publisher, Year.]', false, { size: b.ty.small }), 1]]), { toc: true, tocTitle: 'Bibliography', runHead: 'Bibliography' })],
  ['acknowledgements', 'Acknowledgements', b => page('ebook', 'Acknowledgements', stack(b, [[b.h1('Acknowledgements'), 0], [b.just('[Thank the elders, families, facilitators and communities by name, with their permission.]'), 1]]), { toc: true, tocTitle: 'Acknowledgements' })],
  ['author', 'About the author', b => page('ebook', 'About the author', stack(b, [[b.img(IMG.warm, b.ty.body * 11, '', { w: b.ty.body * 11, radius: 999 }), 0], [b.h2('About the author'), 1.4], [b.just('[Author biography — confirm every fact with the author.]'), 0.6]]), { toc: true, tocTitle: 'About the author' })],
  ['final-cta', 'Final call to action', b => page('ebook', 'Final call to action', stack(b, [[b.mark(48), 0], [b.h1('Hear it from an elder', { color: 'bone' }), 1.4], [b.lead('Every recording in this book can be heard in Ọbá.', { color: 'clay-100' }), 0.6], [b.button('Open Nnọọ', { fill: 'bone', color: 'clay-700' }), 1.6]]), { bg: 'clay-500', justify: 'center', showNum: false })],
  ['back-cover', 'Back cover', b => page('ebook', 'Back cover', stack(b, [[b.lead('[Back-cover blurb. Two short paragraphs describing the book for a reader deciding whether to pick it up.]', { color: 'bone' }), 0], [b.small('“[Endorsement quote.]” — [Name]', { color: 'clay-100' }), 1.6], [b.lockup(30, { variant: 'lockup-reversed' }), 'auto']]).map(fixAuto(b)), { bg: 'clay-500', justify: 'between', showNum: false })]
];
function fixAuto(b) { return el => { if (el.mt === Math.round(b.ty.body * NaN) || isNaN(el.mt)) { el.mt = 0; el.push = true; } return el; }; }
function roman(n) { return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n - 1] || String(n); }

const SAMPLE = 'Sample data — replace before publishing';
const docCover = (kind, b, eyebrow, title, sub, meta) => page(kind, 'Cover', stack(b, [[b.lockup(36, { variant: 'lockup-reversed' }), 0], [b.eyebrow(eyebrow, { color: 'marigold-200' }), 'auto'], [b.title(title, { color: 'bone' }), 0.8], [b.lead(sub, { color: 'clay-100' }), 1.2], [b.small(meta, { color: 'bone', weight: 600 }), 3]]).map(fixAuto(b)), { bg: 'clay-500', justify: 'between', showNum: false });
const docBack = (kind, b) => page(kind, 'Back cover', stack(b, [[b.mark(64), 0], [b.h2('Nnọọ', { color: 'bone' }), 1], [b.small('Two hands, one body.\n[Contact details]\n[Website]', { color: 'clay-100' }), 0.6]]), { bg: 'ink-900', justify: 'center', showNum: false });
const sec = (kind, name, eyebrow, h, paras, extra = () => [], o = {}) => b => page(kind, name, stack(b, [[b.eyebrow(eyebrow), 0], [b.h1(h), 0.6], ...paras.map((p, i) => [b.body(p), i ? 0.8 : 1.2]), ...extra(b)]), { toc: o.toc !== false, tocTitle: o.tocTitle || h, runHead: o.run || name, ...o });
const none = () => [];

const P_REPORT = [
  ['cover', 'Cover', b => docCover('report', b, '[Year] report', '[Report title]', '[One-line description of what this report covers]', '[Organisation] · [Month Year]')],
  ['toc', 'Table of contents', b => page('report', 'Contents', stack(b, [[b.h1('Contents'), 0], [b.toc(), 1.6]]), { showNum: false })],
  ['exec-summary', 'Executive summary', sec('report', 'Executive summary', 'Executive summary', 'The year at a glance', ['[Two or three sentences that a busy reader could stop after.]'], b => [[b.stats([{ value: '[00]', label: '[Metric one]' }, { value: '[00]', label: '[Metric two]' }, { value: '[00]', label: '[Metric three]' }]), 1.6], [b.callout('Key findings', '[Finding one]\n[Finding two]\n[Finding three]', 'brand'), 1.6]])],
  ['introduction', 'Introduction', sec('report', 'Introduction', 'Introduction', 'Why this report', ['[Context and purpose.]', '[Scope and audience.]'])],
  ['methodology', 'Research & methodology', sec('report', 'Methodology', 'Research', 'How we gathered this', ['[Methods, sample, timeframe and limitations.]'], b => [[b.table([['Method', 'Sample', 'Period'], ['[Survey]', '[n = 000]', '[Month–Month]'], ['[Interviews]', '[n = 00]', '[Month–Month]']]), 1.4]])],
  ['section', 'Section', sec('report', 'Section', '[Section]', '[Section heading]', ['[Section text.]', '[Section text.]'], b => [[b.h2('[Subheading]'), 1.6], [b.body('[Text.]'), 0.6]])],
  ['analysis', 'Analysis', sec('report', 'Analysis', 'Analysis', '[What the data shows]', ['[Analysis paragraph.]'], b => [[b.chart('[Chart title] — ' + SAMPLE, [{ label: 'Q1', value: 12 }, { label: 'Q2', value: 18 }, { label: 'Q3', value: 15 }, { label: 'Q4', value: 24 }]), 1.4], [b.small('Figure [0] — [Caption and source]'), 0.6]])],
  ['findings', 'Findings', sec('report', 'Findings', 'Findings', 'What we found', [], b => [[b.cols([{ title: '01 — [Finding]', body: '[Short explanation.]' }, { title: '02 — [Finding]', body: '[Short explanation.]' }, { title: '03 — [Finding]', body: '[Short explanation.]' }], 1), 1.2]])],
  ['data', 'Data visualisation', sec('report', 'Data', 'Data', '[Metric] by [dimension]', [], b => [[b.chart('[Horizontal bar] — ' + SAMPLE, [{ label: '[Region A]', value: 42 }, { label: '[Region B]', value: 31 }, { label: '[Region C]', value: 18 }, { label: '[Region D]', value: 9 }], 'hbar'), 1.2], [b.chart('[Share] — ' + SAMPLE, [{ label: '[Part A]', value: 60 }, { label: '[Part B]', value: 25 }, { label: '[Part C]', value: 15 }], 'donut', { h: b.ty.body * 14 }), 1.6]])],
  ['key-metrics', 'Key metrics', sec('report', 'Key metrics', 'Key metrics', 'By the numbers', [], b => [[b.stats([{ value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }]), 1.4], [b.small('Source: [verified source, date]'), 1]])],
  ['table', 'Data table', sec('report', 'Table', 'Data', '[Table title]', [], b => [[b.table([['[Column]', '[Column]', '[Column]', '[Column]'], ['[Row]', '[0]', '[0]', '[0]'], ['[Row]', '[0]', '[0]', '[0]'], ['[Row]', '[0]', '[0]', '[0]']]), 1.2]])],
  ['recommendations', 'Recommendations', sec('report', 'Recommendations', 'Recommendations', 'What we recommend', [], b => [[b.list('[Recommendation — owner — timeframe]\n[Recommendation — owner — timeframe]\n[Recommendation — owner — timeframe]', true), 1.2]])],
  ['conclusion', 'Conclusion', sec('report', 'Conclusion', 'Conclusion', '[Closing heading]', ['[Conclusion.]'])],
  ['appendix', 'Appendix', sec('report', 'Appendix', 'Appendix', '[Appendix title]', ['[Supporting material.]'])],
  ['references', 'References', b => page('report', 'References', stack(b, [[b.h1('References'), 0], [b.list('[Author (Year). Title. Publisher. URL]\n[Author (Year). Title. Publisher. URL]', true, { size: b.ty.small }), 1]]), { toc: true, tocTitle: 'References', runHead: 'References' })],
  ['back-cover', 'Back cover', b => docBack('report', b)]
];
const P_WHITE = [
  ['cover', 'Cover', b => docCover('whitepaper', b, 'Whitepaper', '[Whitepaper title]', '[The question this paper answers]', '[Author] · [Month Year]')],
  ['abstract', 'Abstract / executive summary', sec('whitepaper', 'Abstract', 'Abstract', 'Summary', ['[One paragraph: problem, approach, conclusion.]'])],
  ['toc', 'Table of contents', b => page('whitepaper', 'Contents', stack(b, [[b.h1('Contents'), 0], [b.toc(), 1.6]]), { showNum: false })],
  ['problem', 'Problem statement', sec('whitepaper', 'Problem', '01 — The problem', '[State the problem plainly]', ['[Who is affected and how.]'], b => [[b.pull('“[A line that makes the problem real.]”'), 1.6]])],
  ['background', 'Background & research', sec('whitepaper', 'Background', '02 — Background', 'What we know', ['[Research context, with citations.]', '[Gaps in existing approaches.]'])],
  ['evidence', 'Evidence', sec('whitepaper', 'Evidence', '03 — Evidence', '[What the evidence says]', ['[Interpretation.]'], b => [[b.stats([{ value: '[00]', label: '[Evidence point]' }, { value: '[00]', label: '[Evidence point]' }]), 1.4], [b.chart('[Chart] — ' + SAMPLE, [{ label: '[A]', value: 30 }, { label: '[B]', value: 52 }, { label: '[C]', value: 41 }]), 1.4]])],
  ['framework', 'Solution framework', sec('whitepaper', 'Framework', '04 — Framework', '[Name of the approach]', ['[How the framework works.]'], b => [[b.cols([{ title: 'Record', body: 'Capture elder voices with consent and provenance.' }, { title: 'Keep', body: 'Store with who, where, when and dialect.' }, { title: 'Teach', body: 'Turn recordings into lessons with tonal feedback.' }], 3), 1.4]])],
  ['case-study', 'Case study', sec('whitepaper', 'Case study', '05 — In practice', '[Case study title]', ['[Context, approach, outcome — confirmed details only.]'], b => [[b.callout('Outcome', '[Result with source.]', 'archival'), 1.4]])],
  ['recommendations', 'Recommendations', sec('whitepaper', 'Recommendations', '06 — Recommendations', 'What to do next', [], b => [[b.list('[Recommendation]\n[Recommendation]\n[Recommendation]', true), 1.2]])],
  ['conclusion', 'Conclusion', sec('whitepaper', 'Conclusion', 'Conclusion', '[Closing heading]', ['[Conclusion.]'])],
  ['references', 'References', b => page('whitepaper', 'References', stack(b, [[b.h1('References'), 0], [b.list('[1] [Citation]\n[2] [Citation]\n[3] [Citation]', false, { size: b.ty.small }), 1]]), { toc: true, tocTitle: 'References' })],
  ['about', 'About', sec('whitepaper', 'About', 'About', 'About Nnọọ', ['Nnọọ is a voice-first platform that preserves and transmits the living culture of Ndị Igbo — recording it from elders, storing it with provenance, and teaching it to diaspora children with tonal pronunciation feedback.'])],
  ['back-cover', 'Back cover', b => docBack('whitepaper', b)]
];
const P_PROPOSAL = [
  ['cover', 'Cover', b => docCover('proposal', b, 'Proposal', '[Proposal title]', 'Prepared for [Client / partner]', '[Prepared by] · [Date] · Ref [000]')],
  ['client', 'Client & project information', sec('proposal', 'Client & project', 'Overview', 'Client and project', [], b => [[b.table([['Client', '[Organisation]'], ['Contact', '[Name, role]'], ['Project', '[Project name]'], ['Date', '[Date]'], ['Valid until', '[Date]']], { header: false }), 1.2], [b.body('[Short summary of the opportunity.]'), 1.4]])],
  ['objectives', 'Objectives', sec('proposal', 'Objectives', 'Objectives', 'What we will achieve', [], b => [[b.list('[Objective — measurable]\n[Objective — measurable]\n[Objective — measurable]', true), 1.2]])],
  ['scope', 'Scope of work', sec('proposal', 'Scope', 'Scope', 'Scope of work', ['[What is included.]'], b => [[b.callout('Out of scope', '[What is not included.]', 'accent'), 1.4]])],
  ['deliverables', 'Deliverables', sec('proposal', 'Deliverables', 'Deliverables', 'What you receive', [], b => [[b.table([['Deliverable', 'Description', 'Format'], ['[Deliverable]', '[Description]', '[Format]'], ['[Deliverable]', '[Description]', '[Format]']]), 1.2]])],
  ['timeline', 'Timeline & milestones', sec('proposal', 'Timeline', 'Timeline', 'Milestones', [], b => [[b.timeline([{ label: '[Week 1–2]', title: '[Milestone]', body: '[Detail]' }, { label: '[Week 3–5]', title: '[Milestone]', body: '[Detail]' }, { label: '[Week 6]', title: '[Milestone]', body: '[Detail]' }]), 1.2]])],
  ['team', 'Team', sec('proposal', 'Team', 'Team', 'Who you’ll work with', [], b => [[b.people([{ name: '[Name]', role: '[Role]', body: '[One-line bio]' }, { name: '[Name]', role: '[Role]', body: '[One-line bio]' }, { name: '[Name]', role: '[Role]', body: '[One-line bio]' }]), 1.2]])],
  ['pricing', 'Pricing & investment', sec('proposal', 'Investment', 'Investment', 'Pricing', [], b => [[b.table([['Item', 'Qty', 'Rate', 'Total'], ['[Item]', '[0]', '[0.00]', '[0.00]'], ['[Item]', '[0]', '[0.00]', '[0.00]'], ['Total', '', '', '[0.00]']]), 1.2], [b.small('[Currency, taxes and payment schedule.]'), 0.8]])],
  ['terms', 'Terms', sec('proposal', 'Terms', 'Terms', 'Terms and conditions', [], b => [[b.list('[Term]\n[Term]\n[Term]', true, { size: b.ty.small }), 1.2]])],
  ['testimonials', 'Testimonials', sec('proposal', 'Testimonials', 'Testimonials', 'What partners say', [], b => [[b.pull('“[Partner quote, used with permission.]”'), 1.2], [b.small('— [Name], [Organisation]', { weight: 600 }), 0.6]])],
  ['next-steps', 'Next steps & sign-off', sec('proposal', 'Next steps', 'Next steps', 'How we begin', [], b => [[b.list('[Step]\n[Step]\n[Step]', true), 1.2], [b.cols([{ title: 'For [Client]', body: 'Signature\n\nName\n\nDate' }, { title: 'For Nnọọ', body: 'Signature\n\nName\n\nDate' }], 2), 2]])],
  ['back-cover', 'Back cover', b => docBack('proposal', b)]
];
const P_CASE = [
  ['cover', 'Cover', b => docCover('casestudy', b, 'Case study', '[Customer / community]: [outcome in a phrase]', '[One-line summary]', '[Month Year]')],
  ['context', 'Customer context', sec('casestudy', 'Context', 'Context', 'About [customer]', ['[Who they are.]'], b => [[b.table([['Organisation', '[Name]'], ['Location', '[Place]'], ['Focus', '[Focus]']], { header: false }), 1.2]])],
  ['challenge', 'Challenge', sec('casestudy', 'Challenge', 'The challenge', '[What stood in the way]', ['[Challenge in their words.]'])],
  ['solution', 'Solution', sec('casestudy', 'Solution', 'The solution', '[What they did]', ['[Approach.]'])],
  ['implementation', 'Implementation', sec('casestudy', 'Implementation', 'Implementation', 'How it rolled out', [], b => [[b.timeline([{ label: '[Phase 1]', title: '[Step]', body: '[Detail]' }, { label: '[Phase 2]', title: '[Step]', body: '[Detail]' }, { label: '[Phase 3]', title: '[Step]', body: '[Detail]' }]), 1.2]])],
  ['results', 'Results & metrics', sec('casestudy', 'Results', 'Results', 'What changed', [], b => [[b.stats([{ value: '[00]', label: '[Result]' }, { value: '[00]', label: '[Result]' }, { value: '[00]', label: '[Result]' }]), 1.2], [b.small('Source: [verified source]'), 0.8]])],
  ['testimonial', 'Testimonial', b => page('casestudy', 'Testimonial', stack(b, [[b.quote('“[Customer quote, used with permission.]”', { color: 'ink-900', size: b.ty.quote * 1.3 }), 0], [b.small('— [Name], [Role], [Organisation]', { weight: 600 }), 1.2]]), { bg: 'cream', justify: 'center' })],
  ['lessons', 'Lessons learned', sec('casestudy', 'Lessons', 'Lessons', 'What we learned', [], b => [[b.list('[Lesson]\n[Lesson]\n[Lesson]'), 1.2]])],
  ['cta', 'Call to action', b => page('casestudy', 'Call to action', stack(b, [[b.h1('[Invitation to the reader]', { color: 'bone' }), 0], [b.lead('[One line.]', { color: 'clay-100' }), 0.8], [b.button('[Get in touch]', { fill: 'bone', color: 'clay-700' }), 1.6]]), { bg: 'clay-500', justify: 'center', showNum: false })]
];
// presentation slides
const slide = (name, els, o = {}) => page('presentation', name, els, { showNum: o.showNum != null ? o.showNum : true, ...o });
const P_PRES = [
  ['cover', 'Cover', b => slide('Cover', stack(b, [[b.mark(96), 0], [b.eyebrow('[Event or context] · [Date]', { color: 'marigold-200' }), 'auto'], [b.title('Nnọọ. Welcome home.', { color: 'bone', size: b.ty.title * 1.2 }), 0.6], [b.lead('Hear our elders. Learn our words. Keep each other’s stories.', { color: 'clay-100' }), 0.8]]).map(fixAuto(b)), { bg: 'clay-500', justify: 'between', showNum: false })],
  ['agenda', 'Agenda', b => slide('Agenda', stack(b, [[b.eyebrow('Agenda'), 0], [b.h1('Today'), 0.4], [b.cols([{ title: '01', body: 'The problem' }, { title: '02', body: 'What we built' }, { title: '03', body: 'How it works' }, { title: '04', body: 'Next steps' }], 4, { size: b.ty.h3 }), 2]]), { toc: true, tocTitle: 'Agenda' })],
  ['divider', 'Section divider', (b, n = 1) => slide('Divider', stack(b, [[b.eyebrow('Section ' + String(n).padStart(2, '0'), { color: 'marigold-300' }), 0], [b.title('[Section title]', { color: 'bone' }), 0.6]]), { bg: 'ink-900', justify: 'center', toc: true, tocTitle: '[Section title]', section: 'Section ' + n })],
  ['problem', 'Problem', b => slide('Problem', stack(b, [[b.eyebrow('The problem'), 0], [b.title('[The problem, in one sentence]', { size: b.ty.h1 }), 0.6], [b.lead('[Who it affects and why it matters now.]'), 1]]), { justify: 'center' })],
  ['insight', 'Insight', b => slide('Insight', stack(b, [[b.eyebrow('Insight', { color: 'forest-500' }), 0], [b.quote('An archive and a classroom can feed each other.', { size: b.ty.quote * 1.1 }), 0.6], [b.lead('Two hands, one body.'), 1]]), { bg: 'cream', justify: 'center' })],
  ['data', 'Data / statistic', b => slide('Data', stack(b, [[b.eyebrow('By the numbers'), 0], [b.stats([{ value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }], { size: b.ty.title * 1.2 }), 1.4], [b.small('Source: [verified source, date]'), 1.6]]), { justify: 'center' })],
  ['chart', 'Chart', b => slide('Chart', stack(b, [[b.eyebrow('Trend'), 0], [b.h2('[Chart headline states the takeaway]'), 0.4], [b.chart(SAMPLE, [{ label: '[Jan]', value: 10 }, { label: '[Feb]', value: 14 }, { label: '[Mar]', value: 13 }, { label: '[Apr]', value: 19 }, { label: '[May]', value: 24 }, { label: '[Jun]', value: 28 }], 'bar', { h: 560 }), 1.2]]))],
  ['comparison', 'Comparison', b => slide('Comparison', stack(b, [[b.eyebrow('Two hands, one body'), 0], [b.h1('An archive and a classroom'), 0.4], [b.cols([{ title: 'Ọbá — the archive', body: 'Elder recordings stored with who, where, when and dialect.' }, { title: 'Nnọọ Learn', body: 'Lessons with tonal pronunciation feedback, built from those recordings.' }], 2, { size: b.ty.h3, boxed: true }), 1.6]]))],
  ['framework', 'Framework', b => slide('Framework', stack(b, [[b.eyebrow('Framework'), 0], [b.h1('Record. Keep. Teach.'), 0.4], [b.cols([{ title: 'Record', body: 'A facilitator sits with an elder. Consent first.' }, { title: 'Keep', body: 'Stored in Ọbá with full provenance.' }, { title: 'Teach', body: 'Turned into lessons in Nnọọ Learn.' }], 3, { size: b.ty.h3, boxed: true }), 1.6]]))],
  ['process', 'Process', b => slide('Process', stack(b, [[b.eyebrow('Process'), 0], [b.h1('How a recording becomes a lesson'), 0.4], [b.timeline([{ label: '01', title: 'Consent', body: 'In the elder’s language' }, { label: '02', title: 'Record', body: 'Audio + metadata' }, { label: '03', title: 'Review', body: 'With the family' }, { label: '04', title: 'Teach', body: 'In Nnọọ Learn' }], { horizontal: true, size: b.ty.h3 }), 2]]))],
  ['timeline', 'Timeline', b => slide('Timeline', stack(b, [[b.eyebrow('Roadmap'), 0], [b.h1('[Timeline headline]'), 0.4], [b.timeline([{ label: '[Q1]', title: '[Milestone]', body: '[Detail]' }, { label: '[Q2]', title: '[Milestone]', body: '[Detail]' }, { label: '[Q3]', title: '[Milestone]', body: '[Detail]' }, { label: '[Q4]', title: '[Milestone]', body: '[Detail]' }], { horizontal: true, size: b.ty.h3 }), 2]]))],
  ['case-study', 'Case study', b => slide('Case study', stack(b, [[b.eyebrow('Case study'), 0], [b.h1('[Community name]'), 0.4], [b.cols([{ title: 'Challenge', body: '[One line]' }, { title: 'Approach', body: '[One line]' }, { title: 'Result', body: '[One line, sourced]' }], 3, { size: b.ty.h3, boxed: true }), 1.6]]))],
  ['quote', 'Quote', b => slide('Quote', stack(b, [[b.quote('“Take your time. There is no hurry.”', { color: 'bone', size: b.ty.quote * 1.3 }), 0], [b.small('— Facilitator guidance', { color: 'clay-100', weight: 600, size: b.ty.body }), 1.2]]), { bg: 'forest-500', justify: 'center' })],
  ['team', 'Team', b => slide('Team', stack(b, [[b.eyebrow('Team'), 0], [b.h1('The people behind Nnọọ'), 0.4], [b.people([{ name: '[Name]', role: '[Role]', body: '' }, { name: '[Name]', role: '[Role]', body: '' }, { name: '[Name]', role: '[Role]', body: '' }, { name: '[Name]', role: '[Role]', body: '' }], { size: b.ty.h3, cols: 4 }), 1.6]]))],
  ['pricing', 'Pricing', b => slide('Pricing', stack(b, [[b.eyebrow('Pricing'), 0], [b.h1('[Pricing headline]'), 0.4], [b.cols([{ title: '[Tier]', meta: '[Price]', body: '[What’s included]' }, { title: '[Tier]', meta: '[Price]', body: '[What’s included]' }, { title: '[Tier]', meta: '[Price]', body: '[What’s included]' }], 3, { size: b.ty.h3, boxed: true }), 1.6], [b.small('[Pricing not yet confirmed — replace before presenting.]'), 1.2]]))],
  ['summary', 'Summary', b => slide('Summary', stack(b, [[b.eyebrow('Summary'), 0], [b.h1('What to remember'), 0.4], [b.list('Elders are recorded with consent and provenance\nRecordings are kept in Ọbá\nLearners hear them in Nnọọ Learn, with tonal feedback', true, { size: b.ty.h3 }), 1.4]]))],
  ['closing', 'Closing', b => slide('Closing', stack(b, [[b.mark(120), 0], [b.title('Ọ dị mma. Thank you.', { color: 'bone' }), 1.4], [b.lead('[Contact] · [Website]', { color: 'clay-100' }), 0.8]]), { bg: 'clay-500', justify: 'center', showNum: false })]
];
const P_ARTICLE = [
  ['hero', 'Hero image', b => page('article', 'Hero', [b.img(IMG.warm, 560, '', { radius: 0 })], { pad: [0, 0, 0, 0], h: 560, showNum: false })],
  ['title', 'Title, author & metadata', b => page('article', 'Title', stack(b, [[b.eyebrow('Nnọọ Journal · [Category]'), 0], [b.title('Why we record elders before we teach'), 0.8], [b.lead('On consent, provenance and patience.'), 0.8], [b.small('By [Author name] · [Date] · [0] min read', { weight: 500 }), 1.6], [b.divider(), 0.4]]), { h: 620, showNum: false, toc: true, tocTitle: 'Title' })],
  ['body', 'Body', b => page('article', 'Body', stack(b, [[b.body('[Opening paragraph. Articles use left-aligned text at a comfortable 64-character measure.]'), 0], [b.h2('[Subheading]'), 1.8], [b.body('[Paragraph.]'), 0.6], [b.body('[Paragraph.]'), 0.8]]), { h: 760, showNum: false })],
  ['image', 'Inline image', b => page('article', 'Image', stack(b, [[b.img(IMG.warm, 480, '[Caption. Credit the photographer and the person pictured.]'), 0]]), { h: 640, showNum: false })],
  ['gallery', 'Gallery', b => page('article', 'Gallery', stack(b, [[b.gallery([{ src: IMG.warm, caption: '[Caption]' }, { src: IMG.cool, caption: '[Caption]' }, { src: IMG.warm, caption: '[Caption]' }], { h: 300 }), 0]]), { h: 460, showNum: false })],
  ['quote', 'Quote', b => page('article', 'Quote', [b.pull('“[A line from the elder or interviewee, quoted exactly.]”')], { h: 360, justify: 'center', showNum: false })],
  ['statistic', 'Statistic', b => page('article', 'Statistic', stack(b, [[b.stats([{ value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }]), 0], [b.small('Source: [verified source]'), 1]]), { h: 360, justify: 'center', showNum: false })],
  ['chart', 'Chart', b => page('article', 'Chart', stack(b, [[b.chart('[Chart title] — ' + SAMPLE, [{ label: '[A]', value: 20 }, { label: '[B]', value: 35 }, { label: '[C]', value: 28 }, { label: '[D]', value: 44 }], 'bar', { h: 380 }), 0]]), { h: 560, showNum: false })],
  ['callout', 'Callout', b => page('article', 'Callout', [b.callout('Good to know', '[A short aside that helps the reader.]', 'archival')], { h: 300, justify: 'center', showNum: false })],
  ['list', 'List', b => page('article', 'List', stack(b, [[b.h3('[List heading]'), 0], [b.list('[Item]\n[Item]\n[Item]'), 0.6]]), { h: 380, showNum: false })],
  ['conclusion', 'Conclusion', b => page('article', 'Conclusion', stack(b, [[b.h2('[Closing heading]'), 0], [b.body('[Closing paragraph.]'), 0.6]]), { h: 420, showNum: false })],
  ['author-bio', 'Author bio', b => page('article', 'Author bio', [b.people([{ name: '[Author name]', role: '[Role]', body: '[Two-line bio — confirm with the author.]' }], { cols: 1 })], { h: 300, justify: 'center', bg: 'cream', showNum: false })],
  ['related', 'Related content', b => page('article', 'Related', stack(b, [[b.eyebrow('Keep reading'), 0], [b.cols([{ title: '[Related article]', body: '[One line]' }, { title: '[Related article]', body: '[One line]' }, { title: '[Related article]', body: '[One line]' }], 3, { boxed: true }), 1]]), { h: 420, showNum: false })],
  ['cta', 'Call to action', b => page('article', 'Call to action', stack(b, [[b.h2('Hear it from an elder', { color: 'bone' }), 0], [b.body('Every recording mentioned here lives in Ọbá.', { color: 'clay-100' }), 0.6], [b.button('Open Nnọọ', { fill: 'bone', color: 'clay-700' }), 1.4]]), { h: 400, bg: 'clay-500', justify: 'center', showNum: false })]
];
const P_NEWS = [
  ['header', 'Header', b => page('newsletter', 'Header', stack(b, [[b.lockup(30, { variant: 'lockup-reversed' }), 0], [b.eyebrow('[Issue 00] · [Month Year]', { color: 'marigold-200' }), 1.4], [b.h1('Letters from Ọbá', { color: 'bone' }), 0.4]]), { bg: 'clay-500', h: 240, showNum: false })],
  ['intro', 'Introduction', b => page('newsletter', 'Introduction', stack(b, [[b.h3('Nnọọ,'), 0], [b.body('[A warm two-sentence opening from the team. Reverent, never salesy.]'), 0.6]]), { h: 200, showNum: false })],
  ['featured', 'Featured story', b => page('newsletter', 'Featured story', stack(b, [[b.img(IMG.warm, 240), 0], [b.eyebrow('Featured'), 1.2], [b.h2('[Featured story headline]'), 0.4], [b.body('[Two-sentence summary.]'), 0.5], [b.button('Read the story'), 1]]), { h: 560, showNum: false })],
  ['article', 'Article block', b => page('newsletter', 'Article', stack(b, [[b.h3('[Article headline]'), 0], [b.body('[Summary.]'), 0.4], [b.small('Read more →', { color: 'clay-600', weight: 600 }), 0.6]]), { h: 200, showNum: false })],
  ['announcement', 'Announcement', b => page('newsletter', 'Announcement', [b.callout('[Announcement]', '[One or two lines.]', 'brand')], { h: 200, justify: 'center', showNum: false })],
  ['event', 'Event block', b => page('newsletter', 'Event', stack(b, [[b.eyebrow('Ọha meetup', { color: 'plum-500' }), 0], [b.h3('[Event name]'), 0.4], [b.small('[Date] · [Time] · [Venue]', { weight: 600 }), 0.4], [b.button('RSVP', { fill: 'plum-500' }), 1]]), { h: 240, bg: 'plum-50', showNum: false })],
  ['quote', 'Quote', b => page('newsletter', 'Quote', stack(b, [[b.quote('Onye aghụghọ na-ebi n’ọhịa.'), 0], [b.small('Umudioka dialect, Anambra · [Translation pending confirmation]'), 0.6]]), { h: 200, bg: 'cream', justify: 'center', showNum: false })],
  ['image', 'Image', b => page('newsletter', 'Image', stack(b, [[b.img(IMG.cool, 260, '[Caption]'), 0]]), { h: 340, showNum: false })],
  ['statistic', 'Statistic', b => page('newsletter', 'Statistic', [b.stats([{ value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }])], { h: 200, justify: 'center', showNum: false })],
  ['cta', 'Call to action', b => page('newsletter', 'Call to action', stack(b, [[b.h2('Become a facilitator', { color: 'bone', align: 'center' }), 0], [b.body('Sit with an elder. Keep their words.', { color: 'forest-100', align: 'center' }), 0.4], [b.button('Learn how', { fill: 'bone', color: 'forest-700', align: 'center' }), 1]]), { h: 240, bg: 'forest-500', justify: 'center', showNum: false })],
  ['footer', 'Footer', b => page('newsletter', 'Footer', stack(b, [[b.mark(32, { align: 'center' }), 0], [b.small('You’re receiving this because you joined Nnọọ.\n[Postal address] · Unsubscribe · Preferences', { align: 'center', color: 'ink-500' }), 0.8]]), { h: 180, bg: 'sand', justify: 'center', showNum: false })]
];
const P_RESUME = [
  ['resume-page', 'Resume page (all sections)', b => page('resume', 'Resume', stack(b, [
    [b.title('[Your Name]'), 0], [b.lead('[Professional title]', { color: 'clay-600', size: b.ty.h2 }), 0.3], [b.small('[email] · [phone] · [city] · [portfolio URL]', { weight: 500 }), 0.6], [b.divider(), 0.2],
    [b.h2('Profile', { upper: true, ls: 0.1, size: b.ty.h3, color: 'clay-600' }), 1.4], [b.body('[Two-sentence professional summary.]'), 0.4],
    [b.h2('Experience', { upper: true, ls: 0.1, size: b.ty.h3, color: 'clay-600' }), 1.4], [b.entries([{ title: '[Role]', org: '[Organisation]', date: '[Year – Year]', body: '[Achievement with a measurable result]\n[Achievement]' }, { title: '[Role]', org: '[Organisation]', date: '[Year – Year]', body: '[Achievement]\n[Achievement]' }]), 0.4],
    [b.h2('Education', { upper: true, ls: 0.1, size: b.ty.h3, color: 'clay-600' }), 1.4], [b.entries([{ title: '[Degree]', org: '[Institution]', date: '[Year]', body: '' }]), 0.4],
    [b.h2('Skills', { upper: true, ls: 0.1, size: b.ty.h3, color: 'clay-600' }), 1.4], [b.tags(['[Skill]', '[Skill]', '[Skill]', '[Skill]', '[Skill]', '[Language]']), 0.6]
  ]), { showNum: false })],
  ['header', 'Header', b => page('resume', 'Header', stack(b, [[b.title('[Your Name]'), 0], [b.lead('[Professional title]', { color: 'clay-600' }), 0.3]]), { showNum: false })],
  ['profile', 'Profile', sec('resume', 'Profile', 'Profile', '[Your Name]', ['[Profile paragraph.]'], none, { toc: false, showNum: false })],
  ['summary', 'Summary', b => page('resume', 'Summary', stack(b, [[b.h2('Summary'), 0], [b.body('[Summary.]'), 0.4]]), { showNum: false })],
  ['experience', 'Experience', b => page('resume', 'Experience', stack(b, [[b.h2('Experience'), 0], [b.entries([{ title: '[Role]', org: '[Organisation]', date: '[Year – Year]', body: '[Achievement]\n[Achievement]' }, { title: '[Role]', org: '[Organisation]', date: '[Year – Year]', body: '[Achievement]' }, { title: '[Role]', org: '[Organisation]', date: '[Year – Year]', body: '[Achievement]' }]), 0.6]]), { showNum: false })],
  ['education', 'Education', b => page('resume', 'Education', stack(b, [[b.h2('Education'), 0], [b.entries([{ title: '[Degree]', org: '[Institution]', date: '[Year]', body: '[Honours]' }]), 0.6]]), { showNum: false })],
  ['skills', 'Skills', b => page('resume', 'Skills', stack(b, [[b.h2('Skills'), 0], [b.tags(['[Skill]', '[Skill]', '[Skill]']), 0.6]]), { showNum: false })],
  ['certifications', 'Certifications', b => page('resume', 'Certifications', stack(b, [[b.h2('Certifications'), 0], [b.entries([{ title: '[Certification]', org: '[Issuer]', date: '[Year]', body: '' }]), 0.6]]), { showNum: false })],
  ['projects', 'Projects', b => page('resume', 'Projects', stack(b, [[b.h2('Projects'), 0], [b.entries([{ title: '[Project]', org: '[Context]', date: '[Year]', body: '[Outcome]' }]), 0.6]]), { showNum: false })],
  ['awards', 'Awards', b => page('resume', 'Awards', stack(b, [[b.h2('Awards'), 0], [b.entries([{ title: '[Award]', org: '[Awarding body]', date: '[Year]', body: '' }]), 0.6]]), { showNum: false })],
  ['publications', 'Publications', b => page('resume', 'Publications', stack(b, [[b.h2('Publications'), 0], [b.list('[Author (Year). Title. Publication.]', false), 0.6]]), { showNum: false })],
  ['references', 'References', b => page('resume', 'References', stack(b, [[b.h2('References'), 0], [b.cols([{ title: '[Name]', body: '[Role, organisation]\n[email]' }, { title: '[Name]', body: '[Role, organisation]\n[email]' }], 2), 0.6]]), { showNum: false })],
  ['contact', 'Contact', b => page('resume', 'Contact', stack(b, [[b.h2('Contact'), 0], [b.table([['Email', '[email]'], ['Phone', '[phone]'], ['Location', '[city]'], ['Web', '[URL]']], { header: false }), 0.6]]), { showNum: false })]
];

export const PAGE_LIB = { ebook: P_BOOK, report: P_REPORT, whitepaper: P_WHITE, proposal: P_PROPOSAL, casestudy: P_CASE, presentation: P_PRES, article: P_ARTICLE, newsletter: P_NEWS, resume: P_RESUME };

// Section blocks that can be inserted into any flow page (any document kind)
export const BLOCKS = [
  ['heading', 'Heading', b => [b.h2('[Heading]')]], ['subheading', 'Subheading', b => [b.h3('[Subheading]')]], ['paragraph', 'Paragraph', b => [b.body('[Paragraph text.]')]],
  ['eyebrow', 'Eyebrow label', b => [b.eyebrow('[Label]')]], ['bullets', 'Bulleted list', b => [b.list('[Item]\n[Item]\n[Item]')]], ['numbered', 'Numbered list', b => [b.list('[Step]\n[Step]\n[Step]', true)]],
  ['pull-quote', 'Pull quote', b => [b.pull('“[Quote]”')]], ['callout', 'Callout', b => [b.callout('[Title]', '[Body]', 'brand')]], ['note', 'Note (archival)', b => [b.callout('Note', '[Body]', 'archival')]],
  ['image', 'Image / figure', b => [b.img(IMG.warm, b.ty.body * 16, '[Caption]')]], ['gallery', 'Gallery', b => [b.gallery([{ src: IMG.warm, caption: '' }, { src: IMG.cool, caption: '' }])]],
  ['table', 'Table', b => [b.table([['[Column]', '[Column]', '[Column]'], ['[Value]', '[Value]', '[Value]'], ['[Value]', '[Value]', '[Value]']])]],
  ['chart-bar', 'Bar chart', b => [b.chart('[Chart title] — ' + SAMPLE, [{ label: 'A', value: 10 }, { label: 'B', value: 18 }, { label: 'C', value: 14 }])]],
  ['chart-hbar', 'Horizontal bar chart', b => [b.chart('[Chart title] — ' + SAMPLE, [{ label: 'A', value: 40 }, { label: 'B', value: 25 }, { label: 'C', value: 12 }], 'hbar')]],
  ['chart-donut', 'Donut chart', b => [b.chart('[Chart title] — ' + SAMPLE, [{ label: 'A', value: 60 }, { label: 'B', value: 40 }], 'donut')]],
  ['stats', 'Statistics', b => [b.stats([{ value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }, { value: '[00]', label: '[Metric]' }])]],
  ['columns', 'Columns / cards', b => [b.cols([{ title: '[Title]', body: '[Body]' }, { title: '[Title]', body: '[Body]' }, { title: '[Title]', body: '[Body]' }], 3, { boxed: true })]],
  ['timeline', 'Timeline', b => [b.timeline([{ label: '[When]', title: '[Milestone]', body: '[Detail]' }, { label: '[When]', title: '[Milestone]', body: '[Detail]' }])]],
  ['entries', 'Dated entries (experience, awards…)', b => [b.entries([{ title: '[Title]', org: '[Organisation]', date: '[Date]', body: '[Detail]' }])]],
  ['people', 'People / team', b => [b.people([{ name: '[Name]', role: '[Role]', body: '' }, { name: '[Name]', role: '[Role]', body: '' }])]],
  ['tags', 'Tags / skills', b => [b.tags(['[Tag]', '[Tag]', '[Tag]'])]], ['button', 'Button / CTA', b => [b.button('[Call to action]')]],
  ['toc', 'Table of contents', b => [b.toc()]], ['divider', 'Divider', b => [b.divider()]], ['spacer', 'Spacer', b => [b.spacer(b.ty.body * 3)]],
  ['logo', 'Logo lockup', b => [b.lockup(b.ty.body * 2.4)]], ['mark', 'Brand mark', b => [b.mark(b.ty.body * 4)]]
];
export function makeBlock(kind, blockId) { const b = B(kind, 'bone'); const blk = BLOCKS.find(x => x[0] === blockId); const els = blk[2](b); els.forEach((e, i) => { e.mt = i ? Math.round(b.ty.body * 0.8) : Math.round(b.ty.body * 1.2); }); return els; }
export function makePage(kind, pageId, n) { const entry = PAGE_LIB[kind].find(x => x[0] === pageId); const b = B(kind, 'bone'); const p = entry[2](b, n); p.kind = pageId; return p; }

// Document templates: ordered page lists
const D = (id, kind, name, seq, extra) => ({ id, cat: 'documents', kind: 'doc', docKind: kind, name, formats: DOC_KINDS[kind].sizes.map(s => s.id), seq, ...extra });
export const DOC_TEMPLATES = [
  D('doc-ebook', 'ebook', 'Ebook — complete manuscript', ['cover', 'title-page', 'copyright', 'dedication', 'epigraph', 'toc', 'foreword', 'preface', 'introduction', ['part', 1], ['chapter', 1], 'section', 'pull-quote', 'figure', 'callout', 'takeaways', ['chapter', 2], 'body', 'table', 'list', 'case-study', 'exercise', 'reflection', 'summary', ['part', 2], ['chapter', 3], 'section', 'notes', 'conclusion', 'appendix', 'references', 'bibliography', 'acknowledgements', 'author', 'final-cta', 'back-cover']),
  D('doc-guide', 'ebook', 'Ebook — short guide', ['cover', 'title-page', 'copyright', 'toc', 'introduction', ['chapter', 1], 'section', 'callout', ['chapter', 2], 'list', 'exercise', 'conclusion', 'author', 'back-cover']),
  D('doc-report', 'report', 'Report — impact report', P_REPORT.map(p => p[0])),
  D('doc-whitepaper', 'whitepaper', 'Whitepaper', P_WHITE.map(p => p[0])),
  D('doc-proposal', 'proposal', 'Proposal — partnership', P_PROPOSAL.map(p => p[0])),
  D('doc-casestudy', 'casestudy', 'Case study', P_CASE.map(p => p[0])),
  D('doc-presentation', 'presentation', 'Presentation — overview deck', ['cover', 'agenda', ['divider', 1], 'problem', 'insight', 'data', 'chart', ['divider', 2], 'comparison', 'framework', 'process', 'timeline', 'case-study', 'quote', 'team', 'pricing', 'summary', 'closing']),
  D('doc-presentation-short', 'presentation', 'Presentation — short talk', ['cover', 'problem', 'insight', 'framework', 'quote', 'closing']),
  D('doc-article', 'article', 'Article / blog post', P_ARTICLE.map(p => p[0])),
  D('doc-newsletter', 'newsletter', 'Newsletter', P_NEWS.map(p => p[0])),
  D('doc-resume', 'resume', 'Resume / CV — one page', ['resume-page']),
  D('doc-resume-sections', 'resume', 'Resume / CV — section by section', ['header', 'summary', 'experience', 'education', 'skills', 'certifications', 'projects', 'awards', 'publications', 'references', 'contact'], { note: 'Each section on its own page so it can be reordered; merge onto one page with “Move to previous page”.' })
];
export function buildDocPages(t) { return t.seq.map(s => Array.isArray(s) ? makePage(t.docKind, s[0], s[1]) : makePage(t.docKind, s)); }

export function newDocFromTemplate(t, formatId) {
  const now = Date.now();
  if (t.kind === 'doc') {
    const k = DOC_KINDS[t.docKind]; const sz = k.sizes.find(s => s.id === formatId) || k.sizes[0];
    return { id: uid('d'), v: 1, name: t.name, templateId: t.id, kind: 'doc', docKind: t.docKind, formatId: sz.id, w: sz.w, h: sz.h, numbering: { from: 1, style: 'n' }, runHead: '', pages: buildDocPages(t), created: now, updated: now };
  }
  const fid = formatId || t.formats[0], f = FORMATS[fid];
  return { id: uid('d'), v: 1, name: t.name, templateId: t.id, kind: 'graphic', formatId: fid, w: f.w, h: f.h, palette: t.palette, layout: t.layout, content: {}, pages: buildGraphic(t, fid), created: now, updated: now };
}

// Re-layout a graphic for a new format / palette / layout, keeping text content and user-added elements.
export function relayoutGraphic(doc, t, { formatId, palette, layout }) {
  const fid = formatId || doc.formatId, f = FORMATS[fid];
  const content = contentOf(doc);
  const pages = buildGraphic(t, fid, palette || doc.palette, layout || doc.layout, content);
  const sx = f.w / doc.w, sy = f.h / doc.h, ss = Math.min(sx, sy);
  doc.pages.forEach((p, i) => {
    const extra = p.elements.filter(e => !e.slot && e.user);
    if (!pages[i]) { if (p.user) pages[i] = p; return; }
    extra.forEach(e => { e.x *= sx; e.y *= sy; e.w *= ss; e.h *= ss; if (e.size) e.size *= ss; pages[i].elements.push(e); });
    pages[i].id = p.id;
  });
  doc.pages.slice(pages.length).forEach(p => p.user && pages.push(p));
  return { ...doc, formatId: fid, w: f.w, h: f.h, palette: palette || doc.palette, layout: layout || doc.layout, pages, updated: Date.now() };
}

export function colorHex(c) { return resolveColor(c); }
