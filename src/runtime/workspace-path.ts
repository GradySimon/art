import type {WorkPath} from "../core";

const WORKS_MARKER = "/works/";
const WORK_ROUTE_PREFIX = "works/";

export function workspacePathFromFile(file: string, fileName: string): string {
  const markerIndex = file.lastIndexOf(WORKS_MARKER);
  if (markerIndex < 0 || !file.endsWith(`/${fileName}`)) {
    throw new Error(`Unexpected workspace file path: ${file}`);
  }
  return file.slice(markerIndex + WORKS_MARKER.length, -(`/${fileName}`.length));
}

export function fullWorkPath(workspacePath: string, workPath: string): WorkPath {
  return `${WORK_ROUTE_PREFIX}${workspacePath}/${workPath}`;
}

export function galleryWorkPath(fullPath: WorkPath): string {
  return fullPath.slice(WORK_ROUTE_PREFIX.length);
}

export function resolveWorkPath(fullPath: string, workspacePaths: Iterable<string>): {
  workspacePath: string;
  workPath: string;
} {
  if (!fullPath.startsWith(WORK_ROUTE_PREFIX)) {
    throw new Error(`Invalid work path: ${fullPath}`);
  }
  const relativePath = fullPath.slice(WORK_ROUTE_PREFIX.length);
  const workspacePath = [...workspacePaths]
    .filter((candidate) => relativePath.startsWith(`${candidate}/`))
    .sort((left, right) => right.length - left.length)[0];
  if (!workspacePath) throw new Error(`Unknown workspace for work: ${fullPath}`);
  return {
    workspacePath,
    workPath: relativePath.slice(workspacePath.length + 1),
  };
}
