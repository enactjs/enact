export type CallbackObject<T = any> = Record<string, T>;

export type Callback<T = any, C = any> = (...args: C[]) => T;