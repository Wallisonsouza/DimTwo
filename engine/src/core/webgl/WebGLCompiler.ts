import { Texture } from "../../Rendering/Texture";
import { EngineResourceManager } from "../managers/EngineResourceManager";
import { Mathf } from "../math/Mathf";
import type { TextureBuffer } from "./TextureBuffer";

export class WebGLCompiler {
  public static compileTexture(gl: WebGL2RenderingContext, texture: Texture): TextureBuffer | null {
    const image = EngineResourceManager.get<HTMLImageElement>(texture.imageName);
    if (!image) return null;

    const glTex = gl.createTexture();
    if (!glTex) throw new Error("Failed to create WebGLTexture");

    texture.width = image.width;
    texture.height = image.height;

    gl.bindTexture(gl.TEXTURE_2D, glTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      texture.internalFormat,
      texture.format,
      texture.type,
      image
    );

    const isPOT = Mathf.isPowerOfTwo(texture.width) && Mathf.isPowerOfTwo(texture.height);

    if (!isPOT) {
      if (texture.wrapS !== gl.CLAMP_TO_EDGE || texture.wrapT !== gl.CLAMP_TO_EDGE) {
        console.warn("Texture is NPOT; forcing wrapS/wrapT to CLAMP_TO_EDGE");
        texture.wrapS = gl.CLAMP_TO_EDGE;
        texture.wrapT = gl.CLAMP_TO_EDGE;
      }
      if (texture.mipmaps) {
        console.warn("Texture is NPOT; mipmaps are not supported and will be ignored");
        texture.mipmaps = false;
      }
    } else if (texture.mipmaps) {
      gl.generateMipmap(gl.TEXTURE_2D);
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, texture.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, texture.wrapT);

    gl.bindTexture(gl.TEXTURE_2D, null);

    const textureBuffer: TextureBuffer = {
      gpuData: glTex,
      width: texture.width,
      height: texture.height
    };

    return textureBuffer;
  }

}