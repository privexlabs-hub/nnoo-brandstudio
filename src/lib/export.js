// Export pipeline: raster (PNG/JPEG/WebP/SVG), PDF, ZIP, PPTX, DOCX, EPUB, HTML, Markdown, TXT, JSON.
// All exports read the current edited document state (and the live rendered DOM for raster/PPTX).
import { loadScript, slug } from './app.js';
import { resolveColor, HEX, LOGO_FILE } from './tokens.js';
import { DOC_KINDS } from './templates.js';

const LIB = {
  h2i: ['https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js', 'htmlToImage'],
  zip: ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'JSZip'],
  pdf: ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf'],
  pptx: ['https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js', 'PptxGenJS']
};
const lib = k => loadScript(LIB[k][0], LIB[k][1]);
const abs = u => new URL(u, location.href).href;
const blobToDataURL = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
export const dataURLToBlob = async d => (await fetch(d)).blob();

let fontCSS = null;
export async function getFontCSS() {
  if (fontCSS) return fontCSS;
  const base = abs('/assets/brand/fonts/fonts.css');
  let css = await (await fetch(base)).text();
  const urls = [...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1]))];
  for (const u of urls) { const d = await blobToDataURL(await (await fetch(new URL(u, base))).blob()); css = css.split('url(' + u + ')').join('url(' + d + ')'); }
  return (fontCSS = css);
}

// ---------- raster ----------
export async function renderPage(node, w, h, { type = 'png', scale = 2, quality = 0.92 } = {}) {
  const h2i = await lib('h2i'); await document.fonts.ready;
  const opts = { width: w, height: h, pixelRatio: scale, style: { transform: 'none', margin: '0', boxShadow: 'none' }, fontEmbedCSS: await getFontCSS(), cacheBust: false, filter: n => !(n.dataset && n.dataset.ui) };
  if (type === 'svg') return h2i.toSvg(node, { ...opts, pixelRatio: 1 });
  if (type === 'jpeg') return h2i.toJpeg(node, { ...opts, quality, backgroundColor: '#ffffff' });
  if (type === 'webp') { const c = await h2i.toCanvas(node, opts); const d = c.toDataURL('image/webp', quality); if (!d.startsWith('data:image/webp')) throw new Error('This browser cannot encode WebP. Use PNG or JPEG.'); return d; }
  return h2i.toPng(node, opts);
}
export async function renderElement(node, scale = 2) { const h2i = await lib('h2i'); return h2i.toPng(node, { pixelRatio: scale, fontEmbedCSS: await getFontCSS(), cacheBust: false, filter: n => !(n.dataset && n.dataset.ui) }); }
export const EXT = { png: 'png', jpeg: 'jpg', webp: 'webp', svg: 'svg' };

export async function zipFiles(files) { const JSZip = await lib('zip'); const z = new JSZip(); for (const f of files) z.file(f.name, f.data, f.base64 ? { base64: true } : undefined); return z.generateAsync({ type: 'blob', compression: 'DEFLATE' }); }
export const b64 = d => d.split(',')[1];

export async function pagesToPDF(nodes, w, h, { quality = 0.92, scale = 2 } = {}) {
  const { jsPDF } = await lib('pdf');
  const pdf = new jsPDF({ orientation: w > h ? 'landscape' : 'portrait', unit: 'px', format: [w, h], hotfixes: ['px_scaling'], compress: true });
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]; const ph = n.h || h;
    if (i) pdf.addPage([w, ph], w > ph ? 'landscape' : 'portrait');
    const d = await renderPage(n.node, w, ph, { type: 'jpeg', scale, quality });
    pdf.addImage(d, 'JPEG', 0, 0, w, ph, undefined, 'FAST');
  }
  return pdf.output('blob');
}

