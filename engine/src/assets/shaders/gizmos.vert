#version 300 es
precision highp float;

layout(location = 0) in vec3 aPosition;

uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 U_VIEW_PROJECTION_MATRIX; 
void main() {
    gl_Position = U_VIEW_PROJECTION_MATRIX * uModel * vec4(aPosition, 1.0);
}
