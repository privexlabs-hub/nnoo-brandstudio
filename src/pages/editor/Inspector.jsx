import React, { useState } from 'react';
import { elementSections, pageSections, docSections } from './sections.js';

// Text-like input that keeps the user's draft while focused (so half-typed numbers aren't overwritten),
// and calls `change` on every input like React's onChange. Shows the document value when not focused.
function Draft({ as = 'input', value, change, focus, ...rest }) {
  const [draft, setDraft] = useState(null);
  const Tag = as;
  return (
    <Tag {...rest} value={draft != null ? draft : (value == null ? '' : value)}
      onFocus={() => { setDraft(value == null ? '' : String(value)); focus && focus(); }}
      onBlur={() => setDraft(null)}
      onChange={e => { setDraft(e.target.value); change && change(e); }} />
  );
}

function FileField({ text, accept, change, className = 'ed-file' }) {
  return <label className={className}>{text}<input type="file" accept={accept} onChange={change} className="ed-file-input" /></label>;
}

function Field({ f }) {
  const k = f.kind;
  const label = f.label && k !== 'toggle' ? <label className="ed-flabel">{f.label}</label> : null;
  let body = null;
  if (k === 'text') body = <Draft type="text" className="ed-input" value={f.value} change={f.change} focus={f.focus} placeholder={f.ph || ''} title={f.label} aria-label={f.label} />;
  else if (k === 'number') body = <Draft type="number" className="ed-input" value={f.value} change={f.change} focus={f.focus} step={f.step || 1} min={f.min} max={f.max} title={f.label} aria-label={f.label} />;
  else if (k === 'area') body = <Draft as="textarea" className="ed-input ed-area" value={f.value} change={f.change} focus={f.focus} rows={f.rows || 3} placeholder={f.ph || ''} title={f.label} aria-label={f.label} />;
  else if (k === 'select') body = (
    <select className="ed-input ed-select" value={f.value == null ? '' : String(f.value)} onChange={f.change} title={f.label} aria-label={f.label}>
      {f.options.map(op => <option key={String(op.v)} value={op.v == null ? '' : String(op.v)}>{op.l}</option>)}
    </select>
  );
  else if (k === 'seg') body = (
    <div role="group" aria-label={f.label} className="ed-seg">
      {f.options.map(op => <button key={op.l} type="button" title={op.l} aria-pressed={!!op.on} onClick={op.pick}>{op.l}</button>)}
    </div>
  );
  else if (k === 'toggle') body = (
    <button type="button" role="switch" aria-checked={!!f.on} onClick={f.toggle} className="ed-toggle">
      <span className="ed-track" data-on={f.on ? '1' : undefined}><span className="ed-knob" /></span><span>{f.text}</span>
    </button>
  );
  else if (k === 'color') body = (
    <div className="ed-color">
      <div className="ed-swatches">
        {f.swatches.map(sw => <button key={sw.name} type="button" title={sw.name} aria-label={sw.name} aria-pressed={sw.on} onClick={sw.pick} className="ed-swatch" style={{ background: sw.bg }} />)}
      </div>
      <Draft type="text" className="ed-input" value={f.value} change={e => f.change(e.target.value)} aria-label={(f.label || 'Colour') + ' value'} placeholder="token or #hex" />
    </div>
  );
  else if (k === 'range') body = (
    <div className="ed-range">
      <input type="range" value={f.value} min={f.min} max={f.max} step={f.step || 1} onChange={f.change} onPointerDown={f.focus} title={f.label} aria-label={f.label} />
      <span>{f.display}</span>
    </div>
  );
  else if (k === 'actions') body = (
    <div className="ed-actions">
      {f.actions.map(a => <button key={a.label} type="button" onClick={a.run} disabled={!!a.disabled} title={a.title || a.label} className={'ed-act' + (a.primary ? ' primary' : a.danger ? ' danger' : '')}>{a.label}</button>)}
    </div>
  );
  else if (k === 'file') body = <FileField text={f.text} accept={f.accept} change={f.change} />;
  else if (k === 'note') body = <p className={'ed-note' + (f.warn ? ' warn' : '')}>{f.text}</p>;
  else if (k === 'layers') body = (
    <div className="ed-layers">
      {f.layers.map(ly => (
        <div key={ly.id} className="ed-layer" data-on={ly.on ? '1' : undefined} data-hidden={ly.hidden ? '1' : undefined}>
          <button type="button" onClick={ly.select} className="ed-layer-name"><span className="ed-layer-type">{ly.type}</span>{ly.name}</button>
          <button type="button" aria-label="Move layer up" onClick={ly.up} className="ed-micro">↑</button>
          <button type="button" aria-label="Move layer down" onClick={ly.down} className="ed-micro">↓</button>
          <button type="button" title={ly.visLabel} aria-label={ly.visLabel} onClick={ly.vis} className="ed-micro">{ly.visIcon}</button>
        </div>
      ))}
      {f.noLayers && <p className="ed-note" style={{ margin: 6 }}>No elements on this page yet.</p>}
    </div>
  );
  else if (k === 'gallery') body = (
    <div className="stack" style={{ '--gap': '8px' }}>
      {f.items.map((gi, i) => (
        <div key={i} className="ed-gal-row">
          <img src={gi.src} alt="" />
          <Draft type="text" className="ed-input" value={gi.caption} change={gi.change} aria-label="Caption" placeholder="Caption" />
          <FileField text="↺" accept="image/*" change={gi.replace} className="ed-micro ed-micro-label" />
          <button type="button" aria-label="Remove image" onClick={gi.remove} className="ed-micro danger">✕</button>
        </div>
      ))}
    </div>
  );
  const full = f.span === 2 || ['area', 'color', 'actions', 'seg', 'layers', 'file', 'note', 'gallery', 'range'].includes(k);
  return <div className="ed-field" style={{ gridColumn: full ? '1 / -1' : 'auto' }}>{label}{body}</div>;
}

export default function Inspector({ ed, s, f }) {
  const tab = f && s.tab === 'element' ? 'element' : s.tab === 'doc' ? 'doc' : 'page';
  const sections = tab === 'element' && f ? elementSections(ed, f) : tab === 'doc' ? docSections(ed) : pageSections(ed);
  const tabs = [['element', 'Element', !!f], ['page', 'Page', true], ['doc', 'Document', true]].filter(x => x[2]);
  const scope = tab === 'element' ? f.el.id : tab === 'page' ? ed.doc().pages[s.pageIdx].id : 'doc';
  return (
    <>
      <div className="ed-insp-tabs" role="tablist" aria-label="Inspector">
        {tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} aria-pressed={tab === id} onClick={() => ed.setState({ tab: id })}>{label}</button>)}
      </div>
      <div className="ed-insp-body" key={tab + scope}>
        {sections.map((sec, si) => (
          <section key={si + sec.title} className="ed-sec">
            <div className="ed-sec-head"><h3>{sec.title}</h3><span>{sec.hint || ''}</span></div>
            <div className="ed-sec-grid">{sec.fields.map((fd, fi) => <Field key={fi + (fd.label || fd.text || fd.kind)} f={fd} />)}</div>
          </section>
        ))}
      </div>
    </>
  );
}
