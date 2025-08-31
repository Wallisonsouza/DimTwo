
import { Mulberry32 } from "@engine/core/algorithms/mulberry32/mulberry32";
import type { Component } from "@engine/core/base/Component";
import { GameEntity } from "@engine/core/base/GameEntity";
import { System } from "@engine/core/base/System";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Scene } from "@engine/core/scene/scene";
import { SpriteRender } from "@engine/modules/components/render/SpriteRender";
import { Transform } from "@engine/modules/components/spatial/Transform";
import type { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { BiomeName } from "@game/enums/BiomeName";
import { getBiomeColor } from "./biome";
import { GRASS_0_PREFAB, GROUND_PREFAB, OAK_TREE_PREFAB, type Prefab } from "./Prefab";
import { World, type TerrainCell } from "./Word";

export class EasyGetter {
  public static getSpriteRender(scene: Scene, entity: GameEntity): SpriteRender | null {
    return scene.components.getComponent<SpriteRender>(entity.id.getValue(), ComponentType.SpriteRender);

  }

  public static getAllByGroup<T extends Component>(scene: Scene, group: ComponentGroup): T[]  {
    return scene.components.getAllByGroup<T>(group);
  }

  public static getTransform(scene: Scene, entity: GameEntity): Transform | null {
    return scene.components.getComponent<Transform>(entity.id.getValue(), ComponentType.Transform);
  }

    public static getEntity(scene: Scene, component: Component): GameEntity | null {
    return scene.entities.getById(component.gameEntity.id.getValue());
  }
}


export class TerrainSystem extends System {
  private world = new World(1221435);

  start() {

    const scene = this.getScene();
    const playerEntity = scene.entities.getByTag("Player");

    if (!playerEntity) {
      return
    }

    const cells = this.world.generateCells(32, 32, 0, 0);

    generateGrounds(scene, cells)

    generateTrees(this.getScene(), cells, new Vec2(0, 0))
  }
}
function generateGrounds(
  scene: Scene,
  terrainCells: TerrainCell[],
): void {
  for (const cell of terrainCells) {
    const entity = scene.instantiate(GROUND_PREFAB, cell.position);
    if (!entity) return;

    const spriteRender = EasyGetter.getSpriteRender(scene, entity);
    if (spriteRender === null) return;
    spriteRender.color = getBiomeColor(cell.biome ?? BiomeName.DEEP_WATER);
  }
}

function seedFromXY(x: number, y: number): number {
  const PRIME1 = 73856093;
  const PRIME2 = 19349663;
  return (x * PRIME1) ^ (y * PRIME2);
}


interface BiomePrefab {
  prefab: Prefab;
  offset: Vec3;
  chance: number; // 0 a 1
}

const biomeTrees: Record<BiomeName, BiomePrefab[]> = {
  [BiomeName.FOREST]: [
    { prefab: OAK_TREE_PREFAB, chance: 0.2, offset: new Vec3(0.25, 1.25, 0) },
  /*   { prefab: BUSHE_0_PREFAB, chance: 0.3, offset: new Vec3(0, 0, 0) },
    { prefab: BUSHE_1_PREFAB, chance: 0.1, offset: new Vec3(0, 0, 0) },
    { prefab: BUSHE_2_PREFAB, chance: 0.4, offset: new Vec3(0, 0, 0) },
    { prefab: BUSHE_3_PREFAB, chance: 0.2, offset: new Vec3(0, 0, 0) },
    { prefab: BUSHE_4_PREFAB, chance: 0.2, offset: new Vec3(0, 0, 0) },
    { prefab: BUSHE_5_PREFAB, chance: 0.2, offset: new Vec3(0, 0, 0) },
    { prefab: BUSHE_6_PREFAB, chance: 0.2, offset: new Vec3(0, 0, 0) } */

  ],
  [BiomeName.DEEP_WATER]: [],
  [BiomeName.SHALLOW_WATER]: [],
  [BiomeName.SAND]: [ { prefab: GRASS_0_PREFAB, chance: 0.7, offset: new Vec3(0, 0, 0) },],
  [BiomeName.GRASSLAND]: [
   
  ],
  [BiomeName.FLOWER_FIELD]: [],
  [BiomeName.SPARSE_FOREST]: [],
  [BiomeName.DENSE_FOREST]: [],
  [BiomeName.SWAMP]: [],
  [BiomeName.SAVANNA]: [],
  [BiomeName.TAIGA]: [],
  [BiomeName.MOUNTAIN]: [],
  [BiomeName.SNOW]: [],
  [BiomeName.TUNDRA]: []
};


function generateTrees(scene: Scene, terrainCells: TerrainCell[], chunkPos: Vec2) {
  const seed = seedFromXY(chunkPos.x, chunkPos.y);
  const rng = new Mulberry32(seed);

  for (const cell of terrainCells) {
    if (!cell.biome) continue;

    const prefabs = biomeTrees[cell.biome];
    if (!prefabs || prefabs.length === 0) continue;

    for (const entry of prefabs) {
      if (rng.nextFloat() < entry.chance) {

        const tempVec3 = new Vec3();
        Vec3.add(tempVec3, entry.offset, cell.position);

        const entity = scene.instantiate(entry.prefab, tempVec3);
        if (!entity) break;

        const sprite = EasyGetter.getSpriteRender(scene, entity);
        if (!sprite) break;
        sprite.layer = -cell.position.y;

        scene.addEntity(entity);
        break;
      }
    }
  }

}
