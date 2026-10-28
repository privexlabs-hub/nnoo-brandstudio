// Nnọọ brand tokens — single source of truth for docs, playbook, editor and exports.
// Values mirror _ds/.../colors_and_type.css. Dark-mode semantic values are an extension defined here.

export const BRAND = {
  name: 'Nnọọ',
  meaning: 'Igbo for "welcome"',
  line: 'Two hands, one body.',
  summary: 'A voice-first mobile platform that preserves and transmits the living culture of Ndị Igbo — language, proverbs, recipes, music, ceremonies, material culture and place-histories — by recording it from elders, storing it with provenance, and teaching it to diaspora children with tonal pronunciation feedback.',
  surfaces: [
    { name: 'Nnọọ Learn', who: 'Diaspora children and adults', what: 'Lessons, tonal pronunciation feedback, daily proverb, flashcards', platform: 'iOS / Android' },
    { name: 'Ọbá Archive', who: 'Anyone', what: 'Browse and listen to elder recordings with full provenance (who, where, when, dialect)', platform: 'In-app', gloss: 'Ọbá — storehouse, treasury' },
    { name: 'Facilitator Mode', who: 'Community volunteers', what: 'Field-recording UI: sit with an elder, capture audio and metadata cleanly', platform: 'Tablet' },
    { name: 'Ọha Community', who: 'Diaspora Igbo', what: 'Find people by state, LGA, hometown, dialect; threads; local meetups', platform: 'In-app', gloss: 'Ọha — the community, the gathering' },
    { name: 'Marketing site', who: 'Public and donors', what: 'Explain the mission, invite contribution', platform: 'Web' }
  ]
};

const C = (token, name, hex, role, usage, on, dark) => ({ token, name, hex, role, usage, on, dark });

