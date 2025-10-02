
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



}

