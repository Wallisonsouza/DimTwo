import type { Vec2 } from "../../modules/2D/Vec2";

export class SpatialHash<T> {
  private readonly cellSize: number;
   readonly buckets = new Map<string, T[]>();

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  private getCellKey(cx: number, cy: number): string {
    return `${cx},${cy}`;
  }

  insert(min: Vec2, max: Vec2, item: T) {
    const minCellX = Math.floor(min.x / this.cellSize);
    const maxCellX = Math.floor(max.x / this.cellSize);
    const minCellY = Math.floor(min.y / this.cellSize);
    const maxCellY = Math.floor(max.y / this.cellSize);

    for (let cx = minCellX; cx <= maxCellX; cx++) {
      for (let cy = minCellY; cy <= maxCellY; cy++) {
        const key = this.getCellKey(cx, cy);
        if (!this.buckets.has(key)) this.buckets.set(key, []);
        this.buckets.get(key)!.push(item);
      }
    }
  }

  getBuckets(): IterableIterator<T[]> {
    return this.buckets.values();
  }

  clear() {
    this.buckets.clear();
  }
}
