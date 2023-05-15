#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 res;
uniform vec2 mouse;
uniform float time;

void main() {
    vec2 coord = gl_FragCoord.xy / res.xy;
    float aspect = res.x / res.y;
    
    coord.x -= mouse.x / res.x;
    coord.y -= 1.0 - (mouse.y / res.y);  // reversed due to reversed coordinate systems
    
    float color = 0.0;
    
    color += 0.1 * (sin(time * 2.0) + 0.01 / (pow(coord.x, 2.0) * aspect + pow(coord.y, 2.0) / aspect));
    gl_FragColor = vec4(vec3(color), 1.0);
}