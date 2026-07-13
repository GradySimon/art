import * as THREE from "three";
import type {ArtworkInstance, WorkImplementation, WorkOptions} from "../../core";
import fragmentShader from "./shaders/metaball.frag?raw";
import vertexShader from "./shaders/metaball.vert?raw";
import {type Metaball, MetaballKind, type MetaballScene, type Vec2} from "./types";

const MAX_METABALLS = 100;

export function implementationFor(sceneDefinition: MetaballScene): WorkImplementation {
  return {
    mount(container: HTMLElement, options: WorkOptions = {}): ArtworkInstance {
      const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const resolution = new THREE.Vector2();
      const uniforms = {
        u_resolution: {value: resolution},
        u_metaball_kind: {value: new Int32Array(MAX_METABALLS)},
        u_metaball_pos: {
          value: Array.from({length: MAX_METABALLS}, () => new THREE.Vector2()),
        },
        u_metaball_radius: {value: new Float32Array(MAX_METABALLS)},
        u_num_metaballs: {value: 0},
        u_threshold: {value: 0.3},
      };
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({vertexShader, fragmentShader, uniforms});
      scene.add(new THREE.Mesh(geometry, material));

      let pointer: Vec2 = [0, 0];
      let paused = options.paused ?? false;
      let destroyed = false;
      let frame = 0;
      const startedAt = performance.now();

      const upload = (balls: Metaball[]): void => {
        uniforms.u_num_metaballs.value = Math.min(balls.length, MAX_METABALLS);
        balls.slice(0, MAX_METABALLS).forEach((ball, index) => {
          uniforms.u_metaball_kind.value[index] = ball.kind ?? MetaballKind.QUADRATIC;
          uniforms.u_metaball_pos.value[index].set(...ball.position);
          uniforms.u_metaball_radius.value[index] = ball.radius;
        });
      };

      const resize = (): void => {
        const {width, height} = container.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        renderer.setSize(width, height, false);
        renderer.getDrawingBufferSize(resolution);
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
        renderer.render(scene, camera);
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
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        },
      };
    },
  };
}
