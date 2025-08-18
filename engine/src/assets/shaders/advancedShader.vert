#version 300 es
precision mediump float;

in vec3 aPosition;
in vec2 aUV;

uniform mat4 uProjection; 
uniform mat4 uView; 
uniform mat4 uModel; 

out vec2 vUV;

void main() {

    gl_Position = uProjection * inverse(uView) * uModel * vec4(aPosition, 1.0);
    vUV = aUV;
}
