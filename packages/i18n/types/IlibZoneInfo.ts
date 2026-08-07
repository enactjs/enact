/**
 * Zone information for a given date in the format that ilib can use directly.
 *
 * Used by `src/zoneinfo.ts` and `src/Loader.ts`.
 */
interface IlibZoneInfo {
	o: string;
	f?: string;
	e?: {c?: string; j: number};
	s?: {c?: string; j: number; v: string};
}

export type {IlibZoneInfo};
