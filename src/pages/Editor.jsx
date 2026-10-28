import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import Icon from '../components/Icon.jsx';
import * as T from '../lib/templates.js';
import * as S from '../lib/store.js';
import * as A from '../lib/app.js';
import * as X from '../lib/export.js';
import { pageView } from '../lib/render.js';
import { createHistory } from './editor/history.js';
import * as ops from './editor/ops.js';
import Canvas from './editor/Canvas.jsx';
import PagesPanel from './editor/PagesPanel.jsx';
import Inspector from './editor/Inspector.jsx';
import AddModal from './editor/AddModal.jsx';
import ExportModal, { initialExport } from './editor/ExportModal.jsx';
import './editor/editor.css';

const MSG_MISSING = 'That document is not in this browser. Documents are stored locally — open it on the device where it was made, or import its project file from the Template Library.';
const MSG_EMPTY = 'Pick a template to start a new document, or reopen a recent one. Everything you make is saved in this browser.';
const pad2 = n => String(n).padStart(2, '0');

// Port of Editor.dc.html. A class component keeps the source's setState-callback sequencing intact.
// `this._doc` mirrors state.doc synchronously so several mutations in one event never read a stale document.
class EditorApp extends React.Component {
  state = { loading: true, doc: null, sel: null, pageIdx: 0, editing: null, zoom: 'fit', hv: 0, cw: 900, ch: 700, w: window.innerWidth, mpanel: 'canvas', preview: false, tab: 'page', add: null, ex: null, saveState: 'saved', overflow: {}, guides: null, collapsed: {}, drag: null, emptyMsg: '', vis: null, renderAll: false, exporting: false, nudge: false, nudgeStep: 1 };
  hist = createHistory();
  byId = T.TEMPLATE_BY_ID();
  coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  vc = {};
  _doc = null;