export const COLOR_GROUPS = [
  { id: 'clay', name: 'Clay — primary brand', note: 'Terracotta red-orange. The signature. Use for primary actions, the logo mark and key brand moments.', items: [
    C('clay-50', 'Clay 50', '#fdf4ee', 'Tint wash', 'Large quiet fills behind clay content; hover rows.', ['ink-900', 'clay-700'], 'Not used as a fill in dark mode; use clay-900.'),
    C('clay-100', 'Clay 100', '#fbe4d4', 'Brand soft', 'Secondary buttons, selected chips, soft callouts (--brand-soft).', ['clay-700', 'ink-900'], 'Replaced by clay-900 as --brand-soft.'),
    C('clay-200', 'Clay 200', '#f5c4a1', 'Selection / highlight', 'Text selection, highlight marks, accents on clay-700+ grounds.', ['ink-900', 'clay-800'], 'Used as --brand-soft-fg and --brand-press in dark.'),
    C('clay-300', 'Clay 300', '#eca372', 'Decorative', 'Illustration, charts, decorative arcs. Not for text on light.', ['ink-900'], 'Dark-mode --brand-hover.'),
    C('clay-400', 'Clay 400', '#e17f47', 'Bright clay', 'Charts and illustration on light; the brand colour on dark grounds.', ['ink-900', 'ink-ground'], 'Dark-mode --brand (fills with ink text, links, icons).'),
    C('clay-500', 'Clay 500', '#c85a26', 'Primary brand', 'Primary buttons, logo mark, active tabs, focus ring base (--brand).', ['bone', 'paper'], 'Kept for logo and artwork; UI fills shift to clay-400.'),
    C('clay-600', 'Clay 600', '#a7471c', 'Brand hover', 'Hover state for clay fills (--brand-hover). Small clay text on light.', ['bone', 'paper'], 'Not used in dark UI chrome.'),
    C('clay-700', 'Clay 700', '#873818', 'Brand press / soft text', 'Pressed state; text on clay-100 (--brand-soft-fg).', ['clay-100', 'bone', 'paper'], 'Not used in dark UI chrome.'),
    C('clay-800', 'Clay 800', '#5f2811', 'Deep clay', 'Deep grounds for marketing; text on clay-200.', ['clay-200', 'bone'], 'Occasional deep ground.'),
    C('clay-900', 'Clay 900', '#3a1809', 'Darkest clay / shadow tint', 'Shadow tint base (rgba 58,24,9); deepest brand ground.', ['bone', 'clay-200'], 'Dark-mode --brand-soft.')
  ] },
  { id: 'marigold', name: 'Marigold — accent (edódó)', note: 'Warm highlight. Streaks, highlights, celebratory moments. Never body text on light grounds below 600.', items: [
    C('marigold-50', 'Marigold 50', '#fdf6e3', 'Tint wash', 'Quiet highlight backgrounds.', ['ink-900'], 'Not used in dark.'),
    C('marigold-100', 'Marigold 100', '#fae9b8', 'Accent soft', 'Highlight chips, streak backgrounds (--accent-soft).', ['ink-900', 'marigold-700'], 'Replaced by #3a2a08.'),
    C('marigold-200', 'Marigold 200', '#f5d477', 'Light accent', 'Accent text/arcs on clay, plum or ink grounds.', ['clay-500', 'plum-500', 'ink-900'], 'Accent on dark grounds.'),
    C('marigold-300', 'Marigold 300', '#eebb3a', 'Bright accent', 'Avatar grounds, illustration, chart series.', ['ink-900'], 'Dark-mode --accent and --warning.'),
    C('marigold-400', 'Marigold 400', '#d9a019', 'Accent', 'Icons, progress, streak flame (--accent). Not for text on light.', ['ink-900'], 'Replaced by marigold-300.'),
    C('marigold-500', 'Marigold 500', '#b88214', 'Warning', 'Warning icons and borders (--warning). Pair with ink text.', ['ink-900', 'paper'], 'Replaced by marigold-300.'),
    C('marigold-600', 'Marigold 600', '#8f6410', 'Deep marigold', 'Marigold text on marigold-50/100.', ['marigold-100', 'paper'], 'Not used.'),
    C('marigold-700', 'Marigold 700', '#684809', 'Darkest marigold', 'Text on marigold-200/300 grounds.', ['marigold-200', 'marigold-300'], 'Not used.')
  ] },
  { id: 'plum', name: 'Plum — community (Ọha)', note: 'Rare. Community signals only — Ọha, people, gatherings, info.', items: [
    C('plum-50', 'Plum 50', '#f7f1f4', 'Tint wash', 'Community surface wash.', ['plum-700', 'ink-900'], 'Not used.'),
    C('plum-100', 'Plum 100', '#ebd9e3', 'Community soft', 'Community chips and badges (--community-soft).', ['plum-700', 'plum-500'], 'Replaced by #2e1022.'),
    C('plum-300', 'Plum 300', '#a8678a', 'Light plum', 'Charts; plum on dark grounds.', ['ink-900', 'ink-ground'], 'Dark-mode --community and --info.'),
    C('plum-500', 'Plum 500', '#6d2c4f', 'Community', 'Ọha identity, info states (--community, --info).', ['bone', 'paper', 'plum-100'], 'Replaced by plum-300.'),
    C('plum-700', 'Plum 700', '#421630', 'Deep plum', 'Text on plum-100; deep community grounds.', ['plum-100', 'bone'], 'Occasional ground.'),
    C('plum-900', 'Plum 900', '#1f0a17', 'Darkest plum', 'Deepest community ground.', ['bone', 'plum-100'], 'Ground only.')
  ] },
  { id: 'forest', name: 'Forest — archival (Ọbá)', note: 'Provenance and the archive. Elder content, consent, verification, success.', items: [
    C('forest-50', 'Forest 50', '#eef4ef', 'Tint wash', 'Archive surface wash.', ['forest-700', 'ink-900'], 'Not used.'),
    C('forest-100', 'Forest 100', '#d0e0d4', 'Archival soft / provenance rule', 'Left rule on elder cards; provenance chips (--archival-soft).', ['forest-700', 'forest-500'], 'Replaced by #15301d.'),
    C('forest-300', 'Forest 300', '#6f9778', 'Light forest', 'Charts; archival on dark grounds.', ['ink-900', 'ink-ground'], 'Dark-mode --archival and --success.'),
    C('forest-500', 'Forest 500', '#2e5d3a', 'Archival / success', 'Provenance labels, verified badges, success (--archival, --success).', ['bone', 'paper', 'forest-100'], 'Replaced by forest-300.'),
    C('forest-700', 'Forest 700', '#153a1f', 'Deep forest', 'Text on forest-100; deep archive grounds.', ['forest-100', 'bone'], 'Ground only.')
  ] },
  { id: 'neutral', name: 'Warm neutrals — never pure grey', note: 'Every neutral has a warm bias. Bone is the page, paper is the card, ink is the text.', items: [
    C('bone', 'Bone', '#faf5ec', 'Page background', 'Default app and artwork background (--bg). Text on clay.', ['ink-900', 'ink-700', 'clay-500'], 'Becomes text colour (--fg).'),
    C('cream', 'Cream', '#f3ead8', 'Raised surface', 'Raised sections, archival cards (--bg-raised).', ['ink-900', 'ink-700'], 'Replaced by #211810.'),
    C('paper', 'Paper', '#ffffff', 'Card surface', 'Cards, inputs, sheets (--bg-card).', ['ink-900', 'clay-500'], 'Replaced by #2a1f15.'),
    C('sand', 'Sand', '#e8dfc9', 'Low-emphasis surface', 'Tracks, dividers, inactive fills.', ['ink-900'], 'Replaced by #3d2e1f.'),
    C('clay-dust', 'Clay dust', '#d6c8ad', 'Warm divider', 'Strong borders, outline buttons (--border-strong).', ['ink-900'], 'Replaced by #5a4632.'),
    C('ink-100', 'Ink 100', '#d9cfbd', 'Hairline', '1px borders and hairlines (--border).', ['ink-900'], 'Replaced by #3d2e1f.'),
    C('ink-300', 'Ink 300', '#a99983', 'Disabled', 'Disabled text and icons (--fg-disabled). Never informational.', ['paper'], 'Replaced by #6b5945.'),
    C('ink-500', 'Ink 500', '#6b5945', 'Tertiary text', 'Captions, placeholders, inactive tabs (--fg-subtle).', ['bone', 'paper', 'cream'], 'Replaced by #b8a68d.'),
    C('ink-700', 'Ink 700', '#3d2e1f', 'Secondary text', 'Body copy (--fg-muted).', ['bone', 'paper', 'cream'], 'Replaced by #e3d6c2.'),
    C('ink-900', 'Ink 900', '#1a120b', 'Primary text', 'Headings and primary text (--fg); inverse grounds.', ['bone', 'paper', 'cream', 'marigold-300'], 'Becomes the near-black ground.')
  ] },
  { id: 'status', name: 'Status', note: 'Semantic status colours always pair with an icon and words — never colour alone.', items: [
    C('success', 'Success', '#2e5d3a', 'Success', 'Saved, verified, completed (= forest-500).', ['bone', 'paper'], '#6f9778'),
    C('warning', 'Warning', '#b88214', 'Warning', 'Needs attention (= marigold-500). Pair with ink text.', ['paper'], '#eebb3a'),
    C('danger', 'Danger', '#b33a2a', 'Error / destructive', 'Errors, delete confirmations.', ['bone', 'paper'], '#e0705f'),
    C('info', 'Info', '#6d2c4f', 'Information', 'Neutral notices (= plum-500).', ['bone', 'paper'], '#a8678a')
  ] }
];

