import React from 'react';
import { FAMILIES, TYPE_STYLES, TYPE_SCALE, LEADING, TRACKING } from '../../lib/tokens.js';
import { SecHead, cp } from './shared.jsx';

const famOf = n => (FAMILIES.find(f => f.name === n) || FAMILIES[1]).stack;
const sampleOf = t => t.upper ? 'Ọha — the community'
  : t.family === 'Fraunces' ? (t.px > 30 ? 'Ilu from Umudioka' : '[Elder name] remembers the market road')
  : t.family === 'System mono' ? '--brand: #c85a26'
  : t.px >= 28 ? 'Hear our elders, learn our words' : 'When you are ready, press record. The words waited for you.';

export default function Type() {
  return (
    <section id="ds-type" className="ds-sec">
      <SecHead eyebrow="04 · Type" title="Rounded, humanist — and ceremonial when it matters" />
      <div className="grid-fit" style={{ '--min': '260px', '--gap': '14px' }}>
        {FAMILIES.map(f => (
          <div key={f.token} className="ds-card g10">
            <div className="ds-fam-spec" style={{ fontFamily: f.stack, fontWeight: f.weights[f.weights.length > 2 ? 2 : 0], letterSpacing: f.name === 'Outfit' ? '-0.02em' : '0' }}>Nnọọ Ag</div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{f.name}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{f.role + '. ' + f.rule}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>{'Weights ' + f.weights.join(' / ') + ' · ' + f.licence}</div>
            <div className="row" style={{ '--gap': '4px' }}>
              <button type="button" className="ds-val" onClick={cp('var(' + f.token + ')')}>{f.token}</button>
              <button type="button" className="ds-val" onClick={cp(f.stack)}>Copy stack</button>
            </div>
          </div>
        ))}
      </div>
      <div className="ds-type-list">
        {TYPE_STYLES.map(t => {
          const css = `font-family: ${famOf(t.family)};\nfont-weight: ${t.weight};\nfont-size: ${t.size};\nline-height: ${t.lh};\nletter-spacing: ${t.ls};${t.upper ? '\ntext-transform: uppercase;' : ''}`;
          return (
            <div key={t.cls} className="ds-type-row">
              <div style={{ minWidth: 0 }}>
                <div className="ds-type-sample" style={{ '--px': t.px + 'px', fontFamily: famOf(t.family), fontWeight: t.weight, lineHeight: t.lh, letterSpacing: t.ls, textTransform: t.upper ? 'uppercase' : 'none', color: t.upper ? 'var(--fg-subtle)' : 'var(--fg)', whiteSpace: t.px >= 28 ? 'nowrap' : 'normal' }}>{sampleOf(t)}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 6 }}>{t.name + ' · ' + t.use}</div>
              </div>
              <div className="ds-type-acts">
                <button type="button" className="ds-val nowrap" title="Copy CSS" onClick={cp(css)}>{`${t.family} ${t.weight} · ${t.px}/${t.lh} · ${t.ls}`}</button>
                <button type="button" className="ds-val raised" title="Copy class name" onClick={cp(t.cls)}>{'.' + t.cls}</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid-fit" style={{ '--min': '280px', '--gap': '14px' }}>
        <div className="ds-card" style={{ gap: 0 }}>
          <h3 className="ds-h3" style={{ marginBottom: 10 }}>Scale · 1.2 ratio</h3>
          {TYPE_SCALE.map(({ token, px, rem, use }) => (
            <button key={token} type="button" className="ds-row-btn" onClick={cp('var(' + token + ')')}>
              <span className="ds-scale-tok">{token}</span>
              <span className="ds-scale-px">{px + 'px · ' + rem}</span>
              <span className="ds-scale-aa" style={{ '--px': px + 'px' }}>Aa</span>
              <span className="ds-scale-use">{use}</span>
            </button>
          ))}
        </div>
        <div className="stack" style={{ '--gap': '14px' }}>
          <div className="ds-card" style={{ gap: 0 }}>
            <h3 className="ds-h3" style={{ marginBottom: 10 }}>Line height & tracking</h3>
            {LEADING.concat(TRACKING).map(([t, v, u]) => (
              <button key={t} type="button" className="ds-row-btn" style={{ fontSize: 13 }} onClick={cp('var(' + t + ')')}>
                <span className="ds-lead-tok">{t}</span><strong style={{ minWidth: 56, flex: 'none' }}>{v}</strong><span style={{ color: 'var(--fg-subtle)', minWidth: 0 }}>{u}</span>
              </button>
            ))}
          </div>
          <div className="ds-raised" style={{ gap: 0 }}>
            <h3 className="ds-h3" style={{ marginBottom: 8 }}>Igbo diacritics are content</h3>
            <p className="ds-c13" style={{ marginBottom: 10 }}>Never strip or italicise. Check every font renders dot-below and tone marks.</p>
            <div className="ds-diac-1">Nnọọ · Ọbá · Ọha · Ndị Igbo</div>
            <div className="ds-diac-2">Onye aghụghọ na-ebi n’ọhịa.</div>
            <p style={{ marginTop: 10, fontSize: 12, lineHeight: 1.5, color: 'var(--fg-subtle)' }}>Fraunces ships precomposed ọ, ị, ụ. Outfit and DM Sans render them via combining marks; verify on target devices.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
