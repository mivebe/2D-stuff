#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

float circeShape(vec2 position, float radius) {
    return step(radius, length(position - vec2(0.5)));
}

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution;
    vec3 color = vec3(0.0);

    vec2 translate = vec2(0.3, -0.15);
    coord += translate;
    
    color += vec3(circeShape(coord, 0.3));
    
    gl_FragColor = vec4(color, 1.0);
}