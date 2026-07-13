import type {WorkPath} from "../../core";
import {galleryWorkPath as pathWithinGallery} from "../../runtime/workspace-path";

export function galleryWorkPath(fullPath: WorkPath): string {
  return pathWithinGallery(fullPath);
}

export function galleryWorkHref(fullPath: WorkPath, basePath = "/works"): string {
  const normalizedBasePath = `/${basePath.replace(/^\/+|\/+$/g, "")}`;
  return `${normalizedBasePath}/${galleryWorkPath(fullPath)}`;
}
