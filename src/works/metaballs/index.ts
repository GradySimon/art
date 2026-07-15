import {lazyWork, type Work} from "../../core";
import {METABALL_BACKGROUND} from "./palette";

const galleryStyle = {backgroundColor: METABALL_BACKGROUND} as const;

export const WORKS = [
  lazyWork(
    {
      path: "two-interacting",
      title: "Two Interacting Metaballs",
      description: "The first shader study: one orbiting point meets one fixed point.",
      date: "2019-12-15",
      provenance: "Source commit · a2387c6",
      tags: ["generative", "shader", "metaball"],
      galleryStyle,
    },
    () => import("./two-interacting"),
  ),
  lazyWork(
    {
      path: "oscillations-and-orbits",
      title: "Oscillations and Orbits",
      description: "Eight small bodies circulate around a breathing central pair.",
      date: "2019-12-15",
      provenance: "Source commit · b789f5f",
      tags: ["generative", "shader", "metaball"],
      galleryStyle,
    },
    () => import("./oscillations-and-orbits"),
  ),
  lazyWork(
    {
      path: "rotational-devotion",
      title: "Rotational Devotion",
      description: "Balanced positive and negative rings turn through each other.",
      date: "2019-12-17",
      provenance: "Source commit · 6d21ea3",
      tags: ["generative", "shader", "metaball"],
      galleryStyle,
    },
    () => import("./rotational-devotion"),
  ),
  lazyWork(
    {
      path: "rejoicing-slugs",
      title: "Rejoicing Slugs",
      description: "Three offset rings stretch into paired, waving forms.",
      date: "2019-12-18",
      provenance: "Source commit · f7eea3b",
      tags: ["generative", "shader", "metaball"],
      galleryStyle,
    },
    () => import("./rejoicing-slugs"),
  ),
  lazyWork(
    {
      path: "sundance",
      title: "Sundance",
      description: "A slowly breathing central field surrounded by Tricky Sun’s orbital corona.",
      visible: true,
      date: "2020-02-08",
      provenance: "Source commit · 870ecec",
      tags: ["generative", "shader", "metaball"],
      galleryStyle,
    },
    () => import("./sundance"),
  ),
  lazyWork(
    {
      path: "two-grazing",
      title: "Caresses",
      description: "Two large bodies pass through a field of opposing satellites.",
      visible: true,
      date: "2019-12-18",
      provenance: "Source commit · f8b9178",
      tags: ["generative", "shader", "metaball"],
      galleryStyle,
    },
    () => import("./two-grazing"),
  ),
  lazyWork(
    {
      path: "goo-gear",
      title: "Goo Gear",
      description: "A positive inner ring meshes with a negative outer ring.",
      visible: true,
      date: "2019-12-18",
      provenance: "Source commit · 8607ff6",
      tags: ["generative", "shader", "metaball"],
      galleryStyle,
    },
    () => import("./goo-gear"),
  ),
  lazyWork(
    {
      path: "tricky-sun",
      title: "Tricky Sun",
      description: "Four slow rings form a flickering corona around a cut-out core.",
      date: "2020-01-01",
      provenance: "Source commit · 0e7e230",
      tags: ["generative", "shader", "metaball"],
      galleryStyle,
    },
    () => import("./tricky-sun"),
  ),
  lazyWork(
    {
      path: "taking-turns",
      title: "Taking Turns",
      description: "A hollow center anchors three interleaved orbital bands.",
      date: "2019-12-18",
      provenance: "Source commit · b9657c9",
      tags: ["generative", "shader", "metaball"],
      galleryStyle,
    },
    () => import("./taking-turns"),
  ),
  lazyWork(
    {
      path: "orbiters",
      title: "Orbiters",
      description: "A deterministic sketch inspired by the later OrbitWorld experiment.",
      date: "2026-07-12",
      provenance: "Codex addition · 66c5f59",
      tags: ["generative", "shader", "metaball", "simulation"],
      galleryStyle,
    },
    () => import("./orbiters"),
  ),
] as const satisfies readonly Work[];
