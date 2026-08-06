export type ClassNames = boolean | string | string[];

export type FilterCallback<T> = (
	value: T,
	index: number,
	array: T[]
) => boolean;

export interface ClassNamesObject {
	[key: string]: string
}
