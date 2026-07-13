# Metaball

A browser for the generative studies preserved in the original 2019–2020
Three.js metaball history.

## Run it

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Then open the local URL printed by Vite. Use the selector, arrow buttons, or
left/right arrow keys to browse studies. The spacebar pauses or resumes the
animation. Each study includes its source commit and provenance in the caption.

## Validate a change

```sh
npm run check
npm run build
```

## Project shape

- `src/index.ts` owns the Three.js renderer and the interactive studies.
- `src/studies.ts` ports the historical compositions and records provenance.
- `src/metaball.ts` contains the original metaball types and composition helpers.
- `src/shader/` contains the original GLSL field renderer.
- `src/orbit-world.ts` and `src/rl.ts` preserve the experimental TensorFlow.js
  reinforcement-learning orbit simulation. They are not part of the current
  build because they depend on private APIs from the 2019 TensorFlow.js runtime.

The `modernize-2026` branch begins at the untouched 2020 project state, so its
first modernization commit can always be inspected or reverted independently.
