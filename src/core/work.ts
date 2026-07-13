export type WorkPath = `works/${string}`;

export interface WorkOptions {
  paused?: boolean;
}

export interface ArtworkInstance {
  pause(): void;
  resume(): void;
  resize(): void;
  destroy(): void;
}

export interface Work {
  path: WorkPath;
  title: string;
  description: string;
  date?: string;
  provenance?: string;
  tags?: readonly string[];
  mount(
    container: HTMLElement,
    options?: WorkOptions,
  ): ArtworkInstance | Promise<ArtworkInstance>;
}

export interface WorkspaceModule {
  WORKS: readonly Work[];
}

export interface CatalogWork extends Omit<Work, "mount"> {
  fullPath: string;
  workspacePath: string;
  workspaceTitle: string;
}
