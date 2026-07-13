import * as THREE from "three";
import type { Vec2 } from "./common-types";
import { type Metaball, MetaballKind, metaballScene } from "./metaball";
import fragmentShader from "./shader/metaball.frag?raw";
import vertexShader from "./shader/metaball.vert?raw";
import "./style.css";

type Study = "rings" | "orbiters" | "cursor";

const MAX_METABALLS = 100;
const studyCopy: Record<Study, [string, string]> = {
  rings: ["Study 01", "Counter-rotating positive and negative fields"],
  orbiters: ["Study 02", "Small bodies tracing an eccentric central mass"],
  cursor: ["Study 03", "A field that follows your pointer"],
};

const canvasHost = document.querySelector<HTMLDivElement>("#canvas")!;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasHost.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const resolution = new THREE.Vector2();
const uniforms = {
  u_resolution: { value: resolution },
  u_metaball_kind: { value: new Int32Array(MAX_METABALLS) },
  u_metaball_pos: {
    value: Array.from({ length: MAX_METABALLS }, () => new THREE.Vector2()),
  },
  u_metaball_radius: { value: new Float32Array(MAX_METABALLS) },
  u_num_metaballs: { value: 0 },
  u_threshold: { value: 0.3 },
};

scene.add(
  new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms }),
  ),
);

let activeStudy: Study = "rings";
let pointer: Vec2 = [0, 0];
let paused = false;
const startedAt = performance.now();

function orbiters(elapsed: number): Metaball[] {
  const bodies: Metaball[] = [
    { position: [0, 0], radius: 0.24 },
    { position: [0, 0], radius: 0.34, kind: MetaballKind.ZERO },
  ];
  for (let i = 0; i < 14; i += 1) {
    const lane = i % 3;
    const radius = 0.48 + lane * 0.17;
    const speed = (lane === 1 ? -1 : 1) * (0.00008 + lane * 0.000025);
    const angle = elapsed * speed + (i / 14) * Math.PI * 2;
    bodies.push({
      position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72],
      radius: 0.045 + (i % 4) * 0.008,
      kind: i % 5 === 0 ? MetaballKind.NEG_QUADRATIC : MetaballKind.QUADRATIC,
    });
  }
  return bodies;
}

function cursorField(elapsed: number): Metaball[] {
  const pulse = 0.11 + Math.sin(elapsed * 0.0018) * 0.025;
  return [
    { position: pointer, radius: pulse },
    { position: [-pointer[0] * 0.55, -pointer[1] * 0.55], radius: 0.2 },
    { position: [0, 0], radius: 0.3, kind: MetaballKind.ZERO },
    { position: [pointer[0] * 0.35, -pointer[1] * 0.35], radius: 0.085, kind: MetaballKind.NEG_LINEAR },
  ];
}

function ballsFor(study: Study, elapsed: number): Metaball[] {
  if (study === "rings") return metaballScene({ elapsed_time: elapsed, mouse: pointer });
  if (study === "orbiters") return orbiters(elapsed);
  return cursorField(elapsed);
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
  if (!paused) uploadMetaballs(ballsFor(activeStudy, now - startedAt));
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

document.querySelectorAll<HTMLButtonElement>("[data-study]").forEach((button) => {
  button.addEventListener("click", () => {
    activeStudy = button.dataset.study as Study;
    document.querySelectorAll<HTMLButtonElement>("[data-study]").forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
    const [number, note] = studyCopy[activeStudy];
    document.querySelector("#study-number")!.textContent = number;
    document.querySelector("#study-note")!.textContent = note;
  });
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    paused = !paused;
    event.preventDefault();
  }
});
window.addEventListener("resize", resize);
resize();
requestAnimationFrame(animate);
