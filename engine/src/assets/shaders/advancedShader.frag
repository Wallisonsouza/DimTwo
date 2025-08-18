#version 300 es
precision mediump float;

in vec2 vUV;
out vec4 outColor;

uniform sampler2D uTexture;
uniform vec2 uUVOffset;
uniform vec2 uUVScale;
uniform vec4 uColor;

void main() {
    vec4 textureColor = texture(uTexture, vUV * uUVScale + uUVOffset);
    outColor = uColor * textureColor;
}
