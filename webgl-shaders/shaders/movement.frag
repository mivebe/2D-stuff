#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
out vec4 outColor;

float circeShape(vec2 position, float radius) {
    return step(radius, length(position - vec2(0.5)));
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution.x;
    vec3 color = vec3(0.0);

    vec2 translate = vec2(0.3, -0.2);
    coord += translate;
    
    color += vec3(circeShape(coord, 0.3));
    
    outColor = vec4(color, 1.0);
}