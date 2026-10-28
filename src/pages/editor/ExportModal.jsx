import React from 'react';
import Modal from '../../components/Modal.jsx';
import * as T from '../../lib/templates.js';

// Browsers (notably iOS Safari) refuse canvases above roughly 16.7M pixels.
export const MAX_PIXELS = 16.7e6;
const FMT = { png: ['PNG', 'Lossless image'], jpeg: ['JPEG', 'Smaller image, adjustable quality'], webp: ['WebP', 'Modern compressed image'], svg: ['SVG', 'Vector wrapper with embedded fonts'], zip: ['ZIP of PNGs', 'Every page as a numbered PNG'], pdf: ['PDF', 'All pages, in order, at page size'], pptx: ['PowerPoint', 'Native editable text, shapes, tables, charts'], docx: ['Word (DOCX)', 'Editable headings, lists, tables, images'], epub: ['EPUB 3', 'Reflowable ebook with contents and cover'], html: ['HTML', 'Single self-contained web page'], md: ['Markdown', 'Plain structured text'], txt: ['Plain text', 'Text only'], json: ['Project file', 'Re-import later or on another device'] };

export function exportFormats(d) {
  const k = d.kind === 'doc' ? T.DOC_KINDS[d.docKind] : null;
  let ids = ['png', 'jpeg', 'webp', 'svg'];
  if (d.pages.length > 1) ids.push('zip');
  if (d.kind === 'graphic') { ids.push('pdf'); if (d.pages.length > 1) ids.push('pptx'); }
  else ids = ids.concat(k.exports.filter(x => !ids.includes(x)));
  if (!ids.includes('zip')) ids.push('zip');
  ids.push('json');
  return ids.map(id => ({ id, label: FMT[id][0], desc: FMT[id][1] }));
}
const tooBig = (d, scale) => d.w * d.h * scale * scale > MAX_PIXELS;
// Initial export state. On phones/tablets pick the largest scale that stays under the canvas pixel limit.
export function initialExport(d, mobile) {
  let scale = d.w * d.h > 4e6 ? 1 : 2;
  if (mobile) while (scale > 1 && tooBig(d, scale)) scale--;
  return { fmt: d.kind === 'doc' ? 'pdf' : 'png', scope: d.kind === 'doc' ? 'all' : 'page', scale, quality: 0.9, msg: '' };
}

