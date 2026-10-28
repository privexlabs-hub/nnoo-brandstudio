// Pipe-delimited text formats for editing structured element data in a textarea (port of the source `SER` getter).
// Each entry: [hint, serialise(items) -> string, parse(string) -> items].
const J = a => a.map(x => (x == null ? '' : String(x)).replace(/\n/g, ' // ')).join(' | ');
const S = s => s.split('|').map(x => x.trim().replace(/ ?\/\/ ?/g, '\n'));
const L = t => t.split('\n').filter(l => l.trim());

export const SER = {
  table: ['one row per line, cells separated by |', it => it.map(J).join('\n'), t => L(t).map(S)],
  chart: ['label | value', it => it.map(d => J([d.label, d.value])).join('\n'), t => L(t).map(l => { const [label, value] = S(l); return { label, value: parseFloat(value) || 0 }; })],
  stats: ['value | label', it => it.map(d => J([d.value, d.label])).join('\n'), t => L(t).map(l => { const [value, label] = S(l); return { value, label: label || '' }; })],
  columns: ['title | highlight | body', it => it.map(d => J([d.title, d.meta || '', d.body])).join('\n'), t => L(t).map(l => { const [title, meta, body] = S(l); return { title, meta: meta || '', body: body || '' }; })],
  entries: ['title | organisation | date | bullets // separated', it => it.map(d => J([d.title, d.org, d.date, d.body])).join('\n'), t => L(t).map(l => { const [title, org, date, body] = S(l); return { title, org: org || '', date: date || '', body: body || '' }; })],
  timeline: ['label | title | detail', it => it.map(d => J([d.label, d.title, d.body])).join('\n'), t => L(t).map(l => { const [label, title, body] = S(l); return { label, title: title || '', body: body || '' }; })],
  people: ['name | role | bio', it => it.map(d => J([d.name, d.role, d.body])).join('\n'), t => L(t).map(l => { const [name, role, body] = S(l); return { name, role: role || '', body: body || '' }; })],
  tags: ['one per line', it => it.join('\n'), t => L(t).map(x => x.trim())]
};