export const DARK_GROUND = '#17110b';

export const HEX = {};
COLOR_GROUPS.forEach(g => g.items.forEach(i => { HEX[i.token] = i.hex; }));
HEX['ink-ground'] = DARK_GROUND;

export const SEMANTIC = [
  ['--bg', 'Page background', 'bone', '#17110b'],
  ['--bg-raised', 'Raised surface', 'cream', '#211810'],
  ['--bg-card', 'Card surface', 'paper', '#2a1f15'],
  ['--bg-inverse', 'Inverse surface', 'ink-900', '#faf5ec'],
  ['--fg', 'Primary text', 'ink-900', '#faf5ec'],
  ['--fg-muted', 'Secondary text', 'ink-700', '#e3d6c2'],
  ['--fg-subtle', 'Tertiary text', 'ink-500', '#b8a68d'],
  ['--fg-disabled', 'Disabled text', 'ink-300', '#6b5945'],
  ['--fg-inverse', 'Text on inverse', 'bone', '#1a120b'],
  ['--fg-on-clay', 'Text on brand fill', 'bone', '#1a120b'],
  ['--border', 'Hairline', 'ink-100', '#3d2e1f'],
  ['--border-strong', 'Strong border', 'clay-dust', '#5a4632'],
  ['--border-accent', 'Focus border', 'clay-500', '#e17f47'],
  ['--brand', 'Brand fill / link', 'clay-500', '#e17f47'],
  ['--brand-hover', 'Brand hover', 'clay-600', '#eca372'],
  ['--brand-press', 'Brand pressed', 'clay-700', '#f5c4a1'],
  ['--brand-soft', 'Brand soft fill', 'clay-100', '#3a1809'],
  ['--brand-soft-fg', 'Text on brand soft', 'clay-700', '#f5c4a1'],
  ['--accent', 'Accent', 'marigold-400', '#eebb3a'],
  ['--accent-soft', 'Accent soft', 'marigold-100', '#3a2a08'],
  ['--archival', 'Archive / provenance', 'forest-500', '#6f9778'],
  ['--archival-soft', 'Archive soft', 'forest-100', '#15301d'],
  ['--community', 'Community (Ọha)', 'plum-500', '#a8678a'],
  ['--community-soft', 'Community soft', 'plum-100', '#2e1022'],
  ['--success', 'Success', 'forest-500', '#6f9778'],
  ['--warning', 'Warning', 'marigold-500', '#eebb3a'],
  ['--danger', 'Danger', 'danger', '#e0705f'],
  ['--info', 'Info', 'plum-500', '#a8678a']
].map(([v, purpose, light, dark]) => ({ v, purpose, light, lightHex: HEX[light] || light, dark }));

