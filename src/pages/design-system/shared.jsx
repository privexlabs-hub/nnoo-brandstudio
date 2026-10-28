import React from 'react';
import { copyText, toast } from '../../lib/app.js';

export const SECTIONS = [
  ['overview', 'Overview'], ['logo', 'Logo'], ['colour', 'Colour'], ['type', 'Type'], ['spacing', 'Spacing'], ['radius', 'Radius & Shadow'],
  ['motif', 'Motif'], ['voice', 'Voice'], ['components', 'Components'], ['slides', 'Slides'], ['uikits', 'UI Kits'], ['governance', 'Governance']
].map(([id, label], i) => ({ id, label, num: String(i + 1).padStart(2, '0') }));

// Copy handler factory: onClick={cp(value)}
export const cp = v => () => copyText(String(v)).catch(() => toast('Copy failed', 'err'));

// Eyebrow + heading for a section. `eyebrow` is the long label, e.g. "05 · Spacing & layout".
export function SecHead({ eyebrow, title, h1 }) {
  return (
    <>
      <div className="eyebrow-ui">{eyebrow}</div>
      {h1 ? <h1 className="ds-h1">{title}</h1> : <h2 className="ds-h2">{title}</h2>}
    </>
  );
}

// Copyable mono value chip.
export function Val({ v, copy = v, title, className = '', children }) {
  return <button type="button" className={'ds-val ' + className} onClick={cp(copy)} title={title}>{children || v}</button>;
}
