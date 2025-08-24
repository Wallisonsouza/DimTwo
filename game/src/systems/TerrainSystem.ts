
import { Mulberry32 } from "@engine/core/algorithms/mulberry32/mulberry32";
import { GameEntity } from "@engine/core/base/GameEntity";
import { System } from "@engine/core/base/System";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Scene } from "@engine/core/scene/scene";
import { SpriteRender } from "@engine/modules/components/render/SpriteRender";
import { Transform } from "@engine/modules/components/spatial/Transform";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { BiomeName, getBiomeColor } from "./biome";
import { BUSHE_0_PREFAB, BUSHE_1_PREFAB, BUSHE_2_PREFAB, BUSHE_3_PREFAB, GROUND_PREFAB, OAK_TREE_PREFAB, PINE_TREE_PREFAB, type Prefab } from "./Prefab";
import { World, type TerrainCell } from "./Word";

export class EasyGetter {
  public static getSpriteRender(scene: Scene, entity: GameEntity): SpriteRender | null {
    return scene.components.getComponent<SpriteRender>(entity.id.getValue(), ComponentType.SpriteRender);

  }

  public static getTransform(scene: Scene, entity: GameEntity): Transform | null {
    return scene.components.getComponent<Transform>(entity.id.getValue(), ComponentType.Transform);

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

    const playerTranform = EasyGetter.getTransform(scene, playerEntity);
    if (!playerTranform) return;

    const cells = this.world.generateCells(16, 16, 0, 0);

    generateGrounds(this.getScene(), cells);
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
  chance: number; // 0 a 1
}

const biomeTrees: Record<BiomeName, BiomePrefab[]> = {
  [BiomeName.FOREST]: [
    { prefab: OAK_TREE_PREFAB, chance: 0.2 },

  ],
  [BiomeName.DEEP_WATER]: [],
  [BiomeName.SHALLOW_WATER]: [],
  [BiomeName.SAND]: [],
  [BiomeName.GRASSLAND]: [
    { prefab: BUSHE_0_PREFAB, chance: 0.3 },
    { prefab: BUSHE_1_PREFAB, chance: 0.1 },
    { prefab: BUSHE_2_PREFAB, chance: 0.4 },
    { prefab: BUSHE_3_PREFAB, chance: 0.2 }
  ],
  [BiomeName.FLOWER_FIELD]: [],
  [BiomeName.SPARSE_FOREST]: [{ prefab: PINE_TREE_PREFAB, chance: 0.3 }],
  [BiomeName.DENSE_FOREST]: [],
  [BiomeName.SWAMP]: [],
  [BiomeName.SAVANNA]: [],
  [BiomeName.TAIGA]: [],
  [BiomeName.MOUNTAIN]: [],
  [BiomeName.SNOW]: [],
  [BiomeName.TUNDRA]: []
};


const offset = new Vec3(1, -1, 0);
function generateTrees(scene: Scene, terrainCells: TerrainCell[], chunkPos: Vec2) {
  const seed = seedFromXY(chunkPos.x, chunkPos.y);
  const rng = new Mulberry32(seed);

  for (const cell of terrainCells) {
  if (!cell.biome) continue;

  const prefabs = biomeTrees[cell.biome];
  if (!prefabs || prefabs.length === 0) continue;

  for (const entry of prefabs) {
    if (rng.nextFloat() < entry.chance) {

      const out = new Vec3(0, 0, 0);
      const position = Vec3.add(out, cell.position, offset); 
      const entity = scene.instantiate(entry.prefab, position);
      if (!entity) break;
      const sprite = EasyGetter.getSpriteRender(scene, entity);
      if (sprite) sprite.layer = -cell.position.y;
      scene.addEntity(entity);
      break; // evita múltiplas instâncias para o mesmo cell
    }
  }
}

}
