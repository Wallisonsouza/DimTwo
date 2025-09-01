import type { TextureBuffer } from "@engine/core/webgl/TextureBuffer";
import { EngineResourceManager } from "../core/managers/EngineResourceManager";
import { Mathf } from "../core/math/Mathf";


export class Texture {
    public name: string;
    public width: number;
    public height: number;
    public format: GLenum;
    public internalFormat: GLenum;
    public type: GLenum;
    public minFilter: GLenum;
    public magFilter: GLenum;
    public wrapS: GLenum;
    public wrapT: GLenum;
    public mipmaps: boolean;
    public imageName: string;

    constructor(
        name: string,
        imagename: string,
        format: GLenum = WebGL2RenderingContext.RGBA,
        internalFormat: GLenum = WebGL2RenderingContext.RGBA8,
        type: GLenum = WebGL2RenderingContext.UNSIGNED_BYTE,
        minFilter: GLenum = WebGL2RenderingContext.NEAREST,
        magFilter: GLenum = WebGL2RenderingContext.NEAREST,
        wrapS: GLenum = WebGL2RenderingContext.CLAMP_TO_EDGE,
        wrapT: GLenum = WebGL2RenderingContext.CLAMP_TO_EDGE,
        mipmaps: boolean = false
    ) {
        this.mipmaps = mipmaps;
        this.name = name;
        this.imageName = imagename;
        this.width = 0;
        this.height = 0;
        this.format = format;
        this.internalFormat = internalFormat;
        this.type = type;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
    }

    /*     setFilters(gl: WebGL2RenderingContext, minFilter: GLenum, magFilter: GLenum) {
            this.minFilter = minFilter;
            this.magFilter = magFilter;
            if (!this.gpuData) return;
            gl.bindTexture(gl.TEXTURE_2D, this.gpuData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    
        setWrap(gl: WebGL2RenderingContext, wrapS: GLenum, wrapT: GLenum) {
            this.wrapS = wrapS;
            this.wrapT = wrapT;
            if (!this.gpuData) return;
            gl.bindTexture(gl.TEXTURE_2D, this.gpuData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    
        destroy(gl: WebGL2RenderingContext) {
            if (this.gpuData) {
                gl.deleteTexture(this.gpuData);
                this.gpuData = null;
            }
        }
     */
    public compile(gl: WebGL2RenderingContext) {

        const image = EngineResourceManager.get<HTMLImageElement>(this.imageName);
        if (!image) return;

        const texture = gl.createTexture();
        if (!texture) throw new Error("Failed to create WebGLTexture");
        this.width = image.width;
        this.height = image.height;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            this.internalFormat,
            this.format,
            this.type,
            image
        );

        const isPOT = Mathf.isPowerOfTwo(this.width) && Mathf.isPowerOfTwo(this.height);


        if (!isPOT) {
            if (this.wrapS !== gl.CLAMP_TO_EDGE || this.wrapT !== gl.CLAMP_TO_EDGE) {
                console.warn("Texture is NPOT; forcing wrapS/wrapT to CLAMP_TO_EDGE");
                this.wrapS = gl.CLAMP_TO_EDGE;
                this.wrapT = gl.CLAMP_TO_EDGE;
            }
            if (this.mipmaps) {
                console.warn("Texture is NPOT; mipmaps are not supported and will be ignored");
                this.mipmaps = false;
            }
        } else if (this.mipmaps) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);

        gl.bindTexture(gl.TEXTURE_2D, null);


        const textureBuffer: TextureBuffer = {
            gpuData: texture,
            width: this.width,
            height: this.height
        }
        return textureBuffer;
    }
}

