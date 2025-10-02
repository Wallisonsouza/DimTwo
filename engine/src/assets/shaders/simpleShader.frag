#version 300 es
precision highp float;
precision highp int;

in vec2 ENGINE_UV;
out vec4 outColor;
uniform vec4 ENGINE_COLOR;

void main() {
  outColor = ENGINE_COLOR;
}
