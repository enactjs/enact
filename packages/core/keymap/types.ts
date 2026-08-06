export type KeyCode = number | number[];

export interface ObjectRegistry {
	[key: string]: KeyCode;
}

export interface KeyMapRegistry {
	[key: string]: number[];
}
