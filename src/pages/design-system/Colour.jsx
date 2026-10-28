import React, { useState } from 'react';
import { COLOR_GROUPS, SEMANTIC, bestText, resolveColor, contrast, grade, rgbStr, hslStr, oklchStr } from '../../lib/tokens.js';
import { SecHead, cp } from './shared.jsx';

const GROUNDS = ['bone', 'cream', 'paper', 'clay-500', 'clay-600', 'marigold-300', 'plum-500', 'forest-500', 'ink-900'];
const TEXTS = ['ink-900', 'ink-700', 'ink-500', 'bone', 'clay-500', 'clay-700', 'forest-500', 'marigold-200'];
const TABS = COLOR_GROUPS.map((g, i) => [i, g.name.split(' — ')[0]]).concat([['semantic', 'Semantic roles'], ['contrast', 'Contrast matrix']]);

function Swatch({ c }) {
  const hex = c.hex.toUpperCase();
  const values = [['var(--' + c.token + ')', 'CSS variable'], [hex, 'HEX'], [rgbStr(c.hex), 'RGB'], [hslStr(c.hex), 'HSL'], [oklchStr(c.hex), 'OKLCH']];
  return (
    <div className="ds-card flat">
      <button type="button" className="ds-sw" style={{ background: c.hex }} onClick={cp(c.hex)} title="Copy hex" aria-label={'Copy ' + c.name + ' hex ' + hex}>
        <span className="ds-sw-text" style={{ color: resolveColor(bestText(c.hex)) }}>{hex}</span>
      </button>
      <div className="ds-col-body">
        <div className="ds-col-head"><span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span><span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{c.role}</span></div>
        <div className="row" style={{ '--gap': '4px' }}>
          {values.map(([v, title]) => <button key={title} type="button" className="ds-val" title={'Copy ' + title} onClick={cp(v)}>{v}</button>)}
        </div>
        <p className="ds-c12">{c.usage}</p>
        <div className="row" style={{ '--gap': '4px' }}>
          {c.on.map(o => {
            const r = contrast(c.hex, o);
            return <span key={o} className="ds-pair" style={{ background: resolveColor(o), color: c.hex }}>{(o === 'ink-ground' ? 'dark UI' : o) + ' ' + r.toFixed(1) + ' ' + grade(r)}</span>;
          })}
        </div>
        <p style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--fg-subtle)' }}><strong>Dark mode:</strong> {c.dark}</p>
      </div>
    </div>
  );
}

function Semantic() {
  return (
    <div className="stack" style={{ '--gap': '12px' }}>
      <div><h3 className="ds-h3 lg">Semantic roles — light and dark</h3><p className="ds-note">Interface components use these roles only. Dark values are defined by this system to keep contrast while preserving warmth.</p></div>
      <div className="scroll-x ds-tbl">
        <table style={{ fontSize: 13, minWidth: 620 }}>
          <thead><tr><th>Token</th><th>Purpose</th><th>Light</th><th>Dark</th></tr></thead>
          <tbody>
            {SEMANTIC.map(s => (
              <tr key={s.v}>
                <td><button type="button" className="ds-plain-btn" style={{ color: 'var(--fg)' }} onClick={cp('var(' + s.v + ')')}>{s.v}</button></td>
                <td style={{ color: 'var(--fg-muted)' }}>{s.purpose}</td>
                <td><button type="button" className="ds-plain-btn" onClick={cp(s.lightHex)}><span className="ds-chipsw" style={{ background: s.lightHex }} />{s.light + ' ' + s.lightHex}</button></td>
                <td><button type="button" className="ds-plain-btn" onClick={cp(s.dark)}><span className="ds-chipsw" style={{ background: s.dark }} />{s.dark}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Contrast() {
  const rc = contrast('bone', 'clay-500').toFixed(2), rc6 = contrast('bone', 'clay-600').toFixed(2);
  const cellBase = g => ({ padding: '8px 10px', background: resolveColor(g), color: resolveColor(bestText(g)), fontFamily: 'var(--font-mono)' });
  return (
    <div className="stack" style={{ '--gap': '12px' }}>
      <div><h3 className="ds-h3 lg">Contrast — text on brand grounds</h3><p className="ds-note">Body text needs 4.5:1 (AA). Large text — 24px regular or 18.7px bold and up — needs 3:1. Ratios are computed live from the tokens.</p></div>
      <div className="scroll-x ds-tbl">
        <table style={{ fontSize: 12, minWidth: 640 }}>
          <thead><tr>
            <th style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>Text ↓ / ground →</th>
            {GROUNDS.map(g => <th key={g} style={{ ...cellBase(g), fontSize: 11, fontWeight: 600 }}>{g}</th>)}
          </tr></thead>
          <tbody>
            {TEXTS.map(t => (
              <tr key={t}>
                <td style={{ padding: '8px 10px', fontWeight: 600, whiteSpace: 'nowrap', color: 'var(--fg)' }}>{t}</td>
                {GROUNDS.map(g => {
                  const r = contrast(t, g), gr = grade(r), fail = gr === 'Fail';
                  return (
                    <td key={g} style={{ ...cellBase(g), whiteSpace: 'nowrap' }}>
                      <span style={{ color: resolveColor(t), fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Aa</span> {r.toFixed(1)}{' '}
                      <span style={{ fontSize: 10, fontWeight: 700, opacity: fail ? 0.7 : 1, textDecoration: fail ? 'line-through' : 'none' }}>{gr}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ds-note-box"><strong style={{ color: 'var(--fg)' }}>Note:</strong> {`Bone text on clay-500 measures ${rc}:1 — use it for large or bold text (buttons at 15px semibold and up, headlines). For small text on a clay fill use clay-600 (${rc6}:1). In dark mode, buttons switch to clay-400 with ink text for AA contrast.`}</p>
    </div>
  );
}

export default function Colour() {
  const [cg, setCg] = useState(0);
  const group = typeof cg === 'number' ? COLOR_GROUPS[cg] : null;
  return (
    <section id="ds-colour" className="ds-sec">
      <SecHead eyebrow="03 · Colour" title="Late-afternoon light, clay and cooking fire" />
      <p className="ds-p">Every neutral is warm. Clay is the brand; marigold is the accent; plum belongs to community and forest to the archive. Roles are meaningful — don’t swap them for variety. Click any value to copy it.</p>
      <div role="tablist" aria-label="Colour views" className="row" style={{ '--gap': '6px' }}>
        {TABS.map(([v, label]) => <button key={v} type="button" role="tab" className="ds-tab" aria-selected={cg === v} onClick={() => setCg(v)}>{label}</button>)}
      </div>
      {group && (
        <div className="stack" style={{ '--gap': '12px' }} role="tabpanel">
          <div><h3 className="ds-h3 lg">{group.name}</h3><p className="ds-note">{group.note}</p></div>
          <div className="grid-auto" style={{ '--min': '250px', '--gap': '12px' }}>
            {group.items.map(c => <Swatch key={c.token} c={c} />)}
          </div>
        </div>
      )}
      {cg === 'semantic' && <Semantic />}
      {cg === 'contrast' && <Contrast />}
    </section>
  );
}