export const DARK_EXTRA = {
  '--shadow-xs': '0 1px 2px rgba(0,0,0,0.30)',
  '--shadow-sm': '0 2px 6px rgba(0,0,0,0.34)',
  '--shadow-md': '0 6px 18px rgba(0,0,0,0.40)',
  '--shadow-lg': '0 14px 40px rgba(0,0,0,0.46)',
  '--shadow-xl': '0 28px 72px rgba(0,0,0,0.52)',
  '--ring': '0 0 0 3px rgba(225,127,71,0.40)',
  '--ring-accent': '0 0 0 3px rgba(238,187,58,0.40)'
};

export const FAMILIES = [
  { token: '--font-display', name: 'Outfit', stack: '"Outfit", "SF Pro Display", -apple-system, system-ui, sans-serif', weights: [400, 500, 600, 700, 800], role: 'Display, headings, buttons', rule: 'Geometric and rounded with personality. Tight tracking (-0.02em) at display sizes.', licence: 'SIL Open Font License 1.1', source: 'https://fonts.google.com/specimen/Outfit' },
  { token: '--font-body', name: 'DM Sans', stack: '"DM Sans", "SF Pro Text", -apple-system, system-ui, sans-serif', weights: [400, 500, 600, 700], role: 'Body and UI', rule: 'Humanist and clean; optical-size axis 9–40. Default tracking.', licence: 'SIL Open Font License 1.1', source: 'https://fonts.google.com/specimen/DM+Sans' },
  { token: '--font-archive', name: 'Fraunces', stack: '"Fraunces", "Iowan Old Style", Georgia, serif', weights: [400, 500, 600], role: 'Archival and elder content only', rule: 'Quoted proverbs, elder names, transcripts. Never UI chrome.', licence: 'SIL Open Font License 1.1', source: 'https://fonts.google.com/specimen/Fraunces' },
  { token: '--font-mono', name: 'System mono', stack: 'ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, monospace', weights: [400], role: 'Token values, code, metadata IDs', rule: 'Values and identifiers only.', licence: 'System font', source: '' }
];

export const TYPE_SCALE = [
  ['--text-xs', 12, '0.75rem', 'Eyebrows, captions, legal'],
  ['--text-sm', 14, '0.875rem', 'Secondary UI, metadata'],
  ['--text-base', 16, '1rem', 'Body, inputs'],
  ['--text-md', 18, '1.125rem', 'Lead body'],
  ['--text-lg', 22, '1.375rem', 'H3, card titles'],
  ['--text-xl', 28, '1.75rem', 'H2'],
  ['--text-2xl', 36, '2.25rem', 'H1'],
  ['--text-3xl', 48, '3rem', 'Display minimum'],
  ['--text-4xl', 64, '4rem', 'Display 2 maximum'],
  ['--text-5xl', 88, '5.5rem', 'Hero maximum']
].map(([token, px, rem, use]) => ({ token, px, rem, use }));

