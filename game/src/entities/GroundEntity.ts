import { GameEntity } from "@engine/core/base/GameEntity";
import type { Color } from "@engine/core/math/Color";
import type { Vec3 } from "@engine/core/math/Vec3";
import type { Scene } from "@engine/core/scene/scene";
import { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";
import { Transform } from "@engine/modules/3D/Transform";


export function configureGroundEntity(
    scene: Scene,
    entity: GameEntity,
    color: Color,
    position: Vec3
) {
    const transform = new Transform({ position: position });
    const spriteRener = new SpriteRender2D({
        layer: 1,
        color: color,
        material: "simpleMaterial",
    });

    scene.addComponent(entity, transform);
    scene.addComponent(entity, spriteRener);
}
