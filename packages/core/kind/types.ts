import {WeakValidationMap} from 'prop-types';
import {ComponentType, Context, CSSProperties, HTMLAttributes, ReactElement} from 'react';

import {Callback, CallbackObject, HandlerFunction} from '../types';

/**
 * Utility type that enforces strict typing for default props.
 * It takes the original props (P) and the default props (D), and makes any keys
 * present in D strictly required in P, stripping away their optional (`?`) modifier.
 *
 * @template P The original component props interface.
 * @template D The inferred defaultProps object.
 */
export type ApplyDefaults<P, D> = P & Required<Pick<P, Extract<keyof P, keyof D>>>;

/**
 * The augmented props object injected into functions within the `computed` block.
 * It contains the component's standard props, plus layout and styling utilities.
 *
 * @template P The component's props.
 */
export type ComputedCallbackObject<P> = P & {style: CSSProperties, styler: {join: Callback<string>, append: Callback<string>}}

/**
 * Merges your custom component props with standard React HTML attributes (like onClick, className).
 * If your custom props share a key with HTMLAttributes (e.g., onChange), your custom type wins.
 *
 * @template P Your custom component props.
 */
export type PropsWithDOM<P> = P & Omit<HTMLAttributes<HTMLDivElement>, keyof P>;

/**
 * Configuration for CSS class name mapping.
 */
export type StylesBlock = {
	/** The CSS module map or stylesheet object of the component. */
	css: CSSProperties;
	/** The static local class name to apply to the root element. */
	className: string;
	/**
	 * Specifies which class names are overridable.
	 * If `true`, all class names of the component CSS become public.
	 */
	publicClassNames: boolean | string | string[];
}

/**
 * The final React Component returned by the `kind()` factory.
 * It accepts standard DOM attributes alongside your custom props, and exposes static properties.
 *
 * @template P The component's custom props.
 * @template DP The component's default props.
 */
export type KindComponent<P = CallbackObject, DP extends Partial<P> = {}> = ComponentType<PropsWithDOM<P>> & {
	/** The computed property functions attached to the component (available in DEV mode). */
	computed?: CallbackObject;
	/** The default properties applied when instantiating the component. */
	defaultProps?: DP;
	/** An inline render function wrapper for the component. */
	inline?: ComputedPropFunction;
};

/**
 * A generic function signature for properties derived dynamically based on props and context.
 */
export interface ComputedPropFunction {
	(props: CallbackObject, context: Context<any>): any;
}

/**
 * The core rendering logic for the component.
 *
 * @template FinalProps The deeply merged object containing custom props, DOM props, defaults, and computed values.
 */
export interface RenderFunction<FinalProps = CallbackObject> {
	/**
	 * @param props The fully resolved properties object.
	 * @param context The resolved React context.
	 * @returns A React element or null.
	 */
	(props: FinalProps, context: Context<any>): ReactElement | null;
}

/**
 * The core configuration object passed to the `kind()` factory to generate a component.
 *
 * @template P The custom props interface (inferred via `_propTypes`).
 * @template C The inferred return values from the `computed` block.
 * @template D The inferred object keys from `defaultProps`.
 */
export interface KindConfig<P = CallbackObject, C = {}, D = {}> {
	/**
	 * **TYPE TOKEN:** Do not pass a value here at runtime.
	 * Cast this property to your props interface (e.g., `_propTypes: {} as MyProps`)
	 * to allow TypeScript to infer your generic props without breaking the inference
	 * of `defaultProps` and `computed`.
	 */
	_propTypes?: P;
	/**
	 * Real `prop-types` validators, checked at runtime (in DEV) via `checkPropTypes` on mount
	 * and on every update. Unlike `_propTypes`, this is actually assigned to the component and
	 * used to validate props — pass real validators here (e.g. `PropTypes.string`).
	 */
	propTypes?: WeakValidationMap<P>;
	/** The display name of the component, used for debugging and React DevTools. */
	name?: string;
	/** If `true`, returns a functional React component instead of a Class component. */
	functional?: boolean;
	/** Sets the default values for optional properties in your props interface. */
	defaultProps?: D;
	/** Specifies the React context type to consume. */
	contextType?: Context<any>;
	/** Configures styles, merging local CSS module classes with user-provided class names. */
	styles?: StylesBlock;
	/** Adds event handlers that are cached between renders to prevent recreation. */
	handlers?: CallbackObject<HandlerFunction>;
	/**
	 * Adds dynamically computed properties. The returned values from these functions
	 * are automatically injected into the `props` argument of your `render` function.
	 */
	computed?: {
		[K in keyof C]: (
			props: ComputedCallbackObject<ApplyDefaults<P, D>>,
			context: any
		) => C[K]
	};
	/**
	 * The final render function. It receives a heavily strictly-typed props object
	 * containing your base props, applied defaults, and extracted computed values.
	 */
	render: RenderFunction<ApplyDefaults<P, D> & C>;
}

/**
 * A specialized KindConfig used exclusively for composing purely functional implementations.
 *
 * @template P The custom props interface.
 * @template C The inferred return values from the `computed` block.
 * @template D The inferred object keys from `defaultProps`.
 */
export interface FunctionalKindConfig<P = CallbackObject, C = {}, D = {}> extends Omit<KindConfig<P, C, D>, 'functional' | 'render'> {
	useRender: RenderFunction<ApplyDefaults<P, D> & C>;
}
