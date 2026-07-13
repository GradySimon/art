import type {Work, WorkspaceModule} from "../core";
import {resolveWorkPath, workspacePathFromFile} from "./workspace-path";

const workspaceModules = import.meta.glob<WorkspaceModule>(
  "../works/**/index.ts",
);
const workspaceManifests = import.meta.glob(
  "../works/**/workspace.yaml",
  {eager: true, query: "?raw", import: "default"},
);

const manifestPaths = new Set(
  Object.keys(workspaceManifests).map((file) =>
    workspacePathFromFile(file, "workspace.yaml"),
  ),
);

const loaders = new Map(
  Object.entries(workspaceModules)
    .map(([file, load]) => [workspacePathFromFile(file, "index.ts"), load] as const)
    .filter(([workspacePath]) => manifestPaths.has(workspacePath)),
);

export async function loadWork(fullPath: string): Promise<Work> {
  const {workspacePath, workPath} = resolveWorkPath(fullPath, loaders.keys());
  const loadWorkspace = loaders.get(workspacePath);
  if (!loadWorkspace) throw new Error(`Unknown workspace: ${workspacePath}`);
  const workspace = await loadWorkspace();
  const work = workspace.WORKS.find((candidate) => candidate.path === workPath);
  if (!work) throw new Error(`Unknown work: ${fullPath}`);
  return work;
}
