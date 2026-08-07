export type CallbackObject<T = any> = Record<string, T>;

export type Callback<T = any> = (...args: any[]) => T;