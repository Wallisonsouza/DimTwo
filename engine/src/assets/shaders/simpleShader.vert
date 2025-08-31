#version 300 es
precision highp float;

in vec3 aPosition;
in vec2 aUV;

uniform mat4 uProjection; 
uniform mat4 uView; 
uniform mat4 uModel; 

out vec2 vUV;
uniform mat4 U_VIEW_PROJECTION_MATRIX; 
void main() {

    gl_Position = U_VIEW_PROJECTION_MATRIX * uModel * vec4(aPosition, 1.0);
    vUV = aUV;
}
