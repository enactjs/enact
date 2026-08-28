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

declare module '@enact/core/kind' {
	interface KindConfig {
		name: string;
		propTypes?: Record<string, any>;
		contextTypes?: Record<string, any>;
		defaultProps?: Record<string, any>;
		styles?: {
			css?: Record<string, string>;
			className?: string;
			publicClassNames?: boolean | string[];
		};
		handlers?: Record<string, (...args: any[]) => any>;
		computed?: Record<string, (props: any) => any>;
		render: (props: any) => any;
	}

	type KindComponent = any & {
		(props: any): any;
		inline: (props: any) => any;
		displayName?: string;
		propTypes?: Record<string, any>;
		defaultProps?: Record<string, any>;
	};

	export default function kind(config: KindConfig): KindComponent;
}

declare module '@enact/core/hoc' {
	interface HocConfig {
		[key: string]: any;
	}

	type HocFactory = (config: HocConfig, Wrapped: any) => any;

	/** The higher-order component produced by `hoc()`. Callable as `Hoc(Wrapped)` or, to override
	 * `defaultConfig`, as `Hoc(configOverrides, Wrapped)`. */
	interface CreatedHoc {
		(Wrapped: any): any;
		(config: HocConfig, Wrapped: any): any;
	}

	interface Hoc {
		(config: HocConfig, factory: HocFactory): CreatedHoc;
		(factory: HocFactory): CreatedHoc;
	}

	const hoc: Hoc;
	export default hoc;
}

declare module '@enact/core/handle' {
	type Handler = (...args: any[]) => any;

	export function forward(name: string, ev?: any, props?: Record<string, any>): any;
	export function forwardCustom(name: string, factory?: (...args: any[]) => any): Handler;
	export function forwardWithPrevent(name: string): Handler;
	export function handle(...handlers: any[]): Handler & {
		named: (name: string) => Handler;
		finally: (fn: Handler) => Handler;
	};
	export function oneOf(...handlers: any[]): Handler;
	export function call(name: string): Handler;
	export function forProp(prop: string, value: any): Handler;
	export function forEventProp(prop: string, value: any): Handler;
	export function forKey(key: string): Handler;
	export function stop(...args: any[]): boolean;
	export function stopImmediate(...args: any[]): boolean;
	export function preventDefault(...args: any[]): boolean;
	export function returnsTrue(...args: any[]): true;
	export function adaptEvent(adapter: Handler, handler: Handler): Handler;
	const handleDefault: typeof handle;
	export default handleDefault;
}

declare module '@enact/core/keymap' {
	export function add(name: string, keyCode: number | number[]): void;
	export function remove(name: string, keyCode?: number): void;
	export function is(name: string, keyCode: number): boolean;
}

declare module '@enact/core/util' {
	export function checkPropTypes(
		instance: any,
		props: Record<string, any>,
		prevProps?: Record<string, any>
	): void;
	export class Job {
		constructor(fn: (...args: any[]) => any, timeout?: number);
		start(...args: any[]): void;
		startAfter(timeout: number, ...args: any[]): void;
		stop(): void;
		throttle(...args: any[]): void;
		idle(...args: any[]): void;
		promise(...args: any[]): Promise<any>;
	}
	export function shallowEqual(a: any, b: any): boolean;
	export function isRenderable(value: any): boolean;
	export function mapAndFilterChildren(children: any, fn: (...args: any[]) => any): any;
	export function memoize<T extends (...args: any[]) => any>(fn: T): T;
	export function extractAriaProps(props: Record<string, any>): [Record<string, any>, Record<string, any>];
	export function cap(str: string): string;
	export function clamp(min: number, max: number, value: number): number;
	export function coerceArray(obj: any): any[];
	export function coerceFunction(obj: any, defaultValue?: any): any;
	export function perfNow(): number;
}

declare module '@enact/core/useClass' {
	export default function useClass<T>(Cls: new (...args: any[]) => T, ...args: any[]): T;
}

declare module '@enact/core/useHandlers' {
	export default function useHandlers(
		handlers: Record<string, (...args: any[]) => any>,
		props: Record<string, any>,
		handlerContext?: Record<string, any>
	): Record<string, (...args: any[]) => any>;
}

declare module '@enact/core/dispatcher' {
	export function on(name: string, fn: (...args: any[]) => any, target?: any, priority?: number): void;
	export function off(name: string, fn: (...args: any[]) => any, target?: any): void;
	export function once(name: string, fn: (...args: any[]) => any, target?: any): void;
}

declare module '@enact/core/internal/prop-types' {
	interface EnactPropTypesShape {
		renderable: any;
		ref: any;
		component: any;
		EventObject: any;
		[key: string]: any;
	}
	const EnactPropTypes: EnactPropTypesShape;
	export default EnactPropTypes;
}

declare module '@enact/core/internal/Registry' {
	/**
	 * Mirrors the real shape in `packages/core/internal/Registry/Registry.ts`. `Registry` is a
	 * plain object (not a class) whose `create()` returns a `RegistryHandle`. Note that
	 * `RegistryInstance` is the *callback function* type passed to `register()` -- not the object
	 * `Registry.create()` returns (that's `RegistryHandle`). An earlier version of this ambient
	 * declaration inverted these, which silently type-checked but didn't reflect the real API.
	 */
	interface CallbackObject {
		[key: string]: any;
	}

	interface RegistryController {
		notify: (ev: RegistryEvent) => void;
		unregister: () => void;
	}

	type RegistryEvent = {action: string} & CallbackObject;
	type RegistryInstance = (ev?: RegistryEvent) => void;
	type RegistryHandler = (ev: RegistryEvent, instance: RegistryInstance) => void;
	type RegisterFunction = (instance: RegistryInstance) => RegistryController;

	interface RegistryHandle {
		parent: RegisterFunction | null;
		notify: (ev?: RegistryEvent, exclude?: (instance: RegistryInstance) => boolean) => void;
		register: RegisterFunction;
	}

	const Registry: {
		create: (handler: RegistryHandler) => RegistryHandle;
	};

	export default Registry;
	export type {
		CallbackObject,
		RegistryController,
		RegistryEvent,
		RegistryInstance,
		RegistryHandler,
		RegisterFunction,
		RegistryHandle
	};
}

declare module '@enact/core/internal/WithRef' {
	function WithRef (Wrapped: any): any;
	export default WithRef;
	export function WithRef (Wrapped: any): any;
}

declare module '@enact/i18n/util' {
	export function isRtlText(text: string): boolean;
	export function toUpperCase(str: string): string;
	export function toLowerCase(str: string): string;
}

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