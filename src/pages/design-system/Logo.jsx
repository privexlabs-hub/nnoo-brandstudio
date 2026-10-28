import React from 'react';
import { Link } from 'react-router-dom';
import { LOGOS, LOGO_RATIO, resolveColor } from '../../lib/tokens.js';
import { download, toast } from '../../lib/app.js';
import { SecHead, cp } from './shared.jsx';

const groundBg = g => (g === 'ink-900' ? '#1a120b' : resolveColor(g));
const baseName = f => f.split('/').pop();

// Rasterise an SVG logo to a PNG whose longest side is 1024px.
async function png(file, ratio = 1) {
  try {
    const im = new Image();
    im.src = file;
    await im.decode();
    let w = im.naturalWidth, h = im.naturalHeight;
    if (!w || !h) { w = ratio >= 1 ? 1024 : 1024 * ratio; h = ratio >= 1 ? 1024 / ratio : 1024; }
    const k = 1024 / Math.max(w, h);
    const c = document.createElement('canvas');
    c.width = Math.round(w * k); c.height = Math.round(h * k);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
    download(c.toDataURL('image/png'), baseName(file).replace('.svg', '') + '.png');
  } catch (e) { toast('Could not render PNG: ' + (e.message || 'image failed to load'), 'err'); }
}

const MARK = '/assets/brand/logo/nnoo-mark-clay.svg';
const MISUSE = [
  ['stretch or squash it.', { transform: 'scaleX(1.5)' }],
  ['recolour it outside the variants.', { filter: 'hue-rotate(160deg)' }],
  ['rotate it.', { transform: 'rotate(-18deg)' }],
  ['add shadows or effects.', { filter: 'drop-shadow(4px 6px 2px rgba(0,0,0,.55))' }],
  ['place the clay mark on clay.', {}, 'clay-500'],
  ['set it on busy imagery without an overlay.', {}, 'img']
];
const AVATARS = ['/assets/brand/avatars/avatar-clay-on-bone-400.png', '/assets/brand/avatars/avatar-bone-on-clay-400.png', '/assets/brand/avatars/avatar-ink-on-marigold-400.png', '/assets/brand/avatars/avatar-outline-on-ink-400.png', '/assets/brand/favicon/favicon-192.png'];

export default function Logo() {
  return (
    <section id="ds-logo" className="ds-sec tight">
      <SecHead eyebrow="02 · Logo" title="Two arcs meeting the dot below" />
      <p className="ds-p">The mark abstracts the dot-below diacritic of Nnọọ held between two arcs — two hands, one body. Use the files exactly as supplied; never redraw, recolour outside the variants, or add effects.</p>
      <div className="grid-auto" style={{ '--min': '230px', '--gap': '14px' }}>
        {LOGOS.map(l => (
          <div key={l.id} className="ds-card flat">
            <div className="ds-logo-ground" style={{ background: groundBg(l.ground) }}>
              <img src={l.file} alt={l.name} style={{ maxWidth: '80%', maxHeight: (LOGO_RATIO[l.id] > 1 ? 56 : 84) + 'px' }} />
            </div>
            <div className="ds-logo-body">
              <div style={{ fontWeight: 600, fontSize: 14 }}>{l.name}</div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--fg-subtle)', flex: 1 }}>{l.use}</div>
              <div className="row" style={{ '--gap': '6px' }}>
                <button type="button" className="ds-sbtn" onClick={() => download(l.file, baseName(l.file))} aria-label={'Download ' + l.name + ' as SVG'}>SVG</button>
                <button type="button" className="ds-sbtn" onClick={() => png(l.file, LOGO_RATIO[l.id])} aria-label={'Download ' + l.name + ' as PNG, 1024 pixels'}>PNG 1024</button>
                <button type="button" className="ds-sbtn soft" onClick={cp(l.file)}>Copy path</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid-fit" style={{ '--min': '260px', '--gap': '14px' }}>
        <div className="ds-card">
          <h3 className="ds-h3">Clear space</h3>
          <div className="ds-clear"><img src="/assets/brand/logo/nnoo-lockup-horizontal.svg" alt="Lockup with clear space" /></div>
          <p className="ds-c13">Keep clear space equal to half the mark’s height on every side. Nothing — text, edges, other logos — enters it.</p>
        </div>
        <div className="ds-card">
          <h3 className="ds-h3">Minimum sizes</h3>
          <div className="ds-minsizes">
            <div><img src={MARK} alt="" style={{ width: 24 }} /><span>Mark 24px</span></div>
            <div><img src="/assets/brand/favicon/favicon.svg" alt="" style={{ width: 16 }} /><span>Favicon 16px</span></div>
            <div><img src="/assets/brand/logo/nnoo-lockup-horizontal.svg" alt="" style={{ width: 96 }} /><span>Lockup 96px</span></div>
          </div>
          <p className="ds-c13">Below 24px use the favicon file — its heavier strokes survive small sizes. Print minimum: lockup 25 mm wide.</p>
        </div>
        <div className="ds-card g10">
          <h3 className="ds-h3">Avatars & favicons</h3>
          <div className="row" style={{ '--gap': '10px' }}>{AVATARS.map(a => <img key={a} src={a} alt="Avatar variant" className="ds-avatar" />)}</div>
          <p className="ds-c13">Avatars are circular-cropped by platforms — the mark sits within the centre 62%. Nine avatar variations are editable in the <Link to="/templates#cat=avatar">template library</Link>.</p>
        </div>
      </div>
      <div className="grid-auto" style={{ '--min': '180px', '--gap': '12px' }}>
        {MISUSE.map(([t, st, g]) => (
          <div key={t} className="ds-misuse">
            <div className="ds-misuse-box" style={{ background: g === 'img' ? "url('/assets/brand/imagery/placeholder-warm.svg') center/cover" : g ? resolveColor(g) : 'var(--bg-raised)' }}>
              <img src={MARK} alt="" style={{ width: 56, ...st }} />
            </div>
            <div className="ds-misuse-cap"><strong style={{ color: 'var(--danger)' }}>Don’t</strong> <span style={{ color: 'var(--fg-muted)' }}>{t}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
