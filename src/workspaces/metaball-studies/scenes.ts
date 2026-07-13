import {type Metaball, MetaballKind, type MetaballScene, type Vec2} from "./types";

interface OrbitOptions {
  period?: number;
  offset?: number;
  radius?: number;
}

function oscillate(
  time: number,
  {period = 4000, offset = 0, radius = 0.5}: OrbitOptions,
  fn = Math.sin,
): number {
  return fn(((time + offset) * Math.PI * 2) / period) * radius;
}

function orbit(time: number, options: OrbitOptions = {}): Vec2 {
  return [oscillate(time, options), oscillate(time, options, Math.cos)];
}

function ring(
  time: number,
  count: number,
  options: OrbitOptions,
  ballRadius: number,
  kind = MetaballKind.QUADRATIC,
): Metaball[] {
  const period = options.period ?? 4000;
  return Array.from({length: count}, (_, index) => ({
    position: orbit(time, {...options, offset: (period / count) * index}),
    radius: ballRadius,
    kind,
  }));
}

const center = (radius: number, kind = MetaballKind.QUADRATIC): Metaball => ({
  position: [0, 0],
  radius,
  kind,
});

export const twoInteracting: MetaballScene = ({elapsed}) => [
  {position: orbit(elapsed, {period: 4000, radius: 0.45}), radius: 0.02},
  {position: [0.2, 0.2], radius: 0.02},
];

export const oscillationsAndOrbits: MetaballScene = ({elapsed}) => [
  {position: orbit(elapsed, {period: 32000, radius: 0.69}), radius: 0.08},
  center(0.155),
  ...ring(elapsed, 8, {period: 8000, radius: 0.75}, 0.05),
];

export const rotationalDevotion: MetaballScene = ({elapsed}) => [
  center(0.25),
  ...ring(elapsed, 8, {period: 32000, radius: 0.77}, 0.055, MetaballKind.NEG_QUADRATIC),
  ...ring(elapsed, 8, {period: -32000, radius: 0.73}, 0.055),
];

export const rejoicingSlugs: MetaballScene = ({elapsed}) => [
  center(0.27),
  ...ring(elapsed, 8, {period: 32000, radius: 0.73}, 0.055, MetaballKind.NEG_QUADRATIC),
  ...ring(elapsed, 8, {period: -32000, radius: 0.77}, 0.085),
  ...ring(elapsed + 2000, 8, {period: 32000, radius: 0.81}, 0.055, MetaballKind.NEG_QUADRATIC),
];

export const gooGear: MetaballScene = ({elapsed}) => [
  center(0.27),
  ...ring(elapsed, 8, {period: -32000, radius: 0.77}, 0.085),
  ...ring(elapsed + 2000, 8, {period: 32000, radius: 0.81}, 0.055, MetaballKind.NEG_QUADRATIC),
];

export const twoGrazing: MetaballScene = ({elapsed}) => [
  center(0.33),
  ...ring(elapsed, 8, {period: 32000, radius: 0.73}, 0.09, MetaballKind.NEG_QUADRATIC),
  ...ring(elapsed, 2, {period: -32000, radius: 0.77}, 0.143),
  ...ring(elapsed + 2000, 8, {period: 32000, radius: 0.81}, 0.1, MetaballKind.NEG_QUADRATIC),
];

export const takingTurns: MetaballScene = ({elapsed}) => [
  center(0.34),
  center(0.49, MetaballKind.ZERO),
  ...ring(elapsed, 8, {period: 32000, radius: 0.73}, 0.082, MetaballKind.NEG_QUADRATIC),
  ...ring(elapsed, 8, {period: -32000, radius: 0.77}, 0.087),
  ...ring(elapsed + 2000, 8, {period: 32000, radius: 0.81}, 0.082, MetaballKind.NEG_QUADRATIC),
];

export const trickySun: MetaballScene = ({elapsed}) => [
  center(0.33),
  center(0.52, MetaballKind.ZERO),
  ...ring(elapsed, 8, {period: 96000, radius: 0.73}, 0.06, MetaballKind.NEG_QUADRATIC),
  ...ring(elapsed, 8, {period: -48000, radius: 0.77}, 0.055),
  ...ring(elapsed + 3000, 8, {period: -48000, radius: 0.77}, 0.055),
  ...ring(elapsed + 3000, 8, {period: 48000, radius: 0.81}, 0.06, MetaballKind.NEG_QUADRATIC),
];

export const orbitalRings: MetaballScene = ({elapsed}) => [
  center(0.375 + Math.sin((elapsed * Math.PI * 2) / 24000) * 0.075),
  ...trickySun({elapsed, pointer: [0, 0]}).slice(1),
];

export const orbiters: MetaballScene = ({elapsed}) => {
  const bodies: Metaball[] = [center(0.24), center(0.34, MetaballKind.ZERO)];
  for (let index = 0; index < 14; index += 1) {
    const lane = index % 3;
    const radius = 0.48 + lane * 0.17;
    const speed = (lane === 1 ? -1 : 1) * (0.00008 + lane * 0.000025);
    const angle = elapsed * speed + (index / 14) * Math.PI * 2;
    bodies.push({
      position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72],
      radius: 0.045 + (index % 4) * 0.008,
      kind: index % 5 === 0 ? MetaballKind.NEG_QUADRATIC : MetaballKind.QUADRATIC,
    });
  }
  return bodies;
};
