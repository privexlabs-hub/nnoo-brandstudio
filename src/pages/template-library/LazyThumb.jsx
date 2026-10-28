import React, { useEffect, useMemo, useRef, useState } from 'react';
import Page from '../../components/Page.jsx';
import { pageView } from '../../lib/render.js';
import { pageNumbers, tocItems } from '../../lib/export.js';

// One IntersectionObserver + ResizeObserver shared by every thumbnail on the page.
const subs = new Map();
let io = null, ro = null;
function observers() {
  if (!io && typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { const s = subs.get(e.target); if (s) s.seen(); } }), { rootMargin: '600px 0px' });
  }
  if (!ro && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(entries => entries.forEach(e => { const s = subs.get(e.target); if (s) s.size(e.contentRect.width); }));
  }
}

// Renders page 0 of `doc` scaled to fit the measured box width × `height`.
// Until the box nears the viewport it shows a placeholder of the right aspect ratio.
export default function LazyThumb({ doc, height = 170, onClick, title, label, fallbackW = 226 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    observers();
    const sub = { seen: () => { setSeen(true); io && io.unobserve(el); }, size: x => setW(Math.floor(x)) };
    subs.set(el, sub);
    setW(Math.floor(el.clientWidth));
    if (io) io.observe(el); else setSeen(true);
    if (ro) ro.observe(el);
    return () => { subs.delete(el); io && io.unobserve(el); ro && ro.unobserve(el); };
  }, []);

  const H = doc.pages[0].h || doc.h;
  const bw = Math.max(40, (w || fallbackW) - 8);
  const z = Math.min(bw / doc.w, (height - 8) / H);
  const view = useMemo(() => (seen && w ? pageView(doc, 0, { zoom: z, thumb: true, nums: pageNumbers(doc), toc: tocItems(doc) }) : null), [seen, w, doc, z]);

  const inner = view ? <Page view={view} /> : <div className="tl-ph" style={{ width: Math.round(doc.w * z) + 'px', height: Math.round(H * z) + 'px' }} />;
  const style = { height: height + 'px' };
  if (onClick) return <button type="button" ref={ref} className="tl-box" style={style} onClick={onClick} title={title} aria-label={label || title}>{inner}</button>;
  return <div ref={ref} className="tl-box" style={style}>{inner}</div>;
}
