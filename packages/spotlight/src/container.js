import hoc from 'enact-core/hoc';
import React from 'react';

import Spotlight from './spotlight';
import {spottableClass} from './spottable';

const defaultConfig = {
	/**
	 * Directs which component receives focus when gaining focus from another container.
	 *
	 * @type {String}
	 * @default ''
	 * @public
	 */
	enterTo: '',

	/**
	 * Restricts or prioritizes navigation when focus attempts to leave the container.
	 *
	 * @type {String}
	 * @default 'none'
	 * @public
	 */
	restrict: 'none'
};

/**
 * Constructs a Higher-order Component that allows Spotlight focus to be passed to 
 * its own configurable hierarchy of spottable child controls.
 *
 * @example
 *	const DefaultContainer = SpotlightContainerDecorator(Component);
 *	const SelfRestrictedContainer = SpotlightContainerDecorator({restrict: 'self-only'}, Component);
 *
 * @param  {Object}		defaultConfig Set of default configuration parameters
 * @param  {Function}	Higher-order component
 *
 * @returns {Function}	SpotlightContainerDecorator
 */
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
