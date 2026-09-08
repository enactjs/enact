/**
 * Ambient declarations for third-party packages that ship no TypeScript typings of their own.
 * `@enact/core/*` and `@enact/i18n/*` are deliberately NOT declared here -- they resolve against
 * their real TypeScript sources so this package type-checks against the actual API surface rather
 * than a hand-guessed approximation. An earlier version of this file guessed at `@enact/core/kind`,
 * `hoc`, `handle`, and `internal/Registry` (typing their callback parameters as `any` so consuming
 * object literals would get contextual typing "for free"), but several of those guesses diverged
 * from the real implementation in ways that only surfaced once the real sources were available for
 * comparison -- see the `kind()`/`hoc()`/`Registry` fixes made during this migration.
 */

declare module 'invariant' {
	export default function invariant(condition: any, message?: string, ...args: any[]): void;
}

declare module 'warning' {
	export default function warning(condition: any, message?: string, ...args: any[]): void;
}

declare module 'ramda/src/clamp' {
	const clamp: (min: number, max: number, value: number) => number;
	export default clamp;
}

declare module 'ramda/src/compose' {
	const compose: (...fns: Array<(...args: any[]) => any>) => (...args: any[]) => any;
	export default compose;
}

declare module 'ramda/src/curry' {
	const curry: (fn: (...args: any[]) => any) => (...args: any[]) => any;
	export default curry;
}

declare module 'react-is' {
	export function isValidElementType(value: any): boolean;
	export function isFragment(value: any): boolean;
	export function isForwardRef(value: any): boolean;
	export function isMemo(value: any): boolean;
	export const ForwardRef: symbol;
	export const Memo: symbol;
}

declare module '*.module.less' {
	const classNames: {[key: string]: string};
	export default classNames;
}

declare module '*.less' {
	const content: {[key: string]: string};
	export default content;
}

/** Compile-time constant injected by the consuming app's bundler (e.g. webpack `DefinePlugin`). */
declare const __DEV__: boolean;