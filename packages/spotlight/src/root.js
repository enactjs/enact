import React from 'react';
import hoc from './hoc';
import {Spotlight, spotlightRootContainerName} from './spotlight';
import {spottableClass} from './spottable';

const defaultConfig = {};

const SpotlightRootDecorator = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {
		displayName = Wrapped.displayName ? 'SpotlightRootDecorator-' + Wrapped.displayName : 'SpotlightRootDecorator';

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
