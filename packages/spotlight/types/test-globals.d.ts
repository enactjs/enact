/* eslint-disable-next-line spaced-comment -- triple-slash reference directive, not a comment */
/// <reference types="@testing-library/jest-dom" />

declare module '*.less' {
	const classes: Record<string, string>;
	export default classes;
}
