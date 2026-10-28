import React from 'react';
import { RADII, SHADOWS } from '../../lib/tokens.js';
import { SecHead, cp } from './shared.jsx';

const RULES = [
  'Hairlines are 1px var(--border). Raised cards add var(--shadow-sm); interactive cards lift to var(--shadow-md).',
  'Shadows are always tinted rgba(58, 24, 9) — never black. In dark mode they deepen to neutral black for depth.',
  'Inputs are flat: a 1px border thickening to 2px var(--border-accent) on focus. No inner shadows.',
  'Pills are reserved for tags, badges and avatars.'
];

export default function Radius() {
  return (
    <section id="ds-radius" className="ds-sec">
      <SecHead eyebrow="06 · Radius & shadow" title="Generous corners, warm-brown elevation" />
      <div className="grid-auto" style={{ '--min': '130px', '--gap': '12px' }}>
        {RADII.map(r => (
          <button key={r.token} type="button" className="ds-radius" onClick={cp('var(' + r.token + ')')}>
            <span className="ds-radius-box" style={{ borderRadius: Math.min(r.px, 36) + 'px' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.token + ' · ' + r.px + 'px'}</span>
            <span style={{ fontSize: 11, color: 'var(--fg-subtle)', lineHeight: 1.4 }}>{r.use}</span>
          </button>
        ))}
      </div>
      <div className="grid-auto ds-shadows" style={{ '--min': '170px', '--gap': '18px' }}>
        {SHADOWS.map(s => (
          <button key={s.token} type="button" className="ds-shadow" style={{ boxShadow: `var(${s.token})` }} onClick={cp(s.value)} title={'Copy ' + s.value}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)' }}>{s.token}</span>
            <span style={{ fontSize: 11, color: 'var(--fg-subtle)', lineHeight: 1.4 }}>{s.use}</span>
          </button>
        ))}
      </div>
      <ul className="ds-list">{RULES.map(r => <li key={r}>{r}</li>)}</ul>
    </section>
  );
}
