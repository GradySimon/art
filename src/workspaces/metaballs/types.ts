export type Vec2 = [number, number];

export enum MetaballKind {
  QUADRATIC = 1,
  NEG_QUADRATIC = 2,
  LINEAR = 3,
  NEG_LINEAR = 4,
  ZERO = 5,
}

export interface Metaball {
  kind?: MetaballKind;
  position: Vec2;
  radius: number;
}

export interface SceneContext {
  elapsed: number;
  pointer: Vec2;
}

export type MetaballScene = (context: SceneContext) => Metaball[];
