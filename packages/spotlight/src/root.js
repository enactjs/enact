import hoc from 'enact-core/hoc';
import React from 'react';

import {Spotlight, spotlightRootContainerName} from './spotlight';
import {spottableClass} from './spottable';

const defaultConfig = {};

/**
 * Constructs a Higher-order Component that initializes and enables Spotlight
 * 5-way navigation within an application.
 *
 * @example
 *	const App = SpotlightRootDecorator(ApplicationView);
 *
 * @param  {Object}		defaultConfig Set of default configuration parameters
 * @param  {Function}	Higher-order component
 *
 * @returns {Function}	SpotlightRootDecorator
 */
const SpotlightRootDecorator = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {

		static displayName = 'SpotlightRootDecorator';

		componentDidMount () {
			Spotlight.initialize();
			Spotlight.add(spotlightRootContainerName, {
				selector: '.' + spottableClass
			});
			Spotlight.focus();
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
export {SpotlightRootDecorator};
