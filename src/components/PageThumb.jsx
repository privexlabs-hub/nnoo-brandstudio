import React, { useMemo } from 'react';
import Page from './Page.jsx';
import { pageView } from '../lib/render.js';
import { pageNumbers, tocItems } from '../lib/export.js';

// Static thumbnail of page `index` of `doc`, scaled to fit inside a maxW × maxH box (maxH optional).
export default function PageThumb({ doc, index = 0, maxW = 240, maxH, style }) {
  const view = useMemo(() => {
    if (!doc) return null;
    const H = doc.pages[index].h || doc.h;
    const z = Math.min(maxW / doc.w, maxH ? maxH / H : Infinity);
    return pageView(doc, index, { zoom: z, thumb: true, nums: pageNumbers(doc), toc: tocItems(doc) });
  }, [doc, index, maxW, maxH]);
  if (!view) return null;
  return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...style }}><Page view={view} /></div>;
}
