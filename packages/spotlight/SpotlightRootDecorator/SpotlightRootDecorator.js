/**
 * Exports the {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}
 * higher-order component.
 *
 * @module spotlight/SpotlightRootDecorator
 * @exports SpotlightRootDecorator
 */

import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {Component, createRef} from 'react';

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
	const {getConfigEffect, noAutoFocus, rootId} = config;
	const rootNode = typeof document === 'object' && document.querySelector('#' + rootId) || document;
	let lastInputType = 'key';
	let needConfigEffect = false;

	return class extends Component {
		static displayName = 'SpotlightRootDecorator';

		constructor (props) {
			super(props);

			this.containerRef = createRef();

			if (typeof window === 'object') {
				Spotlight.initialize({
					selector: '.' + spottableClass,
					restrict: 'none'
				});

				Spotlight.set(rootContainerId, {
					overflow: true
				});
			}

			if (typeof getConfigEffect === 'function') {
				getConfigEffect(this.configEffect);
			}
		}

		componentDidMount () {
			if (!noAutoFocus) {
				Spotlight.focus();
			}

			rootNode.addEventListener('focusin', this.handleFocusIn, {capture: true});
			rootNode.addEventListener('pointerover', this.handlePointerOver, {capture: true});
			rootNode.addEventListener('keydown', this.handleKeyDown, {capture: true});
		}

		componentWillUnmount () {
			Spotlight.terminate();

			rootNode.removeEventListener('focusin', this.handleFocusIn, {capture: true});
			rootNode.removeEventListener('pointerover', this.handlePointerOver, {capture: true});
			rootNode.removeEventListener('keydown', this.handleKeyDown, {capture: true});
		}

		configEffect = (inputType) => {
			if (this && this.containerRef && this.containerRef.current) {
				if (inputType === 'touch') {
					this.containerRef.current.classList.remove('spotlight-on-focus');
					this.containerRef.current.classList.add('spotlight-on-active');
				} else if (inputType === 'mouse' || inputType === 'key') {
					this.containerRef.current.classList.add('spotlight-on-focus');
					this.containerRef.current.classList.remove('spotlight-on-active');
				} else {
					this.containerRef.current.classList.remove('spotlight-on-focus');
					this.containerRef.current.classList.remove('spotlight-on-active');
				}
				needConfigEffect = false;
			} else {
				lastInputType = inputType;
				needConfigEffect = true;
			}
		};

		handlePointerOver = (ev) => this.configEffect(ev.pointerType);

		handleFocusIn = () => {
			if (needConfigEffect) {
				this.configEffect(lastInputType);
			}
		};

		handleKeyDown = (ev) => {
			const {keyCode} = ev;
			if (is('enter', keyCode) && this.containerRef.current.classList.contains('spotlight-on-active')) {
				// Prevent onclick event trigger by enter key
				ev.preventDefault();
			}

			this.configEffect('key');
		};

		navigableFilter = (elem) => {
			while (elem && elem !== rootNode && elem.nodeType === 1) {
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
