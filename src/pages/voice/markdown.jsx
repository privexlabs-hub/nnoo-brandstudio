import React from 'react';

// Mini-markdown parser, ported exactly from "Brand Voice.dc.html" parse().
// Blocks: paragraphs, "- " lists, "1. " lists (indented lines continue the previous item), and pipe tables
// (first row = head, second row = separator, rest = body).
export function parse(md) {
  const out = []; const lines = md.split('\n'); let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (l.startsWith('|')) { const rows = []; while (i < lines.length && lines[i].startsWith('|')) { rows.push(lines[i].split('|').slice(1, -1).map(c => c.trim())); i++; } out.push({ isTable: true, head: rows[0], rows: rows.slice(2) }); continue; }
    if (/^- /.test(l)) { const items = []; while (i < lines.length && /^- /.test(lines[i])) { items.push(lines[i].slice(2)); i++; } out.push({ isUl: true, items }); continue; }
    if (/^\d+\. /.test(l)) { const items = []; while (i < lines.length && (/^\d+\. /.test(lines[i]) || /^ {2,}\S/.test(lines[i]))) { if (/^\d+\. /.test(lines[i])) items.push(lines[i].replace(/^\d+\. /, '')); else items[items.length - 1] += ' — ' + lines[i].trim(); i++; } out.push({ isOl: true, items }); continue; }
    out.push({ isP: true, text: l }); i++;
  }
  return out;
}

// Renders parsed blocks. Styling lives in voice.css (.md-*), which both Voice and Playbook import.
export default function Markdown({ md, blocks }) {
  const bs = blocks || parse(md || '');
  return (
    <div className="md">
      {bs.map((b, k) => {
        if (b.isP) return <p key={k} className="md-p">{b.text}</p>;
        if (b.isUl) return <ul key={k} className="md-list">{b.items.map((x, j) => <li key={j}>{x}</li>)}</ul>;
        if (b.isOl) return <ol key={k} className="md-list md-ol">{b.items.map((x, j) => <li key={j}>{x}</li>)}</ol>;
        return (
          <div key={k} className="scroll-x md-table-wrap" style={{ '--minw': '480px' }}>
            <table className="md-table">
              <thead><tr>{b.head.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
              <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, n) => <td key={n}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
