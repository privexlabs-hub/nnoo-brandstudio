import React from 'react';
import { SecHead } from './shared.jsx';

// Mock-ups are brand artwork: raw hex so they look the same in light and dark UI themes.
const caps = { fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' };

function LearnMobile() {
  return (
    <div className="ds-phone" role="img" aria-label="Nnọọ Learn home screen mock-up">
      <div style={{ padding: '16px 14px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="/assets/brand/logo/nnoo-mark-clay.svg" alt="" style={{ width: 22 }} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Nnọọ.</span>
      </div>
      <div style={{ padding: '0 14px', fontSize: 10, color: '#6b5945' }}>Welcome home.</div>
      <div style={{ margin: '12px 10px 0', background: '#fff', border: '1px solid #d9cfbd', borderRadius: 14, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ ...caps, color: '#6b5945' }}>Today’s lesson</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>Greeting an elder</span>
        <div style={{ height: 5, background: '#e8dfc9', borderRadius: 9 }}><div style={{ width: '60%', height: '100%', background: '#d9a019', borderRadius: 9 }} /></div>
        <span style={{ alignSelf: 'flex-start', background: '#c85a26', color: '#faf5ec', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 10, padding: '6px 10px', borderRadius: 8 }}>Start today’s lesson</span>
      </div>
      <div style={{ margin: '10px 10px 0', background: '#f3ead8', borderLeft: '3px solid #d0e0d4', borderRadius: 12, padding: 10 }}>
        <span style={{ ...caps, color: '#2e5d3a' }}>Ilu · proverb</span>
        <div style={{ fontFamily: 'var(--font-archive)', fontSize: 12, marginTop: 4 }}>Onye aghụghọ na-ebi n’ọhịa.</div>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #d9cfbd', padding: '8px 0 12px', fontSize: 8, fontWeight: 600 }}>
        {['Learn', 'Ọbá', 'Ọha', 'You'].map((t, i) => <span key={t} style={{ color: i ? '#6b5945' : '#c85a26' }}>{t}</span>)}
      </div>
    </div>
  );
}

function FacilitatorTablet() {
  return (
    <div className="ds-tablet" role="img" aria-label="Facilitator recording screen mock-up">
      <div style={{ background: '#f3ead8', padding: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 8, minWidth: 0 }}>
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: 11 }}>Session</strong>
        <span>[Elder name]</span>
        <span>[Hometown] · [Age]</span>
        <span style={{ color: '#2e5d3a', fontWeight: 600 }}>Consent recorded</span>
        <span style={{ marginTop: 6, fontWeight: 600 }}>Checklist</span>
        <span>Place · Date · Dialect</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minWidth: 0, padding: '0 6px', textAlign: 'center' }}>
        <span style={{ fontSize: 9, color: '#6b5945' }}>Take your time. There is no hurry.</span>
        <span style={{ width: 52, height: 52, borderRadius: '50%', background: '#c85a26', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><span style={{ width: 16, height: 16, borderRadius: '50%', background: '#faf5ec' }} /></span>
        <img src="/assets/brand/graphics/waveform.svg" alt="" style={{ width: '80%' }} />
      </div>
    </div>
  );
}

function MarketingWeb() {
  return (
    <div className="ds-browser" role="img" aria-label="Marketing site hero mock-up">
      <div style={{ height: 16, background: '#e8dfc9', display: 'flex', gap: 4, alignItems: 'center', padding: '0 6px', flex: 'none' }}>
        {['#c85a26', '#d9a019', '#2e5d3a'].map(c => <span key={c} style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />)}
      </div>
      <div style={{ flex: 1, background: 'radial-gradient(300px 140px at 0% 0%, #fbe4d4 0%, transparent 60%),radial-gradient(200px 140px at 100% 100%, #fae9b8 0%, transparent 60%),#faf5ec', padding: 18, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, lineHeight: 1.05 }}>Welcome home, Ndị Igbo.</span>
        <span style={{ fontSize: 9, color: '#3d2e1f' }}>Hear our elders. Learn our words.</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 'auto' }}>
          <span style={{ background: '#c85a26', color: '#faf5ec', borderRadius: 8, padding: 8, fontSize: 8, fontWeight: 600 }}>Ọbá — the archive</span>
          <span style={{ background: '#f3ead8', borderLeft: '3px solid #d0e0d4', borderRadius: 8, padding: 8, fontSize: 8, fontWeight: 600 }}>Nnọọ Learn</span>
        </div>
      </div>
    </div>
  );
}

export default function UiKits() {
  return (
    <section id="ds-uikits" className="ds-sec tight">
      <SecHead eyebrow="11 · UI kits" title="Three kits, one language" />
      <div className="grid-fit" style={{ '--min': '260px', '--gap': '14px' }}>
        <div className="ds-card">
          <LearnMobile />
          <h3 className="ds-h3">Nnọọ Learn — mobile</h3>
          <p className="ds-c13">Learn, Ọbá, Ọha and You tabs. Single column, 20px inset, 60px tab bar plus safe area. Daily lesson with tonal feedback, streak and proverb of the day.</p>
        </div>
        <div className="ds-card">
          <FacilitatorTablet />
          <h3 className="ds-h3">Facilitator — tablet</h3>
          <p className="ds-c13">320px left rail (session, checklist, guidance) and a content area flowing setup → recording → review. Provenance is always visible; one big action at a time.</p>
        </div>
        <div className="ds-card">
          <MarketingWeb />
          <h3 className="ds-h3">Marketing site — web</h3>
          <p className="ds-c13">Centred 1200px column, 32px gutter. Warm radial hero, “two hands, one body” panel pair, Fraunces proverb block, three-way CTA grid, footer with elder-consent link.</p>
        </div>
      </div>
    </section>
  );
}
