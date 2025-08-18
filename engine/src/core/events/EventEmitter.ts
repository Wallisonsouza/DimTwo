export type EventCallback<T = void> = (payload: T) => void;

export class EventEmitter<TEvents extends Record<string, any>> {
    private listeners = new Map<keyof TEvents, Set<EventCallback>>();

    public on<K extends keyof TEvents>(event: K, callback: EventCallback<TEvents[K]>): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback as EventCallback);
    }

    public off<K extends keyof TEvents>(event: K, callback: EventCallback<TEvents[K]>): void {
        this.listeners.get(event)?.delete(callback as EventCallback);
    }

    public emit<K extends keyof TEvents>(event: K, payload?: TEvents[K]): void {
        this.listeners.get(event)?.forEach((cb) => {
            (cb as EventCallback<TEvents[K]>)(payload!);
        });
    }

    public clear(event: keyof TEvents): void {
        this.listeners.delete(event);
    }

    public clearAll(): void {
        this.listeners.clear();
    }

    public once<K extends keyof TEvents>(event: K, callback: EventCallback<TEvents[K]>): void {
        const wrapper: EventCallback<TEvents[K]> = (payload: TEvents[K]) => {
            callback(payload);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}
