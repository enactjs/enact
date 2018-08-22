
/**
 * Exports the {@link ui/internal/Pure.Pure} higher-order component (HOC).
 *
 * @module ui/internal/Pure
 * @private
 */

import hoc from '@enact/core/hoc';
import React from 'react';

/**
 * Default config for {@link ui/internal/Pure.Pure}.
 *
 * @memberof ui/internal/Pure.Pure
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the comparators used to test for prop changes
	 *
	 * @type {Object}
	 * @memberof ui/internal/Pure.Pure.defaultConfig
	 */
	propComparators: {
		'*': (a, b) => a === b
	}
};

/**
 * Implements `shouldComponentUpdate` based on property change determination. By default, props are
 * shallowly compared for strict equality
 *
 * Custom comparators can be provided via the `propComparators` config property which accepts an
 * object mapping property names to comparator functions. To override the default comparator, use
 * the key, `'*'`.
 *
 * ```
 * const PureComponent = Pure(
 *     // Overrides the comparator for `count`. All other props will use the default comparators
 *     propComparators: {
 *         // For example, count is compared using loose equality allowing '5' to equal 5
 *         count: (a, b) => a == b
 *     },
 *     Component
 * )
 * ```
 *
 * @class Pure
 * @memberof ui/internal/Pure
 * @hoc
 * @private
 */
const Pure = hoc(defaultConfig, (config, Wrapped) => {
	const {propComparators} = config;

	return class extends React.Component {
		static displayName = 'Pure'

		static propTypes = {}

		static defaultProps = {}

		shouldComponentUpdate (nextProps) {
			return this.hasChanged(this.props, nextProps, propComparators);
		}

		hasChanged (current, next, comparators) {
			const propKeys = Object.keys(current);
			const nextKeys = Object.keys(next);

			// early bail out if the objects have a different number of keys
			if (propKeys.length !== nextKeys.length) {
				return true;
			}

			const hasOwn = Object.prototype.hasOwnProperty.bind(current);
			for (let i = 0; i < nextKeys.length; i++) {
				const prop = nextKeys[i];
				const comp = comparators[prop] || comparators['*'];
				if (!hasOwn(prop) || !comp(current[prop], next[prop])) {
					return true;
				}
			}

			return false;
		}

		render () {
			return (
				<Wrapped {...this.props} />
			);
		}
	};
});

export default Pure;
export {
	Pure
};
