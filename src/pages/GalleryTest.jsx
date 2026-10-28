import React, { useMemo } from 'react';
import AppHeader from '../components/AppHeader.jsx';
import Page from '../components/Page.jsx';
import useHash from '../components/useHash.js';
import { TEMPLATES, DOC_TEMPLATES, newDocFromTemplate } from '../lib/templates.js';
import { pageView } from '../lib/render.js';

// Unlisted QA page — port of "zz Gallery Test.dc.html".
// Hash: #<cat or template id>&<box width, default 280>&all (every format)&pages (every page of doc templates).
function build(hash) {
  const h = hash.slice(1).split('&'); const cat = h[0] || 'square'; const BW = parseInt(h[1] || '280', 10); const fmtAll = h[2] === 'all';
  const items = [];
  TEMPLATES.concat(DOC_TEMPLATES).filter(t => t.cat === cat || t.id === cat).forEach(t => {
    (fmtAll ? t.formats : [t.formats[0]]).forEach(f => {
      const d = newDocFromTemplate(t, f); const pages = cat === t.id || t.kind === 'doc' && h[3] === 'pages' ? d.pages.map((p, i) => i) : [0];
      pages.forEach(i => {
        const H = d.pages[i].h || d.h; const z = Math.min(BW / d.w, BW * 1.2 / H);
        items.push({ key: t.id + '-' + f + '-' + i, name: t.name + ' ' + f + ' p' + (i + 1), box: { width: BW + 'px', height: H * z + 'px' }, view: pageView(d, i, { zoom: z, thumb: true, nums: d.pages.map((p, j) => j + 1), toc: d.pages.map((p, j) => p.toc ? { title: p.tocTitle || p.name, n: j + 1 } : null).filter(Boolean) }) });
      });
    });
  });
  return items;
}

export default function GalleryTest() {
  const hash = useHash();
  const items = useMemo(() => build(hash), [hash]);
  return (
    <>
      <AppHeader />
      <div style={{ background: '#ddd', minHeight: 'calc(100dvh - 61px)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 12, font: '11px sans-serif', color: '#1a120b' }}>
          {items.map(t => (
            <div key={t.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={t.box}><Page view={t.view} /></div>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
