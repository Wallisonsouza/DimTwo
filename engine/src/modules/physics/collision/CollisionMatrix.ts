export class CollisionMatrix {
  private matrix: boolean[][];
  private size: number;
  constructor(size: number) {

    this.matrix = Array.from({ length: size }, () =>
      Array(size).fill(false)
    );

    this.size = size;
  }

  public setCollision(layerA: number, layerB: number, canCollide: boolean): void {
    this.validateLayer(layerA);
    this.validateLayer(layerB);
    this.matrix[layerA][layerB] = canCollide;
    this.matrix[layerB][layerA] = canCollide; 
  }

  public canCollide(layerA: number, layerB: number): boolean {
    this.validateLayer(layerA);
    this.validateLayer(layerB);
    return this.matrix[layerA][layerB];
  }

  public getSize(): number {
    return this.size;
  }

  private validateLayer(layer: number): void {
    if (layer < 0 || layer >= this.size) {
      throw new Error(`Layer inválida: ${layer}`);
    }
  }

  public printTable(): void {
   
    const table: Record<string, Record<string, string>> = {};

    for (let i = 0; i < this.size; i++) {
      const row: Record<string, string> = {};
      for (let j = 0; j < this.size; j++) {
        row[j.toString()] = this.matrix[i][j] ? "✓" : "✗";
      }
      table[i.toString()] = row;
    }

    console.table(table);
  }
}
