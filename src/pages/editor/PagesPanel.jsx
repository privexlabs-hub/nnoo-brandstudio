import React from 'react';
import Page from '../../components/Page.jsx';
import { resolveColor } from '../../lib/tokens.js';

const THUMB_W = 56;

export default function PagesPanel({ ed, s, nums, toc }) {
  const d = s.doc;
  let lastSec = null;
  const title = d.kind === 'doc' ? (d.docKind === 'presentation' ? 'Slides' : d.docKind === 'article' || d.docKind === 'newsletter' ? 'Sections' : 'Pages') : 'Pages';
  const stop = fn => ev => { ev.stopPropagation(); fn(); };
  return (
    <>
      <div className="ed-nav-head">
        <span className="eyebrow-ui">{title}</span>
        <div className="row" style={{ '--gap': '6px', flexWrap: 'nowrap' }}>
          {d.docKind === 'ebook' && <button type="button" className="ed-small" onClick={() => ed.addChapter()}>+ Chapter</button>}
          <button type="button" className="ed-small brand" onClick={() => ed.setState({ add: { type: 'page', at: s.pageIdx + 1 } })}>{d.kind === 'doc' ? '+ Page' : '+ Slide'}</button>
        </div>
      </div>
      <div className="ed-nav-list" ref={ed.navRef}>
        {d.pages.map((p, i) => {
          const hasSection = !!p.section && p.section !== lastSec; lastSec = p.section || lastSec; if (!p.section) lastSec = null;
          const on = i === s.pageIdx;
          const visible = !(p.section && s.collapsed[p.section]) || on;
          const H = p.h || d.h, tz = Math.min(THUMB_W / d.w, 72 / H);
          const live = Math.abs(i - s.pageIdx) <= 12;
          const drag = s.drag;
          return (
            <div key={p.id}>
              {hasSection && (
                <button type="button" className="ed-nav-sec" aria-expanded={!s.collapsed[p.section]} onClick={() => ed.setState({ collapsed: { ...s.collapsed, [p.section]: !s.collapsed[p.section] } })}>
                  <span aria-hidden="true">{s.collapsed[p.section] ? '▸' : '▾'}</span><span>{p.section}</span>
                </button>
              )}
              {visible && (
                <div data-nav-pid={p.id} draggable="true" className="ed-nav-item" data-on={on ? '1' : undefined}
                  role="button" tabIndex={0} aria-current={on ? 'true' : undefined} aria-label={'Page ' + (i + 1) + ': ' + p.name}
                  onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); ed.selectPage(i, { toCanvas: true }); } }}
                  style={{ border: drag && drag.over === i && drag.from !== i ? '2px dashed var(--brand)' : '2px solid transparent', opacity: drag && drag.from === i ? 0.5 : 1 }}
                  onDragStart={ev => { ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', String(i)); ed.setState({ drag: { from: i, over: i } }); }}
                  onDragOver={ev => { ev.preventDefault(); if (ed.state.drag && ed.state.drag.over !== i) ed.setState({ drag: { ...ed.state.drag, over: i } }); }}
                  onDrop={ev => { ev.preventDefault(); const from = parseInt(ev.dataTransfer.getData('text/plain'), 10); ed.setState({ drag: null }); if (!isNaN(from)) ed.movePage(from, i); }}
                  onDragEnd={() => ed.setState({ drag: null })}
                  onClick={() => ed.selectPage(i, { toCanvas: true })}>
                  <div className="ed-thumb" style={{ height: Math.round(H * tz) + 'px' }}>
                    {live ? <Page view={ed.memo('t', p, i, { zoom: tz, thumb: true, nums, toc })} />
                      : <div style={{ width: Math.round(d.w * tz) + 'px', height: Math.round(H * tz) + 'px', background: resolveColor(p.bg || 'bone'), borderRadius: 4, boxShadow: '0 1px 3px rgba(58,24,9,.12)' }} />}
                  </div>
                  <div className="ed-nav-meta">
                    <div className="ed-nav-title"><span className="ed-nav-num">{i + 1}</span><span className="ed-nav-name">{p.name}</span></div>
                    {s.overflow[p.id] && <span className="ed-nav-warn">Overflows page</span>}
                    {on && !s.preview && (
                      <div className="ed-micro-row">
                        <button type="button" title="Move up" aria-label="Move page up" disabled={i === 0} onClick={stop(() => ed.movePage(i, i - 1))} className="ed-micro">↑</button>
                        <button type="button" title="Move down" aria-label="Move page down" disabled={i === d.pages.length - 1} onClick={stop(() => ed.movePage(i, i + 1))} className="ed-micro">↓</button>
                        <button type="button" title="Insert page before" aria-label="Insert page before" onClick={stop(() => ed.setState({ add: { type: 'page', at: i } }))} className="ed-micro">+↑</button>
                        <button type="button" title="Insert page after" aria-label="Insert page after" onClick={stop(() => ed.setState({ add: { type: 'page', at: i + 1 } }))} className="ed-micro">+↓</button>
                        <button type="button" title="Duplicate page" aria-label="Duplicate page" onClick={stop(() => ed.dupPage(i))} className="ed-micro">⧉</button>
                        <button type="button" title="Delete page" aria-label="Delete page" onClick={stop(() => ed.delPage(i))} className="ed-micro danger">✕</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
