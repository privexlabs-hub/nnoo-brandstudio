import React from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';

export default function NotFound() {
  return (
    <>
      <AppHeader />
      <main className="wrap stack" style={{ padding: '64px 20px', '--gap': '16px', maxWidth: 720 }}>
        <div className="eyebrow-ui">Not found</div>
        <h1 className="h-page">This page is not here.</h1>
        <p className="lead">The link may be old. Start again from the studio.</p>
        <div><Link className="btn btn-primary" to="/">Go to the studio</Link></div>
      </main>
    </>
  );
}
