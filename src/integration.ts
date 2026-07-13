import type {AstroIntegration} from "astro";

export interface ArtGalleryOptions {
  basePath?: string;
}

function normalizeBasePath(basePath: string): string {
  const normalized = `/${basePath.replace(/^\/+|\/+$/g, "")}`;
  return normalized === "/" ? "" : normalized;
}

export default function artGallery(options: ArtGalleryOptions = {}): AstroIntegration {
  const basePath = normalizeBasePath(options.basePath ?? "");

  return {
    name: "@grady/art/gallery",
    hooks: {
      "astro:config:setup": ({injectRoute}) => {
        injectRoute({
          pattern: basePath || "/",
          entrypoint: new URL("./app/gallery/routes/index.astro", import.meta.url),
          prerender: true,
        });
        injectRoute({
          pattern: `${basePath}/works/[...path]`,
          entrypoint: new URL("./app/gallery/routes/work.astro", import.meta.url),
          prerender: true,
        });
      },
    },
  };
}
