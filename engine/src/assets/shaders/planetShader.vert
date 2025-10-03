#version 300 es
precision highp float;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aUV;

uniform mat4 ENGINE_MODEL_MATRIX;
uniform mat4 ENGINE_VIEW_PROJECTION_MATRIX;

out vec2 ENGINE_UV;
void main() {

  gl_Position = ENGINE_VIEW_PROJECTION_MATRIX * ENGINE_MODEL_MATRIX * vec4(aPosition, 1.0);
  ENGINE_UV = aUV;
}