import hoc from 'enact-core/hoc';
import React from 'react';

import Spotlight from './spotlight';
import {spottableClass} from './spottable';

const defaultConfig = {
	enterTo: '',
	restrict: 'none'
};

const SpotlightContainerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {
		constructor (props) {
			super(props);
			this.state = {
				containerId: ''
			};
		}

		componentWillMount () {
			const containerId = Spotlight.add(),
				selector = '.' + containerId + ' .' + spottableClass,
				cfg = Object.assign({}, config, {selector: selector});

			Spotlight.set(containerId, cfg);
			this.setState({containerId: containerId});
		}

		componentWillUnmount () {
			Spotlight.remove(this.state.containerId);
		}

		render () {
			const containerId = this.state.containerId,
				props = Object.assign({}, this.props, {containerId});

			if (props.className) {
				props.className += ' ' + containerId;
			} else {
				props.className = containerId;
			}

			return <Wrapped {...props} />;
		}
	};
});

export default SpotlightContainerDecorator;
export {SpotlightContainerDecorator};
