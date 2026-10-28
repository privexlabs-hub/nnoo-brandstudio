import React, { useEffect, useMemo, useState } from 'react';
import AppHeader from '../components/AppHeader.jsx';
import Icon from '../components/Icon.jsx';
import { ASSETS, resolveColor } from '../lib/tokens.js';
import { copyText, download, toast, slug } from '../lib/app.js';
import { zipFiles } from '../lib/export.js';
import './assets/assets.css';

const base = f => f.split('/').pop();
const label = g => g.split(' ')[0]; // "Motifs & graphics" → "Motifs", "Imagery placeholders" → "Imagery"
const GROUPS = ASSETS.map(g => ({ ...g, id: slug(label(g.group)), label: label(g.group) }));
const kb = n => n == null ? '' : n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' KB' : (n / 1048576).toFixed(1) + ' MB';

// Same as the source png() in "Design System.dc.html": longest side 1024px.
async function png(file, name) {
  try {
    const im = new Image(); im.src = file; await im.decode();
    const k = 1024 / Math.max(im.naturalWidth, im.naturalHeight);
    const c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
    download(c.toDataURL('image/png'), name + '.png');
  } catch (e) { toast('Could not render PNG: ' + e.message, 'err'); }
}

async function fetchBlob(file) { const r = await fetch(file); if (!r.ok) throw new Error(base(file) + ' (' + r.status + ')'); return r.blob(); }

function Preview({ item }) {
  const bg = resolveColor(item.ground);
  if (item.font) {
    const fam = item.font === true ? null : item.font;
    const italic = /italic/i.test(item.name) ? 'italic' : 'normal';
    return (
      <div className="as-prev" style={{ background: bg }}>
        {fam ? (
          <div className="as-font" style={{ fontFamily: `"${fam}", system-ui, sans-serif`, fontStyle: italic }}>
            <div className="as-font-big">Aa Ọọ</div>
            <div className="as-font-small" style={{ fontFamily: 'inherit' }}>Nnọọ · Ọbá · Ọha · Ndị Igbo</div>
          </div>
        ) : (
          <div className="as-font" style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
            <span className="as-font-big" style={{ fontFamily: '"Outfit", sans-serif' }}>Aa</span>
            <span className="as-font-big" style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }}>Aa</span>
            <span className="as-font-big" style={{ fontFamily: '"Fraunces", serif', fontWeight: 500 }}>Aa</span>
          </div>
        )}
      </div>
    );
  }
  if (/pattern/.test(item.file)) return <div className="as-prev pattern" style={{ backgroundColor: bg, backgroundImage: `url("${item.file}")` }} role="img" aria-label={item.name} />;
  return <div className="as-prev" style={{ background: bg }}><img src={item.file} alt={item.name} loading="lazy" /></div>;
}

function Item({ item, size, isLogo }) {
  const name = base(item.file); const ext = name.split('.').pop().toUpperCase();
  return (
    <article className="card as-item">
      <Preview item={item} />
      <div className="as-body">
        <h3 className="as-name">{item.name}</h3>
        <p className="small muted">{item.desc}</p>
        <div className="as-meta"><span>{ext}</span>{size != null && <span>{kb(size)}</span>}<span>{name}</span></div>
        <div className="as-actions">
          <button type="button" className="btn btn-soft btn-sm" onClick={() => download(item.file, name)} aria-label={'Download ' + item.name}><Icon name="download" size={16} />Download</button>
          {isLogo && ext === 'SVG' && <button type="button" className="btn btn-outline btn-sm" onClick={() => png(item.file, name.replace(/\.svg$/, '') + '-1024')} aria-label={'Download ' + item.name + ' as PNG 1024'}>PNG 1024</button>}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => copyText(item.file).catch(() => toast('Copy failed', 'err'))} aria-label={'Copy path of ' + item.name}><Icon name="copy" size={16} />Copy path</button>
        </div>
      </div>
    </article>
  );
}

