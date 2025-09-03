import type { GameEntity } from "@engine/core/base/GameEntity";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Scene } from "@engine/core/scene/scene";
import type { Sprite2D } from "@engine/modules/2D/Sprite2D";
import { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";
import { Transform } from "@engine/modules/3D/Transform";

const positionOffset: Vec3 = new Vec3(0,3, 0);

export function configureTreeEntity(
    scene: Scene,
    entity: GameEntity,
    sprite: Sprite2D,
    position: Vec3
) {

    const realPosition: Vec3 = new Vec3(0, 0, 0);
    Vec3.add(realPosition, position, positionOffset);

    const transform = new Transform({ position: realPosition, scale: new Vec3(2, 3, 0) });
    const spriteRener = new SpriteRender2D({
        layer: 1,
        sprite: sprite,
        material: "advancedMaterial",
    });

    scene.addComponent(entity, transform);
    scene.addComponent(entity, spriteRener);
}
