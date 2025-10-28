import { Transform } from "@engine/modules/3D/Transform";
import { Entity } from "./Entity";
import { Scene } from "../scene/scene";

export interface GameEntityOptions {
  name?: string;
  tag?: string;
  active?: boolean;
  static?: boolean;
}

export class GameEntity extends Entity {
  public readonly transform: Transform = new Transform();

  tag: string;
  active: boolean;
  name: string;
  static: boolean;

  constructor(options: GameEntityOptions = {}) {
    super();
    this.name = options.name ?? "";
    this.tag = options.tag ?? "";
    this.active = options.active ?? true;
    this.static = options.static ?? false;
    this.transform.gameEntity = this;
  }

  public static getComponent() {
    return Scene.getLoadedScene().entities.getById
  }

  public static getGameEntityById(id: number) {
    return Scene.getLoadedScene().entities.getById(id);
  }

  public static getGameEntityByName(name: string) {
    return Scene.getLoadedScene().entities.getByName(name);
  }

  public static getGameEntityByTag(tag: string) {
    return Scene.getLoadedScene().entities.getByTag(tag);
  }

  public static getAllGameEntities() {
    return Scene.getLoadedScene().entities.getAll();
  }

  clone(): GameEntity {
    return new GameEntity({
      name: this.name,
      tag: this.tag,
      active: this.active,
    });
  }
}
