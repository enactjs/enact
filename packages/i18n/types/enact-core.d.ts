/*
 * Ambient type declarations for the @enact/core modules used by @enact/i18n.
 *
 * @enact/core is JavaScript-only in this monorepo (types are generated from
 * JSDoc at release time), so the surface consumed by this package is
 * declared here.
 */

declare module '@enact/core/util' {
	function memoize<T extends (...args: never[]) => unknown>(fn: T): T;

	class Job<A extends unknown[] = unknown[]> {
		constructor(fn: (...args: A) => void, timeout?: number);
		start(...args: A): void;
		stop(): void;
		throttle(...args: A): void;
		idle(...args: A): void;
		promise<T>(promise: Promise<T>): Promise<T | null>;
	}

	function checkPropTypes(
		component: {propTypes?: object; displayName?: string; name?: string},
		props: object,
		location?: string,
		componentName?: string
	): void;

	export {checkPropTypes, Job, memoize};
}

declare module '@enact/core/hoc' {
	// Wrapped is typed `any` rather than ComponentType so factories can render
	// it directly and compare against sentinel values
	type HocFactory<C> = (config: C, Wrapped: any) => unknown;

	// The Enact hoc() contract is highly dynamic (config currying, string
	// wrapped components, etc.), so precise generic typing is impractical
	// from the consuming side; callers cast results where needed.
	function hoc<C extends object>(defaultConfig: C, factory: HocFactory<C>): any;
	function hoc(factory: HocFactory<object>): any;

	export default hoc;
}

declare module '@enact/core/dispatcher' {
	function on(
		name: string,
		fn: (ev: Event) => void,
		target?: EventTarget
	): boolean;
	function off(
		name: string,
		fn: (ev: Event) => void,
		target?: EventTarget
	): boolean;
	function once(
		name: string,
		fn: (ev: Event) => void,
		target?: EventTarget
	): () => void;

	export {off, on, once};
}

declare module '@enact/core/snapshot' {
	function isWindowReady(): boolean;
	function onWindowReady(fn: () => void): void;
	function windowReady(): void;

	export {isWindowReady, onWindowReady, windowReady};
}

declare module '@enact/core/useClass' {
	function useClass<T, A extends unknown[]>(
		Ctor: new (...args: A) => T,
		...args: A
	): T;

	export default useClass;
	export {useClass};
}
