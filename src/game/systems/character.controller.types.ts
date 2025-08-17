import { Component } from "../../engine/core/base/Component";
import { Vec2 } from "../../engine/core/math/Vec2";
import { ComponentGroup } from "../../engine/modules/enums/ComponentGroup";
import { ComponentType } from "../../engine/modules/enums/ComponentType";

export type CharacterState = "idle" | "walking" | "attacking";
export type FacingDirection = "up" | "down" | "side";

export class CharacterControler2D extends Component {
  direction: Vec2;
  speed: number;
  runSpeed: number;
  moving: boolean;
  state: CharacterState;
  facing: FacingDirection;

  constructor() {
    super(ComponentType.CharacterController, ComponentGroup.Controller);
    this.direction = new Vec2(0, 0);
    this.speed = 0.5;
    this.runSpeed = 1;
    this.moving = false;
    this.state = "idle";
    this.facing = "down";
  }

  clone(): CharacterControler2D {
    const clone = new CharacterControler2D();
    clone.direction = this.direction.clone(); 
    clone.speed = this.speed;
    clone.runSpeed = this.runSpeed;
    clone.moving = this.moving;
    clone.state = this.state;
    clone.facing = this.facing;
    return clone;
}

}