  // ---------- lifecycle ----------
  componentDidMount() {
    document.documentElement.classList.add('ed-lock');
    this.load();
    this.onResize = () => { this.setState({ w: window.innerWidth }); this.measure(); };
    window.addEventListener('resize', this.onResize);
    this.onKey = e => this.key(e); window.addEventListener('keydown', this.onKey);
    window.addEventListener('hashchange', this.onHash);
    this.flush = () => this.saveNow();
    window.addEventListener('pagehide', this.flush);
    this.ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.measure()) : null;
    this.syncBody();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize); window.removeEventListener('keydown', this.onKey); window.removeEventListener('hashchange', this.onHash); window.removeEventListener('pagehide', this.flush);
    this.ro && this.ro.disconnect(); clearTimeout(this.ovT); clearTimeout(this.rc); cancelAnimationFrame(this.raf);
    if (this.st) this.saveNow();
    document.documentElement.classList.remove('ed-lock'); document.body.classList.remove('has-tabbar');
  }
  componentDidUpdate(prev) {
    if (prev.hash !== this.props.hash) this.onHash();
    this.syncBody();
    this.detectOverflow();
  }
  syncBody() { const s = this.state; document.body.classList.toggle('has-tabbar', !!s.doc && s.w < 1024 && !s.preview); }

  onHash = () => {
    const h = A.hashParams();
    if (h.template || (h.doc && (!this._doc || h.doc !== this._doc.id)) || (!h.doc && !h.template && this._doc)) this.load();
  };
  load() {
    const h = A.hashParams(); let doc = null;
    if (this.st) this.saveNow();
    if (h.template && this.byId[h.template]) {
      const t = this.byId[h.template];
      doc = T.newDocFromTemplate(t, h.format);
      if (h.title || h.subtitle) {
        const over = { ...(h.title ? { title: h.title } : {}), ...(h.subtitle ? { body: h.subtitle } : {}) };
        doc.content = { ...(doc.content || {}), ...over };
        // The override wins over the template's own slot text (relayoutGraphic's `content` option).
        if (doc.kind === 'graphic') doc = T.relayoutGraphic(doc, t, { content: over });
        if (h.title) doc.name = h.title.slice(0, 60);
      }
      try { S.saveDoc(doc); } catch (e) { A.toast(e.message, 'err'); }
      A.setHash({ doc: doc.id });
    } else if (h.doc) {
      doc = S.getDoc(h.doc);
      if (!doc) { this._doc = null; this.setState({ loading: false, doc: null, emptyMsg: MSG_MISSING }); return; }
    }
    if (!doc) { this._doc = null; this.setState({ loading: false, doc: null, emptyMsg: MSG_EMPTY }); return; }
    const pageIdx = Math.max(0, Math.min(doc.pages.length - 1, (parseInt(h.page, 10) || 1) - 1));
    this.hist.reset(); this.vc = {}; this._doc = doc;
    this.setState({ loading: false, doc, pageIdx, sel: null, editing: null, zoom: 'fit', overflow: {}, vis: null, add: null, ex: null, saveState: 'saved', hv: this.state.hv + 1 }, () => { this.measure(); setTimeout(() => this.center(pageIdx, false), 60); });
  }

  doc() { return this._doc; }
  template() { return this.byId[this._doc.templateId]; }
  find(doc, id) { return ops.find(doc, id); }

  // ---------- virtualised rendering ----------
  onScrollCanvas = () => {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = null; const c = this.canvasEl, d = this._doc; if (!c || !d) return;
      const top = c.scrollTop - c.clientHeight * 0.75, bot = c.scrollTop + c.clientHeight * 1.75; let from = null, to = null;
      c.querySelectorAll('[data-page-wrap]').forEach((w, i) => { const y = w.offsetTop, h = w.offsetHeight; if (y + h >= top && y <= bot) { if (from == null) from = i; to = i; } });
      if (from == null) return; const v = this.state.vis;
      if (!v || v.from !== from || v.to !== to) this.setState({ vis: { from, to } });
    });
  };
  isLive(i) { const s = this.state; if (s.renderAll || i === s.pageIdx) return true; const v = s.vis || { from: s.pageIdx - 2, to: s.pageIdx + 2 }; return i >= v.from - 1 && i <= v.to + 1; }

  // ---------- layout helpers ----------
  canvasRef = el => {
    if (el && el !== this.canvasEl) { this.canvasEl = el; if (this.ro) { this.ro.disconnect(); this.ro.observe(el); } setTimeout(() => { this.measure(); this.center(this.state.pageIdx, false); }, 80); }
    else if (!el) this.canvasEl = null;
  };
  navRef = el => { this.navEl = el; };
  measure() {
    const c = this.canvasEl; if (!c) return;
    const cw = c.clientWidth, ch = c.clientHeight;
    if (Math.abs(cw - this.state.cw) > 2 || Math.abs(ch - this.state.ch) > 2) this.setState({ cw, ch }, () => { clearTimeout(this.rc); this.rc = setTimeout(() => this.center(this.state.pageIdx, false), 80); });
  }
  fitZoom() {
    const d = this._doc; if (!d) return 1;
    const pad = this.state.w < 640 ? 32 : 96;
    const zw = (this.state.cw - pad) / d.w, zh = (this.state.ch - 96) / d.h;
    const k = d.kind === 'graphic' ? Math.min(zw, zh) : Math.min(zw, d.docKind === 'presentation' ? zh : 1.4);
    return Math.max(0.05, Math.min(k, 2));
  }
  zoom() { return this.state.zoom === 'fit' ? this.fitZoom() : this.state.zoom; }
  center(i, smooth = true, tries = 0) {
    const c = this.canvasEl, d = this._doc; if (!c || !d || !d.pages[i]) return;
    const el = c.querySelector(`[data-page-wrap="${d.pages[i].id}"]`);
    const outer = el && el.querySelector('[data-page-outer]');
    if (!el || !outer || outer.offsetHeight < 4 || (c.scrollHeight <= c.clientHeight && i > 0 && tries < 1)) { if (tries < 15) setTimeout(() => this.center(i, smooth, tries + 1), 80); return; }
    const cr = c.getBoundingClientRect(), er = el.getBoundingClientRect();
    const top = er.top - cr.top + c.scrollTop, left = er.left - cr.left + c.scrollLeft;
    const ty = er.height + 24 < c.clientHeight ? top + er.height / 2 - c.clientHeight / 2 : top - 24;
    const tx = er.width < c.clientWidth ? left + er.width / 2 - c.clientWidth / 2 : left - 24;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    c.scrollTo({ top: Math.max(0, ty), left: Math.max(0, tx), behavior: smooth && !reduce ? 'smooth' : 'auto' });
    const n = this.navEl && this.navEl.querySelector(`[data-nav-pid="${d.pages[i].id}"]`);
    if (n) { const nr = n.getBoundingClientRect(), pr = this.navEl.getBoundingClientRect(); if (nr.top < pr.top || nr.bottom > pr.bottom) this.navEl.scrollTop += nr.top - pr.top - pr.height / 2 + nr.height / 2; }
  }
  selectPage(i, opts = {}) {
    const d = this._doc; if (!d) return; i = Math.max(0, Math.min(d.pages.length - 1, i));
    const sec = d.pages[i].section; const collapsed = { ...this.state.collapsed }; if (sec) delete collapsed[sec];
    this.setState({ pageIdx: i, sel: opts.keepSel ? this.state.sel : null, editing: null, tab: opts.keepSel ? this.state.tab : 'page', collapsed, mpanel: opts.toCanvas && this.state.w < 1024 ? 'canvas' : this.state.mpanel },
      () => { A.setHash({ doc: d.id, page: i + 1 }); requestAnimationFrame(() => this.center(i, opts.smooth !== false)); });
  }

  // ---------- state mutation ----------
  snap() { return JSON.stringify(this._doc); }
  pushHist(key) { if (this.hist.push(this.snap(), key)) this.setState(s => ({ hv: s.hv + 1 })); }
  commit(fn, opts = {}) {
    if (!this._doc) return;
    this.pushHist(opts.key);
    const doc = JSON.parse(this.snap()); const r = fn(doc); doc.updated = Date.now();
    this._doc = doc;
    this.setState({ doc, ...(opts.state || {}) }, () => { opts.after && opts.after(r); });
    this.save();
    return r;
  }
  raw(fn) { const doc = { ...this._doc, pages: this._doc.pages.slice() }; fn(doc); this._doc = doc; this.setState({ doc }); }
  save() {
    clearTimeout(this.st); if (this.state.saveState !== 'saving') this.setState({ saveState: 'saving' });
    this.st = setTimeout(() => this.saveNow(), 350);
  }
  saveNow() {
    clearTimeout(this.st); this.st = null; if (!this._doc) return;
    try { S.saveDoc(this._doc); this.setState({ saveState: 'saved' }); }
    catch (e) { this.setState({ saveState: 'error' }); A.toast(e.message, 'err'); }
  }
  undo = () => { const prev = this.hist.undo(this.snap()); if (prev == null) return; this._doc = JSON.parse(prev); this.setState({ doc: this._doc, editing: null, hv: this.state.hv + 1 }, () => this.fixSel()); this.save(); };
  redo = () => { const next = this.hist.redo(this.snap()); if (next == null) return; this._doc = JSON.parse(next); this.setState({ doc: this._doc, editing: null, hv: this.state.hv + 1 }, () => this.fixSel()); this.save(); };
  fixSel() { const d = this._doc; const pi = Math.min(this.state.pageIdx, d.pages.length - 1); const ok = this.state.sel && d.pages.some(p => p.elements.some(e => e.id === this.state.sel)); this.setState({ pageIdx: pi, sel: ok ? this.state.sel : null }); }
  setEl(patch, key, id = this.state.sel) {
    this.commit(doc => { const f = ops.find(doc, id); if (!f) return; Object.assign(f.el, patch); if (f.el.slot && patch.text != null) { doc.content = doc.content || {}; doc.content[f.el.slot] = patch.text; } }, { key: key ? id + key : null });
  }
  setPage(patch, key) { const i = this.state.pageIdx; this.commit(doc => { Object.assign(doc.pages[i], patch); }, { key: key ? 'p' + i + key : null }); }
  setDoc(patch, key) { this.commit(doc => { Object.assign(doc, patch); }, { key: key ? 'd' + key : null }); }

  // ---------- pages ----------
  insertPage(page, at) { this.commit(doc => { doc.pages.splice(at, 0, page); }, { state: { add: null }, after: () => this.selectPage(at) }); }
  dupPage(i) { this.commit(doc => ops.duplicatePage(doc, i), { after: () => this.selectPage(i + 1) }); }
  delPage(i) {
    const d = this._doc; if (d.pages.length <= 1) { A.toast('A document needs at least one page.', 'err'); return; }
    if (!window.confirm('Delete page ' + (i + 1) + ' — “' + d.pages[i].name + '”? You can undo this.')) return;
    this.commit(doc => { doc.pages.splice(i, 1); }, { after: () => this.selectPage(Math.min(i, this._doc.pages.length - 1)) });
  }
  movePage(from, to) { const d = this._doc; if (to < 0 || to >= d.pages.length || from === to) return; this.commit(doc => { const [p] = doc.pages.splice(from, 1); doc.pages.splice(to, 0, p); }, { after: () => this.selectPage(to) }); }
  addChapter() { const { at, pages } = ops.chapterPages(this._doc, this.state.pageIdx); this.commit(doc => { doc.pages.splice(at, 0, ...pages); }, { after: () => this.selectPage(at) }); }
  pageRoot(i) { const p = this._doc.pages[i]; return this.canvasEl && this.canvasEl.querySelector(`[data-page-root="${p.id}"]`); }
  flowOverflow(i) {
    const root = this.pageRoot(i); if (!root) return;
    const move = ops.overflowIds(root, this._doc.pages[i], this._doc, this.zoom()); if (!move.length) return;
    this.commit(doc => ops.splitOverflow(doc, i, move), { after: () => this.selectPage(i + 1) });
  }
  convertLayout(i) {
    const p = this._doc.pages[i];
    if (p.layout === 'flow') {
      const root = this.pageRoot(i); if (!root) return;
      const boxes = ops.measureBoxes(root, p, this.zoom());
      this.commit(doc => ops.toFree(doc.pages[i], boxes));
    } else this.commit(doc => ops.toFlow(doc.pages[i]));
  }

  // ---------- elements ----------
  newElement(kind, opt) {
    const d = this._doc, pi = this.state.pageIdx, p = d.pages[pi];
    const els = ops.newElements(d, pi, kind, opt);
    const after = this.state.sel ? p.elements.findIndex(e => e.id === this.state.sel) : -1;
    this.commit(doc => { const pg = doc.pages[pi]; if (pg.layout === 'flow' && after >= 0) pg.elements.splice(after + 1, 0, ...els); else pg.elements.push(...els); }, { state: { add: null, sel: els[0].id, tab: 'element' } });
  }
  dupEl = () => {
    const id = this.state.sel; if (!id) return; const nid = T.uid(); const k = ops.sz(this._doc);
    this.commit(doc => { const f = ops.find(doc, id); if (!f) return; const c = JSON.parse(JSON.stringify(f.el)); c.id = nid; c.slot = null; c.user = true; if (f.page.layout === 'free') { c.x += 24 * k; c.y += 24 * k; } f.page.elements.splice(f.ei + 1, 0, c); }, { state: { sel: nid } });
  };
  delEl = () => { const id = this.state.sel; if (!id) return; this.commit(doc => { const f = ops.find(doc, id); if (f) f.page.elements.splice(f.ei, 1); }, { state: { sel: null, tab: 'page', editing: null } }); };
  moveEl(id, dir) { this.commit(doc => { const f = ops.find(doc, id); if (!f) return; const to = f.ei + dir; if (to < 0 || to >= f.page.elements.length) return; const [e] = f.page.elements.splice(f.ei, 1); f.page.elements.splice(to, 0, e); }); }
  toFront(id, front) { this.commit(doc => { const f = ops.find(doc, id); if (!f) return; const [e] = f.page.elements.splice(f.ei, 1); if (front) f.page.elements.push(e); else f.page.elements.unshift(e); }); }
  nudge(dx, dy) { const id = this.state.sel; const f = id && ops.find(this._doc, id); if (!f || f.page.layout !== 'free') return false; this.commit(doc => { const g = ops.find(doc, id); g.el.x += dx; g.el.y += dy; }, { key: id + 'nudge' }); return true; }
  fitText() {
    const id = this.state.sel; const n = this.canvasEl && this.canvasEl.querySelector(`[data-el-id="${id}"] [data-text]`); if (!n) return;
    const prev = n.style.height; n.style.height = 'auto'; const h = Math.ceil(n.scrollHeight) + 2; n.style.height = prev; this.setEl({ h });
  }
  async upload(e, apply) { const f = e.target.files && e.target.files[0]; e.target.value = ''; try { const d = await ops.readImage(f); apply(d); A.toast('Image added'); } catch (err) { A.toast(err.message, 'err'); } }
  relayout(o) { const t = this.template(); this.commit(doc => Object.assign(doc, T.relayoutGraphic(doc, t, o)), { state: { sel: null }, after: () => setTimeout(() => this.center(this.state.pageIdx, false), 60) }); }
  reset() {
    const t = this.template(); if (!t) return;
    if (!window.confirm('Reset “' + this._doc.name + '” to the original template? Your edits will be replaced (you can undo).')) return;
    const fresh = T.newDocFromTemplate(t, this._doc.formatId);
    this.commit(doc => { const keep = { id: doc.id, created: doc.created }; Object.keys(doc).forEach(k => delete doc[k]); Object.assign(doc, fresh, keep); }, { state: { sel: null, pageIdx: 0 }, after: () => this.selectPage(0) });
  }
  saveCopy() { const c = JSON.parse(this.snap()); c.id = T.uid('d'); c.name = c.name + ' (copy)'; c.created = Date.now(); try { S.saveDoc(c); A.toast('Saved a copy — opening it'); location.hash = 'doc=' + c.id; } catch (e) { A.toast(e.message, 'err'); } }

  // ---------- pointer interactions ----------
  elDown(ev, el, pi) {
    if (this.state.preview) return;
    ev.stopPropagation();
    if (this.state.editing === el.id) return;
    if (this.state.editing) this.commitEditing();
    const touch = ev.pointerType === 'touch' || ev.pointerType === 'pen';
    const wasSel = this.state.sel === el.id && this.state.pageIdx === pi;
    if (touch) {
      // Double-tap (two taps within 300ms) enters text editing.
      const now = Date.now(), lt = this.lastTap; this.lastTap = { id: el.id, t: now };
      if (lt && lt.id === el.id && now - lt.t < 300 && el.type === 'text') { this.lastTap = null; this.startEditing(el.id); return; }
    }
    if (!wasSel) this.setState({ sel: el.id, pageIdx: pi, tab: 'element' });
    const page = this._doc.pages[pi]; if (page.layout !== 'free' || ev.button > 0) return;
    if (touch && !wasSel) return; // first tap only selects, so an unselected element never blocks page scrolling
    ev.preventDefault();
    const z = this.zoom(), sx = ev.clientX, sy = ev.clientY, ox = el.x, oy = el.y; let moved = false;
    const W = this._doc.w, H = page.h || this._doc.h, th = 8 / z;
    const move = e => {
      const dx = (e.clientX - sx) / z, dy = (e.clientY - sy) / z;
      if (!moved && Math.hypot(dx, dy) < 4 / z) return;
      if (!moved) { this.pushHist(); moved = true; }
      let nx = ox + dx, ny = oy + dy; const g = [];
      if (!e.altKey) {
        [[0, 'l'], [W / 2 - el.w / 2, 'c'], [W - el.w, 'r']].forEach(([v, k]) => { if (Math.abs(nx - v) < th) { nx = v; g.push({ x: k === 'l' ? 0 : k === 'c' ? W / 2 : W }); } });
        [[0, 't'], [H / 2 - el.h / 2, 'c'], [H - el.h, 'b']].forEach(([v, k]) => { if (Math.abs(ny - v) < th) { ny = v; g.push({ y: k === 't' ? 0 : k === 'c' ? H / 2 : H }); } });
      }
      this.raw(doc => { doc.pages[pi] = { ...doc.pages[pi], elements: doc.pages[pi].elements.map(x => x.id === el.id ? { ...x, x: Math.round(nx), y: Math.round(ny) } : x) }; });
      this.setState({ guides: { pi, g } });
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); this.setState({ guides: null }); if (moved) this.save(); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  }
  handleDown(ev, el, pi, dir) {
    ev.stopPropagation(); ev.preventDefault(); this.pushHist();
    const z = this.zoom(), sx = ev.clientX, sy = ev.clientY, o = { x: el.x, y: el.y, w: el.w, h: el.h };
    const keep = el.type === 'logo' || el.shape === 'ellipse' || (el.type === 'image' && el.radius >= 999);
    const move = e => {
      const dx = (e.clientX - sx) / z, dy = (e.clientY - sy) / z; let { x, y, w, h } = o;
      if (dir.includes('e')) w = Math.max(8, o.w + dx); if (dir.includes('s')) h = Math.max(8, o.h + dy);
      if (dir.includes('w')) { w = Math.max(8, o.w - dx); x = o.x + o.w - w; } if (dir.includes('n')) { h = Math.max(8, o.h - dy); y = o.y + o.h - h; }
      if ((keep || e.shiftKey) && dir.length === 2) { const r = o.w / o.h; if (w / h > r) h = w / r; else w = h * r; if (dir.includes('n')) y = o.y + o.h - h; if (dir.includes('w')) x = o.x + o.w - w; }
      this.raw(doc => { doc.pages[pi] = { ...doc.pages[pi], elements: doc.pages[pi].elements.map(q => q.id === el.id ? { ...q, x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) } : q) }; });
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); this.save(); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  }
  elDbl(ev, el) { if (this.state.preview) return; if (el.type === 'text') { ev.stopPropagation(); this.startEditing(el.id); } }
  startEditing(id, opts = {}) {
    const f = ops.find(this._doc, id); if (!f || f.el.type !== 'text' || this.state.preview) return;
    const focusNode = () => {
      const n = this.canvasEl && this.canvasEl.querySelector(`[data-el-id="${id}"] [data-text]`); if (!n) return;
      n.focus({ preventScroll: false });
      const r = document.createRange(); r.selectNodeContents(n); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    };
    if (this.state.editing === id) { focusNode(); return; }
    this.setState({ editing: id, sel: id, pageIdx: f.pi, tab: 'element', mpanel: opts.toCanvas && this.state.w < 1024 ? 'canvas' : this.state.mpanel }, () => requestAnimationFrame(focusNode));
  }
  commitEditing() {
    const id = this.state.editing; if (!id || this._committing === id) return;
    this._committing = id;
    const n = this.canvasEl && this.canvasEl.querySelector(`[data-el-id="${id}"] [data-text]`);
    let t = null;
    // innerText applies CSS text-transform, so read it with uppercase styling switched off.
    if (n) { const tt = n.style.textTransform; n.style.textTransform = 'none'; t = n.innerText.replace(/\n$/, ''); n.style.textTransform = tt; }
    const f = ops.find(this._doc, id);
    this.setState({ editing: null }, () => { this._committing = null; });
    if (n && f && f.el.text !== t) this.setEl({ text: t }, null, id);
  }
  handlers = {
    down: (e, el, pi) => this.elDown(e, el, pi),
    dbl: (e, el) => this.elDbl(e, el),
    blur: () => this.state.editing && this.commitEditing(),
    handle: (e, el, pi, dir) => this.handleDown(e, el, pi, dir),
    pageDown: (e, pi) => {
      if (this.state.preview) return;
      if (this.state.editing) this.commitEditing();
      if (this.state.pageIdx !== pi || this.state.sel) { this.setState({ sel: null, tab: 'page' }); if (this.state.pageIdx !== pi) this.selectPage(pi, { smooth: true }); }
    }
  };
  canvasDown = e => {
    const t = e.target, c = e.currentTarget;
    if (t === c || t === c.firstChild || (t.dataset && t.dataset.pageWrap)) { if (this.state.editing) this.commitEditing(); this.setState({ sel: null, tab: 'page' }); }
  };
  key(e) {
    if (!this._doc) return;
    const tag = (e.target.tagName || '').toLowerCase(); const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    const mod = e.metaKey || e.ctrlKey;
    if (e.key === 'Escape') {
      if (this.state.editing) { e.preventDefault(); this.commitEditing(); return; }
      if (this.state.nudge) { this.setState({ nudge: false }); return; }
      if (this.state.add || this.state.ex) { if (!(this.state.ex && this.state.ex.busy)) this.setState({ add: null, ex: null }); return; }
      this.setState({ sel: null, tab: 'page' }); return;
    }
    if (typing) return;
    if (this.state.add || this.state.ex) return;
    const k = e.key.toLowerCase();
    if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? this.redo() : this.undo(); return; }
    if (mod && k === 'y') { e.preventDefault(); this.redo(); return; }
    if (mod && k === 'd' && this.state.sel) { e.preventDefault(); this.dupEl(); return; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && this.state.sel) { e.preventDefault(); this.delEl(); return; }
    if (e.key === 'PageDown') { e.preventDefault(); this.selectPage(this.state.pageIdx + 1); return; }
    if (e.key === 'PageUp') { e.preventDefault(); this.selectPage(this.state.pageIdx - 1); return; }
    if (this.state.sel && e.key.startsWith('Arrow')) {
      const st = e.shiftKey ? 10 : 1; const d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key];
      if (d && this.nudge(d[0], d[1])) e.preventDefault();
    }
  }

  // ---------- overflow detection (400ms after changes) ----------
  detectOverflow() {
    if (!this._doc || this.ovT) return;
    this.ovT = setTimeout(() => {
      this.ovT = null; const c = this.canvasEl, d = this._doc; if (!c || !d) return;
      const ov = {};
      d.pages.forEach(p => {
        const root = c.querySelector(`[data-page-root="${p.id}"]`); if (!root) { if (this.state.overflow[p.id]) ov[p.id] = true; return; }
        if (p.layout === 'flow') { const cont = [...root.children].find(ch => ch.style && ch.style.flexDirection === 'column'); if (cont && cont.scrollHeight > cont.clientHeight + 2) ov[p.id] = true; }
        else p.elements.forEach(e => { if (e.type !== 'text' || e.deco) return; const n = root.querySelector(`[data-el-id="${e.id}"] [data-text]`); if (n && n.scrollHeight > n.clientHeight + 3) ov[e.id] = true; });
      });
      if (JSON.stringify(ov) !== JSON.stringify(this.state.overflow)) this.setState({ overflow: ov });
    }, 400);
  }

  // ---------- export ----------
  openExport = () => this.setState({ ex: initialExport(this._doc, this.state.w < 1024 || this.coarse) });
  closeExport = () => { if (!(this.state.ex && this.state.ex.busy)) this.setState({ ex: null }); };
  closeAdd = () => this.setState({ add: null });
  setExMsg(msg) { this.setState({ ex: { ...this.state.ex, msg } }); }
  async runExport() {
    const ex = this.state.ex; if (!ex || ex.busy) return;
    if (this.state.editing) this.commitEditing();
    this.setState({ ex: { ...ex, busy: true, msg: 'Preparing…', ok: null }, sel: null, exporting: true, renderAll: true });
    await new Promise(r => setTimeout(r, 200 + this._doc.pages.length * 25)); await document.fonts.ready;
    const d = this._doc, base = X.fileBase(d);
    try {
      const nodes = [...this.canvasEl.querySelectorAll('[data-page-root]')];
      const pick = ex.scope === 'page' ? [this.state.pageIdx] : d.pages.map((p, i) => i);
      const nodeOf = i => nodes.find(n => n.dataset.pageRoot === d.pages[i].id);
      const pageFile = (i, ext) => `${pad2(i + 1)}-${A.slug(d.pages[i].name)}.${ext}`;
      const f = ex.fmt; let blob, name;
      if (['png', 'jpeg', 'webp', 'svg'].includes(f)) {
        if (pick.length === 1) {
          const i = pick[0]; const url = await X.renderPage(nodeOf(i), d.w, d.pages[i].h || d.h, { type: f, scale: ex.scale, quality: ex.quality });
          name = base + (d.pages.length > 1 ? '-p' + pad2(i + 1) : '') + '.' + X.EXT[f]; A.download(url, name);
        } else {
          const files = [];
          for (const i of pick) {
            this.setExMsg(`Rendering page ${i + 1} of ${pick.length}…`);
            const url = await X.renderPage(nodeOf(i), d.w, d.pages[i].h || d.h, { type: f, scale: ex.scale, quality: ex.quality });
            files.push(f === 'svg' ? { name: pageFile(i, 'svg'), data: decodeURIComponent(url.split(',')[1]) } : { name: pageFile(i, X.EXT[f]), data: X.b64(url), base64: true });
          }
          blob = await X.zipFiles(files); name = base + '-' + f + '.zip';
        }
      } else if (f === 'zip') {
        const files = [];
        for (const i of pick) { this.setExMsg(`Rendering page ${i + 1} of ${pick.length}…`); const url = await X.renderPage(nodeOf(i), d.w, d.pages[i].h || d.h, { type: 'png', scale: ex.scale }); files.push({ name: pageFile(i, 'png'), data: X.b64(url), base64: true }); }
        blob = await X.zipFiles(files); name = base + '-pages.zip';
      } else if (f === 'pdf') { this.setExMsg('Building PDF…'); blob = await X.pagesToPDF(pick.map(i => ({ node: nodeOf(i), h: d.pages[i].h || d.h })), d.w, d.h, { scale: Math.min(ex.scale, 3), quality: 0.92 }); name = base + '.pdf'; }
      else if (f === 'pptx') { this.setExMsg('Building PowerPoint…'); blob = await X.toPptx(d, d.pages.map((p, i) => nodeOf(i)), this.zoom()); name = base + '.pptx'; }
      else if (f === 'docx') { blob = await X.toDocx(d); name = base + '.docx'; }
      else if (f === 'epub') { const cover = d.pages[0] && d.pages[0].kind === 'cover' ? nodeOf(0) : null; blob = await X.toEpub(d, cover); name = base + '.epub'; }
      else if (f === 'html') { blob = new Blob([await X.toHTML(d)], { type: 'text/html' }); name = base + '.html'; }
      else if (f === 'md') { blob = new Blob([X.toMarkdown(d)], { type: 'text/markdown' }); name = base + '.md'; }
      else if (f === 'txt') { blob = new Blob([X.toText(d)], { type: 'text/plain' }); name = base + '.txt'; }
      else if (f === 'json') { blob = new Blob([JSON.stringify({ nnooProject: 1, doc: d }, null, 1)], { type: 'application/json' }); name = base + '.nnoo.json'; }
      if (blob) A.download(blob, name);
      this.setState({ exporting: false, renderAll: false, ex: { ...this.state.ex, busy: false, ok: true, msg: 'Downloaded ' + name } });
      A.toast('Exported ' + name);
    } catch (err) {
      console.error(err);
      this.setState({ exporting: false, renderAll: false, ex: { ...this.state.ex, busy: false, ok: false, msg: 'Export failed: ' + (err.message || err) } });
    }
  }

  // ---------- view-model cache ----------
  memo(kind, p, i, o) {
    const d = this._doc;
    const has = id => id && p.elements.some(e => e.id === id);
    const usesToc = p.elements.some(e => e.type === 'toc');
    const key = [kind, i, o.zoom, has(o.sel) ? o.sel : '', has(o.editing) ? o.editing : '', !!o.interactive, !!o.exporting, !!o.pageSelected, o.nums[i], d.w, d.h, d.runHead || '', JSON.stringify(d.numbering || {}), usesToc ? JSON.stringify(o.toc) : '', JSON.stringify(p)].join('|');
    const c = this.vc[kind + p.id];
    if (c && c.key === key) return c.view;
    let view = pageView(d, i, o);
    if (kind === 'c' && o.interactive && !o.exporting) view = this.touchView(view, p, o.zoom, o.sel);
    this.vc[kind + p.id] = { key, view }; return view;
  }
  // Touch additions layered on the render.js view-model (render.js itself is shared and left untouched):
  // a selected free-layout element gets touch-action:none so dragging it doesn't scroll, and on coarse
  // pointers each resize handle becomes a 32px transparent hit area with the same visible dot.
  touchView(view, p, z, sel) {
    if (p.layout !== 'free' || !sel) return view;
    const coarse = this.coarse;
    return { ...view, els: view.els.map(x => {
      if (x.id !== sel) return x;
      const nx = { ...x, wrap: { ...x.wrap, touchAction: 'none' } };
      if (coarse && x.handles && x.handles.length) {
        const hs = 32 / z, dot = 6 / z, ring = 7.5 / z;
        nx.handles = x.handles.map(h => {
          const l = /calc\(([\d.]+%)/.exec(h.st.left), t = /calc\(([\d.]+%)/.exec(h.st.top);
          return { ...h, st: { ...h.st, left: `calc(${l ? l[1] : '0%'} - ${hs / 2}px)`, top: `calc(${t ? t[1] : '0%'} - ${hs / 2}px)`, width: hs + 'px', height: hs + 'px', border: 'none', background: `radial-gradient(circle, #ffffff 0 ${dot}px, #c85a26 ${dot}px ${ring}px, transparent ${ring}px)` } };
        });
      }
      return nx;
    }) };
  }
  canvasView(p, i, z, nums, toc) {
    const s = this.state, d = this._doc;
    return this.memo('c', p, i, { zoom: z, sel: s.sel, editing: s.editing, interactive: !s.preview, exporting: s.exporting, handlers: this.handlers, nums, toc, pageSelected: i === s.pageIdx && !s.sel && d.pages.length > 1 });
  }

  // ---------- render ----------
  renderEmpty() {
    const s = this.state;
    if (s.loading) return <div className="ed-loading">Opening the editor…</div>;
    const recent = S.listDocs().slice(0, 8);
    return (
      <div className="ed-empty">
        <div className="ed-empty-inner">
          <div>
            <div className="eyebrow-ui">Editor</div>
            <h1 className="h-sec" style={{ margin: '8px 0' }}>Open something to edit</h1>
            <p className="lead">{s.emptyMsg}</p>
          </div>
          <div className="row"><Link to="/templates" className="btn btn-primary">Choose a template</Link></div>
          {recent.length > 0 && (
            <div className="stack" style={{ '--gap': '8px' }}>
              <h2 className="h-card" style={{ fontSize: 22, margin: '8px 0 4px' }}>Recent documents</h2>
              {recent.map(r => (
                <Link key={r.id} to={'/editor#doc=' + r.id} className="ed-recent">
                  <span className="ed-recent-name">{r.name}</span>
                  <span className="ed-recent-meta">{r.w + ' × ' + r.h + ' · ' + r.pages + (r.pages === 1 ? ' page' : ' pages') + ' · ' + new Date(r.updated).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    const s = this.state, d = s.doc;
    if (!d) return this.renderEmpty();
    const wide = s.w >= 1024;
    const z = this.zoom(); const nums = X.pageNumbers(d), toc = X.tocItems(d);
    const f = s.sel ? ops.find(d, s.sel) : null;
    const k = d.kind === 'doc' ? T.DOC_KINDS[d.docKind] : null;
    const meta = (k ? k.name : (T.FORMATS[d.formatId] || {}).label) + ' · ' + d.w + ' × ' + d.h + ' · ' + d.pages.length + (d.pages.length === 1 ? ' page' : ' pages');
    const saveText = s.saveState === 'saving' ? 'Saving…' : s.saveState === 'error' ? 'Not saved' : 'Saved locally';
    const mp = s.mpanel, side = !s.preview;
    const cols = wide && side ? (s.w >= 1280 ? '264px minmax(0,1fr) 340px' : '232px minmax(0,1fr) 300px') : 'minmax(0,1fr)';
    const zoomTo = v => this.setState({ zoom: v }, () => this.center(this.state.pageIdx, false));
    const togglePreview = () => this.setState({ preview: !s.preview, sel: null, editing: null }, () => setTimeout(() => { this.measure(); this.center(this.state.pageIdx, false); }, 60));
    const pickTab = id => this.setState({ mpanel: id, nudge: false }, () => id === 'canvas' && setTimeout(() => { this.measure(); this.center(this.state.pageIdx, false); }, 50));
    const showToolbar = !wide && !s.preview && mp === 'canvas' && f && !s.exporting;
    const freeSel = f && f.page.layout === 'free';
    const nudgeStep = s.nudgeStep;
    const navPanel = <PagesPanel ed={this} s={s} nums={nums} toc={toc} />;
    const inspPanel = <Inspector ed={this} s={s} f={f} />;
    return (
      <>
        <div className="ed-bar">
          <div className="ed-bar-main">
            <input className="ed-name" aria-label="Document name" value={d.name} onChange={e => this.setDoc({ name: e.target.value }, 'name')} />
            {s.w >= 1200 && <span className="ed-meta">{meta}</span>}
            <span className="ed-save" data-state={s.saveState} role="status">{saveText}</span>
          </div>
          <div className="ed-bar-tools">
            <div className="ed-group">
              <button type="button" className="ed-ibtn" title="Undo (Ctrl/Cmd+Z)" aria-label="Undo" onClick={this.undo} disabled={!this.hist.canUndo}><Icon name="undo" size={18} /></button>
              <button type="button" className="ed-ibtn" title="Redo (Shift+Ctrl/Cmd+Z)" aria-label="Redo" onClick={this.redo} disabled={!this.hist.canRedo}><Icon name="redo" size={18} /></button>
            </div>
            <div className="ed-zoom">
              <button type="button" aria-label="Zoom out" onClick={() => zoomTo(Math.max(0.05, z / 1.25))}>−</button>
              <button type="button" className="ed-zoom-label" onClick={() => this.setState({ zoom: 'fit' }, () => this.center(this.state.pageIdx))} title="Fit to screen" aria-label={'Zoom ' + Math.round(z * 100) + '%, fit to screen'}>{Math.round(z * 100)}%</button>
              <button type="button" aria-label="Zoom in" onClick={() => zoomTo(Math.min(4, z * 1.25))}>+</button>
            </div>
            <button type="button" className="ed-preview" aria-pressed={s.preview} onClick={togglePreview}>{s.preview ? 'Exit preview' : 'Preview'}</button>
          </div>
          <button type="button" className="ed-export" onClick={this.openExport}>Export</button>
        </div>

        <div className="ed-work" style={{ gridTemplateColumns: cols }}>
          {wide && side && <aside aria-label="Pages" className="ed-panel ed-nav">{navPanel}</aside>}
          <Canvas ed={this} s={s} z={z} nums={nums} toc={toc} />
          {wide && side && <aside aria-label="Properties" className="ed-panel ed-insp">{inspPanel}</aside>}
          {!wide && side && mp === 'pages' && <aside aria-label="Pages" className="ed-panel ed-nav ed-overlay">{navPanel}</aside>}
          {!wide && side && mp === 'props' && <aside aria-label="Properties" className="ed-panel ed-insp ed-overlay">{inspPanel}</aside>}
          {showToolbar && (
            <div className="ed-seltools" role="toolbar" aria-label="Selection">
              {s.nudge && freeSel ? (
                <>
                  <button type="button" aria-label="Nudge left" onClick={() => this.nudge(-nudgeStep, 0)}>←</button>
                  <button type="button" aria-label="Nudge up" onClick={() => this.nudge(0, -nudgeStep)}>↑</button>
                  <button type="button" aria-label="Nudge down" onClick={() => this.nudge(0, nudgeStep)}>↓</button>
                  <button type="button" aria-label="Nudge right" onClick={() => this.nudge(nudgeStep, 0)}>→</button>
                  <button type="button" aria-label={'Nudge step ' + nudgeStep + ' pixels'} onClick={() => this.setState({ nudgeStep: nudgeStep === 1 ? 10 : 1 })}>{nudgeStep}px</button>
                  <button type="button" onClick={() => this.setState({ nudge: false })}>Done</button>
                </>
              ) : s.editing ? (
                <button type="button" onPointerDown={e => e.preventDefault()} onClick={() => this.commitEditing()}>Done editing</button>
              ) : (
                <>
                  <button type="button" onClick={this.dupEl}>Duplicate</button>
                  <button type="button" className="danger" onClick={this.delEl}>Delete</button>
                  {f.el.type === 'text' && <button type="button" onClick={() => this.startEditing(f.el.id)}>Edit text</button>}
                  {freeSel && <button type="button" onClick={() => this.setState({ nudge: true })}>Nudge</button>}
                </>
              )}
            </div>
          )}
        </div>

        {!wide && side && (
          <nav aria-label="Editor panels" className="ed-tabbar">
            {[['pages', 'Pages'], ['canvas', 'Canvas'], ['props', 'Edit']].map(([id, l]) => <button key={id} type="button" aria-pressed={mp === id} onClick={() => pickTab(id)}>{l}</button>)}
          </nav>
        )}

        {s.add && <AddModal ed={this} s={s} />}
        {s.ex && <ExportModal ed={this} s={s} />}
      </>
    );
  }
}

export default function Editor() {
  const { hash } = useLocation();
  return (
    <div className="ed-root">
      <AppHeader active="editor" />
      <EditorApp hash={hash} />
    </div>
  );
}
