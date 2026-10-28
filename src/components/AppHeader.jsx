import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import { getPref, setPref } from '../lib/app.js';

export const NAV = [
  ['studio', 'Studio', '/'],
  ['system', 'Design system', '/design-system'],
  ['playbook', 'Playbook', '/playbook'],
  ['voice', 'Voice & knowledge', '/voice'],
  ['assets', 'Assets', '/assets'],
  ['templates', 'Templates', '/templates'],
  ['editor', 'Editor', '/editor']
];
const THEMES = [['light', 'Light theme', 'sun'], ['dark', 'Dark theme', 'moon'], ['system', 'Match system theme', 'monitor']];

export function ThemeSwitch() {
  const [pref, setP] = useState(getPref);
  useEffect(() => { const on = e => setP(e.detail.pref); window.addEventListener('nnoo-theme', on); return () => window.removeEventListener('nnoo-theme', on); }, []);
  return (
    <div className="theme-sw" role="group" aria-label="Theme">
      {THEMES.map(([t, label, icon]) => (
        <button key={t} type="button" title={label} aria-label={label} aria-pressed={pref === t} onClick={() => { setP(t); setPref(t); }}><Icon name={icon} size={16} /></button>
      ))}
    </div>
  );
}

// Sticky 60px app header. Inline nav ≥1080px; menu drop-down below.
export default function AppHeader({ active }) {
  const [menu, setMenu] = useState(false);
  const ref = useRef(null);
  const loc = useLocation();
  useEffect(() => { setMenu(false); }, [loc.pathname, loc.hash]);
  useEffect(() => {
    if (!menu) return;
    const key = e => e.key === 'Escape' && setMenu(false);
    const out = e => ref.current && !ref.current.contains(e.target) && setMenu(false);
    window.addEventListener('keydown', key); document.addEventListener('pointerdown', out);
    return () => { window.removeEventListener('keydown', key); document.removeEventListener('pointerdown', out); };
  }, [menu]);
  const links = cls => NAV.map(([id, label, href]) => (
    <Link key={id} to={href} aria-current={id === active ? 'page' : undefined} className={cls} onClick={() => setMenu(false)}>{label}</Link>
  ));
  return (
    <header className="hdr" ref={ref}>
      <div className="hdr-row">
        <Link to="/" className="hdr-brand" aria-label="Nnọọ Brand Studio home">
          <img src="/assets/brand/logo/nnoo-mark-clay.svg" alt="" />
          <span className="hdr-name">Nnọọ</span>
          <span className="hdr-sub">Brand Studio</span>
        </Link>
        <nav className="hdr-nav" aria-label="Main">{links()}</nav>
        <div className="hdr-spacer" />
        <ThemeSwitch />
        <button type="button" className="icon-btn hdr-menu-btn" aria-label="Menu" aria-expanded={menu} aria-controls="hdr-drop" onClick={() => setMenu(m => !m)}><Icon name={menu ? 'x' : 'menu'} /></button>
      </div>
      {menu && <nav id="hdr-drop" className="hdr-drop" aria-label="Main">{links()}</nav>}
    </header>
  );
}
