import type {Work} from "./work";

export function lazyWork(
  definition: Omit<Work, "mount">,
  load: () => Promise<Pick<Work, "mount">>,
): Work {
  return {
    ...definition,
    async mount(container, options) {
      const implementation = await load();
      return implementation.mount(container, options);
    },
  };
}
