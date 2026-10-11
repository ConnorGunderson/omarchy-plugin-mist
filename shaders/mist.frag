#version 440

layout(location = 0) in vec2 qt_TexCoord0;
layout(location = 0) out vec4 fragColor;

layout(std140, binding = 0) uniform buf {
    mat4 qt_Matrix;
    float qt_Opacity;
    float time;
    float aspect;
    float strength;
    vec4 tint;
};

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = p * 2.03 + vec2(17.1, 9.2);
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = qt_TexCoord0 * vec2(aspect, 1.0) * 1.6;

    // Two banks drifting slowly in different directions, each warped by the
    // other, so the mist folds instead of sliding like a scrolling texture.
    vec2 q = vec2(fbm(uv + vec2(time * 0.025, time * 0.010)),
                  fbm(uv + vec2(-time * 0.015, time * 0.020) + 5.2));
    float d = fbm(uv + 1.6 * q + vec2(time * 0.030, 0.0));

    // Keep only the thicker wisps, and let them gather low in the frame.
    d = smoothstep(0.15, 0.65, d);
    d *= mix(0.55, 1.0, smoothstep(0.0, 1.0, qt_TexCoord0.y));

    float a = d * strength * qt_Opacity;
    fragColor = vec4(tint.rgb * a, a);
}
