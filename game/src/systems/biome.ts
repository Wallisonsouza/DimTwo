import { Color } from "@engine//core/math/Color";
import { Mathf } from "@engine//core/math/Mathf";
import { BiomeName } from "@game/enums/BiomeName";
import type { TerrainCell } from "./Word";

interface BiomeRange {
  min: number;
  max: number;
}

interface Biome {
  name: BiomeName;
  height: BiomeRange;
  temperature: BiomeRange;
  color: Color;
}

const BIOME_DEFAULT: Biome[] = [
  {
    name: BiomeName.DEEP_WATER,
    height: { min: 0.0, max: 0.2 },
    temperature: { min: 0.0, max: 1.0 },
    color: Color.rgba(0, 50, 255, 1),
  },
  {
    name: BiomeName.SHALLOW_WATER,
    height: { min: 0.2, max: 0.3 },
    temperature: { min: 0.0, max: 1.0 },
    color: Color.rgba(64, 164, 223, 1),
  },
  {
    name: BiomeName.SAND,
    height: { min: 0.3, max: 0.35 },
    temperature: { min: 0.5, max: 1.0 },
    color: Color.rgba(244, 233, 156, 1),
  },
  {
    name: BiomeName.GRASSLAND,
    height: { min: 0.35, max: 0.6 },
    temperature: { min: 0.4, max: 0.8 },
    color: Color.rgba(136, 192, 112, 1),
  },
  {
    name: BiomeName.FLOWER_FIELD,
    height: { min: 0.35, max: 0.6 },
    temperature: { min: 0.6, max: 0.9 },
    color: Color.rgba(180, 217, 141, 1),
  },
  {
    name: BiomeName.SPARSE_FOREST,
    height: { min: 0.4, max: 0.65 },
    temperature: { min: 0.4, max: 0.75 },
    color: Color.rgba(76, 166, 76, 1),
  },
  {
    name: BiomeName.FOREST,
    height: { min: 0.45, max: 0.75 },
    temperature: { min: 0.3, max: 0.7 },
    color: Color.rgba(53, 122, 56, 1),
  },
  {
    name: BiomeName.DENSE_FOREST,
    height: { min: 0.45, max: 0.75 },
    temperature: { min: 0.2, max: 0.6 },
    color: Color.rgba(45, 92, 45, 1),
  },
  {
    name: BiomeName.SWAMP,
    height: { min: 0.3, max: 0.5 },
    temperature: { min: 0.6, max: 1.0 },
    color: Color.rgba(91, 117, 83, 1),
  },
  {
    name: BiomeName.SAVANNA,
    height: { min: 0.35, max: 0.6 },
    temperature: { min: 0.8, max: 1.0 },
    color: Color.rgba(214, 194, 111, 1),
  },
  {
    name: BiomeName.TAIGA,
    height: { min: 0.4, max: 0.7 },
    temperature: { min: 0.2, max: 0.4 },
    color: Color.rgba(140, 174, 147, 1),
  },
  {
    name: BiomeName.MOUNTAIN,
    height: { min: 0.7, max: 0.85 },
    temperature: { min: 0.0, max: 1.0 },
    color: Color.rgba(136, 136, 136, 1),
  },
  {
    name: BiomeName.SNOW,
    height: { min: 0.85, max: 1.0 },
    temperature: { min: 0.0, max: 0.3 },
    color: Color.rgba(255, 255, 255, 1),
  },
  {
    name: BiomeName.TUNDRA,
    height: { min: 0.4, max: 0.6 },
    temperature: { min: 0.0, max: 0.2 },
    color: Color.rgba(194, 211, 194, 1),
  },
];

export function classifyBiomes(cells: TerrainCell[]): void {
  for (const cell of cells) {
    const biome = BIOME_DEFAULT.find((def) =>
      Mathf.isInRange(cell.height, def.height.min, def.height.max) &&
      Mathf.isInRange(cell.temperature, def.temperature.min, def.temperature.max)
    );
    if (biome) {
      cell.biome = biome.name;
    } else {
      cell.biome = BiomeName.TUNDRA;
    }
  }
}

export function getBiomeColor(val: BiomeName): Color {
  for (const biomeDef of BIOME_DEFAULT) {
    if (biomeDef.name === val) {
      return biomeDef.color;
    }
  }
  return Color.magenta;
}