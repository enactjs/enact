import hoc from '@enact/core/hoc';
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
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Higher-order component
 *
 * @returns {Function} SpotlightContainerDecorator
 */
const SpotlightContainerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {
		constructor (props) {
			super(props);
			this.state = {
				containerId: ''
			};
		}

		navigableFilter = (elem) => {
			let containerId;
			while (elem && elem !== document && elem.nodeType === 1) {
				containerId = elem.getAttribute('data-container-id');
				if (containerId
						&& containerId != this.state.containerId
						&& elem.getAttribute('data-container-disabled') == 'true') {

					return false;
				}
				elem = elem.parentNode;
			}
		}

		componentWillMount () {
			const containerId = Spotlight.add(),
				selector = '[data-container-id="' + containerId + '"]:not([data-container-disabled="true"]) .' + spottableClass,
				cfg = Object.assign({}, config, {selector, navigableFilter: this.navigableFilter});

			Spotlight.set(containerId, cfg);
			this.setState({containerId: containerId});
		}

		componentWillUnmount () {
			Spotlight.remove(this.state.containerId);
		}

		render () {
			const containerId = this.state.containerId,
				props = Object.assign({}, this.props);

			props['data-container-id'] = containerId;

			return <Wrapped {...props} />;
		}
	};
});

export default SpotlightContainerDecorator;
export {SpotlightContainerDecorator};
