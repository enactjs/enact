/**
 * Provides the {@link core/hoc.hoc} method to create higher-order components (HOCs).
 *
 * @module core/hoc
 * @exports hoc
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
 *	const CountableDiv = Countable('div');
 *	const CountableDivAsDataNumber = CountableAsDataNumber('div');
 * ```
 *
 * @function
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} hawk        Higher-order component
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
			const cfg = mergeDeepWithKey(mergeFn, defaults, config || {});
			if (isRenderable(maybeWrapped)) {
				return factory(cfg, maybeWrapped);
			} else {
				return (Wrapped) => factory(cfg, Wrapped);
			}
		}
	};
};

/**
 * Performs right-to-left composition of Higher-order Components
 *
 * Unlike typical functional composition which accepts `n` arguments for the last function and 1
 * argument for the remaining functions, `compose` supports either 1 or two arguments for each
 * function.
 *
 * If the function supports 2 arguments (as determined by its `length` property), both the config
 * object and the component are passed. If it only supports 1 arguments, only the component is
 * passed.
 *
 * The function returned by `compose` is itself a HOC as returned by [hoc]{@link core/hoc.hoc} and
 * supports the same variable arguments.
 *
 * Example:
 * ```
 * const CountDecorator = compose(
 *   FirstDecorator({prop: 'value'}),     // seals FirstDecorator with the provided config
 *   SecondDecorator(null),               // seals SecondDecorator with the default config
 *   (cfg, Wrapped) => ThirdDecorator(	  // merges the provided config with a pre-configured option
 *     {...cfg, option: true},
 *     Wrapped
 *   ),
 *   Countable                            // passes the provided config untouched
 * );
 *
 * // In this example, the configuration object passed to `compose` is `{prop: 'data-number'}`.
 * // * FirstDecorator will not receive it because it was sealed with a pre-configured object
 * // * SecondDecorator will not receive it because it was sealed with a `null` configuration object
 * // * ThirdDecorator will receive it with `{option: true}` added
 * // * Countable will receive it as is
 * const CountableAsDataNumber = CountDecorator({prop: 'data-number'});
 * ```
 *
 * @function
 * @param  {...Function} hawks Higher-order component
 *
 * @returns {Function}         HoC Decorator
 * @memberof core/hoc
 * @public
 */
const compose = (...hawks) => hoc((config, Wrapped) => {
	return hawks.reduce((Component, hawk) => {
		if (!hawk || typeof hawk !== 'function' || hawk.length === 0) {
			return Component;
		}

		return hawk.length === 1 ? hawk(Component) : hawk(config, Component);
	}, Wrapped);
});

export default hoc;
export {
	compose,
	hoc
};
