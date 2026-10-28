// Snapshot-based undo/redo. Snapshots are JSON strings of the whole document.
// Pushes with the same key within MERGE_MS collapse into one entry (typing, nudging, sliders).
export const HIST_CAP = 60;
export const MERGE_MS = 1500;

export function createHistory() {
  let past = [], future = [], lastKey = null, lastT = 0;
  return {
    push(snap, key) {
      const now = Date.now();
      if (key && lastKey === key && now - lastT < MERGE_MS) { lastT = now; return false; }
      // A snapshot identical to the newest entry would make the next undo a no-op (e.g. focus, then no edit).
      if (past.length && past[past.length - 1] === snap) { lastKey = key || null; lastT = now; return false; }
      lastKey = key || null; lastT = now;
      past = past.concat([snap]).slice(-HIST_CAP); future = [];
      return true;
    },
    undo(cur) { if (!past.length) return null; const prev = past[past.length - 1]; past = past.slice(0, -1); future = [cur].concat(future); lastKey = null; return prev; },
    redo(cur) { if (!future.length) return null; const next = future[0]; future = future.slice(1); past = past.concat([cur]); lastKey = null; return next; },
    reset() { past = []; future = []; lastKey = null; lastT = 0; },
    get canUndo() { return past.length > 0; },
    get canRedo() { return future.length > 0; }
  };
}
