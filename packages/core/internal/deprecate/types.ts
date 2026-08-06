export interface Config {
	name?: string;
	message?: string;
	since?: string;
	until?: string;
	replacedBy?: string;
	alwaysWarn?: boolean;
}

export type ConfigMsg = Omit<Config, 'alwaysWarn'>