# Metaball

A small collection of browser-based generative studies built from the original
2020 Three.js metaball shader.

## Run it

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Then open the local URL printed by Vite. Use the controls above the canvas to
switch studies. The cursor study responds to pointer movement, and the spacebar
pauses or resumes the animation.

## Validate a change

```sh
npm run check
npm run build
```

## Project shape

- `src/index.ts` owns the Three.js renderer and the interactive studies.
- `src/metaball.ts` contains the original ring composition helpers.
- `src/shader/` contains the original GLSL field renderer.
- `src/orbit-world.ts` and `src/rl.ts` preserve the experimental TensorFlow.js
  reinforcement-learning orbit simulation. They are not part of the current
  build because they depend on private APIs from the 2019 TensorFlow.js runtime.

The `modernize-2026` branch begins at the untouched 2020 project state, so its
first modernization commit can always be inspected or reverted independently.