export const TYPE_STYLES = [
  { name: 'Display 1', cls: 'display-1', family: 'Outfit', weight: 700, size: 'clamp(48px, 6vw, 88px)', px: 64, lh: 1.08, ls: '-0.02em', use: 'Hero headlines. One per screen.' },
  { name: 'Display 2', cls: 'display-2', family: 'Outfit', weight: 700, size: 'clamp(36px, 4.5vw, 64px)', px: 48, lh: 1.08, ls: '-0.02em', use: 'Section heroes, slide titles.' },
  { name: 'Heading 1', cls: 'h1', family: 'Outfit', weight: 700, size: '36px', px: 36, lh: 1.08, ls: '-0.02em', use: 'Page titles.' },
  { name: 'Heading 2', cls: 'h2', family: 'Outfit', weight: 600, size: '28px', px: 28, lh: 1.25, ls: '-0.02em', use: 'Section titles.' },
  { name: 'Heading 3', cls: 'h3', family: 'Outfit', weight: 600, size: '22px', px: 22, lh: 1.25, ls: '0', use: 'Card and group titles.' },
  { name: 'Eyebrow', cls: 'eyebrow', family: 'DM Sans', weight: 600, size: '12px', px: 12, lh: 1.5, ls: '0.12em', upper: true, use: 'Tiny labels above headings. The only all-caps style.' },
  { name: 'Body large', cls: 'body-lg', family: 'DM Sans', weight: 400, size: '18px', px: 18, lh: 1.7, ls: '0', use: 'Lead paragraphs.' },
  { name: 'Body', cls: 'body', family: 'DM Sans', weight: 400, size: '16px', px: 16, lh: 1.7, ls: '0', use: 'Default reading text.' },
  { name: 'Body small', cls: 'body-sm', family: 'DM Sans', weight: 400, size: '14px', px: 14, lh: 1.5, ls: '0', use: 'Dense UI, secondary text.' },
  { name: 'Caption', cls: 'caption', family: 'DM Sans', weight: 400, size: '12px', px: 12, lh: 1.5, ls: '0', use: 'Image credits, timestamps.' },
  { name: 'Archive display', cls: 'archive-display', family: 'Fraunces', weight: 500, size: 'clamp(36px, 5vw, 64px)', px: 44, lh: 1.05, ls: '-0.015em', use: 'Proverbs, elder titles.' },
  { name: 'Archive', cls: 'archive', family: 'Fraunces', weight: 400, size: '18px', px: 18, lh: 1.5, ls: '0', use: 'Transcripts, elder names.' },
  { name: 'Mono', cls: 'mono', family: 'System mono', weight: 400, size: '14px', px: 14, lh: 1.5, ls: '0', use: 'Token values, IDs.' }
];

export const LEADING = [['--leading-tight', '1.08', 'Display, headings'], ['--leading-snug', '1.25', 'H2/H3, UI labels'], ['--leading-normal', '1.5', 'UI text, captions'], ['--leading-relaxed', '1.7', 'Reading text']];
export const TRACKING = [['--tracking-tight', '-0.02em', 'Display & headings'], ['--tracking-normal', '0', 'Body'], ['--tracking-wide', '0.04em', 'Small buttons, labels'], ['--tracking-caps', '0.12em', 'Eyebrows (caps)']];

export const SPACING = [
  ['--s-0', 0, '0'], ['--s-1', 4, '0.25rem'], ['--s-2', 8, '0.5rem'], ['--s-3', 12, '0.75rem'], ['--s-4', 16, '1rem'],
  ['--s-5', 24, '1.5rem'], ['--s-6', 32, '2rem'], ['--s-7', 40, '2.5rem'], ['--s-8', 48, '3rem'], ['--s-9', 64, '4rem'], ['--s-10', 96, '6rem']
].map(([token, px, rem]) => ({ token, px, rem, use: { 0: 'Reset', 4: 'Icon–label gaps', 8: 'Tight stacks, chip padding', 12: 'Input padding, list gaps', 16: 'Card padding (mobile)', 24: 'Card padding, group gaps', 32: 'Section gaps, web gutter', 40: 'Large group gaps', 48: 'Section padding (mobile)', 64: 'Section padding (desktop)', 96: 'Hero padding' }[px] }));

export const RADII = [
  ['--r-xs', 4, 'Tiny tags, progress ends'], ['--r-sm', 8, 'Small chips, thumbnails'], ['--r-md', 12, 'Inputs, buttons'], ['--r-lg', 18, 'Cards'],
  ['--r-xl', 24, 'Sheets, modals'], ['--r-2xl', 32, 'Hero cards'], ['--r-full', 999, 'Pills: tags, badges, avatars only']
].map(([token, px, use]) => ({ token, px, use }));

