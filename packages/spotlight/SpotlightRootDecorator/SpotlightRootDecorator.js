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
 * Default configuration for SpotlightRootDecorator
 *
 * @hocconfig
 * @memberof spotlight/SpotlightRootDecorator.SpotlightRootDecorator
 */
const defaultConfig = {
	/**
	 * When `true`, the contents of the component will not receive spotlight focus after being rendered.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 * @memberof spotlight/SpotlightRootDecorator.SpotlightRootDecorator.defaultConfig
	 */
	noAutoFocus: false
};

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
const SpotlightRootDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {noAutoFocus} = config;

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
				const palmSystem = window.PalmSystem;

				Spotlight.initialize();
				Spotlight.add(spotlightRootContainerName, {
					selector: '.' + spottableClass,
					navigableFilter: this.navigableFilter,
					restrict: 'none'
				});

				if (palmSystem && palmSystem.cursor) {
					Spotlight.setPointerMode(palmSystem.cursor.visibility);
				}
			}
		}

		componentDidMount () {
			if (!noAutoFocus) {
				Spotlight.focus();
			}
		}

		componentWillUnmount () {
			Spotlight.terminate();
		}

		render () {
			return <Wrapped {...this.props} />;
		}
	};
});

export default SpotlightRootDecorator;
export {
	spotlightRootContainerName,
	SpotlightRootDecorator
};
