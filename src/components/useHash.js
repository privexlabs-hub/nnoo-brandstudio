import { useEffect, useState } from 'react';

// Re-renders on hashchange (and history.replaceState via the custom `nnoo-hash` event). Returns location.hash.
export default function useHash() {
  const [h, setH] = useState(() => location.hash);
  useEffect(() => {
    const on = () => setH(location.hash);
    window.addEventListener('hashchange', on); window.addEventListener('nnoo-hash', on);
    return () => { window.removeEventListener('hashchange', on); window.removeEventListener('nnoo-hash', on); };
  }, []);
  return h;
}
