import React, { useEffect, useRef } from 'react';

// Fixed bottom bar for bulk export. While shown it lifts the shared toast above itself (body class + measured height).
export default function BulkBar({ count, busy, onPng, onJson, onClear }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current, b = document.body; if (!el) return;
    const set = () => b.style.setProperty('--tl-bulk-h', Math.ceil(el.getBoundingClientRect().height) + 'px');
    set(); b.classList.add('tl-has-bulk');
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(set) : null; ro && ro.observe(el);
    return () => { ro && ro.disconnect(); b.classList.remove('tl-has-bulk'); b.style.removeProperty('--tl-bulk-h'); };
  }, []);
  return (
    <div ref={ref} role="region" aria-label="Bulk export" className="tl-bulk">
      <span className="tl-bulk-n">{count} selected</span>
      <button type="button" className="btn btn-primary" disabled={busy} onClick={onPng}>{busy ? 'Exporting…' : 'Download PNGs (ZIP)'}</button>
      <button type="button" className="btn tl-bulk-ghost" onClick={onJson}>Project files (ZIP)</button>
      <button type="button" className="btn tl-bulk-clear" onClick={onClear}>Clear</button>
    </div>
  );
}
