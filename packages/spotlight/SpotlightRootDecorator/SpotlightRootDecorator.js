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
	const {getInputTypeSetter, noAutoFocus, rootId} = config;
	const rootNode = typeof document === 'object' && document.querySelector('#' + rootId) || document;
	const input = {
		activated: false,
		applied: false,
		types: {
			key: true,
			mouse: false,
			touch: false
		}
	};

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

			if (typeof getInputTypeSetter === 'function') {
				getInputTypeSetter(this.setInputType, this.activateInputType);
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

		activateInputType = (activated) => {
			input.activated = activated;
		};

		applyInputType = () => {
			if (this && this.containerRef && this.containerRef.current) {
				Object.keys(input.types).map((type) => {
					this.containerRef.current.classList.toggle('spotlight-input-' + type, input.types[type]);
				});
				input.applied = true;
			} else {
				input.applied = false;
			}
		};

		setInputType = (inputType) => {
			if (Object.prototype.hasOwnProperty.call(input.types, inputType)) {
				Object.keys(input.types).map((type) => {
					input.types[type] = false;
				});
				input.types[inputType] = true;

				this.applyInputType();
			}
		};

		handlePointerOver = (ev) => this.setInputType(ev.pointerType);

		handleFocusIn = () => {
			if (!input.applied) {
				this.applyInputType();
			}
		};

		handleKeyDown = (ev) => {
			const {keyCode} = ev;
			if (is('enter', keyCode) && this.containerRef.current.classList.contains('spotlight-input-touch')) {
				// Prevent onclick event trigger by enter key
				ev.preventDefault();
			}

			if (!input.activated) {
				this.setInputType('key');
			}
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
