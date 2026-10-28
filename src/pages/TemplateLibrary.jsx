import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import { CATEGORIES, TEMPLATES, DOC_TEMPLATES, DOC_KINDS, FORMATS, newDocFromTemplate, uid, clone } from '../lib/templates.js';
import { listDocs, getDoc, saveDoc, deleteDoc, storageUse } from '../lib/store.js';
import { toast, download, slug, hashParams, setHash } from '../lib/app.js';
import { fileBase } from '../lib/export.js';
import { TemplateCard, DocCard } from './template-library/Cards.jsx';
import BannerGenerator, { DEFAULT_GEN } from './template-library/BannerGenerator.jsx';
import BulkBar from './template-library/BulkBar.jsx';
import { exportPngs, exportProjects, projectBlob } from './template-library/exporter.jsx';
import './template-library/library.css';

const ALL = TEMPLATES.concat(DOC_TEMPLATES);
const CAT_IDS = new Set(['all', 'mine', ...CATEGORIES.map(c => c.id)]);
const N_FORMATS = new Set(ALL.flatMap(t => (t.kind === 'doc' ? t.formats.map(f => t.docKind + f) : t.formats))).size;
const COUNT_LINE = ALL.length + ' templates across ' + CATEGORIES.length + ' categories and ' + N_FORMATS + ' sizes — social, advertising, email, web, editorial and multi-page documents. Every one opens in the editor and exports at its real dimensions.';
const SEARCH_TEXT = Object.fromEntries(ALL.map(t => {
  const cat = CATEGORIES.find(c => c.id === t.cat);
  const fmts = t.kind === 'doc' ? DOC_KINDS[t.docKind].sizes.map(z => z.label) : (t.formats || []).map(f => (FORMATS[f] || {}).label || f);
  return [t.id, [t.name, t.cat, cat ? cat.name : '', fmts.join(' '), t.docKind || '', t.docKind ? DOC_KINDS[t.docKind].name : ''].join(' ').toLowerCase()];
}));
const catFromHash = () => { const c = hashParams().cat; return c && CAT_IDS.has(c) ? c : 'square'; };

// Preview docs are cached per `id|fmt` for the page's lifetime (building 36-page ebooks is not free).
const previewCache = new Map();
function docFor(t, fmt) {
  const k = t.id + '|' + (fmt || '');
  if (!previewCache.has(k)) previewCache.set(k, newDocFromTemplate(t, fmt));
  return previewCache.get(k);
}

