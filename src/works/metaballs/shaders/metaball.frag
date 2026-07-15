#ifdef GL_ES
precision mediump float;
#endif

#define MAX_NUM_METABALLS 100
#define NO_THRESHOLDING false
#define SHOW_THRESHOLD true

uniform vec2 u_resolution;
uniform vec3 u_background_color;

#define QUADRATIC 1
#define NEG_QUADRATIC 2
#define LINEAR 3
#define NEG_LINEAR 4
#define ZERO 5

uniform int u_metaball_kind[MAX_NUM_METABALLS];
uniform vec2 u_metaball_pos[MAX_NUM_METABALLS];
uniform float u_metaball_radius[MAX_NUM_METABALLS];
uniform int u_num_metaballs;
uniform float u_threshold;

vec4 grayscale(float value) {
  return vec4(vec3(value), 1.0);
}

vec4 color_for_density(float density) {
  if (NO_THRESHOLDING) {
    if (SHOW_THRESHOLD && u_threshold < density && density < u_threshold + 0.005) {
      return grayscale(density - 0.05);
    }
    return grayscale(density);
  }
  return density > u_threshold ? grayscale(0.0) : vec4(u_background_color, 1.0);
}

float quadratic_density(vec2 frag_pos, vec2 pos, float radius) {
  return radius * radius / dot(frag_pos - pos, frag_pos - pos);
}

float density_for_ball(vec2 frag_pos, int kind, vec2 pos, float radius) {
  if (kind == QUADRATIC) return quadratic_density(frag_pos, pos, radius);
  if (kind == NEG_QUADRATIC) return -quadratic_density(frag_pos, pos, radius);
  if (kind == LINEAR) return radius * radius / length(frag_pos - pos);
  if (kind == NEG_LINEAR) return -(radius * radius / length(frag_pos - pos));
  if (kind == ZERO && length(frag_pos - pos) < radius) return -1000000.0;
  return 0.0;
}

void main() {
  float aspect_ratio = u_resolution.x / u_resolution.y;
  vec2 frag_pos = 2.0 * (gl_FragCoord.xy - u_resolution / 2.0) / u_resolution;
  if (u_resolution.x < u_resolution.y) frag_pos.y /= aspect_ratio;
  else frag_pos.x *= aspect_ratio;

  float density = 0.0;
  for (int i = 0; i < MAX_NUM_METABALLS; i++) {
    if (i >= u_num_metaballs) break;
    density += density_for_ball(
      frag_pos,
      u_metaball_kind[i],
      u_metaball_pos[i],
      u_metaball_radius[i]
    );
  }
  gl_FragColor = color_for_density(density);
}
