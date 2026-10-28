import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import Icon from '../components/Icon.jsx';
import { BRAND, LOGOS, LOGO_RATIO, COLOR_GROUPS, SEMANTIC, FAMILIES, resolveColor, bestText, contrast, grade } from '../lib/tokens.js';
import { VOICE } from '../lib/voice.js';
import { copyText, toast } from '../lib/app.js';
import Markdown from './voice/markdown.jsx';
import { useScrollPadding, useInitialHashScroll, useActiveSection, jumpTo } from './voice/anchors.js';
import './voice/voice.css';
import './playbook/playbook.css';

const SECTIONS = [
  ['pb-mission', 'Mission and name'],
  ['pb-principles', 'Principles'],
  ['pb-logo', 'Logo essentials'],
  ['pb-colour', 'Core palette'],
  ['pb-type', 'Type pairing'],
  ['pb-voice', 'Voice'],
  ['pb-dodont', 'Do and don’t']
];

// Wording from "Design System.dc.html" (overview principles).
const PRINCIPLES = [
  ['Warm always', 'Every neutral leans warm. No cool greys, no bluish gradients, no glassmorphism.'],
  ['Audio first', 'The voice is the content. Waveforms and players are core primitives.'],
  ['Provenance visible', 'Who, where, when and dialect travel with every recording — forest marks the archive.'],
  ['Igbo foregrounded', 'Diacritics always, never italicised. Igbo anchors key moments.']
];

const LOGO_IDS = ['lockup', 'mark-clay', 'lockup-dark', 'lockup-reversed', 'mark-bone'];

// Misuse examples, same set and treatment as the design system's logo section.
const MISUSE = [
  ['stretch or squash it.', { transform: 'scaleX(1.5)' }],
  ['recolour it outside the variants.', { filter: 'hue-rotate(160deg)' }],
  ['rotate it.', { transform: 'rotate(-18deg)' }],
  ['add shadows or effects.', { filter: 'drop-shadow(4px 6px 2px rgba(0,0,0,.55))' }],
  ['place the clay mark on clay.', {}, 'clay-500'],
  ['set it on busy imagery without an overlay.', {}, 'img']
];

// From the brand README (content fundamentals, visual foundations, iconography, cultural IP).
const DO = [
  'Use sentence case for headings, buttons and navigation — “Start a lesson”.',
  'Keep Igbo diacritics, always: Nnọọ, Ọbá, Ọha, Ndị Igbo.',
  'Set Igbo words in the same roman weight as English. They are not foreign here.',
  'Name people by role: learners, elders, facilitators, contributors.',
  'Show a proverb’s Igbo original first, then the translation, then a one-line gloss. Attribute dialect and region.',
  'Keep every neutral warm — bone, cream, sand, clay dust.',
  'Reserve Fraunces for archival and elder content.',
  'Keep hit targets at least 44 × 44px. On hover, darken one scale step.'
];
const DONT = [
  'Use emoji in product chrome or marketing copy.',
  'Use ALL CAPS, except tiny eyebrow labels.',
  'Call people “users”.',
  'Use bluish-purple gradients, glassmorphism or neon.',
  'Use stock “African” clichés — drums in silhouette, safari sunsets.',
  'Reproduce uli, nsibidi or akwete patterns without an Igbo artist’s authorship, attribution and compensation.',
  'Decorate with proverbs. A proverb is content, not chrome.',
  'Use skeleton shimmer. Audio loading shows a slow pulse on the waveform.'
];

const SPECIMEN = {
  'Outfit': ['display', 'Nnọọ. Welcome home.'],
  'DM Sans': ['body', 'Ọ dị mma. That’s three new words today — they are yours now.'],
  'Fraunces': ['archive', '“Onye aghụghọ na-ebi n’ọhịa.”']
};

