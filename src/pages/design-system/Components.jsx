import React, { useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { MOTION } from '../../lib/tokens.js';
import { SecHead, cp } from './shared.jsx';

const BTN_STATES = [
  ['Default', {}, 'Save'], ['Hover', { background: 'var(--brand-hover)' }, 'Save'], ['Focus', { boxShadow: 'var(--ring)' }, 'Save'],
  ['Active', { background: 'var(--brand-press)', transform: 'scale(0.97)' }, 'Save'], ['Disabled', { opacity: 0.5 }, 'Save'],
  ['Loading', { opacity: 0.85 }, 'Saving', true], ['Success', { background: 'var(--success)', color: 'var(--fg-inverse)' }, 'Saved'],
  ['Error', { background: 'var(--danger)', color: '#faf5ec' }, 'Try again']
];
const INPUT_STATES = [
  ['Default', 'Nnewi', {}, 'Your hometown', 'var(--fg-subtle)'],
  ['Focused', 'Nnewi', { border: '2px solid var(--border-accent)', boxShadow: 'var(--ring)', padding: '0 13px' }, 'Focus: 2px accent border + ring', 'var(--fg-subtle)'],
  ['Error', '', { border: '2px solid var(--danger)', padding: '0 13px' }, 'The recording didn’t catch. Would you try once more?', 'var(--danger)'],
  ['Success', 'Umudioka', { border: '2px solid var(--success)', padding: '0 13px' }, 'Dialect saved.', 'var(--success)'],
  ['Disabled', 'Anambra', { opacity: 0.5 }, 'Set by the facilitator', 'var(--fg-subtle)']
];
const chip = (bg, fg, extra = {}) => ({ fontSize: 12, fontWeight: 600, padding: '5px 11px', borderRadius: 999, background: bg, color: fg, ...extra });
const BADGES = [
  ['Nnewi', chip('var(--brand-soft)', 'var(--brand-soft-fg)')], ['Umudioka dialect', chip('var(--archival-soft)', 'var(--archival)')],
  ['Ọha', chip('var(--community-soft)', 'var(--community)')], ['Streak 7', chip('var(--accent-soft)', 'var(--fg)')],
  ['Verified', chip('var(--archival)', 'var(--fg-inverse)')], ['Draft', chip('transparent', 'var(--fg-muted)', { border: '1px solid var(--border-strong)' })]
];
const TABBAR = [['Learn', 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z'], ['Ọbá', 'M3 12h4l3 8 4-16 3 8h4'], ['Ọha', 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z']];
const ALERTS = [
  ['Saved', 'Your recording is safe in Ọbá.', 'var(--success)'], ['Needs attention', 'Add the dialect before sharing.', 'var(--warning)'],
  ['The recording didn’t catch', 'Would you try once more?', 'var(--danger)'], ['A note', 'Recordings are shared only with the elder’s consent.', 'var(--info)']
];
const eyebrow = { fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' };

export default function Components() {
  const [tab, setTab] = useState(0);
  const [on, setOn] = useState(true);
  return (
    <section id="ds-components" className="ds-sec">
      <SecHead eyebrow="09 · Components" title="Components and their states" />
      <p className="ds-p15">Hover darkens one step (never lightens), press scales to 0.97 in 120ms, focus shows the 3px clay ring, disabled is 50% opacity. Try the live row; the rows below are pinned states.</p>

      <div className="ds-card" style={{ gap: 16 }}>
        <h3 className="ds-h3">Buttons</h3>
        <div className="row" style={{ '--gap': '10px' }}>
          <button type="button" className="ds-demo-btn primary">Start today’s lesson</button>
          <button type="button" className="ds-demo-btn soft">Listen to Ọbá</button>
          <button type="button" className="ds-demo-btn outline">Skip</button>
          <button type="button" className="ds-demo-btn ghost">Cancel</button>
          <button type="button" className="ds-demo-btn inverse">Start recording</button>
        </div>
        <div className="scroll-x" role="group" aria-label="Pinned button states">
          <div className="ds-states">
            {BTN_STATES.map(([label, st, text, spin]) => (
              <div key={label} className="ds-state">
                <span className="ds-state-label">{label}</span>
                <span className="ds-pinned" style={st}>{spin && <span className="ds-spin" aria-hidden="true" />}{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-fit" style={{ '--min': '260px', '--gap': '14px' }}>
        <div className="ds-card">
          <h3 className="ds-h3">Inputs</h3>
          {INPUT_STATES.map(([label, value, st, help, hc]) => (
            <label key={label} className="ds-input-lbl">
              <span>{label}</span>
              <input type="text" className="ds-input" value={value} readOnly disabled={label === 'Disabled'} style={st} />
              <span style={{ fontSize: 12, color: hc }}>{help}</span>
            </label>
          ))}
          <label className="ds-input-lbl">
            <span>Live — focus me</span>
            <input type="text" className="ds-input live" placeholder="Your hometown" />
          </label>
        </div>
        <div className="stack" style={{ '--gap': '14px' }}>
          <div className="ds-card g10">
            <h3 className="ds-h3">Badges & chips</h3>
            <div className="row" style={{ '--gap': '6px' }}>{BADGES.map(([t, st]) => <span key={t} style={st}>{t}</span>)}</div>
          </div>
          <div className="ds-card g10">
            <h3 className="ds-h3">Tabs & segmented</h3>
            <div role="tablist" aria-label="Lesson content" className="ds-seg">
              {['Lessons', 'Words', 'Proverbs'].map((t, i) => <button key={t} type="button" role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>{t}</button>)}
            </div>
            <div className="ds-tabbar">
              {TABBAR.map(([t, icon], i) => <span key={t} className={i === 0 ? 'on' : undefined}><Icon name={icon} size={24} />{t}</span>)}
            </div>
          </div>
          <div className="ds-card g10">
            <h3 className="ds-h3">Toggle</h3>
            <button type="button" role="switch" aria-checked={on} className="ds-switch" onClick={() => setOn(v => !v)}>
              <span className="ds-track"><span className="ds-knob" /></span>Daily proverb reminder
            </button>
          </div>
        </div>
      </div>

      <div className="grid-fit" style={{ '--min': '260px', '--gap': '14px' }}>
        <div className="ds-card g10 ds-lift">
          <span style={{ ...eyebrow, color: 'var(--fg-subtle)' }}>Lesson 4 · Greetings</span>
          <h3 className="ds-h3" style={{ fontSize: 22 }}>Greeting an elder</h3>
          <div className="ds-progress" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} aria-label="Lesson progress"><div /></div>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>3 of 5 words</span>
        </div>
        <div className="ds-archive-card">
          <span style={{ ...eyebrow, color: 'var(--archival)' }}>Ọbá · Recorded [Month Year]</span>
          <div style={{ fontFamily: 'var(--font-archive)', fontSize: 22, lineHeight: 1.3 }}>[Elder name]</div>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>[Hometown] · [Dialect] · Shared with consent</span>
          <img src="/assets/brand/graphics/waveform.svg" alt="" style={{ height: 36, width: '100%', objectFit: 'contain', objectPosition: 'left' }} />
        </div>
        <div className="ds-empty">
          <h3 className="ds-h3">Ọbá is empty for your hometown.</h3>
          <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5 }}>The first recording from Nnewi is waiting to be made.</p>
          <button type="button" className="ds-demo-btn primary sm">Become a facilitator</button>
        </div>
      </div>

      <div className="grid-fit" style={{ '--min': '260px', '--gap': '14px' }}>
        {ALERTS.map(([t, d, c]) => (
          <div key={t} role="status" className="ds-alert" style={{ borderLeftColor: c }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>{t}</strong>
            <span style={{ fontSize: 13, lineHeight: 1.5 }}>{d}</span>
          </div>
        ))}
      </div>

      <div className="ds-card">
        <h3 className="ds-h3">Motion</h3>
        <div className="row" style={{ '--gap': '6px' }}>
          {MOTION.map(m => <button key={m.token} type="button" className="ds-val md" onClick={cp('var(' + m.token + ')')}>{m.token + ': ' + m.value + ' — ' + m.use}</button>)}
        </div>
        <ul className="ds-list">
          <li>Unhurried: 220ms ease-out by default. Entries fade and rise 8px.</li>
          <li>Section transitions cross-fade; sheets slide with ease-in-out.</li>
          <li>The lesson-complete card bounces once (420ms overshoot). Nothing else bounces.</li>
          <li>With “reduce motion” on, every animation is removed and scrolling jumps instantly — this page and the editor respect it.</li>
        </ul>
      </div>
    </section>
  );
}
