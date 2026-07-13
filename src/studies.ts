import type { Vec2 } from "./common-types";
import { type Metaball, MetaballKind } from "./metaball";

export interface StudyContext {
  elapsed: number;
  pointer: Vec2;
}

export interface Study {
  id: string;
  title: string;
  note: string;
  provenance: string;
  render: (context: StudyContext) => Metaball[];
}

interface OrbitOptions {
  period?: number;
  offset?: number;
  radius?: number;
}

function oscillate(
  time: number,
  { period = 4000, offset = 0, radius = 0.5 }: OrbitOptions,
  fn = Math.sin,
): number {
  return fn(((time + offset) * Math.PI * 2) / period) * radius;
}

function orbit(time: number, options: OrbitOptions = {}): Vec2 {
  return [
    oscillate(time, options),
    oscillate(time, options, Math.cos),
  ];
}

function ring(
  time: number,
  count: number,
  options: OrbitOptions,
  ballRadius: number,
  kind = MetaballKind.QUADRATIC,
): Metaball[] {
  const period = options.period ?? 4000;
  return Array.from({ length: count }, (_, index) => ({
    position: orbit(time, {
      ...options,
      offset: (period / count) * index,
    }),
    radius: ballRadius,
    kind,
  }));
}

const center = (radius: number, kind = MetaballKind.QUADRATIC): Metaball => ({
  position: [0, 0],
  radius,
  kind,
});

const historicalStudies: Study[] = [
  {
    id: "two-interacting",
    title: "Two Interacting Metaballs",
    note: "The first shader study: one orbiting point meets one fixed point.",
    provenance: "Historical · Dec 15, 2019 · a2387c6",
    render: ({ elapsed }) => [
      { position: orbit(elapsed, { period: 4000, radius: 0.45 }), radius: 0.02 },
      { position: [0.2, 0.2], radius: 0.02 },
    ],
  },
  {
    id: "oscillations-orbits",
    title: "Oscillations and Orbits",
    note: "Eight small bodies circulate around a breathing central pair.",
    provenance: "Historical · Dec 15, 2019 · b789f5f",
    render: ({ elapsed }) => [
      { position: orbit(elapsed, { period: 32000, radius: 0.69 }), radius: 0.08 },
      center(0.155),
      ...ring(elapsed, 8, { period: 8000, radius: 0.75 }, 0.05),
    ],
  },
  {
    id: "rotational-devotion",
    title: "Rotational Devotion",
    note: "Balanced positive and negative rings turn through each other.",
    provenance: "Historical · Dec 17, 2019 · 6d21ea3",
    render: ({ elapsed }) => [
      center(0.25),
      ...ring(elapsed, 8, { period: 32000, radius: 0.77 }, 0.055, MetaballKind.NEG_QUADRATIC),
      ...ring(elapsed, 8, { period: -32000, radius: 0.73 }, 0.055),
    ],
  },
  {
    id: "rejoicing-slugs",
    title: "Rejoicing Slugs",
    note: "Three offset rings stretch into paired, waving forms.",
    provenance: "Historical · Dec 18, 2019 · f7eea3b",
    render: ({ elapsed }) => [
      center(0.27),
      ...ring(elapsed, 8, { period: 32000, radius: 0.73 }, 0.055, MetaballKind.NEG_QUADRATIC),
      ...ring(elapsed, 8, { period: -32000, radius: 0.77 }, 0.085),
      ...ring(elapsed + 2000, 8, { period: 32000, radius: 0.81 }, 0.055, MetaballKind.NEG_QUADRATIC),
    ],
  },
  {
    id: "goo-gear",
    title: "Goo Gear",
    note: "A positive inner ring meshes with a negative outer ring.",
    provenance: "Historical · Dec 18, 2019 · 8607ff6",
    render: ({ elapsed }) => [
      center(0.27),
      ...ring(elapsed, 8, { period: -32000, radius: 0.77 }, 0.085),
      ...ring(elapsed + 2000, 8, { period: 32000, radius: 0.81 }, 0.055, MetaballKind.NEG_QUADRATIC),
    ],
  },
  {
    id: "two-grazing",
    title: "2 Grazing",
    note: "Two large bodies pass through a field of opposing satellites.",
    provenance: "Historical · Dec 18, 2019 · f8b9178",
    render: ({ elapsed }) => [
      center(0.33),
      ...ring(elapsed, 8, { period: 32000, radius: 0.73 }, 0.09, MetaballKind.NEG_QUADRATIC),
      ...ring(elapsed, 2, { period: -32000, radius: 0.77 }, 0.143),
      ...ring(elapsed + 2000, 8, { period: 32000, radius: 0.81 }, 0.1, MetaballKind.NEG_QUADRATIC),
    ],
  },
  {
    id: "taking-turns",
    title: "Taking Turns",
    note: "A hollow center anchors three interleaved orbital bands.",
    provenance: "Historical · Dec 18, 2019 · b9657c9",
    render: ({ elapsed }) => [
      center(0.34),
      center(0.49, MetaballKind.ZERO),
      ...ring(elapsed, 8, { period: 32000, radius: 0.73 }, 0.082, MetaballKind.NEG_QUADRATIC),
      ...ring(elapsed, 8, { period: -32000, radius: 0.77 }, 0.087),
      ...ring(elapsed + 2000, 8, { period: 32000, radius: 0.81 }, 0.082, MetaballKind.NEG_QUADRATIC),
    ],
  },
  {
    id: "tricky-sun",
    title: "Tricky Sun",
    note: "Four slow rings form a flickering corona around a cut-out core.",
    provenance: "Historical · Jan 1, 2020 · 0e7e230",
    render: ({ elapsed }) => [
      center(0.33),
      center(0.52, MetaballKind.ZERO),
      ...ring(elapsed, 8, { period: 96000, radius: 0.73 }, 0.06, MetaballKind.NEG_QUADRATIC),
      ...ring(elapsed, 8, { period: -48000, radius: 0.77 }, 0.055),
      ...ring(elapsed + 3000, 8, { period: -48000, radius: 0.77 }, 0.055),
      ...ring(elapsed + 3000, 8, { period: 48000, radius: 0.81 }, 0.06, MetaballKind.NEG_QUADRATIC),
    ],
  },
  {
    id: "orbital-rings",
    title: "Orbital Rings",
    note: "A February 2020 variation on Tricky Sun, with a slowly breathing central field.",
    provenance: "Historical variation · Feb 8, 2020 · 870ecec",
    render: ({ elapsed }) => [
      center(0.375 + Math.sin((elapsed * Math.PI * 2) / 24000) * 0.075),
      center(0.52, MetaballKind.ZERO),
      ...ring(elapsed, 8, { period: 96000, radius: 0.73 }, 0.06, MetaballKind.NEG_QUADRATIC),
      ...ring(elapsed, 8, { period: -48000, radius: 0.77 }, 0.055),
      ...ring(elapsed + 3000, 8, { period: -48000, radius: 0.77 }, 0.055),
      ...ring(elapsed + 3000, 8, { period: 48000, radius: 0.81 }, 0.06, MetaballKind.NEG_QUADRATIC),
    ],
  },
];

function orbiters(elapsed: number): Metaball[] {
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
}

export const studies: Study[] = [
  ...historicalStudies,
  {
    id: "orbiters",
    title: "Orbiters",
    note: "A deterministic sketch inspired by the later OrbitWorld experiment.",
    provenance: "Codex addition · Jul 2026 · 66c5f59",
    render: ({ elapsed }) => orbiters(elapsed),
  },
];
