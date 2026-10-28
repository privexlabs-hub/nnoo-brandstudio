// Local persistence for edited documents. Everything stays in this browser (localStorage).
const IDX = 'nnoo.docs.index', K = id => 'nnoo.doc.' + id;
const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
export function listDocs() { return read(IDX, []).sort((a, b) => b.updated - a.updated); }
export function getDoc(id) { return read(K(id), null); }
export function saveDoc(doc) {
  doc.updated = Date.now();
  const meta = { id: doc.id, name: doc.name, templateId: doc.templateId, kind: doc.kind, docKind: doc.docKind || null, formatId: doc.formatId, w: doc.w, h: doc.h, pages: doc.pages.length, updated: doc.updated };
  try {
    localStorage.setItem(K(doc.id), JSON.stringify(doc));
    const idx = read(IDX, []).filter(d => d.id !== doc.id); idx.push(meta); localStorage.setItem(IDX, JSON.stringify(idx));
  } catch (e) {
    const err = new Error('Browser storage is full. Remove unused documents or replace large uploaded images, then try again.'); err.quota = true; throw err;
  }
  return doc;
}
export function deleteDoc(id) { localStorage.removeItem(K(id)); localStorage.setItem(IDX, JSON.stringify(read(IDX, []).filter(d => d.id !== id))); }
export function storageUse() { let n = 0; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('nnoo.')) n += (localStorage.getItem(k) || '').length; } } catch (e) {} return n; }
