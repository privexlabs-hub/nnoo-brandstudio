import React, { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

// Centered dialog on ≥640px, bottom sheet below. Closes on backdrop click and Escape unless `locked`.
export default function Modal({ title, onClose, locked, children, width = 720, footer }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    ref.current && ref.current.focus();
    const key = e => { if (e.key === 'Escape' && !locked) { e.stopPropagation(); onClose && onClose(); } };
    window.addEventListener('keydown', key, true);
    return () => { window.removeEventListener('keydown', key, true); prev && prev.focus && prev.focus(); };
  }, [locked, onClose]);
  return (
    <div className="modal-back" onPointerDown={e => { if (e.target === e.currentTarget && !locked) onClose && onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref} style={{ width: `min(${width}px, 100%)` }}>
        <div className="modal-head">
          <h2 className="h-card" style={{ fontSize: 20 }}>{title}</h2>
          <button type="button" className="icon-btn sm" aria-label="Close" onClick={onClose} disabled={locked}><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div style={{ position: 'sticky', bottom: 0, padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>{footer}</div>}
      </div>
    </div>
  );
}
