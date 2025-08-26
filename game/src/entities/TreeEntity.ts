import type { GameEntity } from "@engine/core/base/GameEntity";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Scene } from "@engine/core/scene/scene";
import { SpriteRender } from "@engine/modules/components/render/SpriteRender";
import { Transform } from "@engine/modules/components/spatial/Transform";
import type { Sprite } from "@engine/modules/resources/sprite/types";

const positionOffset: Vec3 = new Vec3(0,3, 0);

export function configureTreeEntity(
    scene: Scene,
    entity: GameEntity,
    sprite: Sprite,
    position: Vec3
) {

    const realPosition: Vec3 = new Vec3(0, 0, 0);
    Vec3.add(realPosition, position, positionOffset);

    const transform = new Transform({ position: realPosition, scale: new Vec3(2, 3, 0) });
    const spriteRener = new SpriteRender({
        layer: 1,
        sprite: sprite,
        material: "advancedMaterial",
    });

    scene.addComponent(entity, transform);
    scene.addComponent(entity, spriteRener);
}
