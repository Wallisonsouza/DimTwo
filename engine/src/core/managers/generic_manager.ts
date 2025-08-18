export class GenericManager<K, T> {
    name: string;
    values: Map<K, T>;

    constructor(name: string) {
        this.name = name;
        this.values = new Map();
    }

    public generic_manager_set(key: K, value: T): void {
        this.values.set(key, value);
    }

    public add(key: K, value: T): void {
        if (this.values.has(key)) {
            console.warn(`Key '${String(key)}' already exists. Skipping registration.`);
            return;
        }
        this.values.set(key, value);
    }

    public get(key: K): T | null {
        const value = this.values.get(key);
        if (value === undefined) {
            console.warn(`[GenericManager] Key "${String(key)}" not found in manager "${this.name}".`);
            return null;
        }
        return value;
    }

    public generic_manager_has(key: K): boolean {
        return this.values.has(key);
    }

    public generic_manager_remove(key: K): void {
        this.values.delete(key);
    }

    public generic_manager_get_all(): T[] {
        return Array.from(this.values.values());
    }
}