function More({ links }) {
  return (
    <div className="pb-more">
      {links.map(([to, label]) => <Link key={to} to={to}>{label}<Icon name="arrowRight" size={16} /></Link>)}
    </div>
  );
}

function Swatch({ item }) {
  const on = resolveColor(bestText(item.hex));
  const r = contrast(item.hex, on);
  return (
    <button type="button" className="card pb-sw" onClick={() => copyText(item.hex).catch(() => toast('Copy failed', 'err'))} aria-label={`Copy ${item.name} ${item.hex}`}>
      <span className="pb-sw-chip" style={{ background: item.hex, color: on, boxShadow: 'inset 0 -1px 0 rgba(58,24,9,.08)' }}>{item.hex} · {grade(r)}</span>
      <span className="pb-sw-body"><strong>{item.name}</strong><span className="small muted">{item.role}</span><span className="mono-ui subtle">--{item.token}</span></span>
    </button>
  );
}

export default function Playbook() {
  useScrollPadding(80);
  useInitialHashScroll('pb-');
  const cur = useActiveSection(SECTIONS.map(s => s[0]));

  const palette = useMemo(() => {
    const items = Object.fromEntries(COLOR_GROUPS.flatMap(g => g.items.map(i => [i.token, i])));
    const groupOf = Object.fromEntries(COLOR_GROUPS.flatMap(g => g.items.map(i => [i.token, g])));
    // The primary swatch of each colour family = the token behind its semantic role.
    const core = ['--brand', '--accent', '--community', '--archival'].map(v => { const s = SEMANTIC.find(x => x.v === v); return { item: items[s.light], group: groupOf[s.light], role: s.purpose }; });
    const neutrals = ['bone', 'cream', 'paper', 'sand', 'ink-500', 'ink-700', 'ink-900'].map(t => items[t]);
    return { core, neutrals };
  }, []);
  const logos = LOGO_IDS.map(id => LOGOS.find(l => l.id === id)).filter(Boolean);
  const voice = ['personality', 'tone'].map(id => VOICE.find(v => v.id === id)).filter(Boolean);
  const families = FAMILIES.filter(f => SPECIMEN[f.name]);

  return (
    <>
      <AppHeader active="playbook" />
      <div className="sn-layout">
        <nav className="sn-nav" aria-label="Playbook sections">
          <div className="eyebrow-ui">On this page</div>
          {SECTIONS.map(([id, label]) => <a key={id} href={'#' + id} aria-current={cur === id ? 'true' : undefined} onClick={e => { e.preventDefault(); jumpTo(id); }}>{label}</a>)}
        </nav>

        <main className="sn-main" style={{ gap: 40 }}>
          <header className="pb-head">
            <div className="eyebrow-ui">Brand playbook</div>
            <h1 className="vc-title">The Nnọọ brand on one page</h1>
            <p className="vc-lead">The essentials to get the brand right: why it exists, how it looks and how it speaks. Each section links to the full detail in the design system and the voice guide.</p>
            <nav className="pb-pills" aria-label="Playbook sections">
              <div className="pill-row">
                {SECTIONS.map(([id, label]) => <a key={id} className={'pill' + (cur === id ? ' on' : '')} href={'#' + id} aria-current={cur === id ? 'true' : undefined} onClick={e => { e.preventDefault(); jumpTo(id); }}>{label}</a>)}
              </div>
            </nav>
          </header>

          <section id="pb-mission" className="pb-sec" aria-labelledby="pb-mission-h">
            <div className="pb-sec-top"><div className="eyebrow-ui">01</div><h2 id="pb-mission-h" className="h-sec">Mission and name</h2></div>
            <div className="pb-mission">
              <div className="stack" style={{ '--gap': '14px' }}>
                <p className="pb-body">{BRAND.summary}</p>
                <p className="pb-quote">“{BRAND.line}”</p>
                <p className="pb-body">A preservation archive and a learning app that feed each other. Nnọọ welcomes; it does not sell.</p>
              </div>
              <div className="card-raised pb-name">
                <div className="eyebrow-ui">The name</div>
                <div className="pb-name-big">{BRAND.name}</div>
                <p className="pb-body">{BRAND.meaning}. Always written with its diacritics.</p>
                <p className="small muted">Ọbá — storehouse, treasury. Ọha — the community, the gathering. The surfaces are named in Igbo because that is the point.</p>
              </div>
            </div>
            <More links={[['/design-system#ds-overview', 'Design system overview'], ['/voice#sec-overview', 'Brand overview'], ['/voice#sec-purpose', 'Mission and purpose']]} />
          </section>

          <section id="pb-principles" className="pb-sec" aria-labelledby="pb-principles-h">
            <div className="pb-sec-top"><div className="eyebrow-ui">02</div><h2 id="pb-principles-h" className="h-sec">Four principles</h2></div>
            <div className="grid-auto" style={{ '--min': '220px' }}>
              {PRINCIPLES.map(([t, d], i) => (
                <div key={t} className="card pb-prin"><span className="pb-prin-n">{String(i + 1).padStart(2, '0')}</span><h3 className="h-card">{t}</h3><p>{d}</p></div>
              ))}
            </div>
            <More links={[['/design-system#ds-overview', 'Principles in the design system']]} />
          </section>

          <section id="pb-logo" className="pb-sec" aria-labelledby="pb-logo-h">
            <div className="pb-sec-top">
              <div className="eyebrow-ui">03</div><h2 id="pb-logo-h" className="h-sec">Logo essentials</h2>
              <p className="pb-body">The mark abstracts the dot-below diacritic of Nnọọ held between two arcs — two hands, one body. Use the files exactly as supplied; never redraw, recolour outside the variants, or add effects.</p>
            </div>
            <div className="grid-auto" style={{ '--min': '220px', '--gap': '12px' }}>
              {logos.map(l => (
                <figure key={l.id} className="card pb-logo">
                  <div className="pb-logo-ground" style={{ background: resolveColor(l.ground) }}>
                    <img src={l.file} alt={l.name} style={{ maxHeight: (LOGO_RATIO[l.id] > 1 ? 56 : 84) + 'px' }} />
                  </div>
                  <figcaption className="pb-logo-body"><strong>{l.name}</strong><span className="small muted">{l.use}</span></figcaption>
                </figure>
              ))}
            </div>
            <div className="pb-rules">
              <div className="card pb-rule"><h3>Clear space</h3><p>Keep clear space equal to half the mark’s height on every side. Nothing — text, edges, other logos — enters it.</p></div>
              <div className="card pb-rule"><h3>Minimum sizes</h3><p>Mark 24px, lockup 96px. Below 24px use the favicon file — its heavier strokes survive small sizes. Print minimum: lockup 25 mm wide.</p></div>
            </div>
            <h3 className="h-card">Misuse</h3>
            <div className="grid-auto" style={{ '--min': '160px', '--gap': '12px' }}>
              {MISUSE.map(([t, st, g]) => (
                <div key={t} className="pb-misuse">
                  <div className="pb-misuse-box" style={{ background: g === 'img' ? "url('/assets/brand/imagery/placeholder-warm.svg') center/cover" : g ? resolveColor(g) : 'var(--bg-raised)' }}>
                    <img src="/assets/brand/logo/nnoo-mark-clay.svg" alt="" style={{ width: 56, ...st }} />
                  </div>
                  <div className="pb-misuse-cap"><strong>Don’t</strong> <span className="muted">{t}</span></div>
                </div>
              ))}
            </div>
            <More links={[['/design-system#ds-logo', 'Full logo guidance'], ['/assets', 'Download logo files']]} />
          </section>

          <section id="pb-colour" className="pb-sec" aria-labelledby="pb-colour-h">
            <div className="pb-sec-top">
              <div className="eyebrow-ui">04</div><h2 id="pb-colour-h" className="h-sec">Core palette</h2>
              <p className="pb-body">Warm always. Clay is the signature, marigold the accent, plum is rare and marks community, forest is reserved for the archive and provenance. Select a swatch to copy its hex.</p>
            </div>
            <div className="grid-auto" style={{ '--min': '200px', '--gap': '12px' }}>
              {palette.core.map(c => (
                <div key={c.item.token} className="stack" style={{ '--gap': '8px' }}>
                  <Swatch item={c.item} />
                  <span className="small muted">{c.group.note}</span>
                </div>
              ))}
            </div>
            <h3 className="h-card">Warm neutrals</h3>
            <div className="grid-auto pb-neutrals" style={{ '--min': '140px', '--gap': '10px' }}>
              {palette.neutrals.map(n => <Swatch key={n.token} item={n} />)}
            </div>
            <More links={[['/design-system#ds-colour', 'All colour tokens and contrast']]} />
          </section>

          <section id="pb-type" className="pb-sec" aria-labelledby="pb-type-h">
            <div className="pb-sec-top"><div className="eyebrow-ui">05</div><h2 id="pb-type-h" className="h-sec">Type pairing</h2></div>
            <div className="grid-auto" style={{ '--min': '260px' }}>
              {families.map(f => {
                const [cls, text] = SPECIMEN[f.name];
                return (
                  <div key={f.name} className={cls === 'archive' ? 'card-raised pb-type' : 'card pb-type'} style={cls === 'archive' ? { borderLeft: '4px solid var(--archival-soft)' } : undefined}>
                    <div className="eyebrow-ui">{f.role}</div>
                    <h3 className="h-card">{f.name}</h3>
                    <p className={'pb-spec ' + cls}>{text}</p>
                    {cls === 'archive' && <p className="small subtle">— Umudioka dialect, Anambra</p>}
                    <p className="small muted">{f.rule}</p>
                    <div className="pb-type-meta"><span>Weights {f.weights.join(' · ')}</span><span>{f.licence}</span></div>
                  </div>
                );
              })}
            </div>
            <More links={[['/design-system#ds-type', 'Type scale and styles']]} />
          </section>

          <section id="pb-voice" className="pb-sec" aria-labelledby="pb-voice-h">
            <div className="pb-sec-top"><div className="eyebrow-ui">06</div><h2 id="pb-voice-h" className="h-sec">Voice</h2></div>
            {voice.map(v => (
              <div key={v.id} className="card stack" style={{ '--gap': '12px' }}>
                <h3 className="h-card">{v.title}</h3>
                <Markdown md={v.md} />
                <div><Link className="small" to={'/voice#sec-' + v.id} style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44 }}>Open in the voice guide<Icon name="arrowRight" size={16} /></Link></div>
              </div>
            ))}
            <More links={[['/voice', 'Full voice and knowledge guide'], ['/design-system#ds-voice', 'Voice in the design system']]} />
          </section>

          <section id="pb-dodont" className="pb-sec" aria-labelledby="pb-dodont-h">
            <div className="pb-sec-top"><div className="eyebrow-ui">07</div><h2 id="pb-dodont-h" className="h-sec">Do and don’t</h2></div>
            <div className="pb-dd">
              <div className="card pb-do"><h3>Do</h3><ul>{DO.map(t => <li key={t}><Icon name="check" size={18} style={{ color: 'var(--success)' }} /><span>{t}</span></li>)}</ul></div>
              <div className="card pb-dont"><h3>Don’t</h3><ul>{DONT.map(t => <li key={t}><Icon name="x" size={18} style={{ color: 'var(--danger)' }} /><span>{t}</span></li>)}</ul></div>
            </div>
            <More links={[['/voice#sec-style', 'Writing style and mechanics'], ['/voice#sec-avoid', 'Words and claims to avoid']]} />
          </section>
        </main>
      </div>
    </>
  );
}
