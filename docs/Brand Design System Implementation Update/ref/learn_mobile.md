# Nnọọ Learn — mobile UI kit

Learner-facing iOS/Android app. Four primary tabs:

- **Learn** — daily lesson with tonal feedback, streak, proverb of the day
- **Ọbá** — elder-recording archive with provenance
- **Ọha** — diaspora community by hometown/dialect/LGA
- **You** — profile (not implemented in this kit)

## Files
- `index.html` — shows all four screens side-by-side in iOS frames
- `Primitives.jsx` — `NnooButton`, `NnooChip`, `NnooCard`, `Icon`, `Eyebrow`, `AppHeader`, `TabBar`, `Waveform`
- `Screens.jsx` — `HomeScreen`, `LessonScreen`, `ArchiveScreen`, `OhaScreen`
- `ios-frame.jsx` — iOS device chrome (from starter components)

All colors sourced from `../../colors_and_type.css`. Iconography is Lucide paths inlined in the `Icon` component — see the `ICONOGRAPHY` section in the root README.
