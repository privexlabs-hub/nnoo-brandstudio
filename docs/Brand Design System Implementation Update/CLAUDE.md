# Project notes (Nnọọ Brand Studio)

- Shared logic lives in `lib/` (tokens, templates, render, export, store, voice, app). Pages are DCs that `import()` these.
- Template gotcha (causes the preview to hang): a `{{ hole }}` whose rendered TEXT equals a static text node elsewhere in the same template (e.g. dynamic "--shadow-sm" + static `<code>--shadow-sm</code>`). Also avoid holes in `aria-label` and `download` attributes. Compute such strings in renderVals instead.
- Brand artwork uses raw tokens (clay-500, bone); UI uses semantic CSS vars so the theme toggle works.
