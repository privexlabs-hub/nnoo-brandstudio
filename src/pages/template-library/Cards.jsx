import React from 'react';
import { Link } from 'react-router-dom';
import LazyThumb from './LazyThumb.jsx';
import Icon from '../../components/Icon.jsx';
import { FORMATS, DOC_KINDS } from '../../lib/templates.js';

export function Check({ on, onToggle, label = 'Select for bulk export' }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} aria-label={label} className="tl-chk" onClick={onToggle}>
      <span>{on && <Icon name="check" size={16} stroke={3} />}</span>
    </button>
  );
}

export function formatOptions(t) {
  return t.kind === 'doc'
    ? DOC_KINDS[t.docKind].sizes.map(z => ({ v: z.id, l: z.label }))
    : t.formats.map(f => ({ v: f, l: FORMATS[f].label + ' ' + FORMATS[f].w + '×' + FORMATS[f].h }));
}

export function templateMeta(t, d, fmt) {
  if (t.kind === 'doc') { const k = DOC_KINDS[t.docKind]; return k.name + ' · ' + d.pages.length + ' pages · ' + k.exports.map(x => x.toUpperCase()).join(', '); }
  return (t.formats.length > 1 ? t.formats.length + ' formats' : FORMATS[fmt].label) + (d.pages.length > 1 ? ' · ' + d.pages.length + ' slides' : '');
}

export function TemplateCard({ t, d, fmt, on, busy, onToggle, onOpen, onFmt, onDownload }) {
  const opts = formatOptions(t);
  const multi = d.pages.length > 1;
  return (
    <article className={'tl-card' + (on ? ' on' : '')}>
      <div className="tl-card-top"><Check on={on} onToggle={onToggle} label={'Select ' + t.name + ' for bulk export'} /><span className="tl-dims">{d.w} × {d.h}</span></div>
      <LazyThumb key={d.id} doc={d} height={170} onClick={onOpen} title={'Edit ' + t.name} />
      <div style={{ minWidth: 0 }}><h3 className="tl-name">{t.name}</h3><div className="tl-meta">{templateMeta(t, d, fmt)}</div></div>
      <div className="tl-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={onOpen}>Edit</button>
        {opts.length > 1 && (
          <select className="select" aria-label={'Format for ' + t.name} value={fmt} onChange={e => onFmt(e.target.value)}>
            {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        )}
        <button type="button" className="btn btn-outline btn-sm" onClick={onDownload} disabled={busy} title={multi ? 'Download every page as PNG (ZIP)' : 'Download PNG at full size'}>{multi ? 'ZIP' : 'PNG'}</button>
      </div>
    </article>
  );
}

export function DocCard({ d, on, busy, onToggle, onDownload, onJson, onDup, onDelete }) {
  return (
    <div className={'tl-card' + (on ? ' on' : '')}>
      <div className="tl-card-top"><Check on={on} onToggle={onToggle} label={'Select ' + d.name + ' for bulk export'} /><span className="tl-dims">{new Date(d.updated).toLocaleString()}</span></div>
      <LazyThumb key={d.id + ':' + d.updated} doc={d} height={160} fallbackW={236} />
      <div style={{ minWidth: 0 }}><div className="tl-name clip" title={d.name}>{d.name}</div><div className="tl-meta">{d.w} × {d.h} · {d.pages.length}{d.pages.length === 1 ? ' page' : ' pages'}</div></div>
      <div className="tl-actions">
        <Link to={'/editor#doc=' + d.id} className="btn btn-primary btn-sm">Open</Link>
        <button type="button" className="btn btn-outline btn-sm" onClick={onDownload} disabled={busy}>↓ PNG</button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onJson}>Project file</button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onDup}>Duplicate</button>
        <button type="button" className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
