#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
out vec4 outColor;

float rectShape(vec2 position, vec2 scale) {
  scale = vec2(0.5) - scale * 0.5;
  vec2 shaper = vec2(step(scale.x, position.x), step(scale.y, position.y));
  shaper *= vec2(step(scale.x, 1.0 - position.x), step(scale.y, 1.0 - position.y));
  
  return shaper.x * shaper.y;
}

void main() {
  
  vec2 position = gl_FragCoord.xy / u_resolution.x;
  vec3 color = vec3(0.0);
  float rectangle = rectShape(position, vec2(0.3, 0.3));
  color = vec3(rectangle);
  outColor = vec4(color, 1.0);
}