export interface AsyncResource<T> {
    load(): Promise<T>;
}
