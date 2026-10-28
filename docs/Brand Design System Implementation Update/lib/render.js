// View-model builder for rendering a page (editor canvas, thumbnails, exports).
// Pure: (doc, pageIndex, options) -> plain objects consumed by "Nnoo Page.dc.html".
import { resolveColor, LOGO_FILE } from './tokens.js';

const FAM = { display: '"Outfit", system-ui, sans-serif', body: '"DM Sans", system-ui, sans-serif', archive: '"Fraunces", Georgia, serif', mono: 'ui-monospace, Menlo, monospace' };
const C = resolveColor;
const SERIES = ['#c85a26', '#d9a019', '#6d2c4f', '#2e5d3a', '#e17f47', '#a8678a', '#6f9778'];
const TONES = { brand: ['#fbe4d4', '#c85a26', '#873818'], archival: ['#f3ead8', '#2e5d3a', '#153a1f'], accent: ['#fae9b8', '#d9a019', '#684809'], community: ['#ebd9e3', '#6d2c4f', '#421630'], ink: ['#2a1f15', '#eebb3a', '#faf5ec'] };
const initials = n => String(n || '').replace(/[\[\]]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase() || '·';
const alpha = (hex, a) => { const h = C(hex).replace('#', ''); if (h.length < 6) return hex; return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`; };
const isDark = hex => { const h = C(hex).replace('#', ''); if (h.length < 6) return false; const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16); return (r * 299 + g * 587 + b * 114) / 1000 < 128; };

export function pageView(doc, pi, o = {}) {
  const p = doc.pages[pi]; const W = doc.w, H = p.h || doc.h; const z = o.zoom || 1;
  const free = p.layout === 'free'; const dark = isDark(p.bg || 'bone');
  const fg = dark ? '#faf5ec' : '#1a120b', muted = dark ? '#e3d6c2' : '#3d2e1f', line = dark ? 'rgba(250,245,236,0.22)' : '#d9cfbd';
  const sel = o.sel, ui = o.interactive && !o.exporting, hd = o.handlers || {};
  const pad = p.pad || [0, 0, 0, 0];
  const v = {
    pid: p.id, idx: pi,
    outerStyle: { width: W * z + 'px', height: H * z + 'px', position: 'relative', flex: 'none', boxShadow: o.thumb ? '0 1px 3px rgba(58,24,9,.12)' : '0 6px 18px rgba(58,24,9,.14)', borderRadius: o.thumb ? '4px' : '2px', overflow: 'hidden', outline: o.pageSelected && ui ? Math.max(2, 2) + 'px solid #c85a26' : 'none', outlineOffset: '3px' },
    rootStyle: { width: W + 'px', height: H + 'px', position: 'absolute', left: 0, top: 0, transform: `scale(${z})`, transformOrigin: '0 0', background: C(p.bg || 'bone'), overflow: 'hidden', fontFamily: FAM.body, color: fg, WebkitFontSmoothing: 'antialiased', textRendering: 'optimizeLegibility' },
    contStyle: free ? { position: 'absolute', inset: 0 } : { position: 'absolute', inset: 0, padding: pad.map(x => x + 'px').join(' '), display: 'flex', flexDirection: 'column', justifyContent: { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' }[p.justify || 'start'], boxSizing: 'border-box' },
    pageDown: hd.pageDown ? e => hd.pageDown(e, pi) : undefined,
    hasBgImage: !!p.bgImage, bgStyle: p.bgImage ? { position: 'absolute', inset: 0, backgroundImage: `url("${p.bgImage}")`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: p.bgOpacity != null ? p.bgOpacity : 1 } : null,
    els: []
  };
  const num = o.nums ? o.nums[pi] : null;
  const fmt = (doc.numbering && doc.numbering.style) || 'n';
  v.hasNum = !free && p.showNum && num != null;
  v.numText = fmt === 'page' ? 'Page ' + num : fmt === 'of' ? num + ' / ' + (o.nums.filter(n => n != null).length) : String(num);
  const fs = Math.max(8, Math.round((pad[2] || 48) * 0.18));
  v.numStyle = { position: 'absolute', left: pad[3] + 'px', right: pad[1] + 'px', bottom: Math.round((pad[2] || 48) * 0.42) + 'px', textAlign: (doc.numbering && doc.numbering.align) || 'center', fontFamily: FAM.body, fontSize: fs + 'px', color: dark ? '#d9cfbd' : '#6b5945', letterSpacing: '0.04em' };
  const head = p.runHead === '' ? '' : (p.runHead || '');
  v.hasHead = !free && !!head && p.showNum !== false;
  v.headText = (doc.runHead ? doc.runHead + '  ·  ' : '') + head;
  v.headStyle = { position: 'absolute', left: pad[3] + 'px', right: pad[1] + 'px', top: Math.round((pad[0] || 48) * 0.4) + 'px', fontFamily: FAM.body, fontSize: fs + 'px', textTransform: 'uppercase', letterSpacing: '0.12em', color: dark ? '#d9cfbd' : '#6b5945', textAlign: 'center' };

  p.elements.forEach((e, ei) => {
    if (e.hidden) return;
    const isSel = ui && sel === e.id;
    const x = { id: e.id, editing: o.editing === e.id };
    const base = { boxSizing: 'border-box', opacity: e.opacity != null ? e.opacity : 1 };
    if (free) Object.assign(base, { position: 'absolute', left: e.x + 'px', top: e.y + 'px', width: e.w + 'px', height: (e.h || 10) + 'px', transform: e.rot ? `rotate(${e.rot}deg)` : undefined });
    else Object.assign(base, { position: 'relative', marginTop: e.push ? 'auto' : (e.mt || 0) + 'px', flex: 'none', maxWidth: '100%', width: e.w ? e.w + 'px' : (e.type === 'button' || e.type === 'logo') ? 'auto' : '100%', alignSelf: { left: 'flex-start', center: 'center', right: 'flex-end', justify: 'stretch' }[e.type === 'text' ? 'left' : (e.align || 'left')] || 'flex-start', height: e.type === 'image' || e.type === 'spacer' || (e.type === 'shape') || e.type === 'logo' ? undefined : undefined });
    if (ui) { base.cursor = free && !x.editing ? 'move' : 'default'; base.outline = isSel ? `${2 / z}px solid #c85a26` : 'none'; base.outlineOffset = `${1 / z}px`; }
    x.wrap = base;
    if (ui) { x.down = ev => hd.down && hd.down(ev, e, pi); x.dbl = ev => hd.dbl && hd.dbl(ev, e, pi); x.blur = ev => hd.blur && hd.blur(ev, e, pi); }
    x.showHandles = isSel && free && !x.editing;
    if (x.showHandles) { const hs = 12 / z; x.handles = [['se', '100%', '100%', 'nwse-resize'], ['e', '100%', '50%', 'ew-resize'], ['s', '50%', '100%', 'ns-resize'], ['sw', '0%', '100%', 'nesw-resize'], ['ne', '100%', '0%', 'nesw-resize'], ['nw', '0%', '0%', 'nwse-resize']].map(([dir, l, t, cur]) => ({ dir, down: ev => hd.handle && hd.handle(ev, e, pi, dir), st: { position: 'absolute', left: `calc(${l} - ${hs / 2}px)`, top: `calc(${t} - ${hs / 2}px)`, width: hs + 'px', height: hs + 'px', background: '#ffffff', border: `${1.5 / z}px solid #c85a26`, borderRadius: '50%', cursor: cur, zIndex: 5, touchAction: 'none' } })); } else x.handles = [];

    const t = e.type;
    if (t === 'text') {
      x.isText = true; x.isList = !!e.list && !x.editing; x.isPlain = !x.isList;
      const st = { fontFamily: FAM[e.font] || FAM.body, fontSize: e.size + 'px', fontWeight: e.weight, color: C(e.color), textAlign: e.align, lineHeight: e.lh, letterSpacing: (e.ls || 0) + 'em', textTransform: e.upper ? 'uppercase' : 'none', fontStyle: e.italic ? 'italic' : 'normal', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', hyphens: e.align === 'justify' ? 'auto' : 'manual', textWrap: e.role === 'title' || e.role === 'h1' || e.role === 'h2' ? 'balance' : 'pretty', background: e.bg ? C(e.bg) : 'transparent', padding: (e.pad || 0) + 'px', borderRadius: (e.radius || 0) + 'px', outline: 'none', boxSizing: 'border-box', fontOpticalSizing: 'auto', textDecoration: e.underline ? 'underline' : 'none' };
      if (e.borderL) { st.borderLeft = `${Math.max(3, e.size * 0.18)}px solid ${C(e.borderL)}`; st.paddingLeft = (e.pad || e.size) + 'px'; }
      if (free) { st.height = '100%'; st.display = 'flex'; st.flexDirection = 'column'; st.justifyContent = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }[e.valign || 'top']; }
      if (x.editing) { st.cursor = 'text'; st.boxShadow = 'inset 0 0 0 9999px rgba(200,90,38,0.06)'; st.display = 'block'; }
      x.textStyle = st; x.text = e.text;
      if (x.isList) x.lines = String(e.text).split('\n').filter(l => l.trim()).map((l, i) => ({ text: l, marker: e.list === 'number' ? (i + 1) + '.' : '•', st: { display: 'flex', gap: e.size * 0.6 + 'px', marginTop: i ? e.size * 0.35 + 'px' : 0 }, mSt: { flex: 'none', minWidth: e.size * (e.list === 'number' ? 1.3 : 0.7) + 'px', color: C(e.markerColor || (dark ? 'clay-300' : 'clay-500')), fontWeight: 700, fontFamily: e.list === 'number' ? FAM.display : 'inherit' } }));
    } else if (t === 'button') {
      x.isButton = true; x.text = e.text;
      x.btnStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: free ? '100%' : 'auto', height: free ? '100%' : 'auto', padding: free ? '0' : `${e.size * 0.75}px ${e.size * (e.padX || 1.1)}px`, background: C(e.fill), color: C(e.color), fontFamily: FAM.display, fontWeight: e.weight || 600, fontSize: e.size + 'px', borderRadius: (e.radius || 0) + 'px', boxSizing: 'border-box', whiteSpace: 'nowrap', letterSpacing: '-0.005em', border: e.stroke ? `2px solid ${C(e.stroke)}` : 'none' };
    } else if (t === 'shape') {
      if (e.shape === 'motif') {
        x.isMotif = true; x.stroke = C(e.stroke || e.fill || 'clay-300'); x.sw = (e.strokeW || 4) * 80 / Math.max(1, e.w); x.svgStyle = { width: '100%', height: '100%', overflow: 'visible', display: 'block' };
      } else if (e.shape === 'arc-top' || e.shape === 'arc-bottom') {
        x.isArc = true; const w = e.w, h = e.h, sw = e.strokeW || 2, i = sw / 2 + 1;
        x.vb = `0 0 ${w} ${h}`; x.d = e.shape === 'arc-top' ? `M ${i} ${h - i} Q ${w / 2} ${-h + i * 2} ${w - i} ${h - i}` : `M ${i} ${i} Q ${w / 2} ${h * 2 - i * 2} ${w - i} ${i}`;
        x.stroke = C(e.stroke || e.fill); x.sw = sw; x.svgStyle = { width: '100%', height: '100%', overflow: 'visible', display: 'block' };
      } else {
        x.isShape = true;
        x.shapeStyle = { width: '100%', height: (free ? '100%' : (e.h || 2) + 'px'), background: e.fill ? C(e.fill) : 'transparent', borderRadius: e.shape === 'ellipse' ? '50%' : (e.radius || 0) + 'px', border: e.stroke ? `${e.strokeW || 1}px solid ${C(e.stroke)}` : 'none', boxSizing: 'border-box' };
        if (!free && e.shape === 'line') x.shapeStyle.width = e.w ? e.w + 'px' : '100%';
      }
    } else if (t === 'image') {
      x.isImage = true; x.isTile = e.fit === 'tile'; x.hasImg = !x.isTile;
      x.boxStyle = { position: 'relative', width: '100%', height: free ? '100%' : (e.h || 200) + 'px', overflow: 'hidden', borderRadius: (e.radius >= 999 ? '50%' : (e.radius || 0) + 'px'), background: x.isTile ? 'transparent' : '#e8dfc9' };
      x.imgStyle = { width: '100%', height: '100%', objectFit: e.fit === 'contain' ? 'contain' : 'cover', objectPosition: e.pos || 'center', display: 'block', filter: e.filter || 'none' };
      x.tileStyle = { position: 'absolute', inset: 0, backgroundImage: `url("${e.src}")`, backgroundRepeat: 'repeat', backgroundSize: (e.tile || 40) + 'px' };
      x.src = e.src; x.alt = e.alt || e.caption || '';
      x.hasOverlay = !!e.overlay && e.overlayOpacity > 0;
      x.overlayStyle = { position: 'absolute', inset: 0, background: e.overlayGradient === false ? alpha(e.overlay || 'ink-900', e.overlayOpacity) : `linear-gradient(180deg, ${alpha(e.overlay || 'ink-900', e.overlayOpacity * 0.35)} 0%, ${alpha(e.overlay || 'ink-900', Math.min(1, e.overlayOpacity * 1.6))} 100%)` };
      x.hasCaption = !free && !!e.caption; x.caption = e.caption;
      x.capStyle = { fontFamily: FAM.body, fontSize: Math.max(9, (doc.w / 60)) + 'px', color: dark ? '#d9cfbd' : '#6b5945', marginTop: '0.6em', lineHeight: 1.45 };
    } else if (t === 'logo') {
      x.isLogo = true; x.src = LOGO_FILE[e.variant] || LOGO_FILE['mark-clay'];
      x.logoStyle = { width: free ? '100%' : (e.w || 48) + 'px', height: free ? '100%' : (e.h || 48) + 'px', objectFit: 'contain', objectPosition: free ? 'left center' : 'left', display: 'block' };
      if (!free && e.align === 'center') x.logoStyle.objectPosition = 'center';
    } else if (t === 'table') {
      x.isTable = true; const s = e.size || 12; const hdr = e.header !== false;
      x.tableStyle = { width: '100%', borderCollapse: 'collapse', fontFamily: FAM.body, fontSize: s + 'px', color: fg, lineHeight: 1.4 };
      x.rows = (e.items || []).map((r, ri) => ({ cells: r.map((c, ci) => ({ t: c, st: { padding: `${s * 0.6}px ${s * 0.75}px`, textAlign: 'left', verticalAlign: 'top', borderBottom: `1px solid ${line}`, fontFamily: ri === 0 && hdr ? FAM.display : (ci === 0 && !hdr ? FAM.display : FAM.body), fontWeight: (ri === 0 && hdr) || (ci === 0 && !hdr) ? 600 : 400, background: ri === 0 && hdr ? (dark ? 'rgba(250,245,236,0.08)' : '#f3ead8') : 'transparent', color: ri === 0 && hdr ? fg : muted, width: !hdr && ci === 0 ? '32%' : 'auto' } })) }));
    } else if (t === 'chart') {
      x.isChart = true; const s = e.size || 12; const items = e.items || []; const max = Math.max(1, ...items.map(d => Number(d.value) || 0));
      x.chartTitle = e.title || ''; x.hasTitle = !!e.title;
      x.titleStyle = { fontFamily: FAM.display, fontWeight: 600, fontSize: s * 1.15 + 'px', color: fg, marginBottom: s + 'px' };
      const col = C(e.color || 'clay-500');
      x.isBar = e.chart === 'bar' || !e.chart; x.isHbar = e.chart === 'hbar'; x.isDonut = e.chart === 'donut';
      const ch = e.h || 240;
      x.barsStyle = { display: 'flex', alignItems: 'flex-end', gap: s * 1.2 + 'px', height: ch + 'px', borderBottom: `1px solid ${line}`, paddingTop: s * 1.6 + 'px', boxSizing: 'border-box' };
      x.bars = items.map(d => ({ label: d.label, value: d.value + (e.unit || ''), colSt: { flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: s * 0.3 + 'px' }, barSt: { width: '100%', height: Math.max(1, (Number(d.value) || 0) / max * (ch - s * 4)) + 'px', background: col, borderRadius: `${s * 0.4}px ${s * 0.4}px 0 0` }, valSt: { fontFamily: FAM.display, fontWeight: 600, fontSize: s + 'px', color: fg } }));
      x.labelsStyle = { display: 'flex', gap: s * 1.2 + 'px', marginTop: s * 0.5 + 'px' };
      x.labels = items.map(d => ({ label: d.label, st: { flex: 1, textAlign: 'center', fontSize: s * 0.9 + 'px', color: muted, fontFamily: FAM.body } }));
      x.hbars = items.map(d => ({ label: d.label, value: d.value + (e.unit || ''), rowSt: { display: 'grid', gridTemplateColumns: '28% 1fr auto', alignItems: 'center', gap: s * 0.8 + 'px', marginTop: s * 0.6 + 'px' }, lSt: { fontSize: s + 'px', color: muted }, trackSt: { height: s * 1.4 + 'px', background: dark ? 'rgba(250,245,236,0.1)' : '#e8dfc9', borderRadius: s + 'px', overflow: 'hidden' }, fillSt: { width: (Number(d.value) || 0) / max * 100 + '%', height: '100%', background: col, borderRadius: s + 'px' }, vSt: { fontFamily: FAM.display, fontWeight: 600, fontSize: s + 'px', color: fg, minWidth: s * 2.5 + 'px', textAlign: 'right' } }));
      const tot = items.reduce((a, d) => a + (Number(d.value) || 0), 0) || 1; let acc = 0;
      const stops = items.map((d, i) => { const a = acc; acc += (Number(d.value) || 0) / tot * 360; return `${SERIES[i % SERIES.length]} ${a}deg ${acc}deg`; }).join(', ');
      const dd = Math.min(ch, 600);
      x.donutWrap = { display: 'flex', alignItems: 'center', gap: s * 2 + 'px' };
      x.donutStyle = { width: dd + 'px', height: dd + 'px', borderRadius: '50%', background: `conic-gradient(${stops || '#e8dfc9 0deg 360deg'})`, flex: 'none', WebkitMask: `radial-gradient(circle, transparent ${dd * 0.29}px, #000 ${dd * 0.3}px)`, mask: `radial-gradient(circle, transparent ${dd * 0.29}px, #000 ${dd * 0.3}px)` };
      x.legend = items.map((d, i) => ({ label: d.label, value: Math.round((Number(d.value) || 0) / tot * 100) + '%', rowSt: { display: 'flex', alignItems: 'center', gap: s * 0.6 + 'px', fontSize: s + 'px', color: muted, marginTop: i ? s * 0.5 + 'px' : 0 }, dotSt: { width: s * 0.9 + 'px', height: s * 0.9 + 'px', borderRadius: '50%', background: SERIES[i % SERIES.length], flex: 'none' }, vSt: { fontFamily: FAM.display, fontWeight: 600, color: fg } }));
    } else if (t === 'stats') {
      x.isStats = true; const s = e.size || 40; const cols = e.cols || Math.min(3, (e.items || []).length || 1);
      x.gridStyle = { display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: `${s * 0.5}px ${s * 0.6}px` };
      x.stats = (e.items || []).map(it => ({ value: it.value, label: it.label, vSt: { fontFamily: FAM.display, fontWeight: 800, fontSize: s + 'px', lineHeight: 1, letterSpacing: '-0.03em', color: C(e.accent || 'clay-500') }, lSt: { fontFamily: FAM.body, fontSize: Math.max(9, s * 0.3) + 'px', color: muted, marginTop: s * 0.18 + 'px', lineHeight: 1.35 }, cellSt: { borderTop: `2px solid ${line}`, paddingTop: s * 0.3 + 'px' } }));
    } else if (t === 'columns') {
      x.isCols = true; const s = e.size || 14; const cols = Math.max(1, e.cols || (e.items || []).length || 1);
      x.gridStyle = { display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: s * 1.2 + 'px' };
      x.cols = (e.items || []).map(it => ({ title: it.title, meta: it.meta || '', hasMeta: !!it.meta, body: it.body || '', cardSt: e.boxed ? { background: dark ? 'rgba(250,245,236,0.07)' : '#ffffff', border: `1px solid ${line}`, borderRadius: s * 0.9 + 'px', padding: s * 1.3 + 'px', boxShadow: dark ? 'none' : '0 2px 6px rgba(58,24,9,0.08)' } : { borderTop: `2px solid ${C(e.accent || (dark ? 'clay-300' : 'clay-500'))}`, paddingTop: s * 0.8 + 'px' }, tSt: { fontFamily: FAM.display, fontWeight: 600, fontSize: s * 1.15 + 'px', color: fg, lineHeight: 1.25 }, mSt: { fontFamily: FAM.display, fontWeight: 700, fontSize: s * 1.6 + 'px', color: C(dark ? 'clay-300' : 'clay-500'), marginTop: s * 0.3 + 'px' }, bSt: { fontSize: s * 0.95 + 'px', color: muted, marginTop: s * 0.4 + 'px', lineHeight: 1.5, whiteSpace: 'pre-wrap' } }));
    } else if (t === 'entries') {
      x.isEntries = true; const s = e.size || 12;
      x.entries = (e.items || []).map((it, i) => ({ title: it.title, org: it.org || '', date: it.date || '', bullets: String(it.body || '').split('\n').filter(Boolean).map(b => ({ b, st: { display: 'flex', gap: s * 0.5 + 'px', marginTop: s * 0.2 + 'px' }, mSt: { color: C('clay-500'), flex: 'none' } })), rowSt: { marginTop: i ? s * 1.1 + 'px' : 0 }, headSt: { display: 'flex', justifyContent: 'space-between', gap: s + 'px', alignItems: 'baseline' }, tSt: { fontFamily: FAM.display, fontWeight: 600, fontSize: s * 1.15 + 'px', color: fg }, dSt: { fontSize: s * 0.9 + 'px', color: muted, whiteSpace: 'nowrap', fontWeight: 500 }, oSt: { fontSize: s + 'px', color: C(dark ? 'clay-300' : 'clay-600'), fontWeight: 600, marginTop: s * 0.1 + 'px' }, bSt: { fontSize: s + 'px', color: muted, lineHeight: 1.5 } }));
    } else if (t === 'timeline') {
      x.isTimeline = true; const s = e.size || 13; const hz = !!e.horizontal; const acc = C(e.accent || 'clay-500');
      x.tlStyle = hz ? { display: 'grid', gridTemplateColumns: `repeat(${(e.items || []).length || 1}, minmax(0, 1fr))`, gap: s * 1.2 + 'px' } : { display: 'flex', flexDirection: 'column' };
      x.tl = (e.items || []).map((it, i, arr) => ({ label: it.label, title: it.title, body: it.body || '', itemSt: hz ? { borderTop: `${Math.max(2, s * 0.14)}px solid ${acc}`, paddingTop: s * 0.9 + 'px', position: 'relative' } : { display: 'grid', gridTemplateColumns: `${s * 1.2}px 1fr`, gap: s + 'px', paddingBottom: i < arr.length - 1 ? s * 1.1 + 'px' : 0, position: 'relative' }, dotSt: hz ? { position: 'absolute', top: -s * 0.55 + 'px', left: 0, width: s * 0.9 + 'px', height: s * 0.9 + 'px', borderRadius: '50%', background: acc } : { width: s * 0.9 + 'px', height: s * 0.9 + 'px', borderRadius: '50%', background: acc, marginTop: s * 0.3 + 'px', boxShadow: `0 0 0 ${s * 0.25}px ${alpha(acc, 0.2)}` }, lSt: { fontSize: s * 0.8 + 'px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: acc }, tSt: { fontFamily: FAM.display, fontWeight: 600, fontSize: s * 1.15 + 'px', color: fg, marginTop: s * 0.2 + 'px' }, bSt: { fontSize: s * 0.95 + 'px', color: muted, marginTop: s * 0.2 + 'px', lineHeight: 1.45 } }));
    } else if (t === 'people') {
      x.isPeople = true; const s = e.size || 13; const cols = e.cols || Math.min(4, (e.items || []).length || 1);
      x.gridStyle = { display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: s * 1.4 + 'px' };
      const one = (e.items || []).length === 1;
      x.people = (e.items || []).map(it => ({ name: it.name, role: it.role || '', body: it.body || '', hasBody: !!it.body, ini: initials(it.name), hasImg: !!it.src, src: it.src || '', cardSt: one ? { display: 'flex', gap: s * 1.2 + 'px', alignItems: 'center' } : { display: 'flex', flexDirection: 'column', gap: s * 0.7 + 'px' }, avSt: { width: s * 4.4 + 'px', height: s * 4.4 + 'px', borderRadius: '50%', background: C(e.accent || 'clay-500'), color: '#faf5ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FAM.display, fontWeight: 700, fontSize: s * 1.5 + 'px', flex: 'none', overflow: 'hidden' }, imgSt: { width: '100%', height: '100%', objectFit: 'cover' }, nSt: { fontFamily: FAM.display, fontWeight: 600, fontSize: s * 1.15 + 'px', color: fg }, rSt: { fontSize: s * 0.9 + 'px', color: C(dark ? 'clay-300' : 'clay-600'), fontWeight: 600 }, bSt: { fontSize: s * 0.95 + 'px', color: muted, marginTop: s * 0.3 + 'px', lineHeight: 1.45 } }));
    } else if (t === 'tags') {
      x.isTags = true; const s = e.size || 11;
      x.tagsStyle = { display: 'flex', flexWrap: 'wrap', gap: s * 0.5 + 'px' };
      x.tags = (e.items || []).map(tg => ({ t: tg, st: { fontSize: s + 'px', fontWeight: 600, padding: `${s * 0.35}px ${s * 0.9}px`, borderRadius: '999px', background: dark ? 'rgba(250,245,236,0.1)' : '#fbe4d4', color: dark ? '#f5c4a1' : '#873818' } }));
    } else if (t === 'gallery') {
      x.isGallery = true; const n = (e.items || []).length || 1;
      x.gridStyle = { display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gap: Math.max(6, doc.w / 80) + 'px' };
      x.gal = (e.items || []).map(g => ({ src: g.src, caption: g.caption || '', hasCap: !!g.caption, boxSt: { height: (e.h || 200) + 'px', borderRadius: (e.radius || 0) + 'px', overflow: 'hidden', background: '#e8dfc9' }, imgSt: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }, cSt: { fontSize: Math.max(9, doc.w / 70) + 'px', color: muted, marginTop: '0.5em' } }));
    } else if (t === 'toc') {
      x.isToc = true; const s = e.size || 13;
      x.toc = (o.toc || []).map(it => ({ title: it.title, n: it.n == null ? '' : String(it.n), rowSt: { display: 'flex', alignItems: 'baseline', gap: s * 0.6 + 'px', padding: `${s * 0.45}px 0`, borderBottom: `1px dotted ${dark ? 'rgba(250,245,236,0.3)' : '#d6c8ad'}`, fontSize: s + 'px' }, tSt: { flex: 1, color: fg }, nSt: { fontFamily: FAM.display, fontWeight: 600, color: C(dark ? 'clay-300' : 'clay-600') } }));
      x.tocEmpty = !x.toc.length;
      x.emptySt = { fontSize: s + 'px', color: muted, fontStyle: 'italic' };
    } else if (t === 'callout') {
      x.isCallout = true; const s = e.size || 13; const tone = TONES[e.tone] || TONES.brand; const it = (e.items || [])[0] || { title: '', body: '' };
      x.cTitle = it.title; x.cBody = it.body; x.hasCTitle = !!it.title;
      x.calloutStyle = { background: tone[0], borderLeft: `${Math.max(3, s * 0.3)}px solid ${tone[1]}`, borderRadius: s * 0.8 + 'px', padding: `${s * 1.1}px ${s * 1.3}px`, boxSizing: 'border-box' };
      x.ctSt = { fontFamily: FAM.display, fontWeight: 600, fontSize: s * 1.1 + 'px', color: tone[2], marginBottom: s * 0.3 + 'px' };
      x.cbSt = { fontSize: s + 'px', color: e.tone === 'ink' ? '#faf5ec' : '#3d2e1f', lineHeight: 1.55, whiteSpace: 'pre-wrap' };
    } else if (t === 'pagenum') {
      x.isPagenum = true; x.text = num == null ? String(pi + 1) : String(num);
      x.textStyle = { fontFamily: FAM.body, fontSize: (e.size || 14) + 'px', color: C(e.color || 'ink-500'), textAlign: e.align || 'center', width: '100%' };
    }
    v.els.push(x);
  });
  return v;
}

export function emptyFlags() { return {}; }
