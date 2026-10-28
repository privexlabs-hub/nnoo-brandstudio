// Theme + shared browser utilities. UI theme only — brand artwork never changes with theme.
import { SEMANTIC, DARK_EXTRA } from './tokens.js';

const KEY = 'nnoo.theme';
export function getPref() { try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; } }
export function resolved(pref = getPref()) { return pref === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : pref; }
export function applyTheme(pref = getPref()) {
  const mode = resolved(pref), root = document.documentElement;
  SEMANTIC.forEach(s => { if (mode === 'dark') root.style.setProperty(s.v, s.dark); else root.style.removeProperty(s.v); });
  Object.entries(DARK_EXTRA).forEach(([k, v]) => { if (mode === 'dark') root.style.setProperty(k, v); else root.style.removeProperty(k); });
  root.style.colorScheme = mode; root.dataset.theme = mode;
  document.body && (document.body.style.background = 'var(--bg)', document.body.style.color = 'var(--fg)');
  return mode;
}
export function setPref(pref) { try { localStorage.setItem(KEY, pref); } catch (e) {} const m = applyTheme(pref); window.dispatchEvent(new CustomEvent('nnoo-theme', { detail: { pref, mode: m } })); return m; }
let wired = false;
export function initTheme() {
  applyTheme();
  if (!wired) { wired = true; matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => getPref() === 'system' && setPref('system')); window.addEventListener('storage', e => e.key === KEY && applyTheme()); }
  if (!document.querySelector('link[rel=icon]')) { const l = document.createElement('link'); l.rel = 'icon'; l.type = 'image/svg+xml'; l.href = 'assets/brand/favicon/favicon.svg'; document.head.appendChild(l); }
  return resolved();
}

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch (e) { const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); const ok = document.execCommand('copy'); t.remove(); if (!ok) throw e; }
  toast('Copied ' + (text.length > 40 ? text.length + ' characters' : text));
}
export function toast(msg, kind = 'ok') { window.dispatchEvent(new CustomEvent('nnoo-toast', { detail: { msg, kind, t: Date.now() } })); }
export function download(blob, filename) {
  const a = document.createElement('a'); a.href = typeof blob === 'string' ? blob : URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  if (typeof blob !== 'string') setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
export function slug(s) { return String(s || 'untitled').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'untitled'; }
export function hashParams() { const o = {}; location.hash.replace(/^#/, '').split('&').filter(Boolean).forEach(p => { const [k, v] = p.split('='); o[decodeURIComponent(k)] = decodeURIComponent(v || ''); }); return o; }
export function setHash(o) { const s = Object.entries(o).filter(([, v]) => v != null && v !== '').map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&'); history.replaceState(null, '', '#' + s); }
const libs = {};
export function loadScript(src, globalName) {
  if (globalName && window[globalName]) return Promise.resolve(window[globalName]);
  return libs[src] || (libs[src] = new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = () => res(globalName ? window[globalName] : true); s.onerror = () => { delete libs[src]; rej(new Error('Could not load ' + src + ' — check your connection.')); }; document.head.appendChild(s); }));
}
