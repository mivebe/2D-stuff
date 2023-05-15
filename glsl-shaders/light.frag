#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {
    vec2 coord = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    float asd = max(u_resolution.x, u_resolution.y) - min(u_resolution.x, u_resolution.y);
    
    coord.x -= u_mouse.x / u_resolution.x;
    coord.y -= u_mouse.y / u_resolution.y;
    
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
    
    color += 0.1 * (sin(u_time * 2.0) + 0.01 / (pow(coord.x, 2.0) * aspect + pow(coord.y, 2.0) / aspect));
    gl_FragColor = vec4(vec3(color), 1.0);
}