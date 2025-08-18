import { Id } from "./Id";

export abstract class Instantiable {
    readonly instanceID: Id;

    constructor() {
        this.instanceID = new Id();
    }

}