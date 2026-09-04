export type CallbackObject<T = any> = Record<string, T>;

export type Callback<T = any, P = any> = (...args: P[]) => T;
