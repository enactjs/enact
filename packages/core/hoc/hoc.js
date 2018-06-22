/**
 * Provides the {@link core/hoc.hoc} method to create higher-order components (HOCs).
 *
 * @module core/hoc
 */

import {isRenderable} from '../util';
import mergeDeepWithKey from 'ramda/src/mergeDeepWithKey';

const mergeFn = (key, defaultValue, userValue) => {
	// eslint-disable-next-line no-undefined
	if (userValue === undefined) {
		return defaultValue;
	}

	return userValue;
};

/**
 * Constructs a higher-order component (HOC) using an optional set of default configuration parameters and
 * a factory method that accepts instance configuration parameters and a component to wrap. The
 * returned function can accept:
 *	* an instance config and a component constructor to wrap and return a renderable component, or
 *	* an instance config only and return a decorator function expecting a component constructor
 *	(like the next bullet), or
 *	* a component constructor and return a renderable component
 *
 * Example:
 * ```
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
 * ```
 *
 * @function
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} hawk        higher-order component
 *
 * @returns {Function}             HOC Decorator
 * @memberof core/hoc
 * @public
 */
const hoc = (defaultConfig, hawk) => {

	// normalize arguments to allow defaultConfig to be omitted
	let factory = hawk;
	let defaults = defaultConfig;
	if (!factory && typeof defaultConfig === 'function') {
		factory = defaultConfig;
		defaults = null;
	}

	return (config, maybeWrapped) => {
		if (isRenderable(config)) {
			return factory(defaults, config);
		} else {
			const cfg = mergeDeepWithKey(mergeFn, defaults, config);
			if (isRenderable(maybeWrapped)) {
				return factory(cfg, maybeWrapped);
			} else {
				return (Wrapped) => factory(cfg, Wrapped);
			}
		}
	};
};

export default hoc;
export {hoc};
