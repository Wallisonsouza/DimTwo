import { SimplexNoise } from "@engine/core/algorithms/noise/SimplexNoise";
import { Vec3 } from "@engine/core/math/Vec3";
import { BiomeName, classifyBiomes } from "./biome";

export interface TerrainCell {
  position: Vec3;
  scale: number;
  height: number;
  temperature: number;
  biome?: BiomeName;
}

export class World {
  private readonly heightNoiseGenerator: SimplexNoise;
  private readonly temperatureNoiseGenerator: SimplexNoise;

  public readonly HEIGHT_NOISE_SCALE = 64;
  public readonly TEMPERATURE_NOISE_SCALE = 256;

  private readonly OCTAVES = 6;
  private readonly PERSISTENCE = 0.4;

  public readonly TILE_SIZE = 1;

  constructor(seed: number) {
    this.heightNoiseGenerator = new SimplexNoise(seed);
    this.temperatureNoiseGenerator = new SimplexNoise(seed + 9999);
  }

  public generateCells(
    width: number,
    height: number,
    chunkX: number,
    chunkY: number,
  ): TerrainCell[] {
    const terrain: TerrainCell[] = [];

    const halfWidth = Math.floor(width / 2);
    const halfHeight = Math.floor(height / 2);

    for (let y = -halfHeight; y < height - halfHeight; y++) {
      for (let x = -halfWidth; x < width - halfWidth; x++) {
        const tileX = chunkX * width + x;
        const tileY = chunkY * height + y;

        const heightNoise = this.heightNoiseGenerator.fractalNoise2D(
          tileX / this.HEIGHT_NOISE_SCALE,
          tileY / this.HEIGHT_NOISE_SCALE,
          this.OCTAVES,
          this.PERSISTENCE,
        );

        const temperatureNoise = this.temperatureNoiseGenerator.fractalNoise2D(
          tileX / this.TEMPERATURE_NOISE_SCALE,
          tileY / this.TEMPERATURE_NOISE_SCALE,
          this.OCTAVES,
          this.PERSISTENCE,
        );

        terrain.push({

          position: new Vec3(tileX * this.TILE_SIZE,
           tileY * this.TILE_SIZE,
            0),

          scale: this.TILE_SIZE,
          height: (heightNoise + 1) / 2,
          temperature: (temperatureNoise + 1) / 2,
          biome: undefined,
        });
      }
    }

    classifyBiomes(terrain);

    return terrain;
  }
}