export const SHADOWS = [
  ['--shadow-xs', '0 1px 2px rgba(58, 24, 9, 0.06)', 'Hairline lift: inputs on cream'],
  ['--shadow-sm', '0 2px 6px rgba(58, 24, 9, 0.08)', 'Raised cards'],
  ['--shadow-md', '0 6px 18px rgba(58, 24, 9, 0.10)', 'Interactive cards, hover'],
  ['--shadow-lg', '0 14px 40px rgba(58, 24, 9, 0.14)', 'Menus, popovers'],
  ['--shadow-xl', '0 28px 72px rgba(58, 24, 9, 0.18)', 'Modals, sheets'],
  ['--ring', '0 0 0 3px rgba(200, 90, 38, 0.28)', 'Focus ring'],
  ['--ring-accent', '0 0 0 3px rgba(217, 160, 25, 0.32)', 'Accent focus (celebration)']
].map(([token, value, use]) => ({ token, value, use }));

export const MOTION = [
  ['--dur-fast', '120ms', 'Press feedback'], ['--dur-med', '220ms', 'Default transitions, entry'], ['--dur-slow', '420ms', 'Celebration (once)'],
  ['--ease-out', 'cubic-bezier(0.2, 0.7, 0.2, 1)', 'Default — entries, hovers'], ['--ease-in', 'cubic-bezier(0.5, 0, 0.8, 0.3)', 'Exits'],
  ['--ease-in-out', 'cubic-bezier(0.45, 0, 0.2, 1)', 'Moves, sheets'], ['--ease-overshoot', 'cubic-bezier(0.34, 1.56, 0.64, 1)', 'Lesson-complete card only']
].map(([token, value, use]) => ({ token, value, use }));

export const BREAKPOINTS = [
  { name: 'Mobile', range: '0–639px', cols: 4, gutter: 16, margin: 20, container: 'fluid', note: 'Single column, 20px inset, bottom tab bar 60px + safe area.' },
  { name: 'Tablet', range: '640–1023px', cols: 8, gutter: 24, margin: 24, container: 'fluid', note: 'Facilitator: 320px left rail + content.' },
  { name: 'Desktop', range: '1024–1439px', cols: 12, gutter: 32, margin: 32, container: '1200px', note: 'Centred column max 1200px, 32px gutter.' },
  { name: 'Wide', range: '1440px+', cols: 12, gutter: 32, margin: 32, container: '1440px (tools only)', note: 'Editors and dashboards may use --maxw-wide.' }
];

export const LAYOUT = [['--maxw-prose', '64ch', 'Reading measure'], ['--maxw-app', '1200px', 'Web content container'], ['--maxw-wide', '1440px', 'Tools, editors'], ['--z-nav', '10', 'Sticky header'], ['--z-overlay', '50', 'Scrims'], ['--z-modal', '60', 'Dialogs'], ['--z-toast', '70', 'Toasts']];

export const LOGOS = [
  { id: 'mark-clay', name: 'Mark — clay', file: 'assets/brand/logo/nnoo-mark-clay.svg', ground: 'bone', use: 'Default symbol. App icon source, avatars, favicons, small brand moments.' },
  { id: 'mark-ink', name: 'Mark — ink', file: 'assets/brand/logo/nnoo-mark-ink.svg', ground: 'bone', use: 'Single-colour contexts, marigold grounds, print in one colour.' },
  { id: 'mark-bone', name: 'Mark — bone', file: 'assets/brand/logo/nnoo-mark-bone.svg', ground: 'clay-500', use: 'On clay, plum, forest or ink grounds.' },
  { id: 'mark-outline', name: 'Mark — outline', file: 'assets/brand/logo/nnoo-mark-outline.svg', ground: 'bone', use: 'Quiet watermark, secondary placements ≥ 32px.' },
  { id: 'mark-outline-bone', name: 'Mark — outline bone', file: 'assets/brand/logo/nnoo-mark-outline-bone.svg', ground: 'ink-900', use: 'Outline mark on dark grounds.' },
  { id: 'lockup', name: 'Horizontal lockup', file: 'assets/brand/logo/nnoo-lockup-horizontal.svg', ground: 'bone', use: 'Primary logo. Headers, documents, marketing.' },
  { id: 'lockup-dark', name: 'Horizontal lockup — on dark', file: 'assets/brand/logo/nnoo-lockup-horizontal-on-dark.svg', ground: 'ink-900', use: 'Dark mode, ink and deep grounds.' },
  { id: 'lockup-reversed', name: 'Horizontal lockup — reversed', file: 'assets/brand/logo/nnoo-lockup-horizontal-reversed.svg', ground: 'clay-500', use: 'Self-contained clay tile. Partner logos rows, stickers.' },
  { id: 'wordmark', name: 'Wordmark — ink', file: 'assets/brand/logo/nnoo-wordmark.svg', ground: 'bone', use: 'Type-only contexts where the mark already appears nearby.' },
  { id: 'wordmark-bone', name: 'Wordmark — bone', file: 'assets/brand/logo/nnoo-wordmark-bone.svg', ground: 'clay-500', use: 'Wordmark on dark or clay grounds.' },
  { id: 'wordmark-clay', name: 'Wordmark — clay', file: 'assets/brand/logo/nnoo-wordmark-clay.svg', ground: 'bone', use: 'Single-colour brand wordmark on light.' }
];
export const LOGO_FILE = Object.fromEntries(LOGOS.map(l => [l.id, l.file]));
export const LOGO_RATIO = { 'mark-clay': 1, 'mark-ink': 1, 'mark-bone': 1, 'mark-outline': 1, 'mark-outline-bone': 1, lockup: 3.5, 'lockup-dark': 3.5, 'lockup-reversed': 3.5, wordmark: 3.33, 'wordmark-bone': 3.33, 'wordmark-clay': 3.33 };

