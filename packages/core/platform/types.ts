export type PlatformDescription = {
	browserName: string;
	browserVersion: number;
	chrome?: number;
	firefox?: number;
	safari?: number;
	touchEvent?: boolean;
	touchScreen?: boolean;
	type: string;
}