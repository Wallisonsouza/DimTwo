import { Id } from "./Id";

export abstract class Entity {
    readonly id: Id;

    constructor() {
        this.id = new Id();
    }
}