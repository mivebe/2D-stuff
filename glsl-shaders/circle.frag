#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
out vec4 outColor;

float circleshape(vec2 position, float radius) {
  return step(radius, length(position - vec2(0.5)));
}

void main() {
  vec2 position = gl_FragCoord.xy / u_resolution.x;
  vec3 color = vec3(0.0);
  
  float circle = circleshape(position, 0.3);
  
  color = vec3(circle);
  
  outColor = vec4(color, 1.0);
}