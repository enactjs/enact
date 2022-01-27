/**
 * Provides the {@link core/kind.kind} method to create components
 *
 * @module core/kind
 * @exports kind
 */

import {createContext, useContext, Component as ReactComponent} from 'react';

import useHandlers from '../useHandlers';
import Handlers from '../useHandlers/Handlers';

import computed from './computed';
import styles from './styles';

// Because contextType is optional and hooks must be called in the same order, we need a fallback
// context when none is specified. This likely has some overhead so we may want to deprecate and
// remove contextType support for 4.0 since the context APIs have improved since this was added.
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
 * @property {Object.<string, string>} css
 * @property {String} [className]
 * @property {Boolean|String|String[]} [publicClassNames]
 */

/**
 * @typedef {Object} KindConfig
 * @memberof core/kind
 * @property {String} [name]
 * @property {Boolean} [functional]
 * @property {Object.<string, Function>} [propTypes]
 * @property {Object.<string, any>} [defaultProps]
 * @property {Object} [contextType]
 * @property {StylesBlock} [styles]
 * @property {Object.<string, HandlerFunction>} [handlers]
 * @property {Object.<string, ComputedPropFunction>} [computed]
 * @property {RenderFunction} render
 */

/**
 * Creates a new component with some helpful declarative syntactic sugar.
 *
 * Example:
 * ```
 *	import css from './Button.module.less';
 *	const Button = kind({
 *		name: 'Button',
 *		// Return a functional component suitable for use with React hooks
 *		functional: true,
 *		// expect color and onClick properties but neither required
 *		propTypes: {
 *			color: PropTypes.string
 *		},
 *		// if no color is provided, it'll be green
 *		defaultProps: {
 *			color: 'green'
 *		},
 *		// expect backgroundColor via context
 *		contextType: React.createContext({ backgroundColor }),
 *		// configure styles with the static className to merge with user className
 *		styles: {
 *			// include the CSS modules map so 'button' can be resolved to the local name
 *			css,
 *			className: 'button'
 *		},
 *		// add event handlers that are cached between calls to prevent recreating each call. Any
 *		// handlers are added to the props passed to `render()`.  See core/handle.
 *		handlers: {
 *			onKeyDown: (evt, props) => { .... }
 *		},
 *		// add some computed properties, these are added to props passed to `render()`
 *		computed: {
 *			// border color will be the color prepended by 'light'
 *			borderColor: ({color}) => 'light' + color,
 *			// background color will be the contextual background color if specified
 *			color: ({color}, context) => context.backgroundColor || color
 *		},
 *		// Render the thing, already!
 *		render: ({color, borderColor, children, ...rest}) => (
 *			<button
 *				{...rest}
 *				style={{backgroundColor: color, borderColor}}
 *			>
 *				{children}
 *			</button>
 *		)
 *	});
 * ```
 *
 * @function
 * @template Props
 * @param  {KindConfig}    config    Component configuration
 *
 * @returns {Component<Props>}           Component
 * @memberof core/kind
 * @see {@link core/handle}
 * @public
 */
const kind = (config) => {
	const {
		computed: cfgComputed,
		contextType = NoContext,
		defaultProps,
		functional,
		handlers,
		name,
		propTypes,	// eslint-disable-line react/forbid-foreign-prop-types
		render,
		styles: cfgStyles
	} = config;

	const renderStyles = cfgStyles ? styles(cfgStyles) : false;
	const renderComputed = cfgComputed ? computed(cfgComputed) : false;
	const renderKind = (props, context) => {
		if (renderStyles) props = renderStyles(props, context);
		if (renderComputed) props = renderComputed(props, context);

		return render(props, context);
	};

	let Component;

	// In 4.x, this branch will become the only supported version and the class branch will be
	// removed.
	if (functional) {
		Component = function (props) {
			const ctx = useContext(contextType);
			const boundHandlers = useHandlers(handlers, props, ctx);

			const merged = {
				...props,
				...boundHandlers
			};

			return renderKind(merged, ctx);
		};
	} else {
		Component = class extends ReactComponent {
			static contextType = contextType;

			constructor () {
				super();

				this.handlers = new Handlers(handlers);
			}

			render () {
				this.handlers.setContext(this.props, this.context);

				const merged = {
					...this.props,
					...this.handlers.handlers
				};

				return renderKind(merged, this.context);
			}
		};
	}

	if (name) Component.displayName = name;
	if (propTypes) Component.propTypes = propTypes;
	if (defaultProps) Component.defaultProps = defaultProps;

	// Decorate the Component with the computed property object in DEV for easier testability
	if (__DEV__ && cfgComputed) Component.computed = cfgComputed;

	const defaultPropKeys = defaultProps ? Object.keys(defaultProps) : null;
	const handlerKeys = handlers ? Object.keys(handlers) : null;

	Component.inline = (props, context) => {
		let updated = {
			...props
		};

		if (defaultPropKeys && defaultPropKeys.length > 0) {
			defaultPropKeys.forEach(key => {
				// eslint-disable-next-line no-undefined
				if (props == null || props[key] === undefined) {
					updated[key] = defaultProps[key];
				}
			});
		}

		if (handlerKeys && handlerKeys.length > 0) {
			// generate a handler with a clone of updated to ensure each handler receives the same
			// props without the kind.handlers injected.
			updated = handlerKeys.reduce((_props, key) => {
				_props[key] = (ev) => handlers[key](ev, updated, context);
				return _props;
			}, {...updated});
		}

		return renderKind(updated, context);
	};

	return Component;
};

export default kind;
export {kind};
