/* 
export class EasyGetter {
  public static getAllByGroup<T extends Component>(scene: Scene, group: ComponentGroup): T[] {
    return scene.components.getAllByGroup<T>(group);
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

    entity.transform.position = cell.position;

    const spriteRender = scene.components.getComponent<SpriteRender2D>(entity, ComponentType.SpriteRender);
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
      { prefab: BUSHE_6_PREFAB, chance: 0.2, offset: new Vec3(0, 0, 0) } 

  ],
  [BiomeName.DEEP_WATER]: [],
  [BiomeName.SHALLOW_WATER]: [],
  [BiomeName.SAND]: [{ prefab: GRASS_0_PREFAB, chance: 0.7, offset: new Vec3(0, 0, 0) },],
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
        Vec3.add(entry.offset, cell.position, tempVec3);

        const entity = scene.instantiate(entry.prefab, tempVec3);
        if (!entity) break;

        const sprite = scene.components.getComponent<SpriteRender2D>(entity, ComponentType.SpriteRender);
        if (!sprite) break;
        sprite.layer = -cell.position.y;

        scene.addEntity(entity);
        break;
      }
    }
  }

}
 */