# Art

A portable catalog and Astro gallery for browser-based works.

## Run the built-in gallery

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

`npm run build` type-checks and produces a static gallery in `dist/`.

## Workspaces and works

A workspace is any directory under `src/works/**` that contains both a
non-nested `workspace.yaml` and an `index.ts`. The index must export a `WORKS`
array containing `Work` values. `Work` combines catalog metadata with the
implementation that mounts it.

```ts
interface WorkMetadata {
  path: string;
  title: string;
  description: string;
  date?: string;
  provenance?: string;
  tags?: readonly string[];
}

interface WorkImplementation {
  mount(container: HTMLElement, options?: WorkOptions):
    WorkInstance | Promise<WorkInstance>;
}

type Work = WorkMetadata & WorkImplementation;
```

Every work has a path relative to its workspace. Its full identity mirrors its
source path beneath `src/`:

```text
source module:   src/works/metaballs/rejoicing-slugs.ts
workspace path:  metaballs
work path:       rejoicing-slugs
full identity:   works/metaballs/rejoicing-slugs
gallery URL:     /works/metaballs/rejoicing-slugs
```

The built-in gallery discovers these workspaces at build time. It is only one
consumer of the catalog and has no knowledge of individual renderers.

Nested workspace and work paths are preserved:

```text
/works/metaballs/rejoicing-slugs

src/works/collections/fields/series/blue.ts
→ works/collections/fields/series/blue
→ /works/collections/fields/series/blue
```

Each `WORKS` entry uses `lazyWork()`. Its implementation and dependencies are
loaded only when the work mounts. Keep renderer-specific or unusually large
dependencies inside the dynamically imported work module, not the workspace
index. Different works may use entirely different rendering libraries.

## When discovery runs

`src/runtime/discover.ts` is server/build code. Vite expands its
`import.meta.glob()` expressions when it transforms the module. Astro calls
`discoverCatalog()` while rendering the gallery and while `getStaticPaths()`
enumerates work pages. In development that happens in the Astro dev server; in
a production build it happens during `astro build`. It does not run in the
browser. Workspace manifests are loaded eagerly when the discovery module is
evaluated, while workspace modules remain loaders until `discoverCatalog()`
calls them. Individual work modules remain behind their own dynamic imports
until a `Work` is mounted in the browser.

## Import into another Astro site

The package exports its core types, workspace entry points, runtime, and an
Astro player component. In an Astro page or MDX file:

```astro
---
import WorkPlayer from "@grady/art/WorkPlayer.astro";
---

<WorkPlayer
  work="works/metaballs/rejoicing-slugs"
  aspectRatio={1.4}
  label="Rejoicing Slugs"
/>
```

The complete gallery can inject its coordinated route tree into another Astro
site. Configure only its mount point:

```js
import {defineConfig} from "astro/config";
import artGallery from "@grady/art/astro";

export default defineConfig({
  integrations: [artGallery({basePath: "/art"})],
});
```

This provides `/art/` and every `/art/works/<workspace-path>/<work-path>` page.
The host does not define or coordinate the gallery's internal routes.

For direct programmatic use with the narrowest possible import surface:

```ts
import {WORKS} from "@grady/art/works/metaballs";

const work = WORKS.find(({path}) => path === "rejoicing-slugs");
const instance = await work.mount(container);
instance.pause();
instance.resume();
instance.destroy();
```

The package is private while its API is being established. With `art` and
`gradyio` checked out as sibling directories, Grady.io consumes the package
directly from its repository root:

```json
{
  "dependencies": {
    "@grady/art": "file:../art"
  }
}
```

That local path is recorded by Grady.io's package manifest and Bun lockfile.
For a checkout or deployment that does not have the sibling directory, replace
the file dependency with a pinned Git commit, a tagged release, or a published
package. None of those distribution choices changes the `Work` API.