export default function ExportModal({ ed, s }) {
  const d = s.doc, ex = s.ex;
  const set = patch => ed.setState({ ex: { ...ed.state.ex, ...patch } });
  const img = ['png', 'jpeg', 'webp', 'svg', 'zip', 'pdf'].includes(ex.fmt);
  const per = ['png', 'jpeg', 'webp', 'svg'].includes(ex.fmt);
  const cnt = ex.scope === 'page' ? 1 : d.pages.length;
  const dims = ex.fmt === 'svg' ? `${d.w} × ${d.h}` : `${Math.round(d.w * ex.scale)} × ${Math.round(d.h * ex.scale)} px`;
  const sum = {
    png: `${cnt === 1 ? 'One PNG' : cnt + ' PNGs in a ZIP'} at ${dims}.`, jpeg: `${cnt === 1 ? 'One JPEG' : cnt + ' JPEGs in a ZIP'} at ${dims}, quality ${Math.round(ex.quality * 100)}%.`, webp: `${cnt === 1 ? 'One WebP' : cnt + ' WebPs in a ZIP'} at ${dims}.`,
    svg: `${cnt === 1 ? 'One SVG' : cnt + ' SVGs in a ZIP'} (${dims}). Text and fonts are embedded via SVG foreignObject; best viewed in browsers. For print vector work use PDF or PPTX.`,
    zip: `A ZIP with ${cnt} numbered PNG${cnt === 1 ? '' : 's'} at ${dims}.`, pdf: `A ${cnt}-page PDF at ${d.w} × ${d.h} px per page, rendered at ${ex.scale}× for print sharpness. Text is rasterised — use DOCX/EPUB for selectable text.`,
    pptx: `${d.pages.length} slides at ${(d.w / 96).toFixed(2)} × ${(d.h / 96).toFixed(2)} in. Text, buttons, shapes, tables and charts stay editable; logos, images and complex blocks are embedded as images. Install Outfit, DM Sans and Fraunces for exact type.`,
    docx: 'Editable Word document: headings, paragraphs, lists, tables, images, page breaks per page, page size and margins. Decorative layout (backgrounds, free positioning) is simplified.',
    epub: 'EPUB 3 with a chapter per contents entry, navigation, embedded brand fonts, images and a cover image. Reflowable — page numbers are replaced by the reader’s own pagination.',
    html: 'A single self-contained HTML page with embedded fonts and images, in reading order.', md: 'Markdown in reading order — headings, lists, quotes and tables. Images reference their file paths.', txt: 'Plain text in reading order.', json: 'A project file with the full edited document. Import it from the Template Library on any device.'
  }[ex.fmt];
  const pdfScale = ex.fmt === 'pdf' ? Math.min(ex.scale, 3) : ex.scale;
  const warnBig = img && ex.fmt !== 'svg' && tooBig(d, pdfScale);
  const footer = (
    <>
      <button type="button" className="btn btn-outline" onClick={ed.closeExport} disabled={!!ex.busy}>Close</button>
      <button type="button" className="btn btn-primary" onClick={() => ed.runExport()} disabled={!!ex.busy} aria-busy={!!ex.busy}>{ex.busy ? 'Working…' : 'Download'}</button>
    </>
  );
  return (
    <Modal title="Export" onClose={ed.closeExport} locked={!!ex.busy} width={560} footer={footer}>
      <div className="stack" style={{ '--gap': '18px' }}>
        <p className="small subtle">Exports use your current edits.</p>
        <div className="stack" style={{ '--gap': '8px' }}>
          <div className="ed-ex-label">File format</div>
          <div className="ed-ex-grid" role="group" aria-label="File format">
            {exportFormats(d).map(x => (
              <button key={x.id} type="button" className="ed-ex-fmt" aria-pressed={ex.fmt === x.id} disabled={!!ex.busy}
                onClick={() => set({ fmt: x.id, msg: '', ok: null, scope: ['png', 'jpeg', 'webp', 'svg'].includes(x.id) ? ed.state.ex.scope : 'all' })}>
                <span className="ed-ex-name">{x.label}</span><span className="ed-ex-desc">{x.desc}</span>
              </button>
            ))}
          </div>
        </div>
        {per && d.pages.length > 1 && (
          <div className="stack" style={{ '--gap': '8px' }}>
            <div className="ed-ex-label">Page range</div>
            <div className="row" style={{ '--gap': '6px' }}>
              {[['page', 'Current page (' + (s.pageIdx + 1) + ')'], ['all', 'All ' + d.pages.length + ' pages']].map(([v, l]) => <button key={v} type="button" className="ed-ex-pill" aria-pressed={ex.scope === v} disabled={!!ex.busy} onClick={() => set({ scope: v })}>{l}</button>)}
            </div>
          </div>
        )}
        {img && ex.fmt !== 'svg' && (
          <div className="stack" style={{ '--gap': '8px' }}>
            <div className="ed-ex-label">Resolution</div>
            <div className="row" style={{ '--gap': '6px' }}>
              {[1, 2, 3].map(v => <button key={v} type="button" className="ed-ex-pill" aria-pressed={ex.scale === v} disabled={!!ex.busy} onClick={() => set({ scale: v })}>{v + '× — ' + Math.round(d.w * v) + ' × ' + Math.round(d.h * v)}</button>)}
            </div>
          </div>
        )}
        {warnBig && <p className="ed-ex-msg" role="alert" style={{ color: 'var(--danger)' }}>At {Math.round(d.w * pdfScale)} × {Math.round(d.h * pdfScale)} px this export is larger than many browsers can draw (about 16.7 million pixels), especially on phones. Choose a lower resolution if it fails.</p>}
        {(ex.fmt === 'jpeg' || ex.fmt === 'webp') && (
          <div className="row" style={{ '--gap': '12px', flexWrap: 'nowrap' }}>
            <label htmlFor="ed-ex-q" className="ed-ex-label">Quality</label>
            <input id="ed-ex-q" type="range" min="0.5" max="1" step="0.01" value={ex.quality} disabled={!!ex.busy} onChange={e => set({ quality: parseFloat(e.target.value) })} style={{ flex: 1, minWidth: 0, accentColor: 'var(--brand)' }} />
            <span className="small" style={{ minWidth: 40 }}>{Math.round(ex.quality * 100)}%</span>
          </div>
        )}
        <p className="ed-ex-sum">{sum}</p>
        {!!ex.msg && <p role="status" className="ed-ex-msg" style={{ color: ex.ok === false ? 'var(--danger)' : ex.ok ? 'var(--success)' : 'var(--fg-muted)' }}>{ex.msg}</p>}
      </div>
    </Modal>
  );
}