export const ASSETS = [
  { group: 'Logos', items: LOGOS.map(l => ({ name: l.name, file: l.file, desc: l.use, ground: l.ground })).concat([{ name: 'Mark — clay PNG 1024', file: 'assets/brand/logo/nnoo-mark-clay-1024.png', desc: 'Raster master for app stores and platforms that reject SVG.', ground: 'bone' }]) },
  { group: 'Favicons', items: [
    { name: 'Favicon SVG', file: 'assets/brand/favicon/favicon.svg', desc: 'Source favicon. Heavier strokes for legibility at 16px.', ground: 'bone' },
    { name: 'Favicon 16', file: 'assets/brand/favicon/favicon-16.png', desc: '16×16 PNG', ground: 'bone' },
    { name: 'Favicon 32', file: 'assets/brand/favicon/favicon-32.png', desc: '32×32 PNG', ground: 'bone' },
    { name: 'Favicon 48', file: 'assets/brand/favicon/favicon-48.png', desc: '48×48 PNG', ground: 'bone' },
    { name: 'Android 192', file: 'assets/brand/favicon/favicon-192.png', desc: '192×192 PNG (manifest)', ground: 'bone' },
    { name: 'PWA 512', file: 'assets/brand/favicon/favicon-512.png', desc: '512×512 PNG (manifest)', ground: 'bone' },
    { name: 'Apple touch icon', file: 'assets/brand/favicon/apple-touch-icon-180.png', desc: '180×180 PNG, full-bleed clay', ground: 'bone' }
  ] },
  { group: 'Avatars', items: [
    { name: 'Avatar — clay on bone', file: 'assets/brand/avatars/avatar-clay-on-bone-400.png', desc: '400×400 profile image (default)', ground: 'bone' },
    { name: 'Avatar — bone on clay', file: 'assets/brand/avatars/avatar-bone-on-clay-400.png', desc: '400×400 profile image', ground: 'bone' },
    { name: 'Avatar — ink on marigold', file: 'assets/brand/avatars/avatar-ink-on-marigold-400.png', desc: '400×400 profile image (campaigns)', ground: 'bone' },
    { name: 'Avatar — outline on ink', file: 'assets/brand/avatars/avatar-outline-on-ink-400.png', desc: '400×400 profile image (dark platforms)', ground: 'bone' }
  ] },
  { group: 'Motifs & graphics', items: [
    { name: 'Rhythm pattern', file: 'assets/brand/motifs/pattern-rhythm.svg', desc: 'Abstract dots + arcs tile (40px). Original geometry — not a traditional motif.', ground: 'bone' },
    { name: 'Waveform', file: 'assets/brand/graphics/waveform.svg', desc: 'Audio signature. Audio is first-class.', ground: 'bone' }
  ] },
  { group: 'Imagery placeholders', items: [
    { name: 'Placeholder — warm', file: 'assets/brand/imagery/placeholder-warm.svg', desc: 'Tonal colour field for portraits until real, credited photography exists.', ground: 'bone' },
    { name: 'Placeholder — cool', file: 'assets/brand/imagery/placeholder-cool.svg', desc: 'Forest colour field for landscapes and objects.', ground: 'bone' }
  ] },
  { group: 'Fonts', items: [
    { name: 'Brand fonts stylesheet', file: 'assets/brand/fonts/fonts.css', desc: 'Self-hosted @font-face rules for Outfit, DM Sans, Fraunces.', ground: 'bone', font: true },
    { name: 'Font licences', file: 'assets/brand/fonts/LICENSES.md', desc: 'SIL Open Font License 1.1 notices and sources.', ground: 'bone', font: true },
    { name: 'Outfit — latin', file: 'assets/brand/fonts/files/Outfit-normal-latin-variable.woff2', desc: 'Variable 400–800', ground: 'bone', font: 'Outfit' },
    { name: 'Outfit — latin-ext', file: 'assets/brand/fonts/files/Outfit-normal-latin-ext-variable.woff2', desc: 'Variable 400–800', ground: 'bone', font: 'Outfit' },
    { name: 'DM Sans — latin', file: 'assets/brand/fonts/files/DMSans-normal-latin-variable.woff2', desc: 'Variable, opsz 9–40', ground: 'bone', font: 'DM Sans' },
    { name: 'DM Sans — latin-ext', file: 'assets/brand/fonts/files/DMSans-normal-latin-ext-variable.woff2', desc: 'Variable, opsz 9–40', ground: 'bone', font: 'DM Sans' },
    { name: 'DM Sans italic — latin', file: 'assets/brand/fonts/files/DMSans-italic-latin-variable.woff2', desc: 'Variable italic', ground: 'bone', font: 'DM Sans' },
    { name: 'DM Sans italic — latin-ext', file: 'assets/brand/fonts/files/DMSans-italic-latin-ext-variable.woff2', desc: 'Variable italic', ground: 'bone', font: 'DM Sans' },
    { name: 'Fraunces — latin', file: 'assets/brand/fonts/files/Fraunces-normal-latin-variable.woff2', desc: 'Variable 400–600', ground: 'bone', font: 'Fraunces' },
    { name: 'Fraunces — latin-ext', file: 'assets/brand/fonts/files/Fraunces-normal-latin-ext-variable.woff2', desc: 'Variable 400–600', ground: 'bone', font: 'Fraunces' },
    { name: 'Fraunces — vietnamese (ọ ị ụ)', file: 'assets/brand/fonts/files/Fraunces-normal-vietnamese-variable.woff2', desc: 'Covers precomposed dot-below vowels', ground: 'bone', font: 'Fraunces' },
    { name: 'Fraunces italic — latin', file: 'assets/brand/fonts/files/Fraunces-italic-latin-variable.woff2', desc: 'Variable italic', ground: 'bone', font: 'Fraunces' },
    { name: 'Fraunces italic — latin-ext', file: 'assets/brand/fonts/files/Fraunces-italic-latin-ext-variable.woff2', desc: 'Variable italic', ground: 'bone', font: 'Fraunces' },
    { name: 'Fraunces italic — vietnamese', file: 'assets/brand/fonts/files/Fraunces-italic-vietnamese-variable.woff2', desc: 'Variable italic', ground: 'bone', font: 'Fraunces' }
  ] }
];

