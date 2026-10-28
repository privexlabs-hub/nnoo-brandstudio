import React from 'react';
import { COLOR_GROUPS, SEMANTIC, TYPE_STYLES, SPACING, LOGOS } from '../../lib/tokens.js';
import { TEMPLATES, DOC_TEMPLATES } from '../../lib/templates.js';
import { SecHead, cp } from './shared.jsx';

const PRINCIPLES = [
  ['Warm always', 'Every neutral leans warm. No cool greys, no bluish gradients, no glassmorphism.'],
  ['Audio first', 'The voice is the content. Waveforms and players are core primitives.'],
  ['Provenance visible', 'Who, where, when and dialect travel with every recording — forest marks the archive.'],
  ['Igbo foregrounded', 'Diacritics always, never italicised. Igbo anchors key moments.']
];

const IMPORT_LINES = ['@import "/assets/brand/fonts/fonts.css";', '@import "src/styles/tokens.css";'];

export default function Overview() {
  const nColors = COLOR_GROUPS.reduce((a, g) => a + g.items.length, 0);
  const stats = [[nColors, 'colour tokens'], [SEMANTIC.length, 'semantic roles'], [TYPE_STYLES.length, 'type styles'], [SPACING.length, 'spacing steps'], [LOGOS.length, 'logo variants'], [TEMPLATES.length + DOC_TEMPLATES.length, 'templates']];
  return (
    <section id="ds-overview" className="ds-sec tight">
      <SecHead h1 eyebrow="01 · Overview" title="The Nnọọ design system" />
      <p className="ds-lead">One visual language for Nnọọ Learn, Ọbá, Facilitator Mode, Ọha and everything the brand publishes. Warm always, audio first, provenance visible. Every value on this page is live from the same tokens the editor and exports use — click any value to copy it.</p>
      <div className="grid-fit" style={{ '--min': '220px', '--gap': '14px' }}>
        {PRINCIPLES.map(([t, d]) => (
          <div key={t} className="ds-card shadow" style={{ gap: 6 }}><h3 className="ds-h3">{t}</h3><p className="ds-p14">{d}</p></div>
        ))}
      </div>
      <div className="grid-fit" style={{ '--min': '150px', '--gap': '10px' }}>
        {stats.map(([v, l]) => <div key={l} className="ds-stat"><div className="ds-stat-v">{v}</div><div className="ds-stat-l">{l}</div></div>)}
      </div>
      <div className="ds-raised">
        <h3 className="ds-h3">Using the tokens</h3>
        <p className="ds-p14">Components use the semantic roles listed under Colour, so light and dark themes switch automatically. Brand artwork — social posts, documents, exports — uses the raw scale (clay-500, bone) so it never changes with the reader’s theme.</p>
        <button type="button" className="ds-import" onClick={cp(IMPORT_LINES.join('\n'))} title="Copy import lines">
          {IMPORT_LINES.map(l => <span key={l}>{l}</span>)}
        </button>
      </div>
    </section>
  );
}
