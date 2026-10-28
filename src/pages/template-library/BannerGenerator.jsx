import React, { useMemo } from 'react';
import LazyThumb from './LazyThumb.jsx';
import { TEMPLATES, FORMATS, newDocFromTemplate, relayoutGraphic } from '../../lib/templates.js';
import { toast } from '../../lib/app.js';

export const EDITORIAL = TEMPLATES.filter(t => t.editorial);
export const DEFAULT_GEN = { title: 'Why we record elders before we teach', sub: 'On consent, provenance and patience.', eyebrow: 'Nnọọ Journal', img: null, ch: { 'x-article': true, 'li-article': true, medium: true } };

// Build an editorial graphic with the generator's content.
// Note: relayoutGraphic() reads content via contentOf(), which lets the template's existing slot text win over
// doc.content, so we pass a page-less doc to make the generator's title/subtitle/eyebrow actually apply.
export function genDoc(g, t, fmt) {
  const d = newDocFromTemplate(t, fmt);
  const content = { title: g.title || ' ', body: g.sub || '', eyebrow: g.eyebrow || '' };
  if (g.img) content.image = g.img;
  const out = relayoutGraphic({ ...d, content, pages: [] }, t, {});
  out.content = content;
  out.name = (g.title || t.name).slice(0, 60) + ' — ' + FORMATS[fmt].label;
  return out;
}

// Downscale so the longest side is ≤1800px, then JPEG q0.86.
function readImage(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = () => rej(new Error('Could not read that file.'));
    fr.onload = () => {
      const im = new Image();
      im.onerror = () => rej(new Error('That file is not an image this browser can read.'));
      im.onload = () => {
        const k = Math.min(1, 1800 / Math.max(im.width, im.height));
        const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(im.width * k)); c.height = Math.max(1, Math.round(im.height * k));
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', 0.86));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

export default function BannerGenerator({ g, setG, busy, onOpen, onExport }) {
  const chosen = Object.keys(g.ch).filter(k => g.ch[k]);
  const cards = useMemo(() => {
    const out = [];
    EDITORIAL.forEach(t => chosen.forEach(f => out.push({ key: t.id + '|' + f, t, f, d: genDoc(g, t, f) })));
    return out;
  }, [g]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = (k, v) => setG(s => ({ ...s, [k]: v }));
  const onImg = async e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
    try { set('img', await readImage(f)); } catch (err) { toast(err.message, 'err'); }
  };
  return (
    <section aria-label="Article banner generator" className="tl-gen">
      <div className="tl-gen-head">
        <div style={{ minWidth: 0 }}>
          <h2 className="tl-h2">Article banner generator</h2>
          <p className="tl-gen-copy">Type a title and optional subtitle. Every editorial layout updates for the channels you pick. Open any one to refine it, or download them all.</p>
        </div>
        <button type="button" className="btn btn-primary" disabled={busy || !cards.length} onClick={() => onExport(cards.map(c => c.d), 'nnoo-article-banners.zip')}>
          {busy ? 'Working…' : 'Download all ' + cards.length + ' (ZIP)'}
        </button>
      </div>
      <div className="tl-gen-fields">
        <label className="field"><span className="tl-flabel">Article title</span><input className="input" type="text" value={g.title} onChange={e => set('title', e.target.value)} /></label>
        <label className="field"><span className="tl-flabel">Subtitle (optional)</span><input className="input" type="text" value={g.sub} onChange={e => set('sub', e.target.value)} /></label>
        <label className="field"><span className="tl-flabel">Eyebrow / publication</span><input className="input" type="text" value={g.eyebrow} onChange={e => set('eyebrow', e.target.value)} /></label>
        <div className="field"><span className="tl-flabel">Image (for image layouts)</span>
          <label className="tl-upload">{g.img ? 'Image added — replace' : 'Upload image'}<input type="file" accept="image/*" onChange={onImg} /></label>
        </div>
      </div>
      <div className="field"><span className="tl-flabel">Channels</span>
        <div className="tl-chans">
          {EDITORIAL[0].formats.map(f => (
            <button key={f} type="button" className="pill" aria-pressed={!!g.ch[f]} onClick={() => setG(s => ({ ...s, ch: { ...s.ch, [f]: !s.ch[f] } }))}>{FORMATS[f].label} {FORMATS[f].w}×{FORMATS[f].h}</button>
          ))}
        </div>
      </div>
      {cards.length === 0 && <p className="tl-note">Pick at least one channel to see the banners.</p>}
      <div className="tl-grid wide">
        {cards.map(c => (
          <div key={c.key} className="tl-card">
            <LazyThumb key={c.d.w + 'x' + c.d.h} doc={c.d} height={150} fallbackW={276} />
            <div className="tl-gen-card-foot">
              <div style={{ minWidth: 0 }}><div className="tl-name" style={{ fontSize: '14px' }}>{c.t.name.replace('Article — ', '')}</div><div className="tl-meta">{FORMATS[c.f].label} · {c.d.w} × {c.d.h}</div></div>
              <div className="tl-actions" style={{ flex: 'none' }}>
                <button type="button" className="btn btn-outline btn-sm" title="Download PNG" disabled={busy} onClick={() => onExport([c.d])}>↓ PNG</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpen(c.d)}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