export default function Assets() {
  const [group, setGroup] = useState('all');
  const [q, setQ] = useState('');
  const [sizes, setSizes] = useState({});
  const [busy, setBusy] = useState(null);

  // File sizes via HEAD — cheap, same-origin; silently skipped if the server doesn't report them.
  useEffect(() => {
    let live = true;
    GROUPS.flatMap(g => g.items).forEach(it => {
      fetch(it.file, { method: 'HEAD' }).then(r => { const n = parseInt(r.headers.get('content-length'), 10); if (live && r.ok && n > 0) setSizes(s => ({ ...s, [it.file]: n })); }).catch(() => {});
    });
    return () => { live = false; };
  }, []);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return GROUPS.filter(g => group === 'all' || g.id === group)
      .map(g => ({ ...g, items: s ? g.items.filter(it => (it.name + ' ' + it.desc + ' ' + it.file + ' ' + g.group).toLowerCase().includes(s)) : g.items }))
      .filter(g => g.items.length);
  }, [group, q]);

  async function zip(groups, filename, key) {
    if (busy) return;
    setBusy(key);
    try {
      const multi = groups.length > 1;
      const files = await Promise.all(groups.flatMap(g => g.items.map(async it => ({ name: (multi ? g.id + '/' : '') + base(it.file), data: await fetchBlob(it.file) }))));
      download(await zipFiles(files), filename);
      toast('Zipped ' + files.length + ' files');
    } catch (e) { toast('Could not build the ZIP: ' + e.message, 'err'); }
    finally { setBusy(null); }
  }

  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);
  return (
    <>
      <AppHeader active="assets" />
      <main className="wrap as-main">
        <header className="as-head">
          <div className="eyebrow-ui">Asset library</div>
          <h1 className="h-page">Brand files, ready to use</h1>
          <p className="lead">Logos, favicons, avatars, motifs, imagery placeholders and fonts. Use the files exactly as supplied. Imagery placeholders stand in until real, credited photography exists.</p>
        </header>

        <div className="as-bar">
          <div className="as-bar-top">
            <div className="as-search">
              <Icon name="search" size={18} />
              <label className="sr-only" htmlFor="as-q">Search assets</label>
              <input id="as-q" className="input" type="search" placeholder="Search by name, file or use" value={q} onChange={e => setQ(e.target.value)} autoComplete="off" />
            </div>
            <button type="button" className="btn btn-primary" disabled={!!busy} onClick={() => zip(GROUPS, 'nnoo-brand-assets.zip', 'all')}>
              <Icon name="download" size={18} />{busy === 'all' ? 'Zipping…' : 'Download all (ZIP)'}
            </button>
          </div>
          <div className="pill-row" role="group" aria-label="Filter by group">
            <button type="button" className="pill" aria-pressed={group === 'all'} onClick={() => setGroup('all')}>All <span className="count">{total}</span></button>
            {GROUPS.map(g => <button key={g.id} type="button" className="pill" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>{g.label} <span className="count">{g.items.length}</span></button>)}
          </div>
        </div>

        {shown.length === 0 && (
          <div className="as-empty stack" style={{ '--gap': '12px', alignItems: 'center' }}>
            <p className="h-card">Nothing matches “{q}”.</p>
            <button type="button" className="btn btn-outline" onClick={() => { setQ(''); setGroup('all'); }}>Clear the search</button>
          </div>
        )}

        {shown.map(g => {
          const full = GROUPS.find(x => x.id === g.id);
          return (
            <section key={g.id} id={'as-' + g.id} className="as-group" aria-labelledby={'as-' + g.id + '-h'}>
              <div className="as-group-head">
                <div className="stack" style={{ '--gap': '4px' }}><h2 id={'as-' + g.id + '-h'}>{g.group}</h2><span className="small subtle">{g.items.length === full.items.length ? full.items.length + ' files' : g.items.length + ' of ' + full.items.length + ' files'}</span></div>
                <button type="button" className="btn btn-outline btn-sm" disabled={!!busy} onClick={() => zip([full], 'nnoo-' + g.id + '.zip', g.id)}>
                  <Icon name="download" size={16} />{busy === g.id ? 'Zipping…' : 'Download all (ZIP)'}
                </button>
              </div>
              <div className="grid-auto" style={{ '--min': '240px' }}>
                {g.items.map(it => <Item key={it.file} item={it} size={sizes[it.file]} isLogo={g.id === 'logos'} />)}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
