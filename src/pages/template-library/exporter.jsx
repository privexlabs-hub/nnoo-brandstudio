import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import Page from '../../components/Page.jsx';
import { pageView } from '../../lib/render.js';
import { pageNumbers, tocItems, renderPage, zipFiles, b64, fileBase } from '../../lib/export.js';
import { download, slug } from '../../lib/app.js';

// Mount every page of every doc at zoom 1 in a detached off-screen container, capture each, then unmount.
export async function renderDocs(docs, type = 'png') {
  const items = [];
  docs.forEach((d, di) => {
    const nums = pageNumbers(d), toc = tocItems(d);
    d.pages.forEach((p, pi) => items.push({ d, di, pi, view: pageView(d, pi, { zoom: 1, nums, toc }) }));
  });
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  Object.assign(host.style, { position: 'fixed', left: '-200000px', top: '0', pointerEvents: 'none' });
  document.body.appendChild(host);
  const root = createRoot(host);
  try {
    flushSync(() => root.render(
      <>{items.map((s, i) => <div key={i} data-stage-i={i} style={{ marginBottom: '20px' }}><Page view={s.view} /></div>)}</>
    ));
    await new Promise(r => setTimeout(r, 400));
    await document.fonts.ready;
    const out = [];
    for (let i = 0; i < items.length; i++) {
      const s = items[i], pg = s.d.pages[s.pi];
      const node = host.querySelector(`[data-stage-i="${i}"] [data-page-root]`);
      if (!node) throw new Error('Could not render page ' + (s.pi + 1) + ' of ' + s.d.name);
      const url = await renderPage(node, s.d.w, pg.h || s.d.h, { type, scale: 1 });
      out.push({ ...s, url });
    }
    return out;
  } finally {
    root.unmount(); host.remove();
  }
}

// One image → PNG download; several → ZIP (folders per doc when more than one doc).
export async function exportPngs(docs, zipName) {
  const r = await renderDocs(docs);
  if (r.length === 1) download(r[0].url, fileBase(r[0].d) + '.png');
  else {
    const files = r.map(x => ({ name: (docs.length > 1 ? slug(x.d.name) + '-' + x.d.w + 'x' + x.d.h + '/' : '') + String(x.pi + 1).padStart(2, '0') + '-' + slug(x.d.pages[x.pi].name) + '.png', data: b64(x.url), base64: true }));
    download(await zipFiles(files), zipName || 'nnoo-export.zip');
  }
  return r.length;
}

export const projectBlob = d => new Blob([JSON.stringify({ nnooProject: 1, doc: d })], { type: 'application/json' });

export async function exportProjects(docs, zipName = 'nnoo-project-files.zip') {
  const files = docs.map(d => ({ name: fileBase(d) + '.nnoo.json', data: JSON.stringify({ nnooProject: 1, doc: d }) }));
  download(await zipFiles(files), zipName);
}
