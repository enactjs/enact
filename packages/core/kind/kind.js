/**
 * Provides the {@link core/kind.kind} method to create components
 *
 * @module core/kind
 */

import computed from './computed';
import contextTypes from './contextTypes';
import defaultProps from './defaultProps';
import handlers from './handlers';
import name from './name';
import propTypes from './propTypes';
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
 * @param  {Object} config - Component configuration
 *
 * @returns {Function}        Component
 * @memberof core/kind
 * @public
 */
const kind = (config) => {
	// addition prop decorations would be chained here (after config.render)
	let render = (props, context, updater) => {
		let p = Object.assign({}, props);
		if (config.styles) p = styles(config.styles, p, context, updater);
		if (config.computed) p = computed(config.computed, p, context, updater);
		return config.render(p, context, updater);
	};

	// render() decorations
	if (config.handlers) {
		// need to set name and contextTypes on pre-wrapped Component
		if (config.contextTypes) contextTypes(config.contextTypes, render);
		render = handlers(config.handlers, render, config.contextTypes);
	}

	if (config.name) name(config.name, render);
	if (config.propTypes) propTypes(config.propTypes, render);
	if (config.defaultProps) defaultProps(config.defaultProps, render);
	if (config.contextTypes) contextTypes(config.contextTypes, render);

	// Decorate the SFC with the computed property object in DEV for easier testability
	if (__DEV__ && config.computed) render.computed = config.computed;

	return render;
};

export default kind;
export {kind};
