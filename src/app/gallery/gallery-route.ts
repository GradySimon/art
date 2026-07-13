import {splitFullWorkPath} from "../../runtime/workspace-path";

export function galleryWorkPath(fullPath: string): string {
  const {workspacePath, workPath} = splitFullWorkPath(fullPath);
  return `${workspacePath}/${workPath.slice("works/".length)}`;
}

export function galleryWorkHref(fullPath: string): string {
  return `/works/${galleryWorkPath(fullPath)}`;
}
