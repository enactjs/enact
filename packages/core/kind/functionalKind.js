import {createContext, useContext} from 'react';

import useHandlers from '../useHandlers';
import {checkPropTypes} from '../util';

import computed from './computed';
import styles from './styles';

// Fallback context when none is specified.
const NoContext = createContext(null);

/**
 * @callback RenderFunction
 * @memberof core/kind
 * @param {Object<string, any>} props
 * @param {Object<string, any>} context
 * @returns React.Element|null
 */

/**
 * @callback ComputedPropFunction
 * @memberof core/kind
 * @param {Object<string, any>} props
 * @param {Object<string, any>} context
 * @returns any
 */

/**
 * @callback HandlerFunction
 * @memberof core/kind
 * @param {any} event
 * @param {Object<string, any>} props
 * @param {Object<string, any>} context
 */

/**
 * Configuration for CSS class name mapping
 *
 * @typedef {Object} StylesBlock
 * @memberof core/kind
 * @property {Object.<string, string>} css The CSS of the component
 * @property {String} [className] The className of the component
 * @property {Boolean|String|String[]} [publicClassNames] Specifies which class names are overridable.
 * If this value is `true`, all the class names of the component CSS will become public.
 */

/**
 * @typedef {Object} KindConfig
 * @memberof core/kind
 * @property {String} [name] The name of the component
 * @property {Object.<string, Function>} [propTypes] Specifies expected props
 * @property {Object.<string, any>} [defaultProps] Sets the default props
 * @property {Object} [contextType] Specifies context type
 * @property {StylesBlock} [styles] Configures styles
 * @property {Object.<string, HandlerFunction>} [handlers] Adds event handlers
 * @property {Object.<string, ComputedPropFunction>} [computed] Adds computed properties
 * @property {RenderFunction} useRender The useRender function
 */

/**
 * Creates a new functional component with declarative syntactic sugar.
 *
 * @function
 * @template Props
 * @param  {KindConfig}    config    Component configuration
 * @returns {Component<Props>}
 * @memberof core/kind
 * @private
 */
const functionalKind = (config) => {
	const {
		computed: cfgComputed,
		contextType = NoContext,
		defaultProps,
		handlers,
		name,
		propTypes,	// eslint-disable-line react/forbid-foreign-prop-types
		useRender,
		styles: cfgStyles
	} = config;

	const renderStyles  = cfgStyles   ? styles(cfgStyles)     : false;
	const renderComputed = cfgComputed ? computed(cfgComputed) : false;

	const renderKind = (props, context) => {
		if (renderStyles)   props = renderStyles(props, context);
		if (renderComputed) props = renderComputed(props, context);

		return useRender(props, context); // eslint-disable-line react-hooks/rules-of-hooks
	};

	const Component = function (props) {
		// Hooks must always be called unconditionally and in the same order.
		const ctx = useContext(contextType);
		const boundHandlers = useHandlers(handlers, props, ctx);

		// Merge incoming props with bound handlers.
		let merged = {
			...props,
			...boundHandlers
		};

		// Apply defaultProps manually so functional components
		// receive defaults even when React's own defaultProps is set.
		if (defaultProps) {
			Object.keys(defaultProps).forEach(key => {
				// eslint-disable-next-line no-undefined
				if (merged[key] === undefined) {
					merged[key] = defaultProps[key];
				}
			});
		}

		checkPropTypes(Component, merged);

		return renderKind(merged, ctx);
	};

	if (name)         Component.displayName = name;
	if (propTypes)    Component.propTypes   = propTypes;
	if (defaultProps) Component.defaultProps = defaultProps;

	// Expose computed map in DEV for easier testability.
	if (__DEV__ && cfgComputed) Component.computed = cfgComputed;

	// ── inline ──────────────────────────────────────────────────────────────
	// A synchronous, hook-free path for calling the component logic outside
	// of the React render cycle (e.g. in tests or server-side utilities).
	const defaultPropKeys = defaultProps ? Object.keys(defaultProps) : null;
	const handlerKeys     = handlers     ? Object.keys(handlers)     : null;

	Component.inline = (props, context) => {
		let updated = {...props};

		if (defaultPropKeys?.length) {
			defaultPropKeys.forEach(key => {
				// eslint-disable-next-line no-undefined
				if (props == null || props[key] === undefined) {
					updated[key] = defaultProps[key];
				}
			});
		}

		if (handlerKeys?.length) {
			// Snapshot `updated` before injecting handlers so every handler
			// receives the same base props (no cross-contamination).
			const snapshot = {...updated};
			updated = handlerKeys.reduce((_props, key) => {
				_props[key] = (ev) => handlers[key](ev, snapshot, context);
				return _props;
			}, updated);
		}

		return renderKind(updated, context);
	};

	return Component;
};

export default functionalKind;
export {functionalKind};
