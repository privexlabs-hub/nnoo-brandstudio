import React from 'react';
import Icon from '../../components/Icon.jsx';
import { SecHead } from './shared.jsx';

// Lucide paths (activity, mic, book, users, map-pin, play) as used in the source.
const ICON_PATHS = [
  'M3 12h4l3 8 4-16 3 8h4',
  'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
  'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z',
  'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  'M5 3l14 9-14 9V3z'
];

function Tile({ art, title, children }) {
  return (
    <div className="ds-tile">
      {art}
      <div className="ds-tile-body"><strong>{title}</strong><p>{children}</p></div>
    </div>
  );
}

export default function Motif() {
  return (
    <section id="ds-motif" className="ds-sec">
      <SecHead eyebrow="07 · Motif, imagery & icons" title="Abstract originals, used sparingly" />
      <div className="grid-fit" style={{ '--min': '240px', '--gap': '14px' }}>
        <Tile title="Rhythm pattern" art={<div className="ds-motif-art" style={{ background: "#faf5ec url('/assets/brand/motifs/pattern-rhythm.svg')", backgroundSize: '60px' }} />}>Dots and arcs, 40px tile. Once per screen at most, behind sparse content.</Tile>
        <Tile title="Arc motif" art={(
          <div className="ds-motif-art" style={{ background: '#c85a26', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 80 80" width="120" height="120" aria-hidden="true">
              <path d="M22 32 Q40 14 58 32" fill="none" stroke="#eca372" strokeWidth="4" strokeLinecap="round" />
              <path d="M22 48 Q40 66 58 48" fill="none" stroke="#eca372" strokeWidth="4" strokeLinecap="round" />
              <circle cx="40" cy="40" r="4" fill="#eca372" />
            </svg>
          </div>
        )}>The mark’s arcs, cropped large in a corner at 50% opacity. One per composition.</Tile>
        <Tile title="Waveform" art={(
          <div className="ds-motif-art" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--bg-raised)' }}>
            <img src="/assets/brand/graphics/waveform.svg" alt="Waveform" style={{ width: '100%', animation: 'nnpulse 2.4s ease-in-out infinite' }} />
          </div>
        )}>Audio is first-class. Loading audio pulses slowly — no skeleton shimmer.</Tile>
        <Tile title="Warm radial" art={<div className="ds-motif-art" style={{ background: 'radial-gradient(400px 200px at 0% 0%, #fbe4d4 0%, transparent 60%),radial-gradient(300px 200px at 100% 100%, #fae9b8 0%, transparent 60%),#faf5ec' }} />}>Clay and marigold in opposite corners. Hero moments only, once per flow.</Tile>
      </div>
      <div className="grid-fit" style={{ '--min': '240px', '--gap': '14px' }}>
        <div className="ds-card g10">
          <h3 className="ds-h3">Imagery</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            <div style={{ height: 80, borderRadius: 10, background: "url('/assets/brand/imagery/placeholder-warm.svg') center/cover" }} />
            <div style={{ height: 80, borderRadius: 10, background: "linear-gradient(180deg,rgba(26,18,11,.15),rgba(26,18,11,.7)),url('/assets/brand/imagery/placeholder-warm.svg') center/cover" }} />
            <div style={{ height: 80, aspectRatio: '1', maxWidth: '100%', justifySelf: 'center', borderRadius: '50%', background: "url('/assets/brand/imagery/placeholder-cool.svg') center/cover" }} />
          </div>
          <p className="ds-c13">Golden-hour, warm-biased photography of specific, named and credited people. Text over photos needs the ink gradient overlay (45% → 70%). Crop portraits at the eyes’ third; circles for people, rounded rectangles for places and objects. Until real photography exists, use the tonal placeholders — never stock clichés.</p>
        </div>
        <div className="ds-card g10">
          <h3 className="ds-h3">Icons</h3>
          <div className="row" style={{ '--gap': '14px', color: 'var(--fg)' }}>{ICON_PATHS.map(p => <Icon key={p} name={p} size={24} />)}</div>
          <p className="ds-c13">Lucide, 2px stroke, rounded caps. 20px default, 24px in tab bars (inactive in subtle text colour, active in brand clay). Never emoji or unicode shapes as icons. Lucide is a placeholder until an Igbo-context set is commissioned.</p>
        </div>
        <div className="ds-raised" style={{ background: 'var(--archival-soft)', gap: 8 }}>
          <h3 className="ds-h3">Cultural IP</h3>
          <p className="ds-c13" style={{ color: 'var(--fg)' }}>Uli, nsibidi and akwete belong to specific communities and artists. They are never used as decoration here. Any traditional pattern must be sourced from an Igbo artist, with attribution and compensation.</p>
        </div>
      </div>
    </section>
  );
}
