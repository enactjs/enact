import computed from './computed';
import defaultProps from './defaultProps';
import name from './name';
import propTypes from './propTypes';
import styles from './styles';

// eslint-disable-next-line no-undef
const __DEV__ = process.env.NODE_ENV === 'development';

/**
 * Creates a stateless functional component with some helpful declarative sugar.
 *
 * @example
 *	import css from './Button.less';
 *	const Button = kind({
 *		// expect color and onClick properties but neither required
 *		propTypes: {
 *			color: React.PropTypes.string
 *		},
 *		// if no color is provided, it'll be green
 *		defaultProps: {
 *			color: 'green'
 *		},
 *		// configure styles with the static classes to merge with user className
 *		styles: {
 *			// include the CSS modules map so 'button' can be resolved to the local name
 *			css,
 *			classes: 'button'
 *		},
 *		// add some computed properties
 *		computed: {
 *			// border color will be the color prepended by 'light'
 *			borderColor: ({color}) => 'light' + color
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
 *
 * @param  {Object} config - Component configuration
 *
 * @returns {Function}        Component
 */
const kind = (config) => {
	// addition prop decorations would be chained here (after config.render)
	const render = (props, context, updater) => {
		let p = Object.assign({}, props);
		if (config.styles) p = styles(config.styles, p, context, updater);
		if (config.computed) p = computed(config.computed, p, context, updater);
		return config.render(p, context, updater);
	};

	// render() decorations
	if (config.name) name(config.name, render);
	if (config.propTypes) propTypes(config.propTypes, render);
	if (config.defaultProps) defaultProps(config.defaultProps, render);

	// Decorate the SFC with the computed property object in DEV for easier testability
	if (__DEV__ && config.computed) render.computed = config.computed;

	return render;
};

export default kind;
export {kind};
