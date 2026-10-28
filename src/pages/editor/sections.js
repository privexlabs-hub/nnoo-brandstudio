// Inspector section/field descriptors (port of the source elementSections / pageSections / docSections).
// Each section: { title, hint, fields: [{ kind, label, value, span, change, ... }] }. `ed` is the Editor instance.
import * as T from '../../lib/templates.js';
import * as TK from '../../lib/tokens.js';
import { SER } from './serializers.js';

const SWATCHES = TK.BRAND_SWATCHES.concat(['transparent']);
export function colorField(label, value, onPick) {
  return {
    kind: 'color', label, value: value || '', span: 2,
    swatches: SWATCHES.map(t => ({ name: t, on: value === t, pick: () => onPick(t === 'transparent' ? null : t), bg: t === 'transparent' ? 'repeating-conic-gradient(#d9cfbd 0 25%, #fff 0 50%) 0 0/10px 10px' : TK.resolveColor(t) })),
    change: v => { v = String(v).trim(); if (!v || /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) || TK.HEX[v]) onPick(v || null); }
  };
}

const LNAME = { text: 'Text', button: 'Button', shape: 'Shape', image: 'Image', logo: 'Logo', table: 'Table', chart: 'Chart', stats: 'Statistics', columns: 'Columns', entries: 'Entries', timeline: 'Timeline', people: 'People', tags: 'Tags', gallery: 'Gallery', toc: 'Table of contents', callout: 'Callout', pagenum: 'Page number' };
const TEXT_ROLES = [['title', 'Title'], ['h1', 'Heading 1'], ['h2', 'Heading 2'], ['h3', 'Heading 3'], ['eyebrow', 'Eyebrow'], ['subtitle', 'Subtitle'], ['lead', 'Lead'], ['body', 'Body'], ['quote', 'Quote'], ['caption', 'Caption'], ['meta', 'Metadata'], ['label', 'Label'], ['stat', 'Statistic']];

