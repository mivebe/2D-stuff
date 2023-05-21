#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.1415926535;
uniform vec2 u_resolution;
out vec4 outColor;

float polyShape(vec2 position, float radius, float sides) {
  position = position * 2.0 - 1.0;
  float angle = atan(position.x, position.y);
  float slice = PI * 2.0 / sides;
  
  return step(radius, cos(floor(0.5 + angle / slice) * slice - angle) * length(position));
}

void main() {
  vec2 position = gl_FragCoord.xy / u_resolution.x;
  
  float polygon = polyShape(position, 0.6, 6.0);
  
  vec3 color = vec3(polygon);
  
  outColor = vec4(color, 1.0);
}