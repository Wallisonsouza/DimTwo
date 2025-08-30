#version 300 es
precision mediump float;

in vec2 vUV;
out vec4 outColor;

uniform vec4 uColor;        // Cor base da água
uniform float uTime;        // Tempo para animação
uniform vec2 uWorldOffset;  // Offset global em unidades do mundo
uniform vec2 uTileSize;     // Tamanho do tile em unidades do mundo
uniform float uWaveScale;   // Densidade das ondas

// Ruído hash rápido
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Ruído value noise simplificado
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Geração de ondas cartoon
float cartoonWaves(vec2 uv, float time) {
    float wave = 0.0;
    wave += 0.2 * sin(uv.x * 6.0 + time);
    wave += 0.1 * sin(uv.y * 8.0 + time * 1.2);
    wave += 0.05 * sin((uv.x + uv.y) * 10.0 - time * 0.8);
    wave += 0.05 * noise(uv * 2.0 + time * 0.1);
    return wave;
}

// Normal cartoon simplificado
vec3 computeNormal(vec2 uv, float time) {
    float e = 0.02;
    float c = cartoonWaves(uv, time);
    float cx = cartoonWaves(uv + vec2(e, 0.0), time);
    float cy = cartoonWaves(uv + vec2(0.0, e), time);
    vec3 n = normalize(vec3(cx - c, cy - c, e));
    return n;
}

void main() {
    float time = uTime * 0.7;

    vec2 uvGlobal = vUV * uTileSize + uWorldOffset;
    vec2 uv = uvGlobal * uWaveScale;

    vec3 normal = computeNormal(uv, time);

    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0) * 0.6 + 0.4;

    // Cores cartoon saturadas
    vec3 shallowColor = vec3(0.0, 0.6, 0.9);
    vec3 deepColor = vec3(0.0, 0.2, 0.5);

    float depth = 0.5 + 0.5 * cartoonWaves(uv * 0.3, time * 0.5);
    vec3 waterColor = mix(shallowColor, deepColor, depth);

    vec3 skyColor = vec3(0.4, 0.7, 1.0);

    // Reflexo cartoon leve
    vec3 reflectedColor = mix(waterColor, skyColor, fresnel);

    // Brilho cartoon suave
    vec3 lightDir = normalize(vec3(-0.3, 0.5, 0.7));
    float highlight = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 20.0) * 0.4;
    reflectedColor += vec3(1.0, 0.9, 0.7) * highlight;

    // Ajusta saturação com uColor
    reflectedColor = mix(reflectedColor, uColor.rgb, 0.3);

    outColor = vec4(reflectedColor, uColor.a);
}
