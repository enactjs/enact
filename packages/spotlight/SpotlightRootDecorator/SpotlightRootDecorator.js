/**
 * Exports the {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}
 * higher-order component.
 *
 * @module spotlight/SpotlightRootDecorator
 * @exports SpotlightRootDecorator
 */

import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import LS2Request from '@enact/webos/LS2Request/LS2Request';
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
	let lastInputType = 'key';

	return class extends React.Component {
		static displayName = 'SpotlightRootDecorator';

		constructor (props) {
			super(props);

			// In other modules, this reference DOM element could be referred by `#root > div`.
			this.containerRef = React.createRef();

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
			this.getLastInputType().finally(() => {
				if (this && this.containerRef && this.containerRef.current) {
					// Set initial mode
					if (lastInputType === 'touch') {
						this.containerRef.current.classList.remove('non-touch-mode');
						this.containerRef.current.classList.add('touch-mode');
					} else {
						this.containerRef.current.classList.add('non-touch-mode');
						this.containerRef.current.classList.remove('touch-mode');
					}
				}
			});

			if (!noAutoFocus) {
				Spotlight.focus();
			}

			document.addEventListener('visibilitychange', this.handleVisibilityChange, {capture: true});
			document.addEventListener('pointerover', this.handlePointerOver, {capture: true});
			document.addEventListener('keydown', this.handleKeyDown, {capture: true});
		}

		componentWillUnmount () {
			Spotlight.terminate();
			document.removeEventListener('visibilitychange', this.handleVisibilityChange, {capture: true});
			document.removeEventListener('pointerover', this.handlePointerOver, {capture: true});
			document.removeEventListener('keydown', this.handleKeyDown, {capture: true});
		}

		// FIXME: This is a temporary support for NMRM
		getLastInputType = () => {
			return new Promise(function (resolve, reject) {
				if (window.PalmSystem) {
					new LS2Request().send({
						service: 'luna://com.webos.surfacemanager',
						method: 'getLastInputType',
						subscribe: true,
						onSuccess: function (res) {
							lastInputType = res.lastInputType;
							resolve();
						},
						onFailure: function (err) {
							reject('Failed to get system LastInputType: ' + JSON.stringify(err));
						}
					});
				} else {
					resolve();
				}
			}
			);
		};

		handleVisibilityChange = () => {
			if (document.hidden === false) {
				if (lastInputType === 'touch') {
					this.containerRef.current.classList.remove('non-touch-mode');
					this.containerRef.current.classList.add('touch-mode');
				} else {
					this.containerRef.current.classList.add('non-touch-mode');
					this.containerRef.current.classList.remove('touch-mode');
				}
			}
		};

		handlePointerOver = (ev) => {
			if (ev.pointerType === 'touch') {
				this.containerRef.current.classList.remove('non-touch-mode');
				this.containerRef.current.classList.add('touch-mode');
			} else if (ev.pointerType === 'mouse') {
				this.containerRef.current.classList.add('non-touch-mode');
				this.containerRef.current.classList.remove('touch-mode');
			} else {
				this.containerRef.current.classList.remove('non-touch-mode');
				this.containerRef.current.classList.remove('touch-mode');
			}
		};

		handleKeyDown = (ev) => {
			const {keyCode} = ev;
			if (is('enter', keyCode) && this.containerRef.current.classList.contains('touch-mode')) {
				// Prevent onclick event trigger by enter key
				ev.preventDefault();
			}

			this.containerRef.current.classList.add('non-touch-mode');
			this.containerRef.current.classList.remove('touch-mode');
		};

		navigableFilter = (elem) => {
			while (elem && elem !== document && elem.nodeType === 1) {
				if (elem.getAttribute('data-spotlight-container-disabled') === 'true') return false;
				elem = elem.parentNode;
			}
		};

		render () {
			return (
				<div ref={this.containerRef}>
					<Wrapped {...this.props} />
				</div>
			);
		}
	};
});

export default SpotlightRootDecorator;
export {
	SpotlightRootDecorator
};
