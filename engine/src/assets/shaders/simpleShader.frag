#version 300 es
precision highp float;

in vec2 vUV;
out vec4 outColor;
uniform vec4 uColor;

void main() {
     outColor = uColor;
}
