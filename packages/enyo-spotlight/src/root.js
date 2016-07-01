import React from 'react';
import hoc from './hoc';

import Spotlight from './spotlight';
import {spottableClass} from './spottable';

const defaultConfig = {};

const SpotlightRootDecorator = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {
		componentDidMount () {
			Spotlight.initialize();
			Spotlight.add({
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
