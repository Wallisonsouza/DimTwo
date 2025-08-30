import { Transform } from "@engine/modules/components/spatial/Transform";
import type { ComponentGroup } from "../../modules/enums/ComponentGroup";
import type { ComponentType } from "../../modules/enums/ComponentType";
import type { Clonable } from "./Clonable";
import { Id } from "./Id";
import { Instantiable } from "./Instantiable";

export interface ComponentOptions {
  entityID?: number;
  enabled?: boolean;
}

export abstract class Component extends Instantiable implements Clonable<Component> {
  private entityID: number | null = null;
  enabled: boolean;
  readonly type: ComponentType;
  readonly group: ComponentGroup;
  readonly id: Id;




  private _transform: Transform | null = null;

  get transform(): Transform {
    if (!this._transform) {
      this._transform = new Transform();
    }
    return this._transform;
  }


  constructor(
    type: ComponentType,
    group: ComponentGroup,
    options: ComponentOptions
  ) {
    super();
    this.type = type;
    this.group = group;
    this.entityID = options.entityID ?? null;
    this.enabled = options.enabled ?? true;
    this.id = new Id();

  }

  public getEntityID(): number {
    if (this.entityID === null) {
      throw new Error("Game entity não atribuída");
    }
    return this.entityID;
  }

  public setEntityID(id: number): void {
    this.entityID = id;
  }

  enable(): void { this.enabled = true; }
  disable(): void { this.enabled = false; }

  clone(): Component {
    throw new Error(`Subclasse ${this.type} deve implementar clone() retornando uma nova instância`);
  }

  cloneBase() {

  }
}