export function elementSections(ed, f) {
  const e = f.el, free = f.page.layout === 'free', FS = [], d = ed.doc();
  const setEl = (p, k) => ed.setEl(p, k);
  const set = (k, key) => ev => { const v = ev && ev.target ? ev.target.value : ev; setEl({ [k]: v }, key || k); };
  const num = (k, key, mul = 1) => ev => { const v = parseFloat(ev.target.value); if (!isNaN(v)) setEl({ [k]: v * mul }, key || k); };
  const seg = (label, k, opts, val) => ({ kind: 'seg', label, span: 2, options: opts.map(([v, l]) => ({ l, on: val === v, pick: () => setEl({ [k]: v }) })) });
  const focus = () => ed.pushHist();
  const content = [];
  if (e.type === 'text') {
    content.push({ kind: 'area', label: 'Text', value: e.text, rows: Math.min(10, Math.max(3, String(e.text).split('\n').length + 1)), span: 2, change: ev => setEl({ text: ev.target.value }, 'text') });
    content.push({ kind: 'actions', span: 2, actions: [{ label: 'Edit text on canvas', run: () => ed.startEditing(e.id, { toCanvas: true }) }] });
    content.push({ kind: 'select', label: 'Style', value: e.role || 'body', span: 2, options: TEXT_ROLES.map(([v, l]) => ({ v, l })), change: ev => setEl({ role: ev.target.value }) });
    if (ed.state.overflow[e.id]) content.push({ kind: 'note', text: 'This text is taller than its box.', warn: true, span: 2 }, { kind: 'actions', span: 2, actions: [{ label: 'Fit box to text', run: () => ed.fitText() }] });
  } else if (e.type === 'button') content.push({ kind: 'text', label: 'Label', value: e.text, span: 2, change: set('text', 'text'), focus });
  else if (e.type === 'image') {
    content.push({ kind: 'file', text: 'Upload / replace image', accept: 'image/*', span: 2, change: ev => ed.upload(ev, src => setEl({ src })) });
    content.push({ kind: 'select', label: 'Brand image', value: Object.values(T.IMG).includes(e.src) ? e.src : '', span: 2, options: [{ v: '', l: 'Custom image' }, { v: T.IMG.warm, l: 'Placeholder — warm' }, { v: T.IMG.cool, l: 'Placeholder — cool' }, { v: T.IMG.pattern, l: 'Rhythm pattern' }, { v: T.IMG.wave, l: 'Waveform' }], change: ev => ev.target.value && setEl({ src: ev.target.value }) });
    content.push({ kind: 'text', label: 'Alt text', value: e.alt || '', span: 2, change: set('alt', 'alt'), focus, ph: 'Describe the image' });
    if (!free) content.push({ kind: 'text', label: 'Caption', value: e.caption || '', span: 2, change: set('caption', 'caption'), focus });
    content.push({ kind: 'select', label: 'Fit', value: e.fit || 'cover', options: [{ v: 'cover', l: 'Fill (crop)' }, { v: 'contain', l: 'Fit (no crop)' }, { v: 'tile', l: 'Tile' }], change: set('fit') });
    content.push({ kind: 'select', label: 'Focal point', value: e.pos || 'center', options: ['center', 'top', 'bottom', 'left', 'right'].map(v => ({ v, l: v[0].toUpperCase() + v.slice(1) })), change: set('pos') });
    if (!free) content.push({ kind: 'number', label: 'Height (px)', value: Math.round(e.h || 200), step: 10, change: num('h') });
    content.push(colorField('Overlay colour', e.overlay, v => setEl({ overlay: v, overlayOpacity: v ? (e.overlayOpacity || 0.4) : 0 })));
    content.push({ kind: 'range', label: 'Overlay strength', value: e.overlayOpacity || 0, min: 0, max: 0.9, step: 0.05, display: Math.round((e.overlayOpacity || 0) * 100) + '%', span: 2, change: ev => setEl({ overlayOpacity: parseFloat(ev.target.value) }, 'ov'), focus });
    content.push({ kind: 'select', label: 'Treatment', value: e.filter || 'none', span: 2, options: [{ v: 'none', l: 'Original' }, { v: 'sepia(0.25) saturate(1.1)', l: 'Warm' }, { v: 'grayscale(1) contrast(1.05)', l: 'Monochrome' }, { v: 'grayscale(1) sepia(0.45)', l: 'Archival duotone' }], change: set('filter') });
  } else if (e.type === 'logo') content.push({ kind: 'select', label: 'Logo variant', value: e.variant, span: 2, options: TK.LOGOS.map(l => ({ v: l.id, l: l.name })), change: set('variant') });
  else if (e.type === 'callout') {
    const it = e.items[0] || { title: '', body: '' };
    content.push({ kind: 'text', label: 'Title', value: it.title, span: 2, focus, change: ev => setEl({ items: [{ ...it, title: ev.target.value }] }, 'ct') });
    content.push({ kind: 'area', label: 'Body', value: it.body, rows: 4, span: 2, change: ev => setEl({ items: [{ ...it, body: ev.target.value }] }, 'cb') });
    content.push({ kind: 'select', label: 'Tone', value: e.tone || 'brand', span: 2, options: [['brand', 'Brand (clay)'], ['archival', 'Archival (forest)'], ['accent', 'Accent (marigold)'], ['community', 'Community (plum)'], ['ink', 'Ink']].map(([v, l]) => ({ v, l })), change: set('tone') });
  } else if (e.type === 'gallery') {
    content.push({ kind: 'gallery', span: 2, items: e.items.map((g, i) => ({ src: g.src, caption: g.caption || '', change: ev => setEl({ items: e.items.map((x, j) => j === i ? { ...x, caption: ev.target.value } : x) }, 'g' + i), replace: ev => ed.upload(ev, src => setEl({ items: e.items.map((x, j) => j === i ? { ...x, src } : x) })), remove: () => setEl({ items: e.items.filter((x, j) => j !== i) }) })) });
    content.push({ kind: 'file', text: 'Add image', accept: 'image/*', span: 2, change: ev => ed.upload(ev, src => setEl({ items: e.items.concat([{ src, caption: '' }]) })) });
    content.push({ kind: 'number', label: 'Image height', value: Math.round(e.h || 200), step: 10, change: num('h') });
  } else if (e.type === 'toc') content.push({ kind: 'note', text: 'Generated from pages marked “Include in contents”. Page numbers update automatically.', span: 2 });
  else if (SER[e.type]) {
    const [hint, ser, par] = SER[e.type];
    content.push({ kind: 'area', label: 'Data — ' + hint, value: ser(e.items), rows: Math.min(12, Math.max(4, e.items.length + 2)), span: 2, change: ev => setEl({ items: par(ev.target.value) }, 'data') });
    if (e.type === 'chart') {
      content.push({ kind: 'text', label: 'Chart title', value: e.title || '', span: 2, change: set('title', 'title'), focus });
      content.push({ kind: 'select', label: 'Chart type', value: e.chart || 'bar', options: [{ v: 'bar', l: 'Bar' }, { v: 'hbar', l: 'Horizontal bar' }, { v: 'donut', l: 'Donut' }], change: set('chart') });
      content.push({ kind: 'text', label: 'Value suffix', value: e.unit || '', change: set('unit', 'unit'), ph: '% or k', focus });
      content.push({ kind: 'number', label: 'Chart height', value: Math.round(e.h || 240), step: 10, change: num('h') });
      content.push(colorField('Bar colour', e.color, v => setEl({ color: v })));
    }
    if (e.type === 'table') content.push({ kind: 'toggle', text: 'First row is a header', on: e.header !== false, span: 2, toggle: () => setEl({ header: e.header === false }) });
    if (['stats', 'columns', 'people'].includes(e.type)) content.push({ kind: 'number', label: 'Columns', value: e.cols || e.items.length, min: 1, max: 6, step: 1, change: num('cols') });
    if (e.type === 'columns') content.push({ kind: 'toggle', text: 'Show as cards', on: !!e.boxed, span: 2, toggle: () => setEl({ boxed: !e.boxed }) });
    if (e.type === 'timeline') content.push({ kind: 'toggle', text: 'Horizontal', on: !!e.horizontal, span: 2, toggle: () => setEl({ horizontal: !e.horizontal }) });
    if (['stats', 'timeline', 'people'].includes(e.type)) content.push(colorField('Accent', e.accent, v => setEl({ accent: v })));
  }
  FS.push({ title: LNAME[e.type] || e.type, hint: e.slot ? 'Template slot' : (e.user ? 'Added' : ''), fields: content });

  if (e.type === 'text' || e.type === 'button' || e.type === 'pagenum' || ['table', 'chart', 'stats', 'columns', 'entries', 'timeline', 'people', 'tags', 'toc', 'callout'].includes(e.type)) {
    const ty = [];
    if (e.type === 'text') ty.push({ kind: 'select', label: 'Font', value: e.font, options: [{ v: 'display', l: 'Outfit — display' }, { v: 'body', l: 'DM Sans — body' }, { v: 'archive', l: 'Fraunces — archival' }, { v: 'mono', l: 'Mono' }], change: set('font') });
    if (e.type === 'text' || e.type === 'button') ty.push({ kind: 'select', label: 'Weight', value: String(e.weight || 400), options: [400, 500, 600, 700, 800].map(v => ({ v: String(v), l: { 400: 'Regular', 500: 'Medium', 600: 'Semibold', 700: 'Bold', 800: 'Extra bold' }[v] })), change: ev => setEl({ weight: parseInt(ev.target.value, 10) }) });
    ty.push({ kind: 'number', label: 'Size (px)', value: Math.round((e.size || 14) * 10) / 10, step: 0.5, min: 4, change: num('size') });
    if (e.type === 'text') {
      ty.push({ kind: 'number', label: 'Line height', value: e.lh, step: 0.05, min: 0.8, max: 3, change: num('lh') });
      ty.push({ kind: 'number', label: 'Letter spacing (em)', value: e.ls || 0, step: 0.01, min: -0.1, max: 0.4, change: num('ls') });
      ty.push(seg('Alignment', 'align', [['left', 'Left'], ['center', 'Centre'], ['right', 'Right'], ['justify', 'Justify']], e.align));
      if (free) ty.push(seg('Vertical', 'valign', [['top', 'Top'], ['middle', 'Middle'], ['bottom', 'Bottom']], e.valign || 'top'));
      ty.push(seg('List', 'list', [[null, 'None'], ['bullet', 'Bullets'], ['number', 'Numbers']], e.list || null));
      ty.push({ kind: 'toggle', text: 'Uppercase', on: !!e.upper, toggle: () => setEl({ upper: !e.upper }) }, { kind: 'toggle', text: 'Italic', on: !!e.italic, toggle: () => setEl({ italic: !e.italic }) });
      ty.push({ kind: 'toggle', text: 'Underline', on: !!e.underline, toggle: () => setEl({ underline: !e.underline }) });
      ty.push(colorField('Text colour', e.color, v => setEl({ color: v || 'ink-900' })));
      ty.push(colorField('Background', e.bg, v => setEl({ bg: v })));
      ty.push({ kind: 'number', label: 'Padding', value: e.pad || 0, step: 2, min: 0, change: num('pad') }, { kind: 'number', label: 'Corner radius', value: e.radius || 0, step: 2, min: 0, change: num('radius') });
    }
    if (e.type === 'pagenum') ty.push(colorField('Colour', e.color, v => setEl({ color: v })));
    FS.push({ title: 'Typography', fields: ty });
  }
  if (e.type === 'button') FS.push({ title: 'Button style', fields: [colorField('Fill', e.fill, v => setEl({ fill: v || 'clay-500' })), colorField('Label colour', e.color, v => setEl({ color: v || 'bone' })), { kind: 'number', label: 'Corner radius', value: Math.round(e.radius || 0), step: 2, min: 0, change: num('radius') }, ...(free ? [] : [seg('Alignment', 'align', [['left', 'Left'], ['center', 'Centre'], ['right', 'Right']], e.align || 'left')])] });
  if (e.type === 'shape') FS.push({ title: 'Shape', fields: [{ kind: 'select', label: 'Shape', value: e.shape, span: 2, options: [['rect', 'Rectangle'], ['ellipse', 'Ellipse'], ['line', 'Line / rule'], ['arc-top', 'Arc (upper)'], ['arc-bottom', 'Arc (lower)'], ['motif', 'Brand motif'], ['spacer', 'Spacer']].map(([v, l]) => ({ v, l })), change: set('shape') }, colorField('Fill', e.fill, v => setEl({ fill: v })), colorField('Stroke', e.stroke, v => setEl({ stroke: v, strokeW: v ? (e.strokeW || 4) : 0 })), { kind: 'number', label: 'Stroke width', value: e.strokeW || 0, step: 1, min: 0, change: num('strokeW') }, { kind: 'number', label: 'Corner radius', value: e.radius || 0, step: 2, min: 0, change: num('radius') }, ...(free ? [] : [{ kind: 'number', label: 'Height', value: e.h || 2, step: 1, min: 1, change: num('h') }, { kind: 'number', label: 'Width (blank = full)', value: e.w || '', step: 10, change: ev => setEl({ w: ev.target.value ? parseFloat(ev.target.value) : null }) }])] });
  if (e.type === 'image') FS.push({ title: 'Corners', fields: [{ kind: 'number', label: 'Corner radius', value: e.radius >= 999 ? 999 : Math.round(e.radius || 0), step: 2, min: 0, change: num('radius') }, { kind: 'actions', actions: [{ label: 'Circle', run: () => setEl({ radius: 9999 }) }, { label: 'Square', run: () => setEl({ radius: 0 }) }] }] });

  const pos = [];
  if (free) {
    pos.push({ kind: 'number', label: 'X', value: Math.round(e.x), step: 1, change: num('x') }, { kind: 'number', label: 'Y', value: Math.round(e.y), step: 1, change: num('y') }, { kind: 'number', label: 'Width', value: Math.round(e.w), step: 1, min: 1, change: num('w') }, { kind: 'number', label: 'Height', value: Math.round(e.h), step: 1, min: 1, change: num('h') }, { kind: 'number', label: 'Rotation (°)', value: e.rot || 0, step: 1, change: num('rot') });
    const W = d.w, H = f.page.h || d.h;
    pos.push({ kind: 'actions', label: 'Align to page', span: 2, actions: [['Left', { x: 0 }], ['Centre', { x: Math.round((W - e.w) / 2) }], ['Right', { x: W - e.w }], ['Top', { y: 0 }], ['Middle', { y: Math.round((H - e.h) / 2) }], ['Bottom', { y: H - e.h }]].map(([l, p]) => ({ label: l, run: () => setEl(p) })) });
    pos.push({ kind: 'actions', label: 'Arrange', span: 2, actions: [{ label: 'Bring to front', run: () => ed.toFront(e.id, true) }, { label: 'Send to back', run: () => ed.toFront(e.id, false) }, { label: 'Forward', run: () => ed.moveEl(e.id, 1) }, { label: 'Backward', run: () => ed.moveEl(e.id, -1) }] });
  } else {
    pos.push({ kind: 'number', label: 'Space above (px)', value: e.push ? '' : Math.round(e.mt || 0), step: 2, change: ev => { const v = parseFloat(ev.target.value); if (!isNaN(v)) setEl({ mt: v, push: false }, 'mt'); } });
    pos.push({ kind: 'toggle', text: 'Push to bottom', on: !!e.push, toggle: () => setEl({ push: !e.push }) });
    if (e.type !== 'text' && e.type !== 'shape') pos.push(seg('Align', 'align', [['left', 'Left'], ['center', 'Centre'], ['right', 'Right']], e.align || 'left'));
    if (['logo', 'text', 'image', 'table', 'chart'].includes(e.type)) pos.push({ kind: 'number', label: 'Width (blank = auto)', value: e.w ? Math.round(e.w) : '', step: 10, change: ev => setEl({ w: ev.target.value ? parseFloat(ev.target.value) : null, ...(e.type === 'logo' && ev.target.value ? { h: parseFloat(ev.target.value) / (TK.LOGO_RATIO[e.variant] || 1) } : {}) }, 'w') });
    pos.push({ kind: 'actions', label: 'Order', span: 2, actions: [{ label: 'Move up', run: () => ed.moveEl(e.id, -1) }, { label: 'Move down', run: () => ed.moveEl(e.id, 1) }] });
  }
  pos.push({ kind: 'range', label: 'Opacity', value: e.opacity != null ? e.opacity : 1, min: 0.05, max: 1, step: 0.05, display: Math.round((e.opacity != null ? e.opacity : 1) * 100) + '%', span: 2, change: ev => setEl({ opacity: parseFloat(ev.target.value) }, 'op'), focus });
  FS.push({ title: free ? 'Position & size' : 'Spacing & order', fields: pos });
  FS.push({ title: 'Element', fields: [{ kind: 'actions', span: 2, actions: [{ label: 'Duplicate', run: () => ed.dupEl() }, { label: e.hidden ? 'Show' : 'Hide', run: () => setEl({ hidden: !e.hidden }) }, { label: 'Delete', danger: true, run: () => ed.delEl() }] }] });
  return FS;
}

