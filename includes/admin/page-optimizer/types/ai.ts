export type PartialObject<T> = {
    [P in keyof T]?: T[P];
}; 