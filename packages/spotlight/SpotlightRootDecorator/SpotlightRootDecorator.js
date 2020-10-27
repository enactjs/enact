/**
 * Exports the {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}
 * higher-order component.
 *
 * @module spotlight/SpotlightRootDecorator
 * @exports SpotlightRootDecorator
 */

import hoc from '@enact/core/hoc';
import React from 'react';

import Spotlight from '../src/spotlight';
import {spottableClass} from '../Spottable';

import {rootContainerId} from '../src/container';

import '../styles/debug.less';

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
 * Constructs a higher-order component that initializes and enables Spotlight 5-way navigation
 * within an application.
 *
 * No additional properties are passed to the wrapped component.
 *
 * Example:
 * ```
 *	const App = SpotlightRootDecorator(ApplicationView);
 * ```
 *
 * @class SpotlightRootDecorator
 * @memberof spotlight/SpotlightRootDecorator
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Wrapped higher-order component
 * @returns {Function} SpotlightRootDecorator
 * @hoc
 */
const SpotlightRootDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {noAutoFocus} = config;

	return class extends React.Component {
		static displayName = 'SpotlightRootDecorator';

		constructor (props) {
			super(props);

			if (typeof window === 'object') {
				Spotlight.initialize({
					selector: '.' + spottableClass,
					restrict: 'none'
				});

				Spotlight.set(rootContainerId, {
					overflow: true
				});
			}
		}

		componentDidMount () {
			if (!noAutoFocus) {
				Spotlight.focus();
			}

			document.addEventListener('pointerover', this.handleMode);
		}

		componentWillUnmount () {
			Spotlight.terminate();

			document.removeEventListener('pointerover', this.handleMode);
		}

		handleMode = (ev) => {
			if (ev.pointerType === 'touch') {
				document.querySelector('#root > div').classList.remove('mouse-mode');
				document.querySelector('#root > div').classList.add('touch-mode');
			} else if (ev.pointerType === 'mouse') {
				document.querySelector('#root > div').classList.add('mouse-mode');
				document.querySelector('#root > div').classList.remove('touch-mode');
			} else {
				document.querySelector('#root > div').classList.remove('mouse-mode');
				document.querySelector('#root > div').classList.remove('touch-mode');
			}
		}

		navigableFilter = (elem) => {
			while (elem && elem !== document && elem.nodeType === 1) {
				if (elem.getAttribute('data-spotlight-container-disabled') === 'true') return false;
				elem = elem.parentNode;
			}
		};

		render () {
			return <Wrapped {...this.props} />;
		}
	};
});

export default SpotlightRootDecorator;
export {
	SpotlightRootDecorator
};
