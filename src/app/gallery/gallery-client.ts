const select = document.querySelector<HTMLSelectElement>("[data-work-select]");
const player = document.querySelector<HTMLElement>("[data-gallery-player]");
const previous = document.querySelector<HTMLButtonElement>("[data-previous]");
const next = document.querySelector<HTMLButtonElement>("[data-next]");

if (!select || !player || !previous || !next) {
  throw new Error("Gallery controls are incomplete");
}

function show(index: number): void {
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
  document.querySelector("[data-workspace]")!.textContent = option.dataset.workspace ?? "";
  window.location.hash = option.value;
}

select.addEventListener("change", () => show(select.selectedIndex));
previous.addEventListener("click", () => show(select.selectedIndex - 1));
next.addEventListener("click", () => show(select.selectedIndex + 1));
window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") show(select.selectedIndex - 1);
  if (event.code === "ArrowRight") show(select.selectedIndex + 1);
  if (["ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
});

const requestedPath = decodeURIComponent(window.location.hash.slice(1));
const requestedIndex = Array.from(select.options).findIndex(
  (option) => option.value === requestedPath,
);
show(requestedIndex >= 0 ? requestedIndex : 0);
