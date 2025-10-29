import { GenericManager } from "../core/managers/generic_manager";
import type { Sprite2D } from "../modules/2D/Sprite2D";
import type { Material } from "../Rendering/Material";

export class ResourcesManager {
  public static readonly MaterialManager = new GenericManager<string, Material>("material_manager");
  public static readonly SpriteManager = new GenericManager<string, Sprite2D>("sprite_manager");

  public static clearAll() {
    this.MaterialManager.values.clear();
    this.SpriteManager.values.clear();
  }
}
