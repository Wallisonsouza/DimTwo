import { Vec2 } from "../math/Vec2";

export interface QuadTreeItem<T> {
  min: Vec2;
  max: Vec2;
  data: T;
}

export class QuadTreeNode<T> {
  boundsMin: Vec2;
  boundsMax: Vec2;
  capacity: number;
  items: QuadTreeItem<T>[] = [];
  divided: boolean = false;

  nw?: QuadTreeNode<T>;
  ne?: QuadTreeNode<T>;
  sw?: QuadTreeNode<T>;
  se?: QuadTreeNode<T>;

  constructor(boundsMin: Vec2, boundsMax: Vec2, capacity = 4) {
    this.boundsMin = boundsMin;
    this.boundsMax = boundsMax;
    this.capacity = capacity;
  }

  private contains(item: QuadTreeItem<T>): boolean {
    return (
      item.max.x >= this.boundsMin.x &&
      item.min.x <= this.boundsMax.x &&
      item.max.y >= this.boundsMin.y &&
      item.min.y <= this.boundsMax.y
    );
  }

  private subdivide() {
    const midX = (this.boundsMin.x + this.boundsMax.x) / 2;
    const midY = (this.boundsMin.y + this.boundsMax.y) / 2;

    this.nw = new QuadTreeNode(
      new Vec2(this.boundsMin.x, midY),
      new Vec2(midX, this.boundsMax.y),
      this.capacity
    );
    this.ne = new QuadTreeNode(
      new Vec2(midX, midY),
      new Vec2(this.boundsMax.x, this.boundsMax.y),
      this.capacity
    );
    this.sw = new QuadTreeNode(
      new Vec2(this.boundsMin.x, this.boundsMin.y),
      new Vec2(midX, midY),
      this.capacity
    );
    this.se = new QuadTreeNode(
      new Vec2(midX, this.boundsMin.y),
      new Vec2(this.boundsMax.x, midY),
      this.capacity
    );

    this.divided = true;
  }

  insert(item: QuadTreeItem<T>): boolean {
    if (!this.contains(item)) return false;

    if (this.items.length < this.capacity) {
      this.items.push(item);
      return true;
    }

    if (!this.divided) this.subdivide();

    return (
      this.nw!.insert(item) ||
      this.ne!.insert(item) ||
      this.sw!.insert(item) ||
      this.se!.insert(item)
    );
  }

  query(rangeMin: Vec2, rangeMax: Vec2, found: QuadTreeItem<T>[] = []): QuadTreeItem<T>[] {
    if (
      rangeMax.x < this.boundsMin.x ||
      rangeMin.x > this.boundsMax.x ||
      rangeMax.y < this.boundsMin.y ||
      rangeMin.y > this.boundsMax.y
    ) {
      return found;
    }

    for (const item of this.items) {
      if (
        item.max.x >= rangeMin.x &&
        item.min.x <= rangeMax.x &&
        item.max.y >= rangeMin.y &&
        item.min.y <= rangeMax.y
      ) {
        found.push(item);
      }
    }

    if (this.divided) {
      this.nw!.query(rangeMin, rangeMax, found);
      this.ne!.query(rangeMin, rangeMax, found);
      this.sw!.query(rangeMin, rangeMax, found);
      this.se!.query(rangeMin, rangeMax, found);
    }

    return found;
  }

  clear() {
    this.items.length = 0;
    if (this.divided) {
      this.nw!.clear();
      this.ne!.clear();
      this.sw!.clear();
      this.se!.clear();
      this.nw = this.ne = this.sw = this.se = undefined;
      this.divided = false;
    }
  }
}
