#version 300 es
precision lowp float;

layout(location = 0) in vec3 aPosition;

uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uModel;
void main() {
    gl_Position = uProjection *  inverse(uView) * uModel * vec4(aPosition, 1.0);
}
