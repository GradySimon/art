import {lazyWork, type Work} from "../../core";

export const WORKS = [
  lazyWork(
    {
      path: "works/two-interacting",
      title: "Two Interacting Metaballs",
      description: "The first shader study: one orbiting point meets one fixed point.",
      date: "2019-12-15",
      provenance: "Historical · a2387c6",
      tags: ["generative", "shader", "metaball"],
    },
    () => import("./works/two-interacting"),
  ),
  lazyWork(
    {
      path: "works/oscillations-and-orbits",
      title: "Oscillations and Orbits",
      description: "Eight small bodies circulate around a breathing central pair.",
      date: "2019-12-15",
      provenance: "Historical · b789f5f",
      tags: ["generative", "shader", "metaball"],
    },
    () => import("./works/oscillations-and-orbits"),
  ),
  lazyWork(
    {
      path: "works/rotational-devotion",
      title: "Rotational Devotion",
      description: "Balanced positive and negative rings turn through each other.",
      date: "2019-12-17",
      provenance: "Historical · 6d21ea3",
      tags: ["generative", "shader", "metaball"],
    },
    () => import("./works/rotational-devotion"),
  ),
  lazyWork(
    {
      path: "works/rejoicing-slugs",
      title: "Rejoicing Slugs",
      description: "Three offset rings stretch into paired, waving forms.",
      date: "2019-12-18",
      provenance: "Historical · f7eea3b",
      tags: ["generative", "shader", "metaball"],
    },
    () => import("./works/rejoicing-slugs"),
  ),
  lazyWork(
    {
      path: "works/goo-gear",
      title: "Goo Gear",
      description: "A positive inner ring meshes with a negative outer ring.",
      date: "2019-12-18",
      provenance: "Historical · 8607ff6",
      tags: ["generative", "shader", "metaball"],
    },
    () => import("./works/goo-gear"),
  ),
  lazyWork(
    {
      path: "works/two-grazing",
      title: "2 Grazing",
      description: "Two large bodies pass through a field of opposing satellites.",
      date: "2019-12-18",
      provenance: "Historical · f8b9178",
      tags: ["generative", "shader", "metaball"],
    },
    () => import("./works/two-grazing"),
  ),
  lazyWork(
    {
      path: "works/taking-turns",
      title: "Taking Turns",
      description: "A hollow center anchors three interleaved orbital bands.",
      date: "2019-12-18",
      provenance: "Historical · b9657c9",
      tags: ["generative", "shader", "metaball"],
    },
    () => import("./works/taking-turns"),
  ),
  lazyWork(
    {
      path: "works/tricky-sun",
      title: "Tricky Sun",
      description: "Four slow rings form a flickering corona around a cut-out core.",
      date: "2020-01-01",
      provenance: "Historical · 0e7e230",
      tags: ["generative", "shader", "metaball"],
    },
    () => import("./works/tricky-sun"),
  ),
  lazyWork(
    {
      path: "works/orbital-rings",
      title: "Orbital Rings",
      description: "A February 2020 variation on Tricky Sun, with a slowly breathing central field.",
      date: "2020-02-08",
      provenance: "Historical variation · 870ecec",
      tags: ["generative", "shader", "metaball"],
    },
    () => import("./works/orbital-rings"),
  ),
  lazyWork(
    {
      path: "works/orbiters",
      title: "Orbiters",
      description: "A deterministic sketch inspired by the later OrbitWorld experiment.",
      date: "2026-07-12",
      provenance: "Codex addition · 66c5f59",
      tags: ["generative", "shader", "metaball", "simulation"],
    },
    () => import("./works/orbiters"),
  ),
] as const satisfies readonly Work[];
