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

export interface WorkMetadata {
  path: string;
  title: string;
  description: string;
  date?: string;
  provenance?: string;
  tags?: readonly string[];
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
