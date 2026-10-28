import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PageThumb from '../../components/PageThumb.jsx';
import { DOC_TEMPLATES, newDocFromTemplate } from '../../lib/templates.js';
import { SecHead, cp } from './shared.jsx';

const PAGES = [0, 1, 2, 5, 6, 9, 12, 17];
const SERIES = ['#c85a26', '#d9a019', '#6d2c4f', '#2e5d3a', '#e17f47', '#a8678a'];

// Thumbnail that fills its grid column: width is measured with a ResizeObserver.
function SlideThumb({ doc, index }) {
  const ref = useRef(null);
  const [w, setW] = useState(240);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => { const cw = Math.floor(e.contentRect.width); if (cw > 0) setW(cw); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <div ref={ref} className="ds-slide-box"><PageThumb doc={doc} index={index} maxW={w} /></div>;
}

export default function Slides() {
  const deck = useMemo(() => newDocFromTemplate(DOC_TEMPLATES.find(t => t.id === 'doc-presentation')), []);
  return (
    <section id="ds-slides" className="ds-sec tight">
      <SecHead eyebrow="10 · Slides & data" title="Presentations, charts and diagrams" />
      <p className="ds-p15">1920 × 1080. Bone grounds for content, clay for covers and closings, ink for section dividers, forest for elder quotes. One idea per slide; the headline states the takeaway. Body text never below 24px.</p>
      <div className="grid-auto" style={{ '--min': '240px', '--gap': '12px' }}>
        {PAGES.filter(i => deck.pages[i]).map(i => (
          <div key={i} className="ds-slide">
            <SlideThumb doc={deck} index={i} />
            <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>{(i + 1) + ' · ' + deck.pages[i].name}</span>
          </div>
        ))}
      </div>
      <Link to="/editor#template=doc-presentation" className="ds-link">Edit the full {deck.pages.length}-slide deck →</Link>
      <div className="ds-card g10">
        <h3 className="ds-h3">Data visualisation series</h3>
        <div className="row" style={{ '--gap': '8px' }}>
          {SERIES.map((hex, i) => (
            <button key={hex} type="button" className="ds-val md" onClick={cp(hex)}><span className="ds-series-sw" style={{ background: hex }} />{(i + 1) + '. ' + hex}</button>
          ))}
        </div>
        <ul className="ds-list">
          <li>Single series: clay. Comparison: clay vs. marigold. Use series in this order; never more than six.</li>
          <li>Label values directly; avoid legends when you can. Gridlines in hairline colour or none.</li>
          <li>Always cite the source under the chart. Sample data must say so.</li>
          <li>Diagrams use the timeline, columns and process components — rounded rectangles, 2px clay rules, dot markers.</li>
        </ul>
      </div>
    </section>
  );
}
