
export class SimpleManager<T> {

    private readonly managerName: string;
    private readonly data: Map<string, T> = new Map();


    constructor(name: string) {
        this.managerName = name;
    }

    public add(name: string, resource: T): T {
        if (this.data.has(name)) {
            console.warn(`[${this.managerName}] Recurso "${name}" já está registrado.`);
            return this.data.get(name)!;
        }
        this.data.set(name, resource);
        return resource;
    }

    public get(name: string): T | null {
        const resource = this.data.get(name);
        if (!resource) {
            console.warn(`[${this.managerName}] Recurso "${name}" não encontrado.`);
            return null;
        }

        return resource;
    }

    public remove(name: string) {
        if (!this.data.has(name)) {
            console.warn(`[${this.managerName}] Tentativa de remover recurso "${name}" que não existe.`);
            return;
        }
        this.data.delete(name);
    }

    public getAll() {
        return Array.from(this.data.values());
    }

    public clear() {
        this.data.clear();
    }
}
