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

export interface ArtworkDefinition {
  path: WorkPath;
  title: string;
  description: string;
  date?: string;
  provenance?: string;
  tags?: readonly string[];
}

export interface Work extends ArtworkDefinition {
  mount(
    container: HTMLElement,
    options?: WorkOptions,
  ): ArtworkInstance | Promise<ArtworkInstance>;
}

export interface WorkImplementation {
  mount: Work["mount"];
}

export interface WorkspaceModule {
  WORKS: readonly Work[];
}

export interface CatalogWork extends ArtworkDefinition {
  fullPath: string;
  workspacePath: string;
  workspaceTitle: string;
}
