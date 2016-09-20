import hoc from 'enact-core/hoc';
import React from 'react';

import {Spotlight, spotlightRootContainerName} from './spotlight';
import {spottableClass} from './spottable';

const defaultConfig = {};

const SpotlightRootDecorator = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'SpotlightRootDecorator';

		componentWillMount () {
			Spotlight.initialize();
			Spotlight.add(spotlightRootContainerName, {
				selector: '.' + spottableClass
			});
		}

		componentDidMount () {
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
