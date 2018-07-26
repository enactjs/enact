/**
 * Provides the {@link core/kind.kind} method to create components
 *
 * @module core/kind
 * @exports kind
 */

import React from 'react';

import computed from './computed';
import styles from './styles';

/**
 * Creates a new component with some helpful declarative syntactic sugar.
 *
 * Example:
 * ```
 *	import css from './Button.less';
 *	const Button = kind({
 *		// expect color and onClick properties but neither required
 *		propTypes: {
 *			color: PropTypes.string
 *		},
 *		// if no color is provided, it'll be green
 *		defaultProps: {
 *			color: 'green'
 *		},
 *		// expect backgroundColor via context
 *		contextTypes: {
 *			backgroundColor: PropTypes.string
 *		},
 *		// configure styles with the static className to merge with user className
 *		styles: {
 *			// include the CSS modules map so 'button' can be resolved to the local name
 *			css,
 *			className: 'button'
 *		},
 *		// add some computed properties
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
 * @param  {Object}    config    Component configuration
 *
 * @returns {Function}           Component
 * @memberof core/kind
 * @public
 */
const kind = (config) => {
	const {
		computed: cfgComputed,
		contextTypes,
		defaultProps,
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

	// addition prop decorations would be chained here (after config.render)
	const Component = class extends React.Component {
		static displayName = name || 'Component'

		static propTypes = propTypes

		static contextTypes = contextTypes

		static defaultProps = defaultProps

		constructor () {
			super();
			this.handlers = {};

			// cache bound function for each handler
			if (handlers) {
				Object.keys(handlers).forEach(handler => {
					return this.prepareHandler(handler, handlers[handler]);
				});
			}
		}

		/*
		 * Caches an event handler on the local `handlers` member
		 *
		 * @param   {String}    name     Event name
		 * @param   {Function}  handler  Event handler
		 *
		 * @returns {undefined}
		 */
		prepareHandler (prop, handler) {
			this.handlers[prop] = (ev) => {
				return handler(ev, this.props, this.context);
			};
		}

		render () {
			return renderKind({
				...this.props,
				...this.handlers
			}, this.context);
		}
	};

	// Decorate the Component with the computed property object in DEV for easier testability
	if (__DEV__ && cfgComputed) Component.computed = cfgComputed;

	const defaultPropKeys = Object.keys(defaultProps);

	Component.inline = (props, context) => {
		let updated = {
			...props
		};

		defaultPropKeys.forEach(key => {
			// eslint-disable-next-line no-undefined
			if (props[key] === undefined) {
				updated[key] = defaultProps[key];
			}
		});

		if (handlers) {
			// generate a handler with a clone of updated to ensure each handler receives the same
			// props without the kind.handlers injected.
			updated = Object.keys(handlers).reduce((_props, key) => {
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
