import React from 'react';

// Renders one page from the view-model built by lib/render.js pageView(). 1:1 port of "Nnoo Page.dc.html".
// Keep the data-* attributes: export, overflow detection and PPTX positioning read them from the live DOM.
function El({ el }) {
  return (
    <div data-el-id={el.id} style={el.wrap} onPointerDown={el.down} onDoubleClick={el.dbl}>
      {el.isPlain && (
        // Re-mount when entering/leaving edit mode so React never reconciles against DOM the user typed into.
        <div key={el.editing ? 'edit' : 'view'} data-text="1" style={el.textStyle} contentEditable={el.editing || undefined} suppressContentEditableWarning onBlur={el.blur}>{el.text}</div>
      )}
      {el.isList && (
        <div style={el.textStyle}>
          {(el.lines || []).map((ln, i) => <div key={i} style={ln.st}><span style={ln.mSt}>{ln.marker}</span><span>{ln.text}</span></div>)}
        </div>
      )}
      {el.isButton && <div style={el.btnStyle}>{el.text}</div>}
      {el.isShape && <div style={el.shapeStyle} />}
      {el.isArc && (
        <svg viewBox={el.vb} preserveAspectRatio="none" style={el.svgStyle}><path d={el.d} fill="none" stroke={el.stroke} strokeWidth={el.sw} strokeLinecap="round" /></svg>
      )}
      {el.isMotif && (
        <svg viewBox="0 0 80 80" style={el.svgStyle}>
          <path d="M22 32 Q40 14 58 32" fill="none" stroke={el.stroke} strokeWidth={el.sw} strokeLinecap="round" />
          <path d="M22 48 Q40 66 58 48" fill="none" stroke={el.stroke} strokeWidth={el.sw} strokeLinecap="round" />
          <circle cx="40" cy="40" r={el.sw} fill={el.stroke} />
        </svg>
      )}
      {el.isImage && (
        <>
          <div style={el.boxStyle}>
            {el.hasImg && <img src={el.src} alt={el.alt || ''} draggable="false" style={el.imgStyle} />}
            {el.isTile && <div style={el.tileStyle} />}
            {el.hasOverlay && <div style={el.overlayStyle} />}
          </div>
          {el.hasCaption && <div style={el.capStyle}>{el.caption}</div>}
        </>
      )}
      {el.isLogo && <img src={el.src} alt="Nnọọ" draggable="false" style={el.logoStyle} />}
      {el.isTable && (
        <table style={el.tableStyle}><tbody>
          {(el.rows || []).map((row, r) => <tr key={r}>{row.cells.map((cell, c) => <td key={c} style={cell.st}>{cell.t}</td>)}</tr>)}
        </tbody></table>
      )}
      {el.isChart && (
        <div>
          {el.hasTitle && <div style={el.titleStyle}>{el.chartTitle}</div>}
          {el.isBar && (
            <div>
              <div style={el.barsStyle}>{(el.bars || []).map((b, i) => <div key={i} style={b.colSt}><span style={b.valSt}>{b.value}</span><div style={b.barSt} /></div>)}</div>
              <div style={el.labelsStyle}>{(el.labels || []).map((lb, i) => <span key={i} style={lb.st}>{lb.label}</span>)}</div>
            </div>
          )}
          {el.isHbar && (
            <div>{(el.hbars || []).map((hb, i) => (
              <div key={i} style={hb.rowSt}><span style={hb.lSt}>{hb.label}</span><div style={hb.trackSt}><div style={hb.fillSt} /></div><span style={hb.vSt}>{hb.value}</span></div>
            ))}</div>
          )}
          {el.isDonut && (
            <div style={el.donutWrap}>
              <div style={el.donutStyle} />
              <div>{(el.legend || []).map((lg, i) => <div key={i} style={lg.rowSt}><span style={lg.dotSt} /><span>{lg.label}</span><span style={lg.vSt}>{lg.value}</span></div>)}</div>
            </div>
          )}
        </div>
      )}
      {el.isStats && (
        <div style={el.gridStyle}>{(el.stats || []).map((st, i) => <div key={i} style={st.cellSt}><div style={st.vSt}>{st.value}</div><div style={st.lSt}>{st.label}</div></div>)}</div>
      )}
      {el.isCols && (
        <div style={el.gridStyle}>{(el.cols || []).map((c, i) => (
          <div key={i} style={c.cardSt}><div style={c.tSt}>{c.title}</div>{c.hasMeta && <div style={c.mSt}>{c.meta}</div>}<div style={c.bSt}>{c.body}</div></div>
        ))}</div>
      )}
      {el.isEntries && (
        <div>{(el.entries || []).map((en, i) => (
          <div key={i} style={en.rowSt}>
            <div style={en.headSt}><span style={en.tSt}>{en.title}</span><span style={en.dSt}>{en.date}</span></div>
            <div style={en.oSt}>{en.org}</div>
            <div style={en.bSt}>{(en.bullets || []).map((bl, j) => <div key={j} style={bl.st}><span style={bl.mSt}>•</span><span>{bl.b}</span></div>)}</div>
          </div>
        ))}</div>
      )}
      {el.isTimeline && (
        <div style={el.tlStyle}>{(el.tl || []).map((tl, i) => (
          <div key={i} style={tl.itemSt}><div style={tl.dotSt} /><div><div style={tl.lSt}>{tl.label}</div><div style={tl.tSt}>{tl.title}</div><div style={tl.bSt}>{tl.body}</div></div></div>
        ))}</div>
      )}
      {el.isPeople && (
        <div style={el.gridStyle}>{(el.people || []).map((pp, i) => (
          <div key={i} style={pp.cardSt}>
            <div style={pp.avSt}>{pp.hasImg && <img src={pp.src} alt={pp.name} style={pp.imgSt} />}{pp.ini}</div>
            <div><div style={pp.nSt}>{pp.name}</div><div style={pp.rSt}>{pp.role}</div>{pp.hasBody && <div style={pp.bSt}>{pp.body}</div>}</div>
          </div>
        ))}</div>
      )}
      {el.isTags && <div style={el.tagsStyle}>{(el.tags || []).map((tg, i) => <span key={i} style={tg.st}>{tg.t}</span>)}</div>}
      {el.isGallery && (
        <div style={el.gridStyle}>{(el.gal || []).map((g, i) => (
          <div key={i}><div style={g.boxSt}><img src={g.src} alt={g.caption || ''} draggable="false" style={g.imgSt} /></div>{g.hasCap && <div style={g.cSt}>{g.caption}</div>}</div>
        ))}</div>
      )}
      {el.isToc && (
        <div>
          {(el.toc || []).map((tc, i) => <div key={i} style={tc.rowSt}><span style={tc.tSt}>{tc.title}</span><span style={tc.nSt}>{tc.n}</span></div>)}
          {el.tocEmpty && <div style={el.emptySt}>Mark pages “Include in contents” to list them here.</div>}
        </div>
      )}
      {el.isCallout && (
        <div style={el.calloutStyle}>{el.hasCTitle && <div style={el.ctSt}>{el.cTitle}</div>}<div style={el.cbSt}>{el.cBody}</div></div>
      )}
      {el.isPagenum && <div style={el.textStyle}>{el.text}</div>}
      {(el.handles || []).map(hd => <div key={hd.dir} data-ui="1" style={hd.st} onPointerDown={hd.down} />)}
    </div>
  );
}

export default function Page({ view }) {
  if (!view) return null;
  return (
    <div data-page-outer={view.pid} style={view.outerStyle}>
      <div data-page-root={view.pid} style={view.rootStyle} onPointerDown={view.pageDown}>
        {view.hasBgImage && <div style={view.bgStyle} />}
        <div style={view.contStyle}>
          {view.els.map(el => <El key={el.id} el={el} />)}
        </div>
        {view.hasHead && <div style={view.headStyle}>{view.headText}</div>}
        {view.hasNum && <div style={view.numStyle}>{view.numText}</div>}
      </div>
    </div>
  );
}
