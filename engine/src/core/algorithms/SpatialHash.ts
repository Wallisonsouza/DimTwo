import { Vec2 } from "../math/Vec2";

























export class SpatialHash<T> {
  private readonly cellSize: number;
  readonly buckets = new Map<number, T[]>();

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  private getCellKey(cx: number, cy: number): number {
    return (cx & 0xffff) << 16 | (cy & 0xffff);
  }

  insert(min: Vec2, max: Vec2, item: T) {
    const minCellX = Math.floor(min.x / this.cellSize);
    const maxCellX = Math.floor(max.x / this.cellSize);
    const minCellY = Math.floor(min.y / this.cellSize);
    const maxCellY = Math.floor(max.y / this.cellSize);

    for (let cx = minCellX; cx <= maxCellX; cx++) {
      for (let cy = minCellY; cy <= maxCellY; cy++) {
        const key = this.getCellKey(cx, cy);
        let bucket = this.buckets.get(key);
        if (!bucket) {
          bucket = [];
          this.buckets.set(key, bucket);
        }
        bucket.push(item);
      }
    }
  }

  getBuckets(): IterableIterator<T[]> {
    return this.buckets.values();
  }

  clear() {
    this.buckets.forEach(bucket => bucket.length = 0);
    this.buckets.clear();
  }
}
