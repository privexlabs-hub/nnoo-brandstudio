import React from 'react';
import { SecHead } from './shared.jsx';

const GOVERNANCE = [
  { t: 'Ownership & change', items: ['Tokens live in src/styles/tokens.css (design system) and src/lib/tokens.js (studio). Change both together, never one.', 'Propose changes with the problem, the token affected, before/after and contrast results.', 'Version the system (semver): new tokens = minor, changed values = major.', 'Keep the playbook, editor and exports reading from the same tokens — no local copies.'] },
  { t: 'Naming', items: ['Raw scale: family-step (clay-500). Semantic: role (--brand, --fg-muted).', 'Components use semantic roles; brand artwork uses the raw scale.', 'Igbo names keep diacritics in copy; token names stay ASCII.'] },
  { t: 'Accessibility requirements', items: ['Text contrast AA (4.5:1), large text 3:1 — check the matrix above.', 'Visible focus on every interactive element (--ring).', 'Hit targets 44 × 44px on touch.', 'Respect reduced motion. Never rely on colour alone for status.', 'Alt text on every meaningful image; captions credit people.'] },
  { t: 'Review checklist', items: ['Uses the right role colour (clay brand, forest archive, plum community).', 'One motif per composition; pattern once per screen.', 'Sentence case, diacritics intact, no emoji.', 'Imagery is specific, credited and warm — or a neutral placeholder.', 'No unverified claims or numbers.'] },
  { t: 'Open items', items: ['Commission an Igbo-context icon set to replace Lucide.', 'Replace placeholder imagery with credited photography.', 'Seek Igbo co-authorship and elder council guidance on visual identity.', 'Verify Outfit and DM Sans dot-below rendering on all target devices.'] }
];

export default function Governance() {
  return (
    <section id="ds-governance" className="ds-sec tight">
      <SecHead eyebrow="12 · Governance" title="Keeping it consistent" />
      <div className="grid-fit" style={{ '--min': '260px', '--gap': '14px' }}>
        {GOVERNANCE.map(g => (
          <div key={g.t} className="ds-card g8">
            <h3 className="ds-h3">{g.t}</h3>
            <ul className="ds-list sm">{g.items.map(i => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
