import type { Clonable } from "./Component";
import { Entity } from "./Entity";

export interface GameEntityOptions {
    name?: string;
    tag?: string;
    active?: boolean;
    parentID?: number | null;
}

export class GameEntity extends Entity implements Clonable<GameEntity> {
    tag: string;
    active: boolean;
    name: string;
    parentID: number | null;

    constructor(options: GameEntityOptions = {}) {
        super();
        this.name = options.name ?? "";
        this.tag = options.tag ?? "";
        this.active = options.active ?? true;
        this.parentID = options.parentID ?? null;
    }

    clone(): GameEntity {
        return new GameEntity({
            name: this.name,
            tag: this.tag,
            active: this.active,
            parentID: this.parentID
        });
    }
}
