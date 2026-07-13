import type {ArtworkInstance} from "../core";
import {loadWork} from "./registry";

export class ArtWorkElement extends HTMLElement {
  static observedAttributes = ["work"];

  #instance?: ArtworkInstance;
  #generation = 0;
  #resizeObserver = new ResizeObserver(() => this.#instance?.resize());

  connectedCallback(): void {
    this.#resizeObserver.observe(this);
    void this.#mount();
  }

  disconnectedCallback(): void {
    this.#generation += 1;
    this.#resizeObserver.disconnect();
    this.#instance?.destroy();
    this.#instance = undefined;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) void this.#mount();
  }

  async #mount(): Promise<void> {
    const fullPath = this.getAttribute("work");
    if (!fullPath) return;
    const generation = ++this.#generation;
    this.#instance?.destroy();
    this.#instance = undefined;
    this.replaceChildren();
    this.dataset.state = "loading";

    try {
      const work = await loadWork(fullPath);
      const instance = await work.mount(this, {
        paused: this.hasAttribute("paused"),
      });
      if (generation !== this.#generation) {
        instance.destroy();
        return;
      }
      this.#instance = instance;
      this.dataset.state = "ready";
    } catch (error) {
      if (generation !== this.#generation) return;
      this.dataset.state = "error";
      this.textContent = error instanceof Error ? error.message : "Unable to load artwork";
    }
  }
}

if (!customElements.get("art-work")) {
  customElements.define("art-work", ArtWorkElement);
}