// ---- colour maths ----
export function hexToRgb(hex) { const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export function rgbStr(hex) { return 'rgb(' + hexToRgb(hex).join(', ') + ')'; }
export function hslStr(hex) {
  let [r, g, b] = hexToRgb(hex).map(v => v / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}
export function oklchStr(hex) {
  const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const [r, g, b] = hexToRgb(hex).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const Cc = Math.sqrt(A * A + B * B); let H = Math.atan2(B, A) * 180 / Math.PI; if (H < 0) H += 360;
  return `oklch(${(L * 100).toFixed(1)}% ${Cc.toFixed(3)} ${Cc < 0.002 ? 0 : H.toFixed(1)})`;
}
export function luminance(hex) { const [r, g, b] = hexToRgb(hex).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
export function contrast(a, b) { const A = luminance(HEX[a] || a), B = luminance(HEX[b] || b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); }
export function grade(ratio) { return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'Fail'; }
export function resolveColor(c) { if (!c) return 'transparent'; if (c[0] === '#' || c.startsWith('rgb') || c === 'transparent') return c; return HEX[c] || c; }
export function bestText(bg) { const h = resolveColor(bg); return contrast(h, '#1a120b') >= contrast(h, '#faf5ec') ? 'ink-900' : 'bone'; }

export const BRAND_SWATCHES = ['clay-500', 'clay-600', 'clay-700', 'clay-100', 'clay-400', 'marigold-200', 'marigold-300', 'marigold-400', 'plum-500', 'plum-100', 'forest-500', 'forest-100', 'bone', 'cream', 'paper', 'sand', 'ink-900', 'ink-700', 'ink-500', 'clay-900'];
