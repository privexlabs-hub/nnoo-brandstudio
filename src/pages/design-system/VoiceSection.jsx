import React from 'react';
import { Link } from 'react-router-dom';
import { SecHead } from './shared.jsx';

const TONE = [
  ['Lesson success', '“Ọ dị mma. Your tone was right.”', '“Level up! +20 XP!”'],
  ['Elder recording intro', '“Take your time. There is no hurry.”', '“Tap to record — ready, set, go!”'],
  ['Error', '“The recording didn’t catch. Would you try once more?”', '“Oops! Something went wrong.”'],
  ['Empty state', '“No recordings yet from your hometown. Be the first.”', '“Nothing here”'],
  ['Streak break', '“Welcome back. The words waited for you.”', '“You lost your streak! Come back!”']
];

export default function VoiceSection() {
  const cell = { padding: '10px 14px', verticalAlign: 'top' };
  return (
    <section id="ds-voice" className="ds-sec tighter">
      <SecHead eyebrow="08 · Voice" title="Reverent and warm, with moments of encouragement" />
      <div className="scroll-x ds-tbl" style={{ background: 'var(--bg-card)' }}>
        <table style={{ fontSize: 14, minWidth: 560 }}>
          <thead><tr>
            <th style={{ padding: '10px 14px' }}>Context</th>
            <th style={{ padding: '10px 14px', color: 'var(--success)' }}>Do</th>
            <th style={{ padding: '10px 14px', color: 'var(--danger)' }}>Don’t</th>
          </tr></thead>
          <tbody>
            {TONE.map(([c, d, n]) => (
              <tr key={c}>
                <td style={{ ...cell, fontWeight: 600, color: 'var(--fg)' }}>{c}</td>
                <td style={{ ...cell, color: 'var(--fg)' }}>{d}</td>
                <td style={{ ...cell, color: 'var(--fg-subtle)' }}>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/voice" className="ds-link">Open the full voice & knowledge reference →</Link>
    </section>
  );
}
