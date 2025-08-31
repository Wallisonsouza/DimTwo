/* import { CIRCLE_SPRITE } from "../../engine/assets/sprites/circle.sprite";
import { SQUARE_SPRITE } from "../../engine/assets/sprites/square.sprite";
import { TRIANGLE_SPRITE } from "../../engine/assets/sprites/triangle.sprite";
import { Builder } from "../../engine/core";
import { Color } from "../../engine/core/math/color/color";
import { SceneManager } from "../../engine/core/scene/SceneManager";
import type { Sprite } from "../../engine/modules/resources/sprite";

export function createPrimitive(
  name: string,
  sprite: Sprite

) {

  const scene =SceneManager.getCurrentScene();
  if (scene == null) return;

  const componentState = scene.ECSComponents;

  const gameEntity = Builder.BuildGameEntity(name, "Player");

  const transform = Builder.createTransform(gameEntity);
  ComponentState.addComponent(componentState, gameEntity, transform);

  const spriteRender = Builder.createSpriteRender(gameEntity, {
    layer: 1,
    material: "advancedMaterial",
    sprite: sprite,
    color: Color.random()
  });
  ComponentState.addComponent(componentState, gameEntity, spriteRender);

  return gameEntity;
}

export const Primitives = {
  circle: createPrimitive("circle_primitive", CIRCLE_SPRITE),
  square: createPrimitive("square_primitive", SQUARE_SPRITE),
  triangle: createPrimitive("triangle_primitive", TRIANGLE_SPRITE),
} */