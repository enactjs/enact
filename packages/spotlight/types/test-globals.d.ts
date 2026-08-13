// / <reference types="@testing-library/jest-dom" />

declare module '*.less' {
	const classes: Record<string, string>;
	export default classes;
}

interface Element {
	closest?: (selectors: string) => Element | null;
}

declare namespace jest {
	interface Matchers<R> {
		toHaveAttribute(attr: string, value?: string): R;
		toHaveClass(...classNames: string[]): R;
		toBeInTheDocument(): R;
	}
}
