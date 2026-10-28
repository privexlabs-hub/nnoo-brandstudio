import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';
import Icon from '../components/Icon.jsx';
import PageThumb from '../components/PageThumb.jsx';
import { BRAND } from '../lib/tokens.js';
import { listDocs, getDoc } from '../lib/store.js';
import './studio/studio.css';

// Each tool card says what the page holds; wording follows the brand README (sentence case, no hype).
const TOOLS = [
  { to: '/design-system', icon: 'palette', title: 'Design system', desc: 'Colour, type, logo, spacing and components — every token ready to copy.' },
  { to: '/playbook', icon: 'book', title: 'Playbook', desc: 'The brand on one page: mission, principles, logo, palette, type and voice.' },
  { to: '/voice', icon: 'message', title: 'Voice & knowledge', desc: 'Voice, tone and brand facts, marked by certainty and ready to paste into any writing tool.' },
  { to: '/assets', icon: 'image', title: 'Assets', desc: 'Logos, favicons, avatars, motifs, imagery placeholders and fonts to download.' },
  { to: '/templates', icon: 'grid', title: 'Templates', desc: 'Social posts, stories, banners, ads and multi-page documents built on the brand.' },
  { to: '/editor', icon: 'edit', title: 'Editor', desc: 'Make a template your own, then export it as an image, PDF, slides or document.' }
];

class Safe extends React.Component {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

const fmtDate = t => { try { return new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } };

function DocCard({ meta }) {
  const doc = useMemo(() => { const d = getDoc(meta.id); return d && Array.isArray(d.pages) && d.pages.length ? d : null; }, [meta.id]);
  const n = meta.pages || (doc ? doc.pages.length : 0);
  const ph = <Icon name="file" size={32} style={{ color: 'var(--fg-subtle)' }} />;
  return (
    <Link to={'/editor#doc=' + encodeURIComponent(meta.id)} className="card st-doc">
      <div className="st-doc-thumb" aria-hidden="true">
        {doc ? <Safe fallback={ph}><PageThumb doc={doc} maxW={220} maxH={156} /></Safe> : ph}
      </div>
      <div className="st-doc-body">
        <span className="st-doc-name">{meta.name || 'Untitled'}</span>
        <span className="small subtle">{meta.w} × {meta.h} · {n} {n === 1 ? 'page' : 'pages'} · {fmtDate(meta.updated)}</span>
      </div>
    </Link>
  );
}

export default function Studio() {
  const docs = useMemo(() => { try { return listDocs().slice(0, 6); } catch (e) { return []; } }, []);
  return (
    <>
      <AppHeader active="studio" />
      <main className="st-main">
        <section className="st-hero" aria-labelledby="st-name">
          <img className="st-wave-bg" src="/assets/brand/graphics/waveform.svg" alt="" />
          <div className="wrap st-hero-in">
            <div className="eyebrow-ui">Brand Studio</div>
            <h1 id="st-name" className="st-hero-name">{BRAND.name}</h1>
            <p className="st-hero-meaning">{BRAND.meaning}</p>
            <p className="st-hero-line">“{BRAND.line}”</p>
            <p className="st-hero-sum">{BRAND.summary}</p>
            <img className="st-wave" src="/assets/brand/graphics/waveform.svg" alt="" width="400" height="80" />
            <div className="st-hero-cta">
              <Link className="btn btn-primary" to="/playbook">Read the playbook</Link>
              <Link className="btn btn-outline" to="/templates">Start from a template</Link>
            </div>
          </div>
        </section>

        <section className="wrap st-sec" aria-labelledby="st-tools">
          <div className="st-sec-head"><div><div className="eyebrow-ui">Tools</div><h2 id="st-tools" className="h-sec">Everything the brand needs, in one place</h2></div></div>
          <div className="st-tools">
            {TOOLS.map(t => (
              <Link key={t.to} to={t.to} className="card st-tool">
                <span className="st-tool-ico"><Icon name={t.icon} /></span>
                <h3 className="h-card">{t.title}</h3>
                <p>{t.desc}</p>
                <span className="st-tool-go">Open <Icon name="arrowRight" size={16} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="wrap st-sec" aria-labelledby="st-surf">
          <div className="st-sec-head"><div><div className="eyebrow-ui">Product surfaces</div><h2 id="st-surf" className="h-sec">One visual language, five surfaces</h2><p className="lead">Nnọọ is not one app — it is a small constellation. The surfaces are named in Igbo because that is the point.</p></div></div>
          <div className="grid-auto" style={{ '--min': '240px' }}>
            {BRAND.surfaces.map(s => (
              <article key={s.name} className="card-raised st-surf">
                <h3 className="st-surf-name">{s.name}</h3>
                {s.gloss && <div className="st-surf-gloss">{s.gloss}</div>}
                <dl>
                  <dt>For</dt><dd>{s.who}</dd>
                  <dt>Does</dt><dd>{s.what}</dd>
                  <dt>On</dt><dd>{s.platform}</dd>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap st-sec" aria-labelledby="st-recent">
          <div className="st-sec-head">
            <div><div className="eyebrow-ui">Recent documents</div><h2 id="st-recent" className="h-sec">Pick up where you left off</h2></div>
            {docs.length > 0 && <Link className="btn btn-ghost btn-sm" to="/templates">New from a template <Icon name="arrowRight" size={16} /></Link>}
          </div>
          {docs.length ? (
            <div className="grid-auto" style={{ '--min': '220px' }}>{docs.map(d => <DocCard key={d.id} meta={d} />)}</div>
          ) : (
            <div className="st-empty">
              <h3 className="h-card">No documents yet.</h3>
              <p className="muted">Documents you edit are kept in this browser. Start from a template when you’re ready.</p>
              <Link className="btn btn-primary" to="/templates">Browse templates</Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
