#version 300 es
precision highp float;

uniform vec3 uResolution;
uniform float uTime;
uniform float uPulse;
uniform vec3 uColor;
uniform float uFuzz;
uniform float uScale;
uniform float uGlow;

uniform vec4 uCenterColor;
uniform float uClearCenter; // New uniform for center clear
uniform float uClearRadius; // New uniform for clear radius
uniform int uWaveDensity;
uniform float uWaveTexture;


// Name must match the vertex shader's output
in vec2 vUV; 

out vec4 FragColor;

vec4 custom_tanh(vec4 x) {
    return (exp(x) - exp(-x)) / (exp(x) + exp(-x));
}

void main() {
    float a, d, s, t = uTime;
    vec3 p, r = uResolution;

    vec4 o = vec4(0.0);
    d = 0.0;
    s = 0.0;
    
    // Use vUV for the position calculation
    vec2 u = vUV * r.xy;

    for (float i = 0.0; i < 100.0; i++) {
        d += s = .02 + abs(s) * 0.4;
        o += vec4(1, 2.7 - cos(.5) * 1.6, 1.8, 0.3) / s;
        
        p = vec3(((u - r.xy / 2.0) / r.y + vec2(0.02, 0.03)) * (d + uPulse) * uScale, (d - 8.0) * uScale);
        s = length(p) - 3.0;

        for (int k = 0; k < 2; k++) {
            float a_inner = pow(2.0, float(k + uWaveDensity));
            p += cos(0.005 * t + a_inner + p.yzx * uWaveTexture) * uFuzz;
            s -= abs(dot(sin(1.54 * t + p * a_inner * 0.8), 0.05 + p - p)) / a_inner * 4.0;
        }
    }

    vec4 finalColor = custom_tanh(o * uGlow / 1.5e4) * vec4(uColor, 1.0);
    
    // Calculate the distance from the center
    float dist = length(u - r.xy / 2.0) / r.y;
    
    // Use smoothstep to create a smooth falloff
    float blendFactor = smoothstep(uClearRadius - uClearCenter, uClearRadius, dist);
    
    // Set the center color (e.g., black)
    vec4 centerColor = vec4(uCenterColor);
    
    // Blend the final color with the center color
    FragColor = mix(vec4(uCenterColor), finalColor, blendFactor);
}