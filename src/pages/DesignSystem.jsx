import React, { useEffect, useRef } from 'react';
import AppHeader from '../components/AppHeader.jsx';
import useHash from '../components/useHash.js';
import { SECTIONS } from './design-system/shared.jsx';
import Overview from './design-system/Overview.jsx';
import Logo from './design-system/Logo.jsx';
import Colour from './design-system/Colour.jsx';
import Type from './design-system/Type.jsx';
import Spacing from './design-system/Spacing.jsx';
import Radius from './design-system/Radius.jsx';
import Motif from './design-system/Motif.jsx';
import VoiceSection from './design-system/VoiceSection.jsx';
import Components from './design-system/Components.jsx';
import Slides from './design-system/Slides.jsx';
import UiKits from './design-system/UiKits.jsx';
import Governance from './design-system/Governance.jsx';
import './design-system/ds.css';

const VIEWS = { overview: Overview, logo: Logo, colour: Colour, type: Type, spacing: Spacing, radius: Radius, motif: Motif, voice: VoiceSection, components: Components, slides: Slides, uikits: UiKits, governance: Governance };
const IDS = SECTIONS.map(s => s.id);

export default function DesignSystem() {
  const hash = useHash();
  const m = hash.match(/^#ds-([a-z]+)/);
  const sec = m && IDS.includes(m[1]) ? m[1] : 'overview';
  const cur = IDS.indexOf(sec);
  const prev = cur > 0 ? SECTIONS[cur - 1] : null;
  const next = cur < IDS.length - 1 ? SECTIONS[cur + 1] : null;
  const pillsRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add('ds-page');
    return () => document.documentElement.classList.remove('ds-page');
  }, []);

  // Each section is its own "page": jump to the top when it changes and keep the active pill in view.
  useEffect(() => {
    window.scrollTo(0, 0);
    const row = pillsRef.current, pill = row && row.querySelector('[aria-current="true"]');
    if (row && pill && row.offsetParent) row.scrollLeft = Math.max(0, pill.offsetLeft - row.offsetLeft - (row.clientWidth - pill.offsetWidth) / 2);
  }, [sec]);

  const View = VIEWS[sec];
  return (
    <div className="ds-root">
      <AppHeader active="system" />
      <div className="ds-layout">
        <nav className="ds-side" aria-label="Design system sections">
          <div className="ds-side-title">Design system</div>
          {SECTIONS.map(s => (
            <a key={s.id} href={'#ds-' + s.id} aria-current={s.id === sec ? 'true' : undefined}><span className="ds-side-num">{s.num}</span>{s.label}</a>
          ))}
        </nav>
        <nav className="ds-pills" aria-label="Design system sections" ref={pillsRef}>
          {SECTIONS.map(s => <a key={s.id} href={'#ds-' + s.id} aria-current={s.id === sec ? 'true' : undefined}>{s.label}</a>)}
        </nav>
        <main className="ds-main">
          <View key={sec} />
          <div className="ds-pager">
            {prev && <a href={'#ds-' + prev.id}>← {prev.label}</a>}
            {next && <a className="next" href={'#ds-' + next.id}>{next.label} →</a>}
          </div>
        </main>
      </div>
    </div>
  );
}
