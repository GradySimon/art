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

export type NumericParameters<Parameters> = {
  [Key in keyof Parameters]: number;
};

export interface SceneContext<
  Parameters extends NumericParameters<Parameters> = Record<never, never>,
> {
  elapsed: number;
  pointer: Vec2;
  parameters: Readonly<Parameters>;
}

export type MetaballScene<
  Parameters extends NumericParameters<Parameters> = Record<never, never>,
> = (
  context: SceneContext<Parameters>,
) => Metaball[];
