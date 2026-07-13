import * as THREE from "three";
import type { Vec2 } from "./common-types";
import type { Metaball } from "./metaball";
import { MetaballKind } from "./metaball";
import fragmentShader from "./shader/metaball.frag?raw";
import vertexShader from "./shader/metaball.vert?raw";
import { studies } from "./studies";
import "./style.css";

const MAX_METABALLS = 100;
const canvasHost = document.querySelector<HTMLDivElement>("#canvas")!;
const studySelect = document.querySelector<HTMLSelectElement>("#study-select")!;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasHost.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const resolution = new THREE.Vector2();
const uniforms = {
  u_resolution: { value: resolution },
  u_metaball_kind: { value: new Int32Array(MAX_METABALLS) },
  u_metaball_pos: { value: Array.from({ length: MAX_METABALLS }, () => new THREE.Vector2()) },
  u_metaball_radius: { value: new Float32Array(MAX_METABALLS) },
  u_num_metaballs: { value: 0 },
  u_threshold: { value: 0.3 },
};

scene.add(new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms }),
));

let activeIndex = 0;
let pointer: Vec2 = [0, 0];
let paused = false;
const startedAt = performance.now();

for (const [index, study] of studies.entries()) {
  const option = document.createElement("option");
  option.value = String(index);
  option.textContent = `${String(index + 1).padStart(2, "0")} — ${study.title}`;
  studySelect.appendChild(option);
}

function showStudy(index: number): void {
  activeIndex = (index + studies.length) % studies.length;
  const study = studies[activeIndex];
  studySelect.value = String(activeIndex);
  document.querySelector("#study-number")!.textContent =
    `${String(activeIndex + 1).padStart(2, "0")} / ${String(studies.length).padStart(2, "0")}`;
  document.querySelector("#study-title")!.textContent = study.title;
  document.querySelector("#study-note")!.textContent = study.note;
  document.querySelector("#study-provenance")!.textContent = study.provenance;
  window.location.hash = study.id;
}

function uploadMetaballs(balls: Metaball[]): void {
  uniforms.u_num_metaballs.value = Math.min(balls.length, MAX_METABALLS);
  balls.slice(0, MAX_METABALLS).forEach((ball, index) => {
    uniforms.u_metaball_kind.value[index] = ball.kind ?? MetaballKind.QUADRATIC;
    uniforms.u_metaball_pos.value[index].set(...ball.position);
    uniforms.u_metaball_radius.value[index] = ball.radius;
  });
}

function resize(): void {
  const { width, height } = canvasHost.getBoundingClientRect();
  renderer.setSize(width, height, false);
  renderer.getDrawingBufferSize(resolution);
}

function animate(now: number): void {
  if (!paused) {
    uploadMetaballs(studies[activeIndex].render({ elapsed: now - startedAt, pointer }));
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

canvasHost.addEventListener("pointermove", (event) => {
  const bounds = canvasHost.getBoundingClientRect();
  const aspect = bounds.width / bounds.height;
  pointer = [
    ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
    1 - ((event.clientY - bounds.top) / bounds.height) * 2,
  ];
  if (aspect > 1) pointer[0] *= aspect;
  else pointer[1] /= aspect;
});

studySelect.addEventListener("change", () => showStudy(Number(studySelect.value)));
document.querySelector<HTMLButtonElement>("#previous")!.addEventListener("click", () => showStudy(activeIndex - 1));
document.querySelector<HTMLButtonElement>("#next")!.addEventListener("click", () => showStudy(activeIndex + 1));
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") paused = !paused;
  if (event.code === "ArrowLeft") showStudy(activeIndex - 1);
  if (event.code === "ArrowRight") showStudy(activeIndex + 1);
  if (["Space", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
});
window.addEventListener("resize", resize);

const hashIndex = studies.findIndex((study) => study.id === window.location.hash.slice(1));
showStudy(hashIndex >= 0 ? hashIndex : 0);
resize();
requestAnimationFrame(animate);
