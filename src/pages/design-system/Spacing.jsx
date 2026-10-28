import React from 'react';
import { SPACING, BREAKPOINTS, LAYOUT } from '../../lib/tokens.js';
import { SecHead, cp } from './shared.jsx';

export default function Spacing() {
  return (
    <section id="ds-spacing" className="ds-sec">
      <SecHead eyebrow="05 · Spacing & layout" title="A 4px base. Interfaces breathe." />
      <div className="ds-card" style={{ gap: 4 }}>
        {SPACING.map(s => (
          <button key={s.token} type="button" className="ds-space-row" onClick={cp('var(' + s.token + ')')}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.token}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-subtle)' }}>{s.px + 'px · ' + s.rem}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <span className="ds-space-bar" style={{ width: Math.max(2, s.px * 2) + 'px' }} />
              <span className="ds-ellip">{s.use}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="grid-fit" style={{ '--min': '230px', '--gap': '14px' }}>
        {BREAKPOINTS.map(b => (
          <div key={b.name} className="ds-card g10" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>{b.name}</strong>
              <button type="button" className="ds-val raised" style={{ padding: '3px 6px', borderRadius: 6 }} onClick={cp(b.range)}>{b.range}</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${b.cols}, 1fr)`, gap: Math.max(2, b.gutter / 6) + 'px' }}>
              {Array.from({ length: b.cols }, (_, i) => <span key={i} className="ds-bp-col" />)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-subtle)', lineHeight: 1.5 }}>{b.cols + ' columns · ' + b.gutter + 'px gutter · ' + b.margin + 'px margin · container ' + b.container + '. ' + b.note}</div>
          </div>
        ))}
      </div>
      <div className="row" style={{ '--gap': '6px' }}>
        {LAYOUT.map(([t, v, u]) => <button key={t} type="button" className="ds-val md card" onClick={cp('var(' + t + ')')}>{t + ': ' + v + ' — ' + u}</button>)}
      </div>
      <p className="ds-p14">Alignment: left-align reading text; centre only short, ceremonial moments (greetings, covers, dividers). Hit targets are at least 44 × 44px on touch. Mobile content inset is 20px.</p>
    </section>
  );
}
