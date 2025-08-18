export class Id {
    private readonly value: number;

    private static currentId: number = 0;
    private static readonly stack: number[] = [];

    public getValue(): number {
        return this.value;
    }

    constructor() {
        if (Id.stack.length > 0) {
            this.value = Id.stack.pop()!;
            return;
        }
        
        this.value = ++Id.currentId;
    }

    public static release(id: Id) {
        Id.stack.push(id.value);
    }
}