// ---------- semantic model (for DOCX / EPUB / HTML / MD / TXT) ----------
const ROLE_TAG = { title: 'h1', h1: 'h1', h2: 'h2', h3: 'h3', eyebrow: 'eyebrow', quote: 'quote' };
export function pageNumbers(doc) { const from = (doc.numbering && doc.numbering.from) || 1; return doc.pages.map((p, i) => (i + 1 >= from ? i + 2 - from : null)); }
export function tocItems(doc) { const nums = pageNumbers(doc); return doc.pages.map((p, i) => p.toc ? { title: p.tocTitle || p.name, n: nums[i], id: p.id } : null).filter(Boolean); }
export function semantic(doc) {
  const toc = tocItems(doc); const out = [];
  doc.pages.forEach((p, pi) => {
    out.push({ t: 'page', page: p, i: pi });
    const els = p.layout === 'free' ? p.elements.slice().sort((a, b) => (a.y - b.y) || (a.x - b.x)) : p.elements;
    els.forEach(e => {
      if (e.hidden) return;
      if (e.type === 'text') {
        const s = String(e.text || '').trim(); if (!s) return;
        if (e.list) out.push({ t: e.list === 'number' ? 'ol' : 'ul', items: s.split('\n').filter(Boolean), el: e });
        else out.push({ t: ROLE_TAG[e.role] || 'p', text: s, el: e });
      } else if (e.type === 'button') out.push({ t: 'p', text: e.text, strong: true, el: e });
      else if (e.type === 'image') { if (!e.deco) out.push({ t: 'img', src: e.src, caption: e.caption, alt: e.alt || e.caption || '', el: e }); }
      else if (e.type === 'gallery') e.items.forEach(g => out.push({ t: 'img', src: g.src, caption: g.caption, alt: g.caption || '' }));
      else if (e.type === 'table') out.push({ t: 'table', rows: e.items, header: e.header !== false });
      else if (e.type === 'chart') { if (e.title) out.push({ t: 'p', text: e.title, strong: true }); out.push({ t: 'table', rows: [['Label', 'Value'], ...e.items.map(d => [d.label, String(d.value) + (e.unit || '')])], header: true }); }
      else if (e.type === 'stats') out.push({ t: 'ul', items: e.items.map(s => s.value + ' — ' + s.label) });
      else if (e.type === 'columns') e.items.forEach(c => { out.push({ t: 'h3', text: c.title + (c.meta ? ' — ' + c.meta : '') }); if (c.body) out.push({ t: 'p', text: c.body }); });
      else if (e.type === 'entries') e.items.forEach(c => { out.push({ t: 'h3', text: [c.title, c.org].filter(Boolean).join(' — ') + (c.date ? ' (' + c.date + ')' : '') }); if (c.body) out.push({ t: 'ul', items: c.body.split('\n').filter(Boolean) }); });
      else if (e.type === 'timeline') out.push({ t: 'ol', items: e.items.map(c => [c.label, c.title, c.body].filter(Boolean).join(' — ')) });
      else if (e.type === 'people') out.push({ t: 'ul', items: e.items.map(c => c.name + (c.role ? ', ' + c.role : '') + (c.body ? ': ' + c.body : '')) });
      else if (e.type === 'tags') out.push({ t: 'p', text: e.items.join(' · ') });
      else if (e.type === 'callout') e.items.forEach(c => out.push({ t: 'quote', text: (c.title ? c.title + '\n' : '') + c.body, title: c.title, body: c.body, callout: true }));
      else if (e.type === 'toc') out.push({ t: 'toc', items: toc });
      else if (e.type === 'shape' && e.shape === 'line') out.push({ t: 'hr' });
    });
  });
  return out;
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function toMarkdown(doc) {
  const L = [];
  semantic(doc).forEach(b => {
    if (b.t === 'page') { if (b.i) L.push('\n---\n'); return; }
    if (b.t === 'h1') L.push('# ' + b.text); else if (b.t === 'h2') L.push('## ' + b.text); else if (b.t === 'h3') L.push('### ' + b.text);
    else if (b.t === 'eyebrow') L.push('**' + b.text.toUpperCase() + '**');
    else if (b.t === 'p') L.push(b.strong ? '**' + b.text + '**' : b.text);
    else if (b.t === 'quote') L.push(b.text.split('\n').map(l => '> ' + l).join('\n'));
    else if (b.t === 'ul') L.push(b.items.map(i => '- ' + i).join('\n'));
    else if (b.t === 'ol') L.push(b.items.map((i, n) => (n + 1) + '. ' + i).join('\n'));
    else if (b.t === 'img') L.push(`![${b.alt}](${b.src.startsWith('data:') ? 'embedded-image' : b.src})` + (b.caption ? '\n*' + b.caption + '*' : ''));
    else if (b.t === 'table') { const r = b.rows; if (!r.length) return; const head = b.header ? r[0] : r[0].map(() => ''); L.push('| ' + head.join(' | ') + ' |\n| ' + head.map(() => '---').join(' | ') + ' |\n' + (b.header ? r.slice(1) : r).map(x => '| ' + x.join(' | ') + ' |').join('\n')); }
    else if (b.t === 'toc') L.push(b.items.map(i => '- ' + i.title + (i.n ? ' — ' + i.n : '')).join('\n'));
    else if (b.t === 'hr') L.push('***');
    L.push('');
  });
  return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
export function toText(doc) { return toMarkdown(doc).replace(/^#+ /gm, '').replace(/\*\*/g, '').replace(/^> /gm, '  ').replace(/^\*(.*)\*$/gm, '$1').replace(/^\| ?---.*$/gm, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '[image]'); }

async function srcToDataURL(src) { if (src.startsWith('data:')) return src; try { return await blobToDataURL(await (await fetch(abs(src))).blob()); } catch (e) { return abs(src); } }
export async function toHTML(doc) {
  const kind = DOC_KINDS[doc.docKind] || {}; const B = [];
  const fonts = await getFontCSS();
  for (const b of semantic(doc)) {
    if (b.t === 'page') { B.push(b.i ? '</section>\n<section class="page">' : '<section class="page">'); continue; }
    const st = b.el && b.el.align && b.el.align !== 'left' ? ` style="text-align:${b.el.align}"` : '';
    if (b.t === 'h1' || b.t === 'h2' || b.t === 'h3') B.push(`<${b.t}${st}>${esc(b.text)}</${b.t}>`);
    else if (b.t === 'eyebrow') B.push(`<p class="eyebrow"${st}>${esc(b.text)}</p>`);
    else if (b.t === 'p') B.push(`<p${st}>${b.strong ? '<strong>' : ''}${esc(b.text).replace(/\n/g, '<br>')}${b.strong ? '</strong>' : ''}</p>`);
    else if (b.t === 'quote') B.push(b.callout ? `<aside class="callout">${b.title ? '<strong>' + esc(b.title) + '</strong>' : ''}<p>${esc(b.body).replace(/\n/g, '<br>')}</p></aside>` : `<blockquote${st}>${esc(b.text).replace(/\n/g, '<br>')}</blockquote>`);
    else if (b.t === 'ul' || b.t === 'ol') B.push(`<${b.t}>${b.items.map(i => '<li>' + esc(i) + '</li>').join('')}</${b.t}>`);
    else if (b.t === 'img') B.push(`<figure><img src="${await srcToDataURL(b.src)}" alt="${esc(b.alt)}">${b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : ''}</figure>`);
    else if (b.t === 'table') B.push('<table>' + b.rows.map((r, i) => '<tr>' + r.map(c => (i === 0 && b.header ? '<th>' : '<td>') + esc(c) + (i === 0 && b.header ? '</th>' : '</td>')).join('') + '</tr>').join('') + '</table>');
    else if (b.t === 'toc') B.push('<nav><ol class="toc">' + b.items.map(i => `<li><span>${esc(i.title)}</span><span>${i.n || ''}</span></li>`).join('') + '</ol></nav>');
    else if (b.t === 'hr') B.push('<hr>');
  }
  B.push('</section>');
  const w = doc.docKind === 'newsletter' ? 600 : 720;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(doc.name)}</title>
<style>${fonts}
body{margin:0;background:#faf5ec;color:#1a120b;font-family:"DM Sans",system-ui,sans-serif;font-size:${doc.docKind === 'newsletter' ? 15 : 18}px;line-height:1.65}
main{max-width:${w}px;margin:0 auto;padding:48px 24px}
section.page{padding:8px 0 ${kind.continuous ? 8 : 40}px;${kind.continuous ? '' : 'border-bottom:1px solid #d9cfbd;margin-bottom:40px;'}}
h1,h2,h3{font-family:Outfit,system-ui,sans-serif;letter-spacing:-0.02em;line-height:1.15;color:#1a120b}h1{font-size:2.2em}h2{font-size:1.5em}h3{font-size:1.2em}
p{color:#3d2e1f}.eyebrow{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#c85a26}
blockquote{font-family:Fraunces,Georgia,serif;font-size:1.4em;line-height:1.3;margin:1.2em 0;padding-left:20px;border-left:4px solid #c85a26}
.callout{background:#f3ead8;border-left:4px solid #d0e0d4;padding:16px 20px;border-radius:12px;margin:1.2em 0}.callout p{margin:.3em 0 0}
figure{margin:1.4em 0}img{max-width:100%;border-radius:12px;display:block}figcaption{font-size:13px;color:#6b5945;margin-top:8px}
table{border-collapse:collapse;width:100%;font-size:.9em;margin:1em 0}th,td{border-bottom:1px solid #d9cfbd;padding:8px 10px;text-align:left}th{font-family:Outfit,sans-serif;background:#f3ead8}
.toc{list-style:none;padding:0}.toc li{display:flex;justify-content:space-between;border-bottom:1px dotted #d6c8ad;padding:6px 0}hr{border:0;border-top:2px solid #eca372;width:64px;margin:1.4em 0}
a{color:#a7471c}</style></head><body><main>
${B.join('\n')}
</main></body></html>`;
}

// ---------- DOCX ----------
const xml = s => esc(s);
const PXT = 15; // 1px = 15 twips
async function rasterSrc(src, maxW = 1200) {
  const d = await srcToDataURL(src); const im = new Image(); im.src = d; await im.decode();
  const w = im.naturalWidth || 800, h = im.naturalHeight || 600; const k = Math.min(1, maxW / w);
  const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
  return { data: c.toDataURL('image/png'), w: c.width, h: c.height };
}
export async function toDocx(doc) {
  const JSZip = await lib('zip'); const z = new JSZip();
  const pad = (doc.pages[0] && doc.pages[0].pad) || [72, 64, 72, 64];
  const contentW = doc.w - pad[1] - pad[3];
  const media = []; let numId = 2; const nums = [];
  const run = (t, o = {}) => t.split('\n').map((line, i) => `<w:r><w:rPr>${o.b ? '<w:b/>' : ''}${o.caps ? '<w:caps/>' : ''}${o.color ? `<w:color w:val="${o.color}"/>` : ''}${o.font ? `<w:rFonts w:ascii="${o.font}" w:hAnsi="${o.font}" w:cs="${o.font}"/>` : ''}${o.sz ? `<w:sz w:val="${o.sz}"/>` : ''}</w:rPr>${i ? '<w:br/>' : ''}<w:t xml:space="preserve">${xml(line)}</w:t></w:r>`).join('');
  const jc = a => a && a !== 'left' ? `<w:jc w:val="${a === 'justify' ? 'both' : a}"/>` : '';
  const para = (t, style, o = {}) => `<w:p><w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ''}${o.num ? `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="${o.num}"/></w:numPr>` : ''}${jc(o.align)}${o.pb ? '<w:pageBreakBefore/>' : ''}</w:pPr>${run(t, o)}</w:p>`;
  const body = []; let firstPage = true, pendingBreak = false;
  for (const b of semantic(doc)) {
    if (b.t === 'page') { if (!firstPage) pendingBreak = true; firstPage = false; continue; }
    const pb = pendingBreak; pendingBreak = false; const al = b.el && b.el.align;
    if (b.t === 'h1') body.push(para(b.text, 'Heading1', { pb, align: al }));
    else if (b.t === 'h2') body.push(para(b.text, 'Heading2', { pb, align: al }));
    else if (b.t === 'h3') body.push(para(b.text, 'Heading3', { pb, align: al }));
    else if (b.t === 'eyebrow') body.push(para(b.text, 'Eyebrow', { pb, align: al }));
    else if (b.t === 'p') body.push(para(b.text, null, { pb, b: b.strong, align: al }));
    else if (b.t === 'quote') body.push(b.callout ? `<w:p><w:pPr><w:pStyle w:val="Callout"/>${pb ? '<w:pageBreakBefore/>' : ''}</w:pPr>${b.title ? run(b.title, { b: true }) + '<w:r><w:br/></w:r>' : ''}${run(b.body)}</w:p>` : para(b.text, 'Quote', { pb, align: al }));
    else if (b.t === 'ul' || b.t === 'ol') { const id = numId++; nums.push({ id, abs: b.t === 'ol' ? 1 : 0 }); b.items.forEach((it, i) => body.push(para(it, 'ListParagraph', { num: id, pb: pb && !i }))); }
    else if (b.t === 'hr') body.push(`<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="1" w:color="ECA372"/></w:pBdr></w:pPr></w:p>`);
    else if (b.t === 'toc') b.items.forEach((it, i) => body.push(`<w:p><w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="${Math.round(contentW * PXT)}"/></w:tabs>${pb && !i ? '<w:pageBreakBefore/>' : ''}</w:pPr>${run(it.title)}<w:r><w:tab/></w:r>${run(String(it.n || ''))}</w:p>`));
    else if (b.t === 'table') {
      const cols = Math.max(...b.rows.map(r => r.length)); const cw = Math.round(contentW * PXT / cols);
      body.push((pb ? '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' : '') + `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="${cw * cols}" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="D9CFBD"/><w:bottom w:val="single" w:sz="4" w:color="D9CFBD"/><w:insideH w:val="single" w:sz="4" w:color="D9CFBD"/></w:tblBorders></w:tblPr><w:tblGrid>${Array(cols).fill(`<w:gridCol w:w="${cw}"/>`).join('')}</w:tblGrid>` +
        b.rows.map((r, ri) => `<w:tr>${Array.from({ length: cols }, (_, ci) => `<w:tc><w:tcPr><w:tcW w:w="${cw}" w:type="dxa"/>${ri === 0 && b.header ? '<w:shd w:val="clear" w:color="auto" w:fill="F3EAD8"/>' : ''}</w:tcPr>${para(r[ci] || '', null, { b: ri === 0 && b.header })}</w:tc>`).join('')}</w:tr>`).join('') + '</w:tbl>' + '<w:p/>');
    } else if (b.t === 'img') {
      try {
        const r = await rasterSrc(b.src); const n = media.length + 1; media.push({ name: `image${n}.png`, data: b64(r.data) });
        const wE = Math.round(Math.min(contentW, r.w) * 9525), hE = Math.round(Math.min(contentW, r.w) * r.h / r.w * 9525);
        body.push(`<w:p><w:pPr>${pb ? '<w:pageBreakBefore/>' : ''}</w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${wE}" cy="${hE}"/><wp:docPr id="${n}" name="Picture ${n}" descr="${xml(b.alt || '')}"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${n}" name="image${n}.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdImg${n}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${wE}" cy="${hE}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`);
        if (b.caption) body.push(para(b.caption, 'Caption'));
      } catch (e) { if (b.caption) body.push(para('[Image] ' + b.caption, 'Caption')); }
    }
  }
  const sect = `<w:sectPr><w:pgSz w:w="${doc.w * PXT}" w:h="${doc.h * PXT}"/><w:pgMar w:top="${pad[0] * PXT}" w:right="${pad[1] * PXT}" w:bottom="${pad[2] * PXT}" w:left="${pad[3] * PXT}" w:header="${Math.round(pad[0] * PXT / 2)}" w:footer="${Math.round(pad[2] * PXT / 2)}" w:gutter="0"/></w:sectPr>`;
  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  z.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${body.join('')}${sect}</w:body></w:document>`);
  const st = (id, name, o) => `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>${o}</w:style>`;
  const disp = '<w:rFonts w:ascii="Outfit" w:hAnsi="Outfit" w:cs="Outfit"/>';
  z.file('word/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="DM Sans" w:hAnsi="DM Sans" w:cs="DM Sans" w:eastAsia="DM Sans"/><w:color w:val="3D2E1F"/><w:sz w:val="21"/><w:lang w:val="en-GB"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
${st('Heading1', 'heading 1', `<w:pPr><w:keepNext/><w:spacing w:before="360" w:after="160"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr>${disp}<w:b/><w:color w:val="1A120B"/><w:sz w:val="44"/></w:rPr>`)}
${st('Heading2', 'heading 2', `<w:pPr><w:keepNext/><w:spacing w:before="280" w:after="120"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr>${disp}<w:b/><w:color w:val="1A120B"/><w:sz w:val="32"/></w:rPr>`)}
${st('Heading3', 'heading 3', `<w:pPr><w:keepNext/><w:spacing w:before="220" w:after="80"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr>${disp}<w:b/><w:color w:val="1A120B"/><w:sz w:val="26"/></w:rPr>`)}
${st('Eyebrow', 'Eyebrow', `<w:pPr><w:keepNext/><w:spacing w:after="60"/></w:pPr><w:rPr><w:b/><w:caps/><w:spacing w:val="24"/><w:color w:val="C85A26"/><w:sz w:val="16"/></w:rPr>`)}
${st('Quote', 'Quote', `<w:pPr><w:pBdr><w:left w:val="single" w:sz="24" w:space="12" w:color="C85A26"/></w:pBdr><w:ind w:left="360"/><w:spacing w:before="240" w:after="240"/></w:pPr><w:rPr><w:rFonts w:ascii="Fraunces" w:hAnsi="Fraunces" w:cs="Fraunces"/><w:color w:val="1A120B"/><w:sz w:val="30"/></w:rPr>`)}
${st('Callout', 'Callout', `<w:pPr><w:pBdr><w:left w:val="single" w:sz="24" w:space="12" w:color="D0E0D4"/></w:pBdr><w:shd w:val="clear" w:color="auto" w:fill="F3EAD8"/><w:ind w:left="240" w:right="240"/><w:spacing w:before="200" w:after="200"/></w:pPr>`)}
${st('Caption', 'caption', `<w:rPr><w:color w:val="6B5945"/><w:sz w:val="17"/></w:rPr>`)}
${st('ListParagraph', 'List Paragraph', `<w:pPr><w:ind w:left="720"/><w:spacing w:after="60"/></w:pPr>`)}
<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:tblPr><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>`);
  const lvl = (fmt, txt) => `<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="${fmt}"/><w:lvlText w:val="${txt}"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl>`;
  z.file('word/numbering.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0">${lvl('bullet', '•')}</w:abstractNum><w:abstractNum w:abstractNumId="1">${lvl('decimal', '%1.')}</w:abstractNum>${nums.map(n => `<w:num w:numId="${n.id}"><w:abstractNumId w:val="${n.abs}"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>`).join('')}</w:numbering>`);
  z.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdNum" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>${media.map((m, i) => `<Relationship Id="rIdImg${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${m.name}"/>`).join('')}</Relationships>`);
  media.forEach(m => z.file('word/media/' + m.name, m.data, { base64: true }));
  z.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`);
  z.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`);
  z.file('docProps/core.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xml(doc.name)}</dc:title><dc:creator>Nnọọ Brand Studio</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created></cp:coreProperties>`);
  return z.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

// ---------- EPUB 3 ----------
export async function toEpub(doc, coverNode) {
  const JSZip = await lib('zip'); const z = new JSZip();
  z.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
  z.file('META-INF/container.xml', '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  const manifest = [], spine = [], navItems = []; let imgN = 0;
  // fonts
  const fcss = await (await fetch(abs('/assets/brand/fonts/fonts.css'))).text();
  let epubFonts = fcss;
  for (const u of [...new Set([...fcss.matchAll(/url\(([^)]+)\)/g)].map(m => m[1]))]) {
    const name = 'fonts/' + u.split('/').pop(); z.file('OEBPS/' + name, await (await fetch(new URL(u, abs('/assets/brand/fonts/fonts.css')))).blob());
    manifest.push(`<item id="f${manifest.length}" href="${name}" media-type="font/woff2"/>`); epubFonts = epubFonts.split('url(' + u + ')').join('url(' + name + ')');
  }
  z.file('OEBPS/style.css', epubFonts + `\nbody{font-family:"DM Sans",sans-serif;line-height:1.6;color:#1a120b;margin:0 5%}h1,h2,h3{font-family:Outfit,sans-serif;line-height:1.15;page-break-after:avoid}h1{font-size:1.8em;margin:1.6em 0 .6em}h2{font-size:1.35em}h3{font-size:1.1em}
p{margin:0 0 .8em;text-align:justify;hyphens:auto;-webkit-hyphens:auto}.eyebrow{font-size:.7em;font-weight:bold;letter-spacing:.12em;text-transform:uppercase;color:#c85a26;text-align:left}
blockquote{font-family:Fraunces,serif;font-size:1.2em;margin:1em 0;padding-left:1em;border-left:3px solid #c85a26}.callout{background:#f3ead8;padding:.8em 1em;border-left:3px solid #2e5d3a;margin:1em 0}
figure{margin:1em 0;text-align:center}img{max-width:100%}figcaption{font-size:.8em;color:#6b5945}table{border-collapse:collapse;width:100%;font-size:.85em}td,th{border-bottom:1px solid #d9cfbd;padding:.3em .5em;text-align:left}
.toc{list-style:none;padding:0}.center{text-align:center}hr{border:0;border-top:2px solid #eca372;width:3em;margin:1.2em 0}`);
  manifest.push('<item id="css" href="style.css" media-type="text/css"/>');
  // cover
  if (coverNode) {
    const d = await renderPage(coverNode, doc.w, doc.h, { type: 'jpeg', scale: 2, quality: 0.9 });
    z.file('OEBPS/images/cover.jpg', b64(d), { base64: true });
    manifest.push('<item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>');
    z.file('OEBPS/cover.xhtml', `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Cover</title><style>body{margin:0;text-align:center}img{max-height:100vh;max-width:100%}</style></head><body epub:type="cover"><img src="images/cover.jpg" alt="${xml(doc.name)} cover"/></body></html>`);
    manifest.push('<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>'); spine.push('<itemref idref="cover"/>');
  }
  // chapters: a new file starts at each page flagged for the TOC
  const blocks = semantic(doc); let chapters = [], cur = null;
  blocks.forEach(b => {
    if (b.t === 'page') { if (coverNode && b.i === 0) { cur = { skip: true, items: [] }; chapters.push(cur); return; } if (!cur || cur.skip || b.page.toc) { cur = { title: b.page.tocTitle || b.page.name, items: [], toc: b.page.toc }; chapters.push(cur); } return; }
    cur.items.push(b);
  });
  chapters = chapters.filter(c => !c.skip && c.items.length);
  for (let ci = 0; ci < chapters.length; ci++) {
    const c = chapters[ci], H = [];
    for (const b of c.items) {
      const cls = b.el && b.el.align === 'center' ? ' class="center"' : '';
      if (b.t === 'h1' || b.t === 'h2' || b.t === 'h3') H.push(`<${b.t}${cls}>${xml(b.text)}</${b.t}>`);
      else if (b.t === 'eyebrow') H.push(`<p class="eyebrow">${xml(b.text)}</p>`);
      else if (b.t === 'p') H.push(`<p${cls}>${b.strong ? '<strong>' : ''}${xml(b.text).replace(/\n/g, '<br/>')}${b.strong ? '</strong>' : ''}</p>`);
      else if (b.t === 'quote') H.push(b.callout ? `<aside class="callout">${b.title ? '<strong>' + xml(b.title) + '</strong><br/>' : ''}${xml(b.body).replace(/\n/g, '<br/>')}</aside>` : `<blockquote${cls}><p>${xml(b.text).replace(/\n/g, '<br/>')}</p></blockquote>`);
      else if (b.t === 'ul' || b.t === 'ol') H.push(`<${b.t}>${b.items.map(i => '<li>' + xml(i) + '</li>').join('')}</${b.t}>`);
      else if (b.t === 'hr') H.push('<hr/>');
      else if (b.t === 'table') H.push('<table>' + b.rows.map((r, i) => '<tr>' + r.map(x => (i === 0 && b.header ? '<th>' : '<td>') + xml(x) + (i === 0 && b.header ? '</th>' : '</td>')).join('') + '</tr>').join('') + '</table>');
      else if (b.t === 'toc') H.push('<ol class="toc">' + chapters.filter(x => x.toc).map(x => `<li><a href="ch${chapters.indexOf(x) + 1}.xhtml">${xml(x.title)}</a></li>`).join('') + '</ol>');
      else if (b.t === 'img') {
        try { const r = await rasterSrc(b.src, 1400); imgN++; z.file(`OEBPS/images/img${imgN}.png`, b64(r.data), { base64: true }); manifest.push(`<item id="img${imgN}" href="images/img${imgN}.png" media-type="image/png"/>`); H.push(`<figure><img src="images/img${imgN}.png" alt="${xml(b.alt || '')}"/>${b.caption ? '<figcaption>' + xml(b.caption) + '</figcaption>' : ''}</figure>`); } catch (e) {}
      }
    }
    const f = `ch${ci + 1}.xhtml`;
    z.file('OEBPS/' + f, `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en"><head><title>${xml(c.title)}</title><link rel="stylesheet" href="style.css" type="text/css"/></head><body><section epub:type="chapter">${H.join('\n')}</section></body></html>`);
    manifest.push(`<item id="ch${ci + 1}" href="${f}" media-type="application/xhtml+xml"/>`); spine.push(`<itemref idref="ch${ci + 1}"/>`);
    if (c.toc) navItems.push(`<li><a href="${f}">${xml(c.title)}</a></li>`);
  }
  if (!navItems.length && chapters.length) navItems.push(`<li><a href="ch1.xhtml">${xml(doc.name)}</a></li>`);
  z.file('OEBPS/nav.xhtml', `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${navItems.join('')}</ol></nav></body></html>`);
  manifest.push('<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>');
  const uidv = 'urn:uuid:' + (crypto.randomUUID ? crypto.randomUUID() : doc.id);
  z.file('OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="bookid">${uidv}</dc:identifier><dc:title>${xml(doc.name)}</dc:title><dc:language>en</dc:language><dc:creator>[Author]</dc:creator><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>${coverNode ? '<meta name="cover" content="cover-image"/>' : ''}</metadata><manifest>${manifest.join('')}</manifest><spine>${spine.join('')}</spine></package>`);
  return z.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
}

// ---------- PPTX (native text, shapes, tables, charts; complex blocks as images) ----------
const hex6 = c => resolveColor(c).replace('#', '').slice(0, 6).toUpperCase();
const FONT = { display: 'Outfit', body: 'DM Sans', archive: 'Fraunces', mono: 'Courier New' };
async function svgToPng(src, w, h) {
  const d = await srcToDataURL(src); const im = new Image(); im.src = d; await im.decode();
  const k = 3, c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
  const x = c.getContext('2d'); const r = Math.min(c.width / (im.naturalWidth || c.width), c.height / (im.naturalHeight || c.height));
  const dw = (im.naturalWidth || c.width) * r, dh = (im.naturalHeight || c.height) * r; x.drawImage(im, (c.width - dw) / 2, (c.height - dh) / 2, dw, dh); return c.toDataURL('image/png');
}
export async function toPptx(doc, pageNodes, zoom) {
  const PptxGenJS = await lib('pptx'); const pptx = new PptxGenJS();
  const IN = 96; pptx.defineLayout({ name: 'NN', width: doc.w / IN, height: doc.h / IN }); pptx.layout = 'NN'; pptx.title = doc.name;
  for (let pi = 0; pi < doc.pages.length; pi++) {
    const p = doc.pages[pi], root = pageNodes[pi]; const slide = pptx.addSlide();
    slide.background = { color: hex6(p.bg || 'bone') };
    const rr = root.getBoundingClientRect();
    for (const e of p.elements) {
      if (e.hidden) continue;
      const n = root.querySelector(`[data-el-id="${e.id}"]`); if (!n) continue;
      const b = n.getBoundingClientRect(); const box = { x: (b.left - rr.left) / zoom / IN, y: (b.top - rr.top) / zoom / IN, w: b.width / zoom / IN, h: b.height / zoom / IN };
      if (box.w <= 0 || box.h <= 0) continue;
      const tr = e.opacity != null && e.opacity < 1 ? Math.round((1 - e.opacity) * 100) : 0;
      try {
        if (e.type === 'text') {
          const lines = String(e.text).split('\n');
          const runs = lines.map((l, i) => ({ text: e.upper ? l.toUpperCase() : l, options: { breakLine: i < lines.length - 1, bullet: e.list ? (e.list === 'number' ? { type: 'number' } : true) : false } }));
          slide.addText(runs, { ...box, fontFace: FONT[e.font] || 'DM Sans', fontSize: Math.max(1, e.size * 0.75), color: hex6(e.color), bold: e.weight >= 600, italic: !!e.italic, align: e.align === 'justify' ? 'justify' : e.align, valign: e.valign === 'middle' ? 'middle' : e.valign === 'bottom' ? 'bottom' : 'top', lineSpacingMultiple: e.lh, charSpacing: (e.ls || 0) * e.size * 0.75, margin: (e.pad || 0) * 0.75, fill: e.bg ? { color: hex6(e.bg) } : undefined, transparency: tr, fit: 'none' });
        } else if (e.type === 'button') {
          slide.addText(e.text, { ...box, shape: pptx.ShapeType.roundRect, rectRadius: Math.min(0.5, (e.radius || 0) / IN / Math.min(box.w, box.h)), fill: { color: hex6(e.fill) }, color: hex6(e.color), fontFace: 'Outfit', bold: true, fontSize: e.size * 0.75, align: 'center', valign: 'middle' });
        } else if (e.type === 'shape' && (e.shape === 'rect' || e.shape === 'ellipse')) {
          slide.addShape(e.shape === 'ellipse' ? pptx.ShapeType.ellipse : (e.radius ? pptx.ShapeType.roundRect : pptx.ShapeType.rect), { ...box, fill: e.fill ? { color: hex6(e.fill), transparency: tr } : { type: 'none' }, line: e.stroke ? { color: hex6(e.stroke), width: (e.strokeW || 1) * 0.75 } : { type: 'none' }, rectRadius: e.radius ? Math.min(0.5, e.radius / IN / Math.min(box.w, box.h)) : undefined });
        } else if (e.type === 'shape' && e.shape === 'line') {
          slide.addShape(pptx.ShapeType.rect, { ...box, fill: { color: hex6(e.fill) }, line: { type: 'none' } });
        } else if (e.type === 'shape' && e.shape === 'spacer') { /* nothing */ }
        else if (e.type === 'image' && e.fit !== 'tile') {
          const d = await renderElement(n, 2); slide.addImage({ data: d, ...box, transparency: tr });
        } else if (e.type === 'logo') {
          const d = await svgToPng(LOGO_FILE[e.variant], box.w * IN, box.h * IN); slide.addImage({ data: d, ...box });
        } else if (e.type === 'table') {
          const rows = e.items.map((r, ri) => r.map(c => ({ text: c, options: { bold: ri === 0 && e.header !== false, fill: ri === 0 && e.header !== false ? { color: 'F3EAD8' } : undefined } })));
          slide.addTable(rows, { x: box.x, y: box.y, w: box.w, fontFace: 'DM Sans', fontSize: e.size * 0.75, color: '1A120B', border: { type: 'solid', pt: 0.5, color: 'D9CFBD' } });
        } else if (e.type === 'chart') {
          const t = e.chart === 'donut' ? pptx.ChartType.doughnut : pptx.ChartType.bar;
          const pal = ['C85A26', 'D9A019', '6D2C4F', '2E5D3A', 'E17F47', 'A8678A'];
          slide.addChart(t, [{ name: e.title || 'Series', labels: e.items.map(d => d.label), values: e.items.map(d => Number(d.value) || 0) }], { ...box, barDir: e.chart === 'hbar' ? 'bar' : 'col', chartColors: e.chart === 'donut' ? pal : [hex6(e.color || 'clay-500')], showLegend: e.chart === 'donut', showTitle: !!e.title, title: e.title, titleFontFace: 'Outfit', titleFontSize: 12, catAxisLabelFontFace: 'DM Sans', valAxisLabelFontFace: 'DM Sans', showValue: true });
        } else {
          const d = await renderElement(n, 2); slide.addImage({ data: d, ...box });
        }
      } catch (err) { console.warn('pptx element skipped', e.type, err); }
    }
  }
  return pptx.write({ outputType: 'blob' });
}

export function fileBase(doc) { return 'nnoo-' + slug(doc.name) + '-' + doc.w + 'x' + doc.h; }
export const MIME = { md: 'text/markdown', txt: 'text/plain', html: 'text/html', json: 'application/json' };