export default function TemplateLibrary() {
  const navigate = useNavigate();
  const [cat, setCat] = useState(catFromHash);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState({});
  const [fmt, setFmt] = useState({});
  const [busy, setBusy] = useState(false);
  const [g, setG] = useState(DEFAULT_GEN);
  const [docsV, setDocsV] = useState(0);
  const busyRef = useRef(false);

  useEffect(() => {
    const on = () => setCat(catFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  // Re-read saved docs when another tab edits them.
  useEffect(() => {
    const on = e => { if (!e.key || e.key.startsWith('nnoo.doc')) setDocsV(v => v + 1); };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);

  const pick = id => { setCat(id); setHash({ cat: id }); };

  const docsIdx = useMemo(() => listDocs(), [docsV]); // eslint-disable-line react-hooks/exhaustive-deps
  const query = q.trim().toLowerCase();
  const match = t => !query || SEARCH_TEXT[t.id].includes(query);

  const cats = useMemo(() => [{ id: 'all', name: 'All' }, ...CATEGORIES, { id: 'mine', name: 'My documents' }].map(c => ({
    ...c, n: c.id === 'all' ? ALL.length : c.id === 'mine' ? docsIdx.length : ALL.filter(t => t.cat === c.id).length
  })), [docsIdx]);

  const quick = useCallback(async (docs, zipName) => {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true);
    try {
      const n = await exportPngs(docs, zipName);
      toast('Downloaded ' + n + (n === 1 ? ' image' : ' images'));
    } catch (e) { console.error(e); toast('Export failed: ' + (e && e.message || e), 'err'); }
    busyRef.current = false; setBusy(false);
  }, []);

  const open = useCallback(doc => {
    try {
      const d = clone(doc); d.id = uid('d'); d.created = d.updated = Date.now();
      saveDoc(d); navigate('/editor#doc=' + d.id);
    } catch (e) { toast(e.message, 'err'); }
  }, [navigate]);

  const importJson = async e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
    try {
      let j; try { j = JSON.parse(await f.text()); } catch (err) { throw new Error('This file is not valid JSON.'); }
      const docs = j && j.nnooProject ? [j.doc] : j && j.nnooBundle ? j.docs : null;
      if (!Array.isArray(docs) || !docs.length || !docs.every(d => d && Array.isArray(d.pages) && d.pages.length && d.w && d.h)) throw new Error('This is not a Nnọọ project file.');
      docs.forEach(d => { d.id = uid('d'); if (!d.name) d.name = 'Imported document'; if (!d.created) d.created = Date.now(); saveDoc(d); });
      setDocsV(v => v + 1); pick('mine');
      toast('Imported ' + docs.length + (docs.length === 1 ? ' document' : ' documents'));
    } catch (err) { toast('Import failed: ' + err.message, 'err'); }
  };

  // ----- template groups -----
  const groups = useMemo(() => {
    if (cat === 'mine') return [];
    const cs = cat === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === cat);
    return cs.map(c => {
      const items = ALL.filter(t => t.cat === c.id && match(t)).map(t => { const f = fmt[t.id] || t.formats[0]; return { t, f, d: docFor(t, f) }; });
      return { c, items, note: c.note + ' · ' + items.length + (items.length === 1 ? ' template' : ' templates') };
    }).filter(gr => gr.items.length);
  }, [cat, query, fmt]); // eslint-disable-line react-hooks/exhaustive-deps

  // ----- my documents -----
  const showMine = cat === 'mine';
  const mine = useMemo(() => (showMine ? docsIdx.filter(m => !query || (m.name || '').toLowerCase().includes(query)).map(m => getDoc(m.id)).filter(d => d && Array.isArray(d.pages) && d.pages.length) : []), [showMine, docsIdx, query]);
  const storageLine = docsIdx.length + (docsIdx.length === 1 ? ' document' : ' documents') + ' saved in this browser · ' + Math.round(storageUse() / 1024) + ' KB of about 5 MB used';

  const showGen = cat === 'editorial' || (cat === 'all' && !query);

  const toggle = (key, val) => setSel(s => { const n = { ...s }; if (n[key]) delete n[key]; else n[key] = val; return n; });
  const selected = Object.values(sel);
  const selDocs = () => selected.map(x => x.doc || docFor(x.t, x.fmt));

  const dup = d => { try { const c = clone(d); c.id = uid('d'); c.name += ' (copy)'; c.created = Date.now(); saveDoc(c); setDocsV(v => v + 1); toast('Duplicated'); } catch (e) { toast(e.message, 'err'); } };
  const del = d => {
    if (!window.confirm('Delete “' + d.name + '” from this browser? This cannot be undone.')) return;
    deleteDoc(d.id); setDocsV(v => v + 1); setSel(s => { const n = { ...s }; delete n['doc:' + d.id]; return n; }); toast('Deleted');
  };
  const bulkJson = async () => {
    try { await exportProjects(selDocs(), 'nnoo-project-files.zip'); } catch (e) { console.error(e); toast('Export failed: ' + e.message, 'err'); }
  };

  const noResults = !showMine && !groups.length && !(showGen && cat === 'editorial');

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-body)' }}>
      <AppHeader active="templates" />
      <main className="wrap tl-main">
        <div className="tl-head">
          <div className="tl-head-copy">
            <div className="eyebrow-ui">Template library</div>
            <h1 className="tl-h1">Start from the brand, not a blank page</h1>
            <p className="tl-count">{COUNT_LINE}</p>
          </div>
          <label className="field tl-search">
            <span className="tl-flabel">Search templates</span>
            <input className="input" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. poll, LinkedIn, proposal" />
          </label>
        </div>

        <nav aria-label="Categories" className="pill-row tl-pills">
          {cats.map(c => (
            <button key={c.id} type="button" className="pill" aria-pressed={cat === c.id} onClick={() => pick(c.id)}>
              {c.name}<span className="count">{c.n}</span>
            </button>
          ))}
        </nav>

        {showGen && <BannerGenerator g={g} setG={setG} busy={busy} onOpen={open} onExport={quick} />}

        {showMine && (
          <section aria-label="My documents" className="tl-sec" style={{ gap: '16px' }}>
            <div className="tl-gen-head" style={{ alignItems: 'center' }}>
              <div><h2 className="tl-h2">Your saved documents</h2><p className="tl-note" style={{ marginTop: '4px' }}>{storageLine}</p></div>
              <label className="btn btn-outline btn-sm" style={{ position: 'relative' }}>
                Import project file (.json)
                <input type="file" accept=".json,application/json" onChange={importJson} style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, overflow: 'hidden' }} />
              </label>
            </div>
            {!docsIdx.length && (
              <div className="tl-empty"><strong>Nothing saved yet.</strong>Open any template to start — your edits save in this browser automatically.</div>
            )}
            {!!docsIdx.length && !mine.length && <p className="tl-note">No saved documents match “{q.trim()}”.</p>}
            <div className="tl-grid">
              {mine.map(d => {
                const key = 'doc:' + d.id;
                return (
                  <DocCard key={d.id} d={d} on={!!sel[key]} busy={busy}
                    onToggle={() => toggle(key, { doc: d })}
                    onDownload={() => quick([d], 'nnoo-' + slug(d.name) + '.zip')}
                    onJson={() => download(projectBlob(d), fileBase(d) + '.nnoo.json')}
                    onDup={() => dup(d)} onDelete={() => del(d)} />
                );
              })}
            </div>
          </section>
        )}

        {groups.map(gr => (
          <section key={gr.c.id} className="tl-sec" aria-labelledby={'tl-cat-' + gr.c.id}>
            <div className="tl-sec-head"><h2 className="tl-h2" id={'tl-cat-' + gr.c.id}>{gr.c.name}</h2><span className="tl-note">{gr.note}</span></div>
            <div className="tl-grid">
              {gr.items.map(({ t, f, d }) => (
                <TemplateCard key={t.id} t={t} d={d} fmt={f} on={!!sel[t.id]} busy={busy}
                  onToggle={() => toggle(t.id, { t, fmt: f })}
                  onOpen={() => open(d)}
                  onFmt={v => { setFmt(s => ({ ...s, [t.id]: v })); setSel(s => (s[t.id] ? { ...s, [t.id]: { t, fmt: v } } : s)); }}
                  onDownload={() => quick([d], 'nnoo-' + slug(t.name) + '.zip')} />
              ))}
            </div>
          </section>
        ))}

        {noResults && query && <div className="tl-empty"><strong>No templates match “{q.trim()}”.</strong>Try a channel (LinkedIn, story), a format or a document type.</div>}
      </main>

      {selected.length > 0 && <BulkBar count={selected.length} busy={busy} onPng={() => quick(selDocs(), 'nnoo-templates.zip')} onJson={bulkJson} onClear={() => setSel({})} />}
    </div>
  );
}
