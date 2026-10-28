import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ToastHost from './components/ToastHost.jsx';

const Studio = lazy(() => import('./pages/Studio.jsx'));
const DesignSystem = lazy(() => import('./pages/DesignSystem.jsx'));
const Playbook = lazy(() => import('./pages/Playbook.jsx'));
const Voice = lazy(() => import('./pages/Voice.jsx'));
const Assets = lazy(() => import('./pages/Assets.jsx'));
const TemplateLibrary = lazy(() => import('./pages/TemplateLibrary.jsx'));
const Editor = lazy(() => import('./pages/Editor.jsx'));
const GalleryTest = lazy(() => import('./pages/GalleryTest.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const TITLES = { '/': 'Nnọọ Brand Studio', '/design-system': 'Design system — Nnọọ Brand Studio', '/playbook': 'Playbook — Nnọọ Brand Studio', '/voice': 'Voice & knowledge — Nnọọ Brand Studio', '/assets': 'Assets — Nnọọ Brand Studio', '/templates': 'Templates — Nnọọ Brand Studio', '/editor': 'Editor — Nnọọ Brand Studio', '/gallery-test': 'Gallery test — Nnọọ Brand Studio' };

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { document.title = TITLES[pathname] || 'Nnọọ Brand Studio'; }, [pathname]);
  return (
    <>
      <Suspense fallback={<div style={{ minHeight: '100dvh', background: 'var(--bg)' }} />}>
        <Routes>
          <Route path="/" element={<Studio />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="/playbook" element={<Playbook />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/templates" element={<TemplateLibrary />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/gallery-test" element={<GalleryTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ToastHost />
    </>
  );
}
