import { System } from "@engine/core/base/System";
import type { SpriteRender } from "@engine/modules/2D/SpriteRender";
import type { Animator } from "@engine/modules/components/animation/Animator";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { WebKeyCode } from "@engine/modules/webInput/WebKeyCode";
import { CharacterControler2D } from "./character.controller.types";
import { Input } from "./InputSystem";


export class CharacterControllerAnimationSystem extends System {

    lateUpdate() {
        const scene = this.getScene();
        const components = scene.components;

        const characterControlers = components.getAllOfType<CharacterControler2D>(ComponentType.CharacterController);

        for (const characterControler of characterControlers) {

            const entityID = characterControler.gameEntity.id.getValue();

            const spriteRender = components.getComponent<SpriteRender>(
                entityID,
                ComponentType.SpriteRender
            );
            if (!spriteRender) continue;

            const animator = components.getComponent<Animator>(
                entityID,
                ComponentType.Animator
            );
            if (!animator) continue;

            animator.playbackSpeed = Input.keyboard.getKey(WebKeyCode.ShiftLeft) ? 1.5 : 1.0;

            const dir = characterControler.direction;

            if (characterControler.direction.x < 0) spriteRender.flipHorizontal = true;
            else if (characterControler.direction.x > 0) spriteRender.flipHorizontal = false;

            if (dir.x !== 0 || dir.y !== 0) {
                if (dir.x !== 0) {
                    animator.setAnimatorState("walk_side");
                } else if (dir.y < 0) {
                    animator.setAnimatorState("walk_back");
                } else if (dir.y > 0) {
                    animator.setAnimatorState("walk_front");

                }
            } else {
                animator.setAnimatorState("idle");
            }
        }
    }
}




