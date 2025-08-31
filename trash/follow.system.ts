// import type { setAnimatorState } from "../../../core/gears/animator";
// import type { SpriteRenderComponent } from "../../../core/gears/render/sprite_render";
// import type TransformComponent from "../../../core/gears/transform/transform.types";
// import Vec2Math from "../../../core/helpers/vec2-math";
// import Time from "../../../core/time/time";
// import { ComponentType } from "../../../core/types/component-type";
// import type { GameEntity } from "../../../core/types/EngineEntity";
// import { ECS, Types } from "../../../engine/TwoD";
// import type { AnimatorComponent } from "../../../engine/types";

// export default function FollowSystem(
//     playerId: GameEntity,
//     enemyIds: GameEntity[],
//     baseSpeed: number,
//     followRange: number = 300,
//     stopRange: number = 10
// ): Types.System {
//     return {
//         update() {
//             const playerTransform = ECS.Component.getComponent<TransformComponent>(playerId, ComponentType.TRANSFORM);
//             if (!playerTransform || !playerTransform.enabled) return;

//             for (const slimeId of enemyIds) {
//                 const slimeTransform = ECS.Component.getComponent<TransformComponent>(slimeId, ComponentType.TRANSFORM);
//                 if (!slimeTransform) continue;

//                 const animator = ECS.Component.getComponent<AnimatorComponent>(slimeId, ComponentType.ANIMATOR);
//                 if (!animator) continue;

//                 const spriteRender = ECS.Component.getComponent<SpriteRenderComponent>(slimeId, ComponentType.SPRITE_RENDER);

//                 const dist = Vec2Math.distance(slimeTransform.position, playerTransform.position);

//                 if (dist <= followRange && dist > stopRange) {
//                     let direction = Vec2Math.normalize(Vec2Math.subtract(playerTransform.position, slimeTransform.position));

//                     slimeTransform.position.x += direction.x * baseSpeed * Time.deltaTime;
//                     slimeTransform.position.y += direction.y * baseSpeed * Time.deltaTime;

//                     // FLIP HORIZONTAL baseado na direção x
//                     if (spriteRender) {
//                         if (direction.x < -0.1) {
//                             spriteRender.flipHorizontal = true;  // olhando para esquerda
//                         } else if (direction.x > 0.1) {
//                             spriteRender.flipHorizontal = false; // olhando para direita
//                         }
//                     }

//                     setAnimatorState(animator, "move");
//                 } else {
//                     setAnimatorState(animator, "idle");
//                 }
//             }
//         },
//     };
// }
