#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
out vec4 outColor;

float circeShape(vec2 position, float radius) {
    return step(radius, length(position - vec2(0.5)));
}

void main() {
    vec2 coord = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.x + 0.5;
    vec3 color = vec3(0.0);
    
    // small orbit so the circle stays on screen, offset a bit to the right
    vec2 translate = vec2(sin(u_time), cos(u_time)) * 0.12;
    coord -= vec2(0.15, 0.0) + translate;
    
    color += vec3(circeShape(coord, 0.15));
    
    outColor = vec4(color, 1.0);
}