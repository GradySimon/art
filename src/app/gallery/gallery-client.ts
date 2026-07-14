const select = document.querySelector<HTMLSelectElement>("[data-work-select]");
const player = document.querySelector<HTMLElement>("[data-gallery-player]");
const previous = document.querySelector<HTMLButtonElement>("[data-previous]");
const next = document.querySelector<HTMLButtonElement>("[data-next]");
const gallery = document.querySelector<HTMLElement>("[data-gallery]");

if (!select || !player || !previous || !next || !gallery) {
  throw new Error("Gallery controls are incomplete");
}

if (window.location.hash) {
  window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);
}

function pathFromLocation(): string {
  return decodeURIComponent(window.location.pathname.replace(/\/+$/g, "")) || "/";
}

function show(index: number, pushHistory = false): void {
  const count = select!.options.length;
  const normalized = (index + count) % count;
  select!.selectedIndex = normalized;
  const option = select!.options[normalized];
  player!.setAttribute("work", option.value);
  document.querySelector("[data-work-number]")!.textContent =
    `${String(normalized + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
  document.querySelector("[data-work-title]")!.textContent = option.dataset.title ?? "";
  document.querySelector("[data-work-note]")!.textContent = option.dataset.description ?? "";
  document.querySelector("[data-work-provenance]")!.textContent = option.dataset.provenance ?? "";
  document.querySelector("[data-workspace-label]")!.textContent = option.dataset.workspace ?? "";
  if (pushHistory) window.history.pushState({}, "", option.dataset.href);
}

select.addEventListener("change", () => show(select.selectedIndex, true));
previous.addEventListener("click", () => show(select.selectedIndex - 1, true));
next.addEventListener("click", () => show(select.selectedIndex + 1, true));
window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") show(select.selectedIndex - 1, true);
  if (event.code === "ArrowRight") show(select.selectedIndex + 1, true);
  if (["ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
});

window.addEventListener("popstate", () => {
  const requestedPath = pathFromLocation();
  const requestedIndex = Array.from(select.options).findIndex(
    (option) => option.dataset.href === requestedPath,
  );
  show(requestedIndex >= 0 ? requestedIndex : 0);
});

const requestedPath = pathFromLocation() === "/"
  ? gallery.dataset.initialHref ?? ""
  : pathFromLocation();
const requestedIndex = Array.from(select.options).findIndex(
  (option) => option.dataset.href === requestedPath,
);
show(requestedIndex >= 0 ? requestedIndex : select.selectedIndex);
