#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
out vec4 outColor;

// RNG based on a number seed.
float rand(vec2 n) {
  return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

// Generates noise based on random factors.
float noise(vec2 n) {
  const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
  return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

// Fractal Brownian Motion, applies movement.
float fbm(vec2 n) {
  float total = 0.0, amplitude = 1.0;
  for(int i = 0; i < 4; i ++ ) {
    total += noise(n) * amplitude;
    n += n;
    amplitude *= 0.5;
  }
  return total;
}

void main() {
  float alpha = 1.0;
  // color shift speed for the domain warp
  vec2 speed = vec2(0.7, 0.4);
  // how packed the clusters are in the display area
  float clusters = 8.0;

  // toxic green palette: near-black green into acid highlights
  const vec3 c1 = vec3(0.02, 0.05, 0.01);
  const vec3 c2 = vec3(0.20, 0.45, 0.05);
  const vec3 c3 = vec3(0.0, 0.10, 0.0);
  const vec3 c4 = vec3(0.45, 0.85, 0.10);
  const vec3 c5 = vec3(0.05);
  const vec3 c6 = vec3(0.55);

  // centered, aspect-correct coords drive the swirl and the vignette
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.x;

  // slow rotation of the noise domain so the gas churns instead of drifting up
  float angle = u_time * 0.15;
  mat2 rot = mat2(cos(angle), - sin(angle), sin(angle), cos(angle));
  vec2 pixel = (rot * uv + 0.5) * clusters;

  float q = fbm(pixel - u_time * 0.1);
  vec2 r = vec2(fbm(pixel + q + u_time * speed.x - pixel.x - pixel.y), fbm(pixel + q - u_time * speed.y));
  vec3 color = mix(c1, c2, fbm(pixel + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);

  // gentle breathing density
  float pulse = 0.85 + 0.15 * sin(u_time * 0.6);
  // radial vignette, dense center fading to the edges
  float vignette = smoothstep(0.7, 0.1, length(uv));

  outColor = vec4(color * pulse * vignette, alpha);
}