export function pageSections(ed) {
  const d = ed.doc(), i = ed.state.pageIdx, p = d.pages[i], free = p.layout === 'free';
  const sp = (k, key) => ev => ed.setPage({ [k]: ev.target.value }, key || k);
  const focus = () => ed.pushHist();
  const FS = [];
  const pf = [{ kind: 'text', label: 'Page name', value: p.name, span: 2, change: sp('name', 'name'), focus }];
  if (d.kind === 'doc') pf.push({ kind: 'text', label: 'Chapter / section', value: p.section || '', span: 2, change: sp('section', 'section'), focus, ph: 'Groups pages in the navigator' });
  pf.push(colorField('Background', p.bg, v => ed.setPage({ bg: v || 'bone' })));
  pf.push({ kind: 'file', text: p.bgImage ? 'Replace background image' : 'Add background image', accept: 'image/*', span: 2, change: ev => ed.upload(ev, src => ed.setPage({ bgImage: src })) });
  if (p.bgImage) pf.push({ kind: 'range', label: 'Background image opacity', value: p.bgOpacity != null ? p.bgOpacity : 1, min: 0.05, max: 1, step: 0.05, display: Math.round((p.bgOpacity != null ? p.bgOpacity : 1) * 100) + '%', span: 2, change: ev => ed.setPage({ bgOpacity: parseFloat(ev.target.value) }, 'bgo'), focus }, { kind: 'actions', span: 2, actions: [{ label: 'Remove background image', run: () => ed.setPage({ bgImage: null }) }] });
  if (!free) {
    const pad = p.pad || [0, 0, 0, 0];
    const setPad = j => ev => { const v = parseFloat(ev.target.value); if (isNaN(v)) return; const np = pad.slice(); np[j] = v; ed.setPage({ pad: np }, 'pad' + j); };
    pf.push({ kind: 'number', label: 'Margin top', value: pad[0], step: 4, min: 0, change: setPad(0) }, { kind: 'number', label: 'Margin bottom', value: pad[2], step: 4, min: 0, change: setPad(2) }, { kind: 'number', label: 'Margin left', value: pad[3], step: 4, min: 0, change: setPad(3) }, { kind: 'number', label: 'Margin right', value: pad[1], step: 4, min: 0, change: setPad(1) });
    pf.push({ kind: 'seg', label: 'Vertical distribution', span: 2, options: [['start', 'Top'], ['center', 'Centre'], ['end', 'Bottom'], ['between', 'Spread']].map(([v, l]) => ({ l, on: (p.justify || 'start') === v, pick: () => ed.setPage({ justify: v }) })) });
    if (d.kind === 'doc' && T.DOC_KINDS[d.docKind].continuous) pf.push({ kind: 'number', label: 'Section height (px)', value: p.h || d.h, step: 10, min: 60, span: 2, change: ev => { const v = parseFloat(ev.target.value); if (!isNaN(v)) ed.setPage({ h: v }, 'h'); } });
    if (d.kind === 'doc') {
      pf.push({ kind: 'toggle', text: 'Show page number', on: !!p.showNum, span: 2, toggle: () => ed.setPage({ showNum: !p.showNum }) });
      pf.push({ kind: 'text', label: 'Running head', value: p.runHead || '', span: 2, change: sp('runHead', 'rh'), focus, ph: 'Shown at the top of the page' });
      pf.push({ kind: 'toggle', text: 'Include in contents', on: !!p.toc, span: 2, toggle: () => ed.setPage({ toc: !p.toc, tocTitle: p.tocTitle || p.name }) });
      if (p.toc) pf.push({ kind: 'text', label: 'Contents entry', value: p.tocTitle || p.name, span: 2, change: sp('tocTitle', 'tt'), focus });
    }
  }
  pf.push({ kind: 'actions', label: 'Layout mode', span: 2, actions: [{ label: free ? 'Convert to flowing layout' : 'Convert to free layout', title: free ? 'Stack elements top to bottom' : 'Position elements freely', run: () => ed.convertLayout(i) }] });
  FS.push({ title: 'Page ' + (i + 1) + ' of ' + d.pages.length, hint: free ? 'Free layout' : 'Flowing layout', fields: pf });
  FS.push({ title: 'Elements', hint: free ? 'Top of list = back' : 'Reading order', fields: [
    { kind: 'actions', span: 2, actions: [{ label: '+ Add element', primary: true, run: () => ed.setState({ add: { type: 'element' } }) }] },
    { kind: 'layers', span: 2, noLayers: !p.elements.length, layers: p.elements.map(e => ({ id: e.id, type: e.type, hidden: !!e.hidden, on: ed.state.sel === e.id, name: e.name || (e.text ? String(e.text).slice(0, 40) : e.variant || e.shape || (e.items && e.items[0] && (e.items[0].title || e.items[0].label || e.items[0].name)) || e.type), up: () => ed.moveEl(e.id, -1), down: () => ed.moveEl(e.id, 1), vis: () => ed.commit(doc => { const f = ed.find(doc, e.id); f.el.hidden = !f.el.hidden; }), visIcon: e.hidden ? '◌' : '●', visLabel: e.hidden ? 'Show element' : 'Hide element', select: () => ed.setState({ sel: e.id, tab: 'element' }) })) }
  ] });
  FS.push({ title: 'Page actions', fields: [{ kind: 'actions', span: 2, actions: [{ label: 'Insert before', run: () => ed.setState({ add: { type: 'page', at: i } }) }, { label: 'Insert after', run: () => ed.setState({ add: { type: 'page', at: i + 1 } }) }, { label: 'Duplicate', run: () => ed.dupPage(i) }, { label: 'Move up', disabled: i === 0, run: () => ed.movePage(i, i - 1) }, { label: 'Move down', disabled: i === d.pages.length - 1, run: () => ed.movePage(i, i + 1) }, { label: 'Delete page', danger: true, disabled: d.pages.length < 2, run: () => ed.delPage(i) }] }] });
  return FS;
}

