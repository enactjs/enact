/**
 * Exports the {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}
 * higher-order component.
 *
 * @module spotlight/SpotlightRootDecorator
 * @exports SpotlightRootDecorator
 */

import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {useCallback, useEffect, useRef} from 'react';

import {spottableClass} from '../Spottable';
import {rootContainerId} from '../src/container';
import {setFocusEffectClass} from '../src/focusEffect';
import {activateInputType, applyInputTypeToNode, getInputInfo, getInputType, setInputType} from '../src/inputType';
import Spotlight from '../src/spotlight';

import './debug.less';

/**
 * Default configuration for SpotlightRootDecorator
 *
 * @hocconfig
 * @memberof spotlight/SpotlightRootDecorator.SpotlightRootDecorator
 */
const defaultConfig = {
	/**
	 * A CSS class name to apply globally to every spottable component when it receives spotlight focus.
	 *
	 * This is the declarative equivalent of calling `setFocusEffectClass` imperatively. It acts as
	 * an app-wide default
	 *
	 * Example:
	 * ```js
	 * const App = SpotlightRootDecorator({focusEffectClass: css.focusClass}, AppBase);
	 * ```
	 *
	 * @type {String}
	 * @default null
	 * @public
	 * @memberof spotlight/SpotlightRootDecorator.SpotlightRootDecorator.defaultConfig
	 */
	focusEffectClass: null,

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
	const {focusEffectClass, noAutoFocus, rootId} = config;

	function SpotlightRootDecoratorBase (props) {
		const containerNode = useRef(null);
		const hasFocusedIn = useRef(false);

		const applyInputType = useCallback(() => {
			if (containerNode.current) {
				applyInputTypeToNode(containerNode.current);
			}
		}, []);

		const handleFocusInBeforeMount = useCallback(() => {
			hasFocusedIn.current = true;
		}, []);

		const handleFocusIn = useCallback(() => {
			if (!getInputInfo().applied) {
				applyInputType();
			}
		}, [applyInputType]);

		// For key input
		const handleKeyDown = useCallback((ev) => {
			const {keyCode} = ev;
			if (is('enter', keyCode) && containerNode.current.classList.contains('spotlight-input-touch')) {
				// Prevent onclick event trigger by enter key
				ev.preventDefault();
			}

			setTimeout(() => {
				if (!getInputInfo().activated) {
					setInputType('key');
				}
				applyInputType();
			}, 0);
		}, [applyInputType]);

		// For mouse input
		const handlePointerMove = useCallback((ev) => {
			if (ev.pointerType === 'mouse') {
				setInputType('mouse');
				applyInputType();
			}
		}, [applyInputType]);

		// For touch input
		const handlePointerOver = useCallback((ev) => {
			if (ev.pointerType === 'touch') {
				setInputType('touch');
				applyInputType();
			}
		}, [applyInputType]);

		// One-time initialization equivalent to the class constructor.
		// Runs synchronously on first render so the focusin listener is in place
		// before the component mounts (mirrors the constructor behaviour).
		const initialized = useRef(false);
		if (!initialized.current) {
			initialized.current = true;

			if (focusEffectClass) {
				setFocusEffectClass(focusEffectClass);
			}

			if (typeof window === 'object') {
				Spotlight.initialize({
					selector: '.' + spottableClass,
					restrict: 'none'
				});

				Spotlight.set(rootContainerId, {
					overflow: true
				});

				// Sometimes the focusin event is fired before the effect runs.
				document.addEventListener('focusin', handleFocusInBeforeMount, {capture: true});
			}
		}

		useEffect(() => {
			if (!noAutoFocus) {
				Spotlight.focus();
			}

			if (typeof document === 'object') {
				containerNode.current = document.querySelector('#' + rootId);

				document.addEventListener('focusin', handleFocusIn, {capture: true});
				document.addEventListener('keydown', handleKeyDown, {capture: true});
				document.addEventListener('pointermove', handlePointerMove, {capture: true});
				document.addEventListener('pointerover', handlePointerOver, {capture: true});
				document.removeEventListener('focusin', handleFocusInBeforeMount, {capture: true});
			}

			if (hasFocusedIn.current) {
				hasFocusedIn.current = false;
				handleFocusIn();
			}

			return () => {
				Spotlight.terminate();

				if (typeof document === 'object') {
					document.removeEventListener('focusin', handleFocusIn, {capture: true});
					document.removeEventListener('keydown', handleKeyDown, {capture: true});
					document.removeEventListener('pointermove', handlePointerMove, {capture: true});
					document.removeEventListener('pointerover', handlePointerOver, {capture: true});
				}
			};
		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<Wrapped {...props} />
		);
	}

	SpotlightRootDecoratorBase.displayName = 'SpotlightRootDecorator';

	return SpotlightRootDecoratorBase;
});

export default SpotlightRootDecorator;
export {
	SpotlightRootDecorator,
	activateInputType,
	getInputType,
	setFocusEffectClass,
	setInputType
};
