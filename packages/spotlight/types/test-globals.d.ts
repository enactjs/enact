/// <reference types="@testing-library/jest-dom" />

declare module '*.less' {
	const classes: Record<string, string>;
	export default classes;
}
