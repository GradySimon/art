#ifdef GL_ES
precision mediump float;
#endif

// #define MAX_NUM_METABALLS 25
#define THRESHOLD 0.424
#define RADIUS 0.065

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// uniform vec2 u_metaball_pos[MAX_NUM_METABALLS];
uniform vec2 u_metaball_pos_0;
uniform vec2 u_metaball_pos_1;
uniform vec2 u_metaball_pos_2;
uniform vec2 u_metaball_pos_3;
// uniform float u_metaball_radius[MAX_NUM_METABALLS];
uniform float u_metaball_radius_0;
uniform float u_metaball_radius_1;
uniform float u_metaball_radius_2;
uniform float u_metaball_radius_3;
// uniform int u_num_metaballs;
uniform float u_threshold;

vec4 grayscale(float value) {
    return vec4(vec3(value), 1.);
}

vec4 color_for_density(float density) {
    if (density > u_threshold) {
        return grayscale(0.0);
    }
    return grayscale(0.944);
}

void main() {
    vec2 metaball_pos[4];
    float metaball_radius[4];
    metaball_pos[0] = u_metaball_pos_0;
    metaball_radius[0] = u_metaball_radius_0;
    metaball_pos[1] = u_metaball_pos_1;
    metaball_radius[1] = u_metaball_radius_1;
    metaball_pos[2] = u_metaball_pos_2;
    metaball_radius[2] = u_metaball_radius_2;
    metaball_pos[3] = u_metaball_pos_3;
    metaball_radius[3] = u_metaball_radius_3;
    
    vec2 st = gl_FragCoord.xy / u_resolution;

    float density = 0.;
    for (int i = 0; i < 4; i++) {
        vec2 pos = metaball_pos[i] / u_resolution;
        float single_ball_density =
          (metaball_radius[i] * metaball_radius[i])
          / dot((st - pos), (st - pos));
        density += single_ball_density;
    }
    
    
    gl_FragColor = color_for_density(density);
}
