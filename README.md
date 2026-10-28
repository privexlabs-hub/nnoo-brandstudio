# Nnọọ Brand Studio

Standalone rebuild of the Nnọọ Brand Studio (design system, playbook, voice & knowledge, assets, template library, editor).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/ (SPA: host with an index.html fallback — _redirects and vercel.json included)
npm run gen:dark   # regenerate src/styles/dark.css after changing dark values in src/lib/tokens.js
BASE=http://localhost:5173 npm run check:responsive   # every route × 8 widths × light/dark: overflow + console errors
```

Exports (PNG/PDF/ZIP/PPTX/DOCX/EPUB) lazy-load html-to-image, JSZip, jsPDF and PptxGenJS from CDNs, so they need a network connection. Documents are saved in the browser (localStorage, ~5 MB).

See `CLAUDE.md` for structure and conventions. The original Claude Design export lives in `docs/` as the reference.
