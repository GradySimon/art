import type {CatalogWork, WorkspaceModule} from "../core";
import {parse} from "yaml";
import {fullWorkPath, workspacePathFromFile} from "./workspace-path";

interface WorkspaceManifest {
  title: string;
  description?: string;
  order?: number;
}

const manifests = import.meta.glob<string>("../works/**/workspace.yaml", {
  eager: true,
  query: "?raw",
  import: "default",
});
const modules = import.meta.glob<WorkspaceModule>("../works/**/index.ts");

export async function discoverCatalog(): Promise<CatalogWork[]> {
  const moduleLoaders = new Map(
    Object.entries(modules).map(([file, load]) => [
      workspacePathFromFile(file, "index.ts"),
      load,
    ] as const),
  );

  const workspaces = await Promise.all(
    Object.entries(manifests).map(async ([file, source]) => {
      const workspacePath = workspacePathFromFile(file, "workspace.yaml");
      const manifest = parse(source) as WorkspaceManifest;
      const load = moduleLoaders.get(workspacePath);
      if (!load) throw new Error(`Workspace ${workspacePath} is missing index.ts`);
      if (!manifest.title) throw new Error(`Workspace ${workspacePath} is missing a title`);
      const module = await load();
      return {workspacePath, manifest, works: module.WORKS};
    }),
  );

  return workspaces
    .sort((left, right) =>
      (left.manifest.order ?? Number.MAX_SAFE_INTEGER) -
      (right.manifest.order ?? Number.MAX_SAFE_INTEGER),
    )
    .flatMap(({workspacePath, manifest, works}) =>
      works
        .filter(({visible}) => visible ?? false)
        .map(({mount: _mount, ...metadata}) => ({
          ...metadata,
          fullPath: fullWorkPath(workspacePath, metadata.path),
          workspacePath,
          workspaceTitle: manifest.title,
        })),
    );
}
