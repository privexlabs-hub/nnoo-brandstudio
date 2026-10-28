// Generates src/styles/dark.css from the dark values in src/lib/tokens.js (single source of truth).
import { writeFileSync } from 'node:fs';
import { SEMANTIC, DARK_EXTRA } from '../src/lib/tokens.js';

let s = '/* GENERATED from src/lib/tokens.js SEMANTIC + DARK_EXTRA. Regenerate with: npm run gen:dark */\n:root[data-theme="dark"] {\n  color-scheme: dark;\n';
SEMANTIC.forEach(x => { s += `  ${x.v}: ${x.dark};\n`; });
Object.entries(DARK_EXTRA).forEach(([k, v]) => { s += `  ${k}: ${v};\n`; });
s += '}\n';
writeFileSync(new URL('../src/styles/dark.css', import.meta.url), s);
