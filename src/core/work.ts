export type WorkPath = `works/${string}`;

export interface WorkOptions {
  paused?: boolean;
}

export interface WorkInstance {
  pause(): void;
  resume(): void;
  resize(): void;
  destroy(): void;
}

export interface GalleryStyle {
  backgroundColor?: string;
}

export interface WorkMetadata {
  path: string;
  title: string;
  description: string;
  visible?: boolean;
  date?: string;
  provenance?: string;
  tags?: readonly string[];
  galleryStyle?: GalleryStyle;
}

export interface WorkImplementation {
  mount(
    container: HTMLElement,
    options?: WorkOptions,
  ): WorkInstance | Promise<WorkInstance>;
}

export type Work = WorkMetadata & WorkImplementation;

export interface WorkspaceModule {
  WORKS: readonly Work[];
}

export interface CatalogWork extends WorkMetadata {
  fullPath: WorkPath;
  workspacePath: string;
  workspaceTitle: string;
}
