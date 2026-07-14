import {Geometry, Mesh, Program, Renderer} from "ogl";
import type {WorkImplementation, WorkInstance, WorkOptions} from "../../core";
import fragmentShader from "./shaders/metaball.frag?raw";
import vertexShader from "./shaders/metaball.vert?raw";
import {type Metaball, MetaballKind, type MetaballScene, type Vec2} from "./types";

const MAX_METABALLS = 100;
const WEBGL2_VERTEX_SHADER = `#version 300 es
#define attribute in
attribute vec3 position;
${vertexShader}`;
const WEBGL2_FRAGMENT_SHADER = `#version 300 es
layout(location = 0) out highp vec4 pc_fragColor;
#define gl_FragColor pc_fragColor
${fragmentShader}`;

const PLANE_POSITIONS = new Float32Array([
  -1, 1, 0,
  1, 1, 0,
  -1, -1, 0,
  1, -1, 0,
]);
const PLANE_INDICES = new Uint16Array([0, 2, 1, 2, 3, 1]);

export function asWorkImplementation(sceneDefinition: MetaballScene): WorkImplementation {
  return {
    mount(container: HTMLElement, options: WorkOptions = {}): WorkInstance {
      const renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio, 2),
        premultipliedAlpha: true,
        webgl: 2,
      });
      const {gl} = renderer;
      if (!renderer.isWebgl2) throw new Error("Metaball works require WebGL 2");
      gl.canvas.style.display = "block";
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      container.appendChild(gl.canvas);

      const resolution = new Float32Array(2);
      const kinds = Array<number>(MAX_METABALLS).fill(0);
      const positions = Array<number>(MAX_METABALLS * 2).fill(0);
      const radii = Array<number>(MAX_METABALLS).fill(0);
      const uniforms = {
        u_resolution: {value: resolution},
        u_metaball_kind: {value: kinds},
        u_metaball_pos: {value: positions},
        u_metaball_radius: {value: radii},
        u_num_metaballs: {value: 0},
        u_threshold: {value: 0.3},
      };
      const geometry = new Geometry(gl, {
        position: {size: 3, data: PLANE_POSITIONS},
        index: {data: PLANE_INDICES},
      });
      const program = new Program(gl, {
        vertex: WEBGL2_VERTEX_SHADER,
        fragment: WEBGL2_FRAGMENT_SHADER,
        uniforms,
      });
      const mesh = new Mesh(gl, {geometry, program});

      let pointer: Vec2 = [0, 0];
      let paused = options.paused ?? false;
      let destroyed = false;
      let frame = 0;
      const startedAt = performance.now();

      const upload = (balls: Metaball[]): void => {
        uniforms.u_num_metaballs.value = Math.min(balls.length, MAX_METABALLS);
        balls.slice(0, MAX_METABALLS).forEach((ball, index) => {
          kinds[index] = ball.kind ?? MetaballKind.QUADRATIC;
          positions[index * 2] = ball.position[0];
          positions[index * 2 + 1] = ball.position[1];
          radii[index] = ball.radius;
        });
      };

      const resize = (): void => {
        const {width, height} = container.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        renderer.setSize(width, height);
        gl.canvas.style.width = "100%";
        gl.canvas.style.height = "100%";
        resolution[0] = gl.drawingBufferWidth;
        resolution[1] = gl.drawingBufferHeight;
      };

      const onPointerMove = (event: PointerEvent): void => {
        const bounds = container.getBoundingClientRect();
        const aspect = bounds.width / bounds.height;
        pointer = [
          ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
          1 - ((event.clientY - bounds.top) / bounds.height) * 2,
        ];
        if (aspect > 1) pointer[0] *= aspect;
        else pointer[1] /= aspect;
      };

      const animate = (now: number): void => {
        if (destroyed) return;
        if (!paused) upload(sceneDefinition({elapsed: now - startedAt, pointer}));
        renderer.render({scene: mesh});
        frame = requestAnimationFrame(animate);
      };

      container.addEventListener("pointermove", onPointerMove);
      resize();
      frame = requestAnimationFrame(animate);

      return {
        pause: () => { paused = true; },
        resume: () => { paused = false; },
        resize,
        destroy: () => {
          destroyed = true;
          cancelAnimationFrame(frame);
          container.removeEventListener("pointermove", onPointerMove);
          geometry.remove();
          program.remove();
          gl.deleteShader(program.vertexShader);
          gl.deleteShader(program.fragmentShader);
          gl.canvas.remove();
        },
      };
    },
  };
}
