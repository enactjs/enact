/*
 * Ambient type declarations for the @enact/core modules used by @enact/spotlight.
 *
 * @enact/core is JavaScript-only in this monorepo (types are generated from
 * JSDoc at release time), so the surface consumed by this package is
 * declared here.
 */

declare module '@enact/core/util' {
	function coerceArray<T>(value: T | T[]): T[];

	class Job<A extends unknown[] = unknown[]> {
		constructor(fn: (...args: A) => void, timeout?: number);
		start(...args: A): void;
		startAfter(timeout: number, ...args: A): void;
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

	export {checkPropTypes, coerceArray, Job};
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
	export {hoc};
}

declare module '@enact/core/handle' {
	type Handler = (ev: any, props?: any, context?: any) => any;

	interface HandleChain {
		(...args: any[]): any;
		finally(fn: Handler): HandleChain;
		bindAs(context: object, name: string): Handler;
	}

	function handle(...handlers: Handler[]): HandleChain;
	function forward(prop: string): Handler;
	function forwardWithPrevent(prop: string): Handler;
	function forProp(prop: string, value?: any): Handler;
	function forKey(name: string): Handler;
	function forKeyCode(keyCode: number): Handler;
	function forEventProp(prop: string, value?: any): Handler;
	function preventDefault(ev: any): boolean;
	function stop(ev: any): boolean;
	function stopImmediate(ev: any): boolean;
	function returnsTrue(fn?: Handler): Handler;
	function not(handler: Handler): Handler;
	function call(method: string): Handler;
	function adaptEvent(adapter: Handler, handler: Handler): Handler;
	function oneOf(...handlers: Handler[]): Handler;
	function forwardCustom(prop: string): Handler;
	function log(message?: string): Handler;

	export default handle;
	export {
		adaptEvent,
		call,
		forward,
		forwardCustom,
		forwardWithPrevent,
		forEventProp,
		forKey,
		forKeyCode,
		forProp,
		handle,
		log,
		oneOf,
		preventDefault,
		returnsTrue,
		stop,
		stopImmediate,
		not
	};
}

declare module '@enact/core/keymap' {
	function is(name: string): (keyCode: number) => boolean;
	function is(name: string, keyCode: number): boolean;
	function add(...args: any[]): void;
	function remove(...args: any[]): void;
	function addMap(...args: any[]): void;

	function addAll (...args: any[]): void;
	function removeAll (...args: any[]): void;

	export {add, addAll, addMap, is, remove, removeAll};
}

declare module '@enact/core/snapshot' {
	function isWindowReady(): boolean;
	function onWindowReady(fn: () => void): void;
	function windowReady(): void;

	export {isWindowReady, onWindowReady, windowReady};
}

declare module '@enact/core/platform' {
	interface Platform {
		gesture?: boolean;
		touch?: boolean;
		[key: string]: unknown;
	}

	const platform: Platform;

	export default platform;
}

declare module '@enact/core/useClass' {
	function useClass<T, A extends unknown[]>(
		Ctor: new (...args: A) => T,
		...args: A
	): T;

	export default useClass;
	export {useClass};
}

declare module '@enact/core/useHandlers' {
	function useHandlers(handlers: object, props: object, context?: object): any;

	export default useHandlers;
	export {useHandlers};
}

declare module '@enact/core/internal/WithRef' {
	function WithRef(Wrapped: any): any;

	export default WithRef;
	export {WithRef};
}
