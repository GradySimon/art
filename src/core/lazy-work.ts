import type {
  ArtworkDefinition,
  Work,
  WorkImplementation,
} from "./work";

export function lazyWork(
  definition: ArtworkDefinition,
  load: () => Promise<WorkImplementation>,
): Work {
  return {
    ...definition,
    async mount(container, options) {
      const implementation = await load();
      return implementation.mount(container, options);
    },
  };
}
