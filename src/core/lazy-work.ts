import type {Work, WorkImplementation, WorkMetadata} from "./work";

export function lazyWork(
  metadata: WorkMetadata,
  load: () => Promise<WorkImplementation>,
): Work {
  return {
    ...metadata,
    async mount(container, options) {
      const implementation = await load();
      return implementation.mount(container, options);
    },
  };
}
