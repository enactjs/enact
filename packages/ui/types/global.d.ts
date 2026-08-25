declare global {
	const __DEV__: boolean;
	module '*.less' {
		const classes: Record<string, string>;
		export default classes;
	}
}

export {};