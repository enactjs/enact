import React from 'react';

import computed from './computed';
import contextTypes from './contextTypes';
import defaultProps from './defaultProps';
import propTypes from './propTypes';
import styles from './styles';

/**
 * Creates a stateless functional component with some helpful declarative sugar.
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
 * @param  {Object} config - Component configuration
 *
 * @returns {Function}        Component
 */
const kind = (config) => {
	// addition prop decorations would be chained here (after config.render)
	const Component = class extends React.Component {
		constructor () {
			super();
			this.handlers = {};

			// cache bound function for each handler
			if (config.handlers) {
				Object.keys(config.handlers).forEach(handler => {
					return this.prepareHandler(handler, config.handlers[handler]);
				});
			}
		}

		/**
		 * Caches an event handler on the local `handlers` member
		 *
		 * @param   {String}    name     Event name
		 * @param   {Function}  handler  Event handler
		 *
		 * @returns {undefined}
		 */
		prepareHandler (name, handler) {
			this.handlers[name] = (ev) => {
				handler(ev, this.props, this.context);
			};
		}

		render () {
			let p = Object.assign({}, this.props);
			if (config.styles) p = styles(config.styles, p, this.context);
			if (config.computed) p = computed(config.computed, p, this.context);

			return config.render(p, this.context);
		}
	};

	if (config.propTypes) propTypes(config.propTypes, Component);
	if (config.defaultProps) defaultProps(config.defaultProps, Component);
	if (config.contextTypes) contextTypes(config.contextTypes, Component);

	// Decorate the SFC with the computed property object in DEV for easier testability
	if (__DEV__ && config.computed) Component.computed = config.computed;


	return Component;
};

export default kind;
export {kind};
