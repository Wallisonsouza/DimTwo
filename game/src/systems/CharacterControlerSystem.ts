
import { System } from "@engine/core/base/System";
import { Vec2 } from "@engine/core/math/Vec2";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { WebKeyCode } from "@engine/modules/webInput/WebKeyCode";
import { CharacterControler2D } from "./character.controller.types";

export class CharacterControlerSystem extends System {
  update(dt: number) {

    const input = this.engine.input;

    const components = this.getScene().components;
    const characterControlers = components.getAllOfType<CharacterControler2D>(
      ComponentType.CharacterController
    );

    for (const characterControler of characterControlers) {

      characterControler.direction.x = 0;
      characterControler.direction.y = 0;

      if (input.getKey(WebKeyCode.KeyA)) characterControler.direction.x -= 1;
      if (input.getKey(WebKeyCode.KeyD)) characterControler.direction.x += 1;
      if (input.getKey(WebKeyCode.KeyW)) characterControler.direction.y += 1;
      if (input.getKey(WebKeyCode.KeyS)) characterControler.direction.y -= 1;

      Vec2.normalize(characterControler.direction, characterControler.direction);
      const speed = input.getKey(WebKeyCode.ShiftLeft)
        ? characterControler.runSpeed
        : characterControler.speed;

      const deltaX = characterControler.direction.x * speed * dt;
      const deltaY = characterControler.direction.y * speed * dt;

      characterControler.transform.position.x += deltaX;
      characterControler.transform.position.y += deltaY;
    }
  }
}
