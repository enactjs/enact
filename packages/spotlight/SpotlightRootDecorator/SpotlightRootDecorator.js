/**
 * Exports the {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}
 * Higher-order Component.
 *
 * @module spotlight/SpotlightRootDecorator
 */

import hoc from '@enact/core/hoc';
import React from 'react';

import Spotlight from '../src/spotlight';
import {spottableClass} from '../Spottable';

const spotlightRootContainerName = 'spotlightRootDecorator';

/**
 * Constructs a Higher-order Component that initializes and enables Spotlight
 * 5-way navigation within an application.
 *
 * @example
 *	const App = SpotlightRootDecorator(ApplicationView);
 *
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Higher-order component
 *
 * @returns {Function} SpotlightRootDecorator
 * @memberof spotlight/SpotlightRootDecorator
 * @hoc
 */
const SpotlightRootDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'SpotlightRootDecorator';

		navigableFilter = (elem) => {
			while (elem && elem !== document && elem.nodeType === 1) {
				if (elem.getAttribute('data-container-disabled') === 'true') return false;
				elem = elem.parentNode;
			}
		}

		componentWillMount () {
			if (typeof window === 'object') {
				Spotlight.initialize();
				Spotlight.add(spotlightRootContainerName, {
					selector: '.' + spottableClass,
					navigableFilter: this.navigableFilter,
					restrict: 'none'
				});
			}
		}

		componentDidMount () {
			Spotlight.focus();
		}

		componentWillUnmount () {
			Spotlight.terminate();
		}

		render () {
			return <Wrapped data-container-id={spotlightRootContainerName} {...this.props} />;
		}
	};
});

export default SpotlightRootDecorator;
export {
	spotlightRootContainerName,
	SpotlightRootDecorator
};
