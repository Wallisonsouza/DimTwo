
import { GenericManager } from "../../core/managers/generic_manager";
import type { MaterialType, MeshType, SpriteType } from "../../modules/resources";
import type { ShaderSystem } from "../../modules/resources/shader/ShaderSystem";

export class ResourcesManager {
    public static readonly MaterialManager = new GenericManager<string, MaterialType>("material_manager");
    public static readonly MeshManager = new GenericManager<string, MeshType>("mesh_manager");
    public static readonly ShaderSystemManager = new GenericManager<string, ShaderSystem>("shader_system_manager");
    public static readonly SpriteManager = new GenericManager<string, SpriteType>("sprite_manager");

    public static clearAll() {
        this.MaterialManager.values.clear();
        this.MeshManager.values.clear();
        this.ShaderSystemManager.values.clear();
        this.SpriteManager.values.clear();
    }
}
