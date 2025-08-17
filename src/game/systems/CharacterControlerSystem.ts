
import { System } from "../../engine/core/base/System";
import { Vec2 } from "../../engine/core/math/Vec2";
import type { Transform } from "../../engine/modules/components/spatial/Transform";
import { ComponentType } from "../../engine/modules/enums/ComponentType";
import { WebKeyCode } from "../../engine/modules/webInput/WebKeyCode";
import { CharacterControler2D } from "./character.controller.types";
import { Input } from "./InputSystem";

export class CharacterControlerSystem extends System {
  update(dt: number) {


    const components = this.getScene().components;

    const characterControlers = components.getAllOfType<CharacterControler2D>(
      ComponentType.CharacterController
    );
    for (const characterControler of characterControlers) {

      const characterTransform = components.getComponent<Transform>(
        characterControler.getEntityID(),
        ComponentType.Transform
      );
      if (!characterTransform) continue;


      characterControler.direction.x = 0;
      characterControler.direction.y = 0;

      if (Input.keyboard.getKey(WebKeyCode.KeyA)) characterControler.direction.x -= 1;
      if (Input.keyboard.getKey(WebKeyCode.KeyD)) characterControler.direction.x += 1;
      if (Input.keyboard.getKey(WebKeyCode.KeyW)) characterControler.direction.y += 1;
      if (Input.keyboard.getKey(WebKeyCode.KeyS)) characterControler.direction.y -= 1;

      Vec2.normalize(characterControler.direction, characterControler.direction);
      const speed = Input.keyboard.getKey(WebKeyCode.ShiftLeft)
        ? characterControler.runSpeed
        : characterControler.speed;


      const deltaX = characterControler.direction.x * speed * dt;
      const deltaY = characterControler.direction.y * speed * dt;

      characterTransform.position.x += deltaX;
      characterTransform.position.y += deltaY;

    }
  }
}
