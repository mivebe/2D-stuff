#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
out vec4 outColor;

mat2 scale(vec2 scale) {
  return mat2(scale.x, 0.0, 0.0, scale.y);
}

float circleShape(vec2 position, float radius) {
  return step(radius, length(position - vec2(0.5)));
}

void main() {
  vec2 coord = gl_FragCoord.xy / u_resolution.x;
  vec3 color = vec3(0.0);
  
  coord = scale(vec2(sin(u_time) + 2.0)) * coord;
  
  color += vec3(circleShape(coord, 0.3));
  
  outColor = vec4(color, 1.0);
}