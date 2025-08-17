
import type { ComponentGroup } from "../../modules/enums/ComponentGroup";
import type { ComponentType } from "../../modules/enums/ComponentType";
import { Instantiable } from "./Instantiable";

export interface Clonable<T> {
  clone(): T;
}

export abstract class Component extends Instantiable implements Clonable<Component> {
  private entityID: number | null = null;
  enabled: boolean;
  readonly type: ComponentType;
  readonly group: ComponentGroup;

  public getEntityID(): number {
    if (!this.entityID) {
      throw new Error("game entity não atribuída");
    }
    return this.entityID;
  }

  public setEntityID(id: number): void {
    this.entityID = id;
  }

  constructor(
    type: ComponentType,
    group: ComponentGroup,
    entityID: number | null = null
  ) {
    super();
    this.type = type;
    this.group = group;
    this.entityID = entityID;
    this.enabled = true;
  }

 clone(): Component {
  throw new Error(`Subclasse ${this.type} deve implementar clone() retornando uma nova instância`);
}
}
