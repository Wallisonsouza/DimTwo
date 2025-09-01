import { GenericManager } from "@engine/core/managers/generic_manager";
import type { Material } from "@engine/modules/resources/material/Material";
import type { Mesh } from "@engine/modules/resources/mesh/Mesh";
import type { ShaderSystem } from "@engine/modules/resources/shader/ShaderSystem";
import type { Sprite } from "@engine/modules/resources/sprite/types";

export class ResourcesManager {
    public static readonly MaterialManager = new GenericManager<string, Material>("material_manager");
    public static readonly MeshManager = new GenericManager<string, Mesh>("mesh_manager");
    public static readonly ShaderSystemManager = new GenericManager<string, ShaderSystem>("shader_system_manager");
    public static readonly SpriteManager = new GenericManager<string, Sprite>("sprite_manager");

    public static clearAll() {
        this.MaterialManager.values.clear();
        this.MeshManager.values.clear();
        this.ShaderSystemManager.values.clear();
        this.SpriteManager.values.clear();
    }
}
