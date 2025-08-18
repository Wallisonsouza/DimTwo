#version 300 es
precision mediump float;

in vec2 vUV;
out vec4 outColor;

uniform sampler2D uTexture; // atlas MSDF
uniform vec4 uColor;        // cor do texto (rgba)

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main() {
    vec3 texture = texture(uTexture, vUV).rgb;
    float sigDist = median(texture.r, texture.g, texture.b) - 0.5;

    float smoothing = fwidth(sigDist) * 0.8;
    float alpha = smoothstep(-smoothing, smoothing, sigDist);

    // Descarta pixels quase transparentes para performance
    if (alpha < 0.01) {
        discard;
    }

    // Correção gamma opcional (descomente se usar pipeline sRGB)
    // alpha = pow(alpha, 1.0 / 2.2);

    outColor = vec4(uColor.rgb, alpha * uColor.a);
}
