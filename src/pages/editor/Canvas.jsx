import React from 'react';
import Page from '../../components/Page.jsx';
import * as T from '../../lib/templates.js';
import { resolveColor } from '../../lib/tokens.js';

// Scrollable, virtualised stack of pages. Only pages near the viewport are rendered (all of them while exporting).
export default function Canvas({ ed, s, z, nums, toc }) {
  const d = s.doc;
  const cont = d.kind === 'doc' && T.DOC_KINDS[d.docKind].continuous;
  return (
    <main aria-label="Canvas" className={'ed-canvas' + (s.preview ? ' preview' : '')} ref={ed.canvasRef}
      onPointerDown={ed.canvasDown} onScroll={ed.onScrollCanvas}>
      <div className="ed-canvas-inner">
        {d.pages.map((p, i) => {
          const live = ed.isLive(i);
          const H = p.h || d.h;
          const view = live ? ed.canvasView(p, i, z, nums, toc) : null;
          const guides = s.guides && s.guides.pi === i ? s.guides.g : [];
          const warn = !!s.overflow[p.id] && !s.preview;
          const showLabel = !s.preview && !(cont && i > 0 && !s.overflow[p.id]);
          return (
            <div key={p.id} data-page-wrap={p.id} className="ed-page-wrap" style={{ marginTop: i === 0 || cont ? 0 : 28 }}>
              {showLabel && (
                <div data-ui="1" className="ed-page-label">
                  <span style={{ fontWeight: i === s.pageIdx ? 600 : 500, color: i === s.pageIdx ? 'var(--brand)' : 'var(--fg-subtle)' }}>{(i + 1) + ' · ' + p.name + (p.section ? ' — ' + p.section : '')}</span>
                  {warn && (
                    <span className="ed-ovf">
                      <span>Content overflows this page</span>
                      <button type="button" onClick={() => ed.flowOverflow(i)}>Move overflow to new page</button>
                    </span>
                  )}
                </div>
              )}
              <div style={{ position: 'relative' }}>
                {live ? <Page view={view} /> : <div style={{ width: d.w * z + 'px', height: H * z + 'px', background: resolveColor(p.bg || 'bone'), boxShadow: '0 6px 18px rgba(58,24,9,.14)', opacity: 0.6 }} />}
                {guides.map((g, gi) => (
                  <div key={gi} data-ui="1" style={g.x != null
                    ? { position: 'absolute', left: g.x * z + 'px', top: 0, bottom: 0, width: '1px', background: '#d9a019', pointerEvents: 'none' }
                    : { position: 'absolute', top: g.y * z + 'px', left: 0, right: 0, height: '1px', background: '#d9a019', pointerEvents: 'none' }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
