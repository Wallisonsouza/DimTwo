import { GameEntity } from "../../../engine/core/base/GameEntity";
import { System } from "../../../engine/core/base/System";
import { Vec2 } from "../../../engine/core/math/Vec2";
import type { Scene } from "../../../engine/core/scene/scene";
import { SpriteRender } from "../../../engine/modules/components/render/SpriteRender";
import { Transform } from "../../../engine/modules/components/spatial/Transform";
import { ComponentType } from "../../../engine/modules/enums/ComponentType";
import { BiomeName, getBiomeColor } from "./biome";
import { World, type TerrainCell } from "./Word";


export class TerrainSystem extends System {
  private playerPosition: Vec2 = new Vec2();
  private world = new World(1221435);

  start() {

    const scene = this.getScene();
    const playerEntity = scene.entities.getByTag("Player");

    if (!playerEntity) {
      return
    }

    const playerTranform = scene.components.getComponent<Transform>(playerEntity.id.getValue(), ComponentType.Transform);
    if (!playerTranform) return;

    this.playerPosition = playerTranform.position;


    const cells = this.world.generateCells(16, 16, 0, 0);
    const entities: GameEntity[] = [];

    generateTerrainEntities(this.getScene(), cells, entities);

  }
}

function generateTerrainEntities(
  scene: Scene,
  terrainCells: TerrainCell[],
  gameEntities: GameEntity[],
): void {
  for (const cell of terrainCells) {

    const gameEntity: GameEntity = new GameEntity({ tag: "Ground" });
    gameEntity.name = `ground_${gameEntity.id.getValue()}`
    const transform = new Transform({ position: cell.position });


    scene.addComponent(gameEntity, transform);
    scene.addEntity(gameEntity);

    const spriteReder = new SpriteRender();
    spriteReder.material = "simpleMaterial";
    spriteReder.color = getBiomeColor(cell.biome ?? BiomeName.DEEP_WATER);

    scene.addComponent(gameEntity, spriteReder);

    gameEntities.push(gameEntity);
  }
}
/* 
function seedFromXY(x: number, y: number): number {
  const PRIME1 = 73856093;
  const PRIME2 = 19349663;
  return (x * PRIME1) ^ (y * PRIME2);
}
 */
/* export function generateTrees(
  componentState: ComponentStateType,
  terrainCells: TerrainCell[],
  gameEntities: GameEntity[],
  chunkPos: Vec2
) {

  const seed = seedFromXY(chunkPos.x, chunkPos.y);
  const rng = new Mulberry32(seed);

  for (const cell of terrainCells) {
    const treeChance = rng.nextFloat();
    if (cell.biome === BiomeName.DENSE_FOREST || cell.biome === BiomeName.SPARSE_FOREST) {
      if (treeChance < 0.1) {

        const treeEntity = createTreeEntity(componentState, "tree", OAK_TRE_0, cell.position);
        gameEntities.push(treeEntity);
      }
    }
  }
} */