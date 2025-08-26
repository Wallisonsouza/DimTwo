import type { GameEntity } from "../base/GameEntity";

export class EntityManager {
    private byName: Map<string, GameEntity> = new Map();
    private byId: Map<number, GameEntity> = new Map();
    private byTag: Map<string, Set<GameEntity>> = new Map();

    add(entity: GameEntity) {

        const id = entity.id.getValue();
        if (this.byId.has(id) || this.byName.has(entity.name)) {
            console.log(entity)
            throw new Error(`Entity with same ID: ${id} or name: ${entity.name} already exists`);
        }
        this.byId.set(id, entity);
        this.byName.set(entity.name, entity);

        if (!this.byTag.has(entity.tag)) {
            this.byTag.set(entity.tag, new Set());
        }
        this.byTag.get(entity.tag)!.add(entity);
    }

    remove(entity: GameEntity) {
        const id = entity.id.getValue();
        this.byId.delete(id);
        this.byName.delete(entity.name);

        for (const tagSet of this.byTag.values()) {
            tagSet.delete(entity);
        }
    }

    getById(id: number) {
        return this.byId.get(id) ?? null;
    }

    getByName(name: string) {
        return this.byName.get(name);
    }

    getByTag(tag: string): GameEntity | null {
        return this.byTag.get(tag)?.values().next().value ?? null;
    }
    getAll(): GameEntity[] {
        return Array.from(this.byId.values());
    }

    public clear() {
        this.byId.clear();
        this.byName.clear();
        this.byTag.clear();
    }

    getData() {
        return this.byId;
    }
}
