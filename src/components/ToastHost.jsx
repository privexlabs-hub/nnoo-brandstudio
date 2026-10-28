import React, { useEffect, useRef, useState } from 'react';

// Global toast host. lib/app.js toast() dispatches `nnoo-toast`; one toast at a time, newest wins.
export default function ToastHost() {
  const [t, setT] = useState(null);
  const timer = useRef();
  useEffect(() => {
    const on = e => { clearTimeout(timer.current); setT(e.detail); timer.current = setTimeout(() => setT(null), e.detail.kind === 'err' ? 6000 : 2600); };
    window.addEventListener('nnoo-toast', on);
    return () => { window.removeEventListener('nnoo-toast', on); clearTimeout(timer.current); };
  }, []);
  return <div aria-live="polite" role="status">{t && <div key={t.t} className={'toast' + (t.kind === 'err' ? ' err' : '')}>{t.msg}</div>}</div>;
}
