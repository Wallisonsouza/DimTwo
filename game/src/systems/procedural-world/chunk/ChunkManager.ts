/* import type { GameEntity } from "../../../../engine/core/base/GameEntity";
import { EventEmitter, type EventCallback } from "../../../../engine/core/events/EventEmitter";
import type { Vec2 } from "../../../../engine/core/math/Vec2";
import type { TerrainCell, World } from "../Word";


interface Chunk {
    position: Vec2;
    cells: TerrainCell[];
    gameEntities: GameEntity[];
}

interface ChunkEvents {
    chunkLoaded: Vec2;
    chunkUnloaded: Vec2;
}

export class ChunkManager {
    public static CHUNK_WIDTH = 8;
    public static CHUNK_HEIGHT = 8;

    private static loadedChunks = new Map<string, Chunk>();
    private static events = new EventEmitter<ChunkEvents>();

    public static loadChunk(x: number, y: number, world: World): void {
        const key = `${x},${y}`;
        if (this.loadedChunks.has(key)) return;

        const cells = world.generateCells(
            ChunkManager.CHUNK_WIDTH,
            ChunkManager.CHUNK_HEIGHT,
            x,
            y,
        );
        const chunk: Chunk = {
            cells: cells,
            gameEntities: [],
            position: { x: x, y: y },
        };
        this.loadedChunks.set(key, chunk);
        this.events.emit("chunkLoaded", { x: x, y: y });
    }

    public static updateAround(pos: Vec2, radius: number, world: World): void {
        const halfChunkWidthInTiles = ChunkManager.CHUNK_WIDTH / 2;
        const halfChunkHeightInTiles = ChunkManager.CHUNK_HEIGHT / 2;

        const tileX =pos.x / world.TILE_SIZE + halfChunkWidthInTiles
        const tileY =  pos.y / world.TILE_SIZE + halfChunkHeightInTiles

        const chunkX = Math.floor(tileX / ChunkManager.CHUNK_WIDTH);
        const chunkY = Math.floor(tileY / ChunkManager.CHUNK_HEIGHT);

        const keepChunks = new Set<string>();

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const x = chunkX + dx;
                const y = chunkY + dy;
                const key = `${x},${y}`;
                keepChunks.add(key);
                if (!this.loadedChunks.has(key)) {
                    this.loadChunk(x, y, world);
                }
            }
        }

        for (const [key] of this.loadedChunks) {
            if (!keepChunks.has(key)) {
                const [xStr, yStr] = key.split(",");
                const x = Number(xStr);
                const y = Number(yStr);
                this.unloadChunk(x, y);
            }
        }
    }

    public static unloadChunk(x: number, y: number): void {
        const key = `${x},${y}`;
        const chunk = this.loadedChunks.get(key);
        if (!chunk) return;

        this.events.emit("chunkUnloaded", { x, y });
        this.loadedChunks.delete(key);
    }

    public static getChunk(x: number, y: number): Chunk | undefined {
        return this.loadedChunks.get(`${x},${y}`);
    }

    public static on<K extends keyof ChunkEvents>(
        event: K,
        callback: EventCallback<ChunkEvents[K]>,
    ): void {
        this.events.on(event, callback);
    }
}
 */