import computed from './computed';
import contextTypes from './contextTypes';
import defaultProps from './defaultProps';
import handlers from './handlers';
import name from './name';
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
	window.performance.mark('kind.start');
	// addition prop decorations would be chained here (after config.render)
	let render = (props, context, updater) => {
		window.performance.mark('kind.render.start');
		let p = Object.assign({}, props);
		if (config.styles) {
			window.performance.mark('kind.render.styles.start');
			p = styles(config.styles, p, context, updater);
			window.performance.mark('kind.render.styles.end');
			window.performance.measure('kind.render.styles', 'kind.render.styles.start', 'kind.render.styles.end');
		}
		if (config.computed) {
			window.performance.mark('kind.render.computed.start');
			p = computed(config.computed, p, context, updater);
			window.performance.mark('kind.render.computed.end');
			window.performance.measure('kind.render.computed', 'kind.render.computed.start', 'kind.render.computed.end');
		}

		window.performance.mark('kind.render.component.start');
		const result = config.render(p, context, updater);
		window.performance.mark('kind.render.component.end');
		window.performance.measure('kind.render.component', 'kind.render.component.start', 'kind.render.component.end');

		window.performance.mark('kind.render.end');
		window.performance.measure('kind.render', 'kind.render.start', 'kind.render.end');

		return result;
	};

	// render() decorations
	if (config.handlers) {
		window.performance.mark('kind.handlers.start');
		// need to set name and contextTypes on pre-wrapped Component
		if (config.contextTypes) contextTypes(config.contextTypes, render);
		render = handlers(config.handlers, render, config.contextTypes);
		window.performance.mark('kind.handlers.end');
		window.performance.measure('kind.handlers', 'kind.handlers.start', 'kind.handlers.end');
	}

	if (config.name) name(config.name, render);
	if (config.propTypes) propTypes(config.propTypes, render);
	if (config.defaultProps) defaultProps(config.defaultProps, render);
	if (config.contextTypes) contextTypes(config.contextTypes, render);

	// Decorate the SFC with the computed property object in DEV for easier testability
	if (__DEV__ && config.computed) render.computed = config.computed;

	window.performance.mark('kind.end');
	window.performance.measure('kind', 'kind.start', 'kind.end');

	return render;
};

export default kind;
export {kind};
