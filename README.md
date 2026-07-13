# Art

A portable catalog and Astro gallery for browser-based artworks.

## Run the built-in gallery

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

`npm run build` type-checks and produces a static gallery in `dist/`.

## Workspaces and works

A workspace is any directory under `src/workspaces/**` that contains both a
non-nested `workspace.yaml` and an `index.ts`. The index must export a `WORKS`
array containing `Work` definitions.

Every work has a workspace-relative path beginning with `works/`. Its full
catalog path combines the workspace directory and work path:

```text
metaballs/works/rejoicing-slugs
```

The built-in gallery discovers these workspaces at build time. It is only one
consumer of the catalog and has no knowledge of individual renderers.

Each `WORKS` entry uses `lazyWork()`. Its implementation and dependencies are
loaded only when the work mounts. Keep renderer-specific or unusually large
dependencies inside the dynamically imported work module, not the workspace
index. Different works may use entirely different rendering libraries.

## Import into another Astro site

The package exports its core types, workspace entry points, runtime, and an
Astro player component. In an Astro page or MDX file:

```astro
---
import WorkPlayer from "@grady/art/WorkPlayer.astro";
---

<WorkPlayer
  work="metaballs/works/rejoicing-slugs"
  aspectRatio={1.4}
  label="Rejoicing Slugs"
/>
```

For direct programmatic use with the narrowest possible import surface:

```ts
import {WORKS} from "@grady/art/workspaces/metaballs";

const work = WORKS.find(({path}) => path === "works/rejoicing-slugs");
const instance = await work.mount(container);
instance.pause();
instance.resume();
instance.destroy();
```

The package is private while its API is being established. Grady.io can consume
it as a local workspace dependency now; publishing or moving both projects into
one package-manager workspace can come later without changing the work API.
