// Grouped options for the "Add page" / "Add element" modal. `ed` is the Editor instance.
import * as T from '../../lib/templates.js';
import * as TK from '../../lib/tokens.js';
import { blankPage } from './ops.js';

export function addGroups(ed) {
  const a = ed.state.add, d = ed.doc();
  if (a.type === 'page') {
    const at = a.at != null ? a.at : ed.state.pageIdx + 1;
    const groups = [{ title: 'Basic', items: [{ label: 'Blank page', run: () => ed.insertPage(blankPage(d, ed.state.pageIdx), at) }, { label: 'Duplicate current page', run: () => { ed.setState({ add: null }); ed.dupPage(ed.state.pageIdx); } }] }];
    if (d.kind === 'doc') {
      const chN = d.pages.filter(p => p.kind === 'chapter').length + 1, partN = d.pages.filter(p => p.kind === 'part').length + 1, divN = d.pages.filter(p => p.kind === 'divider').length + 1;
      groups.push({ title: T.DOC_KINDS[d.docKind].name + ' pages', items: T.PAGE_LIB[d.docKind].map(([id, name]) => ({ label: name, run: () => { const pg = T.makePage(d.docKind, id, id === 'chapter' ? chN : id === 'part' ? partN : divN); pg.user = true; const cur = d.pages[Math.max(0, at - 1)]; if (!pg.section && cur && cur.section && id !== 'cover') pg.section = cur.section; ed.insertPage(pg, at); } })) });
    } else {
      const f = T.FORMATS[d.formatId];
      groups.push({ title: 'Layouts in ' + (T.PAL[d.palette] || T.PAL.bone).name, items: Object.entries(T.LAYOUTS).map(([id, l]) => ({ label: l.name, run: () => { const pg = l.build(f, d.palette, { eyebrow: 'Label', title: 'New slide', body: 'Supporting text.', num: String(d.pages.length + 1).padStart(2, '0'), name: '[Name]', meta: '[Detail]', day: '00', month: 'Month', cta: id === 'headline' ? 'Learn more' : undefined, options: ['Option A', 'Option B'], leftTitle: 'Left', leftBody: 'Text', rightTitle: 'Right', rightBody: 'Text', translation: '[Translation]' }); pg.user = true; pg.name = l.name; pg.elements.forEach(e => { e.slot = null; e.user = true; }); ed.insertPage(pg, at); } })) });
    }
    return groups;
  }
  const p = d.pages[ed.state.pageIdx];
  const it = (label, k, opt) => ({ label, run: () => ed.newElement(k, opt) });
  if (p.layout === 'flow') return [
    { title: 'Text', items: [it('Heading', 'heading'), it('Subheading', 'subheading'), it('Paragraph', 'paragraph'), it('Eyebrow label', 'eyebrow'), it('Bulleted list', 'bullets'), it('Numbered list', 'numbered'), it('Pull quote', 'pull-quote'), it('Callout', 'callout'), it('Note (archival)', 'note')] },
    { title: 'Media', items: [it('Image (placeholder)', 'image'), it('Gallery', 'gallery'), it('Logo lockup', 'logo'), it('Brand mark', 'mark'), ...TK.LOGOS.slice(0, 6).map(l => it(l.name, 'logo-variant', l.id))] },
    { title: 'Data', items: [it('Table', 'table'), it('Bar chart', 'chart-bar'), it('Horizontal bars', 'chart-hbar'), it('Donut chart', 'chart-donut'), it('Statistics', 'stats')] },
    { title: 'Structure', items: [it('Columns / cards', 'columns'), it('Timeline', 'timeline'), it('Dated entries', 'entries'), it('People / team', 'people'), it('Tags / skills', 'tags'), it('Button / CTA', 'button'), it('Table of contents', 'toc'), it('Divider', 'divider'), it('Spacer', 'spacer')] }
  ];
  return [
    { title: 'Text', items: [it('Heading', 'heading'), it('Subheading', 'subheading'), it('Paragraph', 'paragraph'), it('Eyebrow label', 'eyebrow'), it('Bulleted list', 'bullets'), it('Numbered list', 'numbered'), it('Quote', 'pull-quote'), it('Button / CTA', 'button'), it('Page number', 'pagenum')] },
    { title: 'Brand', items: TK.LOGOS.map(l => it(l.name, 'logo-variant', l.id)).concat([it('Rhythm pattern (full page)', 'pattern'), it('Waveform', 'wave')]) },
    { title: 'Shapes & media', items: [it('Image (placeholder)', 'image'), it('Rectangle', 'rect'), it('Ellipse', 'ellipse'), it('Line', 'line'), it('Arc', 'arcs'), it('Brand motif (arcs + dot)', 'motif')] },
    { title: 'Data', items: [it('Table', 'table'), it('Bar chart', 'chart-bar'), it('Statistics', 'stats'), it('Callout', 'callout'), it('Tags', 'tags')] }
  ];
}