export function docSections(ed) {
  const d = ed.doc(), t = ed.template(), FS = [];
  const df = [{ kind: 'text', label: 'Document name', value: d.name, span: 2, change: ev => ed.setDoc({ name: ev.target.value }, 'name'), focus: () => ed.pushHist() }];
  if (d.kind === 'graphic' && t) {
    df.push({ kind: 'select', label: 'Size / channel', value: d.formatId, span: 2, options: t.formats.map(id => ({ v: id, l: T.FORMATS[id].label + ' — ' + T.FORMATS[id].w + ' × ' + T.FORMATS[id].h })), change: ev => ed.relayout({ formatId: ev.target.value }) });
    if (!t.avatar) {
      df.push({ kind: 'select', label: 'Colour variant', value: d.palette, span: 2, options: Object.entries(T.PAL).map(([v, p]) => ({ v, l: p.name })), change: ev => ed.relayout({ palette: ev.target.value }) });
      if (!t.pages) df.push({ kind: 'select', label: 'Layout', value: d.layout, span: 2, options: Object.entries(T.LAYOUTS).filter(([k]) => k !== 'slide').map(([v, l]) => ({ v, l: l.name })), change: ev => ed.relayout({ layout: ev.target.value }) });
      df.push({ kind: 'note', text: 'Changing size, colour or layout re-flows the template. Your text and images are kept; hand-positioned template elements return to the layout.', span: 2 });
    }
  } else if (d.kind === 'doc') {
    const k = T.DOC_KINDS[d.docKind];
    df.push({ kind: 'select', label: 'Page size', value: d.formatId, span: 2, options: k.sizes.map(s => ({ v: s.id, l: s.label })), change: ev => { const s = k.sizes.find(x => x.id === ev.target.value); ed.commit(doc => { doc.formatId = s.id; doc.w = s.w; doc.h = s.h; }, { after: () => ed.center(ed.state.pageIdx) }); } });
    df.push({ kind: 'number', label: 'Numbering starts at page', value: (d.numbering && d.numbering.from) || 1, step: 1, min: 1, change: ev => { const v = parseInt(ev.target.value, 10); if (v > 0) ed.setDoc({ numbering: { ...(d.numbering || {}), from: v } }, 'nf'); } });
    df.push({ kind: 'select', label: 'Number style', value: (d.numbering && d.numbering.style) || 'n', options: [{ v: 'n', l: '12' }, { v: 'page', l: 'Page 12' }, { v: 'of', l: '12 / 40' }], change: ev => ed.setDoc({ numbering: { ...(d.numbering || {}), style: ev.target.value } }) });
    df.push({ kind: 'seg', label: 'Number position', span: 2, options: [['left', 'Left'], ['center', 'Centre'], ['right', 'Right']].map(([v, l]) => ({ l, on: ((d.numbering && d.numbering.align) || 'center') === v, pick: () => ed.setDoc({ numbering: { ...(d.numbering || {}), align: v } }) })) });
    df.push({ kind: 'text', label: 'Document running head', value: d.runHead || '', span: 2, change: ev => ed.setDoc({ runHead: ev.target.value }, 'rh'), focus: () => ed.pushHist(), ph: 'Prefixed to page running heads' });
  }
  df.push({ kind: 'actions', span: 2, actions: [{ label: 'Save a copy', run: () => ed.saveCopy() }, { label: 'Reset to template', danger: true, run: () => ed.reset() }] });
  FS.push({ title: 'Document', hint: d.w + ' × ' + d.h, fields: df });
  return FS;
}
