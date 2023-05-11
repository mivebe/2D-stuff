precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
// uniform vec2 resolution;
// uniform float time;
// uniform float alpha;
// uniform float shift;
// uniform vec2 speed;

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
  // some predefined vars that can be omitted if sent to PIXI.AbstractFilter as uniforms.
  
  float alpha = 1.0;
  // The color shifting step size.
  float shift = 1.6;
  // The color shift speed.
  vec2 speed = vec2(0.7, 0.4);
  // Defines how many are the clusters of smoke in the display area.
  float clusters = 8.0;
  float density = 1.0;

  // A bunch of colors for pixel shifting
  const vec3 c1 = vec3(126.0 / 255.0, 0.0 / 255.0, 97.0 / 255.0);
  const vec3 c2 = vec3(173.0 / 255.0, 0.0 / 255.0, 161.4 / 255.0);
  const vec3 c3 = vec3(0.2, 0.0, 0.0);
  const vec3 c4 = vec3(164.0 / 255.0, 1.0 / 255.0, 214.4 / 255.0);
  const vec3 c5 = vec3(0.1);
  const vec3 c6 = vec3(0.9);
  
  // This is how "packed" the smoke is in the display area.
  vec2 pixel = gl_FragCoord.xy * clusters / u_resolution.xx;

  // The fbm function takes pixel as its seed (so each pixel looks different) and time (so it shifts over time)
  float q = fbm(pixel - u_time * 0.1);
  vec2 r = vec2(fbm(pixel + q + u_time * speed.x - pixel.x - pixel.y), fbm(pixel + q - u_time * speed.y));
  vec3 color = mix(c1, c2, fbm(pixel + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
  float gradient = gl_FragCoord.y / u_resolution.y;
  gl_FragColor = vec4(color * cos(shift * gl_FragCoord.y / u_resolution.y), alpha);
  gl_FragColor.xyz *= density - gradient;
}