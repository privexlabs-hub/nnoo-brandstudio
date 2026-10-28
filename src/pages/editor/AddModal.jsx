import React from 'react';
import Modal from '../../components/Modal.jsx';
import { addGroups } from './addGroups.js';

export default function AddModal({ ed, s }) {
  const d = s.doc, add = s.add;
  const title = add.type === 'page' ? (d.kind === 'doc' ? 'Add a page' : 'Add a page / slide') : 'Add an element';
  const sub = add.type === 'page'
    ? 'Inserted at position ' + ((add.at != null ? add.at : s.pageIdx + 1) + 1) + '.'
    : (d.pages[s.pageIdx].layout === 'flow' ? 'Inserted after the selected element, or at the end of page ' + (s.pageIdx + 1) + '.' : 'Placed in the centre of page ' + (s.pageIdx + 1) + '. Drag to position.');
  return (
    <Modal title={title} onClose={ed.closeAdd} width={720}>
      <p className="small subtle" style={{ marginBottom: 16 }}>{sub}</p>
      <div className="stack" style={{ '--gap': '16px' }}>
        {addGroups(ed).map(g => (
          <div key={g.title}>
            <div className="eyebrow-ui" style={{ fontSize: 11, marginBottom: 8 }}>{g.title}</div>
            <div className="ed-add-grid">{g.items.map((it, i) => <button key={i + it.label} type="button" className="ed-add-item" onClick={it.run}>{it.label}</button>)}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
