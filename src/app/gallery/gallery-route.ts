import {splitFullWorkPath} from "../../runtime/workspace-path";

export function galleryWorkPath(fullPath: string): string {
  const {workspacePath, workPath} = splitFullWorkPath(fullPath);
  return `${workspacePath}/${workPath.slice("works/".length)}`;
}

export function galleryWorkHref(fullPath: string, basePath = "/works"): string {
  const normalizedBasePath = `/${basePath.replace(/^\/+|\/+$/g, "")}`;
  return `${normalizedBasePath}/${galleryWorkPath(fullPath)}`;
}
