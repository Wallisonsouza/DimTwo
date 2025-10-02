#version 300 es
precision highp float;

in vec3 aPosition;
in vec2 aUV;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 ENGINE_MODEL_MATRIX;
uniform mat4 ENGINE_VIEW_PROJECTION_MATRIX;
out vec2 vUV;

void main() {

  gl_Position = ENGINE_VIEW_PROJECTION_MATRIX * ENGINE_MODEL_MATRIX * vec4(aPosition, 1.0);
  vUV = aUV;
}
