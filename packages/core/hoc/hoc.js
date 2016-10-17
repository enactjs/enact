import invariant from 'invariant';

import {isRenderable} from '../util';

/**
 * Constructs, validates, and decorates the component
 *
 * @param  {Function} factory HOC Factory
 * @param  {Object} config  Configuration object
 * @param  {String|Function} Wrapped Component to wrap with HOC
 *
 * @returns {String|Function} New wrapped component
 * @private
 */
const wrap = (factory, config, Wrapped) => {
	const Component = factory(config, Wrapped);

	invariant(
		Component && isRenderable(Component),
		`The HOC factory expected a renderable component but received '${typeof Component}' instead`
	);

	if (__DEV__) {
		Component.propTypes = Object.assign({}, Wrapped.propTypes, Component.propTypes);
	}

	return Component;
};

/**
 * Constructs a Higher-order Component using an optional set of default configuration parameters and
 * a factory method that acceps instance configuration paramters and a component to wrap. The
 * returned function can accept:
 * 	* an instance config and a component constructor to wrap and return a renderable component, or
 * 	* an instance config only and return a decorator function expecting a component constructor
 * 	  (like the next bullet), or
 * 	* a component constructor and return a renderable component
 *
 * @example
 *	const Countable = hoc({prop: 'data-count'}, (config, Wrapped) => {
 *		return class extends React.Component {
 *			constructor (props) {
 *				super(props);
 *				this.state = {
 *					count: 0
 *				};
 *			},
 *			inc = () => this.setState({count: this.state.count + 1}),
 *			render () {
 *				const props = Object.assign({}, this.props, {
 *					[config.prop]: this.state.count,
 *					onClick: this.inc
 *				});
 *				return <Wrapped {...props} />
 *			}
 *		}
 *	});
 *
 *	const CountableAsDataNumber({prop: 'data-number'});
 *	const CountableDiv('div');
 *	const CountableDivAsDataNumber = CountableAsDataNumber('div');
 *
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} factory        Higher-order component
 *
 * @returns {Function}             HoC Decorator
 */
const hoc = (defaultConfig, factory) => {

	// normalize arguments to allow defaultConfig to be omitted
	let hawk = factory;
	let defaults = defaultConfig;
	if (!hawk && typeof defaultConfig === 'function') {
		hawk = defaultConfig;
		defaults = null;
	}

	return (config, maybeWrapped) => {
		if (isRenderable(config)) {
			return wrap(hawk, defaults, config);
		} else {
			const cfg = Object.assign({}, defaults, config);
			if (isRenderable(maybeWrapped)) {
				return wrap(hawk, cfg, maybeWrapped);
			} else {
				return (Wrapped) => wrap(hawk, cfg, Wrapped);
			}
		}
	};
};

export default hoc;
export {hoc};
