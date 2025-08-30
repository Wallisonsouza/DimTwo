export class NullReferenceException extends Error {
    constructor(componentType?: string, property?: string) {
        const msg = componentType && property
            ? `Component '${componentType}': cannot access '${property}' because entity is null.`
            : "Entity is null";
        super(msg);
        this.name = "NullReferenceException";
    }
}