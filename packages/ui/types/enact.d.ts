/**
 * Ambient declarations for `@enact/*` and other untyped third-party packages consumed by this
 * package. These packages ship no TypeScript typings of their own, so we declare loose (but
 * explicit, non-`any`-implicit) shapes here to satisfy `strict`/`noImplicitAny` without having to
 * re-type the entirety of `@enact/core`.
 *
 * `KindConfig`/`HocConfig` intentionally type their callback parameters as `any`. That's not
 * laziness: it's what lets every call-site object literal (the `computed`, `handlers`, and
 * `render` functions passed into `kind({...})`/`hoc({...})`) receive a contextual type instead of
 * tripping `noImplicitAny` on each destructured parameter. Individual modules still declare real
 * `interface *Props` for their public, exported API; this file only covers the internal glue.
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