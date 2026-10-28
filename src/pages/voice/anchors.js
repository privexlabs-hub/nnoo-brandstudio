import { useEffect, useState } from 'react';

// In-page anchor helpers shared by Voice and Playbook.
// scroll-padding-top clears the 60px sticky header (+20px breathing room) for anchors and scrollIntoView.
export function useScrollPadding(px = 80) {
  useEffect(() => {
    const root = document.documentElement; const prev = root.style.scrollPaddingTop;
    root.style.scrollPaddingTop = px + 'px';
    return () => { root.style.scrollPaddingTop = prev; };
  }, [px]);
}

// The page renders after load, so the browser's own jump-to-hash has nothing to land on. Do it once on mount.
export function useInitialHashScroll(prefix) {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id || (prefix && !id.startsWith(prefix))) return;
    const t = requestAnimationFrame(() => { const el = document.getElementById(id); el && el.scrollIntoView({ block: 'start' }); });
    return () => cancelAnimationFrame(t);
  }, [prefix]);
}

export function jumpTo(id) {
  const el = document.getElementById(id); if (!el) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(history.state, '', '#' + id);
}

// Tracks which section is under the header, for highlighting the nav.
export function useActiveSection(ids) {
  const [cur, setCur] = useState(ids[0]);
  const key = ids.join('|');
  useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length || !('IntersectionObserver' in window)) return;
    const vis = new Map();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => vis.set(e.target.id, e.isIntersecting));
      const first = ids.find(id => vis.get(id));
      if (first) setCur(first);
    }, { rootMargin: '-80px 0px -60% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return cur;
}
