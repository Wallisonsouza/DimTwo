import { Transform } from "@engine/modules/3D/Transform";
import { Entity } from "./Entity";

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

  clone(): GameEntity {
    return new GameEntity({
      name: this.name,
      tag: this.tag,
      active: this.active,
    });
  }
}
