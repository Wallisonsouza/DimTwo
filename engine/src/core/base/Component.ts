import { NullReferenceException } from "@engine/errors/NullReferenceException";
import type { Transform } from "@engine/modules/components/spatial/Transform";
import type { ComponentGroup } from "../../modules/enums/ComponentGroup";
import type { ComponentType } from "../../modules/enums/ComponentType";
import type { Clonable } from "./Clonable";
import type { GameEntity } from "./GameEntity";
import { Id } from "./Id";
import { Instantiable } from "./Instantiable";



export interface ComponentOptions {
  entity?: GameEntity;
  enabled?: boolean;
}

export abstract class Component extends Instantiable implements Clonable<Component> {
  private _entity: GameEntity | null = null;
  enabled: boolean;
  readonly type: ComponentType;
  readonly group: ComponentGroup;

  readonly id: Id;

  public set gameEntity(v: GameEntity) { this._entity = v };
  public get gameEntity(): GameEntity {
    if (!this._entity) throw new NullReferenceException(this.type, "gameEntity");
    return this._entity;
  }

  public get transform(): Transform {
    if (!this._entity) throw new NullReferenceException(this.type, "transform");
    return this._entity.transform;
  }

  constructor(
    type: ComponentType,
    group: ComponentGroup,
    options: ComponentOptions
  ) {
    super();
    this.type = type;
    this.group = group;
    this._entity = options.entity ?? null;
    this.enabled = options.enabled ?? true;
    this.id = new Id();

  }

  enable(): void { this.enabled = true; }
  disable(): void { this.enabled = false; }

  clone(): Component {
    throw new Error(`Subclasse ${this.type} deve implementar clone() retornando uma nova instância`);
  }
}
