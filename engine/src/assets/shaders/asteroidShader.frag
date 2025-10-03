#version 300 es
precision highp float;
precision highp int;

in vec2 ENGINE_UV;
out vec4 outColor;

// --- hash / noise simples ---
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) { // aumentei as oitavas para mais detalhe
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    // Coordenadas pixeladas
    vec2 uv = ENGINE_UV * 8.0; // escala do tile
    float pixelSize = 1.0 / 40.0;
    uv = floor(uv / pixelSize) * pixelSize;

    // Camadas em função do fbm (escala maior no fbm para mais detalhe)
    float val = fbm(uv * 0.5);

    // Paleta mais cinza
    vec3 palette[4];
    palette[0] = vec3(0.12, 0.12, 0.12); // quase preto
    palette[1] = vec3(0.30, 0.30, 0.30); // cinza escuro
    palette[2] = vec3(0.50, 0.50, 0.50); // cinza médio
    palette[3] = vec3(0.72, 0.72, 0.72); // cinza claro

    // Divide o valor em bandas sólidas
    int idx = int(floor(val * 4.0));
    vec3 rock = palette[clamp(idx, 0, 3)];

    outColor = vec4(rock, 1.0);
}
