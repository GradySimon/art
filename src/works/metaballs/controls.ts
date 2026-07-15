import type {NumericParameters} from "./types";

type ControlFormat = "integer" | "decimal" | "multiplier";

interface NumericControl<Parameters extends NumericParameters<Parameters>> {
  key: Extract<keyof Parameters, string>;
  label: string;
  min: number;
  max: number;
  step: number;
  format?: ControlFormat;
}

export interface MetaballControls<Parameters extends NumericParameters<Parameters>> {
  title: string;
  defaults: Parameters;
  fields: readonly NumericControl<Parameters>[];
}

const CONTROL_STYLES = `
.metaball-controls {
  position: absolute;
  z-index: 2;
  top: 10px;
  right: 10px;
  color: #f2f0e9;
  background: rgba(19, 20, 18, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font: 9px/1.2 "DM Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.metaball-controls {
  width: min(240px, calc(100% - 20px));
  padding: 10px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
}
.metaball-controls[hidden] { display: none; }
.metaball-controls__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.metaball-controls__actions { display: flex; gap: 8px; }
.metaball-controls button {
  border: 0;
  padding: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0.64;
}
.metaball-controls button:hover,
.metaball-controls button:focus-visible { opacity: 1; }
.metaball-controls__field {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr) 36px;
  align-items: center;
  gap: 7px;
  min-height: 21px;
}
.metaball-controls__field output {
  color: rgba(242, 240, 233, 0.68);
  text-align: right;
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
}
.metaball-controls input[type="range"] {
  width: 100%;
  height: 12px;
  margin: 0;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: ew-resize;
}
.metaball-controls input[type="range"]::-webkit-slider-runnable-track {
  height: 1px;
  background: rgba(242, 240, 233, 0.34);
}
.metaball-controls input[type="range"]::-webkit-slider-thumb {
  width: 7px;
  height: 7px;
  margin-top: -3px;
  border: 0;
  border-radius: 50%;
  appearance: none;
  -webkit-appearance: none;
  background: #f2f0e9;
}
.metaball-controls input[type="range"]::-moz-range-track {
  height: 1px;
  background: rgba(242, 240, 233, 0.34);
}
.metaball-controls input[type="range"]::-moz-range-thumb {
  width: 7px;
  height: 7px;
  border: 0;
  border-radius: 50%;
  background: #f2f0e9;
}
`;

function formatControlValue(
  value: number,
  format: ControlFormat | undefined,
  step: number,
): string {
  if (format === "integer") return String(Math.round(value));
  if (format === "multiplier") return `${value.toFixed(2)}×`;
  const precision = Math.min(String(step).split(".")[1]?.length ?? 0, 3);
  return value.toFixed(precision);
}

export function mountControls<Parameters extends NumericParameters<Parameters>>(
  container: HTMLElement,
  controls: MetaballControls<Parameters>,
  parameters: Record<string, number>,
): () => void {
  const style = document.createElement("style");
  style.textContent = CONTROL_STYLES;

  const panel = document.createElement("section");
  panel.className = "metaball-controls";
  panel.hidden = true;
  panel.setAttribute("aria-label", `${controls.title} parameters`);

  const header = document.createElement("header");
  header.className = "metaball-controls__header";
  const title = document.createElement("span");
  title.textContent = controls.title;
  const actions = document.createElement("div");
  actions.className = "metaball-controls__actions";
  const reset = document.createElement("button");
  reset.type = "button";
  reset.textContent = "Reset";
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "Close parameters");
  actions.append(reset, close);
  header.append(title, actions);
  panel.append(header);

  const inputs = new Map<string, {input: HTMLInputElement; output: HTMLOutputElement}>();
  for (const field of controls.fields) {
    const label = document.createElement("label");
    label.className = "metaball-controls__field";
    const name = document.createElement("span");
    name.textContent = field.label;
    const input = document.createElement("input");
    input.type = "range";
    input.min = String(field.min);
    input.max = String(field.max);
    input.step = String(field.step);
    input.value = String(parameters[field.key]);
    const output = document.createElement("output");
    output.value = formatControlValue(parameters[field.key], field.format, field.step);
    input.addEventListener("input", () => {
      parameters[field.key] = input.valueAsNumber;
      output.value = formatControlValue(input.valueAsNumber, field.format, field.step);
    });
    label.append(name, input, output);
    panel.append(label);
    inputs.set(field.key, {input, output});
  }

  const setOpen = (open: boolean): void => {
    panel.hidden = !open;
  };
  const stopPropagation = (event: Event): void => event.stopPropagation();
  const onContainerClick = (): void => setOpen(panel.hidden);
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  };
  const resetParameters = (): void => {
    Object.assign(parameters, controls.defaults);
    for (const field of controls.fields) {
      const elements = inputs.get(field.key);
      if (!elements) continue;
      elements.input.value = String(parameters[field.key]);
      elements.output.value = formatControlValue(parameters[field.key], field.format, field.step);
    }
  };

  panel.addEventListener("click", stopPropagation);
  close.addEventListener("click", () => setOpen(false));
  reset.addEventListener("click", resetParameters);
  container.addEventListener("click", onContainerClick);
  window.addEventListener("keydown", onKeyDown);
  const previousPosition = container.style.position;
  if (getComputedStyle(container).position === "static") container.style.position = "relative";
  container.append(style, panel);

  return () => {
    container.removeEventListener("click", onContainerClick);
    window.removeEventListener("keydown", onKeyDown);
    style.remove();
    panel.remove();
    container.style.position = previousPosition;
  };
}
