import type { Component } from "@engine/core/base/Component";
import type { GameEntity } from "@engine/core/base/GameEntity";
import { System } from "@engine/core/base/System";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Scene } from "@engine/core/scene/scene";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { Animator } from "@engine/modules/shared/animator/Animator";

export class ECS {
  public static getComponentInScene<T extends Component>(scene: Scene, target: GameEntity, type: ComponentType) {
    return scene.components.getComponent(target, type) as T | null;
  }
}

enum EnemyState {
  Idle = "Idle",
  Chasing = "Chasing",
  Attacking = "Attacking",
}

export class FollowSystem extends System {
  player: GameEntity | null = null;
  enemy: GameEntity | null = null;

  enemyAnimator: Animator | null = null;

  state: EnemyState = EnemyState.Idle;

  followRange: number = 5;
  stopRange: number = 0.5;
  speed: number = 0.3;

  start(): void {

    this.player = this.engine.entities.getByTag("Player");
    this.enemy = this.engine.entities.getByTag("Enemy");

    if (!this.enemy) return;

    this.enemyAnimator = ECS.getComponentInScene<Animator>(
      this.engine.activedScene,
      this.enemy,
      ComponentType.Animator
    );

  }

  update(dt: number): void {
    if (!this.player || !this.enemy || !this.enemyAnimator) return;


    const playerPos = this.player.transform.position;
    const enemyPos = this.enemy.transform.position;
    const dist = Vec3.distanceTo(playerPos, enemyPos);

    if (dist > this.followRange) {
      this.state = EnemyState.Idle;
    } else if (dist > this.stopRange) {
      this.state = EnemyState.Chasing;
    } else {
      this.state = EnemyState.Attacking;
    }

    switch (this.state) {
      case EnemyState.Chasing:
        this.moveTowards(enemyPos, playerPos, dt);
        this.enemyAnimator.setAnimatorState("move");
        break;
      case EnemyState.Attacking:

        break;
      case EnemyState.Idle:
        this.enemyAnimator.setAnimatorState("idle");
        break;
      default:

        break;
    }

    console.log("Enemy State:", this.state);
  }

  private moveTowards(from: Vec3, to: Vec3, dt: number): void {
    const offset = Vec3.sub(to, from);
    const direction = Vec3.normalize(offset);
    from.x += direction.x * this.speed * dt;
    from.y += direction.y * this.speed * dt;

  }
}
