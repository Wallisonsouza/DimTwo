import { GenericManager } from "@engine/core/managers/generic_manager";
import type { Sprite2D } from "@engine/modules/2D/Sprite2D";
import type { Material } from "@engine/Rendering/Material";
import type { Mesh } from "@engine/Rendering/Mesh";
import type { ShaderSystem } from "@engine/Rendering/ShaderSystem";

export class ResourcesManager {
    public static readonly MaterialManager = new GenericManager<string, Material>("material_manager");
    public static readonly MeshManager = new GenericManager<string, Mesh>("mesh_manager");
    public static readonly ShaderSystemManager = new GenericManager<string, ShaderSystem>("shader_system_manager");
    public static readonly SpriteManager = new GenericManager<string, Sprite2D>("sprite_manager");

    public static clearAll() {
        this.MaterialManager.values.clear();
        this.MeshManager.values.clear();
        this.ShaderSystemManager.values.clear();
        this.SpriteManager.values.clear();
    }
}
