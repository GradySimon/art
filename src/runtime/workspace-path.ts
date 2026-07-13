const WORKSPACES_MARKER = "/workspaces/";

export function workspacePathFromFile(file: string, fileName: string): string {
  const markerIndex = file.lastIndexOf(WORKSPACES_MARKER);
  if (markerIndex < 0 || !file.endsWith(`/${fileName}`)) {
    throw new Error(`Unexpected workspace file path: ${file}`);
  }
  return file.slice(markerIndex + WORKSPACES_MARKER.length, -(`/${fileName}`.length));
}

export function splitFullWorkPath(fullPath: string): {
  workspacePath: string;
  workPath: `works/${string}`;
} {
  const marker = "/works/";
  const markerIndex = fullPath.lastIndexOf(marker);
  if (markerIndex <= 0) throw new Error(`Invalid work path: ${fullPath}`);
  return {
    workspacePath: fullPath.slice(0, markerIndex),
    workPath: `works/${fullPath.slice(markerIndex + marker.length)}`,
  };
}
