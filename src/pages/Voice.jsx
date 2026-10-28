import React, { useMemo } from 'react';
import AppHeader from '../components/AppHeader.jsx';
import Icon from '../components/Icon.jsx';
import { VOICE, STATUS, sectionText, fullText } from '../lib/voice.js';
import { copyText, download, toast } from '../lib/app.js';
import Markdown, { parse } from './voice/markdown.jsx';
import { useScrollPadding, useInitialHashScroll, useActiveSection, jumpTo } from './voice/anchors.js';
import './voice/voice.css';

const FILE = 'nnoo-brand-voice-and-knowledge';

// Standalone HTML export — ported verbatim from the source's html() method.
export function voiceHTML() {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const body = VOICE.map(s => `<section><h2>${esc(s.title)}</h2><p class="st">${STATUS[s.status].label}</p>` + parse(s.md).map(b => b.isP ? `<p>${esc(b.text)}</p>` : b.isUl ? '<ul>' + b.items.map(x => `<li>${esc(x)}</li>`).join('') + '</ul>' : b.isOl ? '<ol>' + b.items.map(x => `<li>${esc(x)}</li>`).join('') + '</ol>' : '<table><tr>' + b.head.map(h => `<th>${esc(h)}</th>`).join('') + '</tr>' + b.rows.map(r => '<tr>' + r.map(c => `<td>${esc(c)}</td>`).join('') + '</tr>').join('') + '</table>').join('') + '</section>').join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Nnọọ — brand voice and knowledge</title><style>body{font-family:"DM Sans",system-ui,sans-serif;max-width:760px;margin:40px auto;padding:0 20px;color:#1a120b;line-height:1.65;background:#faf5ec}h1,h2{font-family:Outfit,system-ui,sans-serif;letter-spacing:-0.01em}h2{margin-top:2em}.st{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#a7471c}table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #d9cfbd;padding:6px 8px;text-align:left;vertical-align:top}</style></head><body><h1>Nnọọ — brand voice and knowledge</h1>${body}</body></html>`;
}

const DOWNLOADS = [
  ['Download .md', () => download(new Blob([fullText()], { type: 'text/markdown' }), FILE + '.md')],
  ['Download .txt', () => download(new Blob([fullText().replace(/^#+ /gm, '')], { type: 'text/plain' }), FILE + '.txt')],
  ['Download .html', () => download(new Blob([voiceHTML()], { type: 'text/html' }), FILE + '.html')]
];

export default function Voice() {
  useScrollPadding(80);
  useInitialHashScroll('sec-');
  const sections = useMemo(() => VOICE.map(s => ({ ...s, anchor: 'sec-' + s.id, blocks: parse(s.md) })), []);
  const cur = useActiveSection(sections.map(s => s.anchor));
  const copyAll = () => copyText(fullText()).catch(() => toast('Copy failed — select the text manually.', 'err'));

  return (
    <>
      <AppHeader active="voice" />
      <div className="sn-layout">
        <nav className="sn-nav" aria-label="Sections">
          <div className="eyebrow-ui">On this page</div>
          {sections.map(s => (
            <a key={s.id} href={'#' + s.anchor} aria-current={cur === s.anchor ? 'true' : undefined} onClick={e => { e.preventDefault(); jumpTo(s.anchor); }}>
              <span className={'vc-dot ' + s.status} />{s.title}
            </a>
          ))}
        </nav>

        <main className="sn-main">
          <header className="vc-head">
            <div className="eyebrow-ui">Voice &amp; knowledge</div>
            <h1 className="vc-title">Everything a writer — or an AI tool — needs to sound like Nnọọ</h1>
            <p className="vc-lead">Copy a single section, or the whole document, straight into ChatGPT, Claude or your content calendar. Each section is marked by how certain it is, so nothing unconfirmed is passed off as fact.</p>
            <div className="vc-tools">
              <button type="button" className="btn btn-primary" onClick={copyAll}><Icon name="copy" size={18} />Copy everything</button>
              {DOWNLOADS.map(([label, run]) => <button key={label} type="button" className="btn btn-outline" onClick={run}><Icon name="download" size={18} />{label}</button>)}
            </div>
            <div className="vc-legend">
              {Object.entries(STATUS).map(([k, v]) => <span key={k}><span className={'vc-dot ' + k} /><span><strong>{v.label}</strong> — {v.note}</span></span>)}
            </div>
            <div className="sn-jump">
              <label className="label" htmlFor="vc-jump">Jump to section</label>
              <select id="vc-jump" className="select" value="" onChange={e => { if (e.target.value) jumpTo(e.target.value); }}>
                <option value="">Choose a section…</option>
                {sections.map((s, i) => <option key={s.id} value={s.anchor}>{(i + 1) + '. ' + s.title}</option>)}
              </select>
            </div>
          </header>

          {sections.map(s => (
            <section key={s.id} id={s.anchor} className="vc-sec" aria-labelledby={s.anchor + '-h'}>
              <div className="vc-sec-top">
                <div>
                  <span className={'vc-badge ' + s.status}>{STATUS[s.status].label}</span>
                  <h2 id={s.anchor + '-h'}>{s.title}</h2>
                </div>
                <button type="button" className="btn btn-outline btn-sm" title={'Copy section: ' + s.title} aria-label={'Copy section: ' + s.title} onClick={() => copyText(sectionText(s)).catch(() => toast('Copy failed', 'err'))}>
                  <Icon name="copy" size={16} />Copy section
                </button>
              </div>
              <Markdown blocks={s.blocks} />
            </section>
          ))}
        </main>
      </div>
    </>
  );
}
