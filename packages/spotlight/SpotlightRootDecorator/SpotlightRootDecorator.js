/**
 * Exports the {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}
 * higher-order component.
 *
 * @module spotlight/SpotlightRootDecorator
 * @exports SpotlightRootDecorator
 */

import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {Component} from 'react';

import Spotlight from '../src/spotlight';
import {spottableClass} from '../Spottable';

import {rootContainerId} from '../src/container';

import '../styles/debug.less';

const input = {
	activated: false,
	applied: false,
	types: {
		key: true,
		mouse: false,
		touch: false
	}
};

const activateInputType = (activated) => {
	input.activated = activated;
};

const getInputType = () => {
	return Object.keys(input.types).find(type => input.types[type]);
};

const setInputType = (inputType) => {
	if (Object.prototype.hasOwnProperty.call(input.types, inputType) && !input.types[inputType]) {
		Object.keys(input.types).map((type) => {
			input.types[type] = false;
		});
		input.types[inputType] = true;

		input.applied = false;
	}
};

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
	noAutoFocus: false,

	/**
	 * Specifies the id of the React DOM tree root node
	 *
	 * @type {String}
	 * @default 'root'
	 * @public
	 * @memberof spotlight/SpotlightRootDecorator.SpotlightRootDecorator.defaultConfig
	 */
	rootId: 'root'
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
	const {noAutoFocus, rootId} = config;

	return class extends Component {
		static displayName = 'SpotlightRootDecorator';

		constructor (props) {
			super(props);

			this.containerNode = null;

			if (typeof window === 'object') {
				Spotlight.initialize({
					selector: '.' + spottableClass,
					restrict: 'none'
				});

				Spotlight.set(rootContainerId, {
					overflow: true
				});

				// Sometimes the focusin event is fired before componentDidMount.
				document.addEventListener('focusin', this.handleFocusInBeforeMount, {capture: true});
			}
		}

		componentDidMount () {
			if (!noAutoFocus) {
				Spotlight.focus();
			}

			if (typeof document === 'object') {
				this.containerNode = document.querySelector('#' + rootId);

				document.addEventListener('focusin', this.handleFocusIn, {capture: true});
				document.addEventListener('keydown', this.handleKeyDown, {capture: true});
				document.addEventListener('pointermove', this.handlePointerMove, {capture: true});
				document.addEventListener('pointerover', this.handlePointerOver, {capture: true});
				document.removeEventListener('focusin', this.handleFocusInBeforeMount, {capture: true});
			}

			if (this.hasFocusedIn) {
				this.hasFocusedIn = false;
				this.handleFocusIn();
			}
		}

		componentWillUnmount () {
			Spotlight.terminate();

			if (typeof document === 'object') {
				document.removeEventListener('focusin', this.handleFocusIn, {capture: true});
				document.removeEventListener('keydown', this.handleKeyDown, {capture: true});
				document.removeEventListener('pointermove', this.handlePointerMove, {capture: true});
				document.removeEventListener('pointerover', this.handlePointerOver, {capture: true});
			}
		}

		applyInputType = () => {
			if (this && this.containerNode) {
				Object.keys(input.types).map((type) => {
					this.containerNode.classList.toggle('spotlight-input-' + type, input.types[type]);
				});
				input.applied = true;
			}
		};

		handleFocusInBeforeMount = () => {
			this.hasFocusedIn = true;
		};

		handleFocusIn = () => {
			if (!input.applied) {
				this.applyInputType();
			}
		};

		// For key input
		handleKeyDown = (ev) => {
			const {keyCode} = ev;
			if (is('enter', keyCode) && this.containerNode.classList.contains('spotlight-input-touch')) {
				// Prevent onclick event trigger by enter key
				ev.preventDefault();
			}

			setTimeout(() => {
				if (!input.activated) {
					setInputType('key');
				}
				this.applyInputType();
			}, 0);
		};

		// For mouse input
		handlePointerMove = (ev) => {
			if (ev.pointerType === 'mouse') {
				setInputType('mouse');
				this.applyInputType();
			}
		};

		// For touch input
		handlePointerOver = (ev) => {
			if (ev.pointerType === 'touch') {
				setInputType('touch');
				this.applyInputType();
			}
		};

		render () {
			return (
				<Wrapped {...this.props} />
			);
		}
	};
});

export default SpotlightRootDecorator;
export {
	SpotlightRootDecorator,
	activateInputType,
	getInputType,
	setInputType
};
