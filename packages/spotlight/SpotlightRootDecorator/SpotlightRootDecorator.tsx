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

import type {SpotlightRootDecoratorConfig} from '../types/SpotlightContainerConfig';
import type {SpotlightRootDecoratorProps} from '../types/SpotlightContainerProps';

import {spottableClass} from '../Spottable';
import {getContainerConfig, getContainerDefaultElement, getContainersForNode, rootContainerId} from '../src/container';
import {setFocusEffectClass} from '../src/focusEffect';
import {activateInputType, applyInputTypeToNode, getInputInfo, getInputType, setInputType} from '../src/inputType';
import Spotlight from '../src/spotlight';

import './debug.less';

// A container can focus a header before its default element (panel body, list item) exists.
// Once that element exists, initial focus should move there. A later attempt must not call
// Spotlight.focus() with no target: that jumps to the first spottable and leaves the body.
function nextAutofocusTarget (current: HTMLElement | null): HTMLElement | 'stay' | 'wait' {
	if (!current) return 'wait';

	const containerIds = getContainersForNode(current);
	let waiting = false;

	for (let i = containerIds.length - 1; i >= 0; i--) {
		const config = getContainerConfig(containerIds[i]);
		if (!config?.defaultElement) continue;

		const preferred = getContainerDefaultElement(containerIds[i]) as HTMLElement | null | undefined;
		if (!preferred) {
			waiting = true;
			continue;
		}

		if (preferred === current || preferred.contains(current)) {
			return 'stay';
		}

		return preferred;
	}

	return waiting ? 'wait' : 'stay';
}

/**
 * Default configuration for SpotlightRootDecorator
 *
 * @hocconfig
 * @memberof spotlight/SpotlightRootDecorator.SpotlightRootDecorator
 */
const defaultConfig: SpotlightRootDecoratorConfig = {
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
const SpotlightRootDecorator = hoc(defaultConfig, (config: SpotlightRootDecoratorConfig, Wrapped) => {
	const {focusEffectClass, noAutoFocus, rootId} = config;

	function SpotlightRootDecoratorBase (props: SpotlightRootDecoratorProps) {
		const containerNode = useRef<HTMLElement | null>(null);
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
		const handleKeyDown = useCallback((ev: KeyboardEvent) => {
			const {keyCode} = ev;
			if (is('enter', keyCode) && containerNode.current?.classList.contains('spotlight-input-touch')) {
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
		const handlePointerMove = useCallback((ev: PointerEvent) => {
			if (ev.pointerType === 'mouse') {
				setInputType('mouse');
				applyInputType();
			}
		}, [applyInputType]);

		// For touch input
		const handlePointerOver = useCallback((ev: PointerEvent) => {
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
			let attempts = 0;
			let timer = 0;

			// List items are measured after this effect. Retry only until the container's
			// default element (a panel body control or list item) has focus. Do not call
			// Spotlight.focus() again once that control has it.
			const focusWhenIdle = () => {
				if (noAutoFocus || Spotlight.getPointerMode() || attempts >= 20) return;

				if (!Spotlight.getCurrent()) {
					Spotlight.focus(void 0);
				}

				let decision = nextAutofocusTarget(Spotlight.getCurrent() as HTMLElement | null);
				if (decision !== 'stay' && decision !== 'wait') {
					Spotlight.focus(decision);
					decision = nextAutofocusTarget(Spotlight.getCurrent() as HTMLElement | null);
				}

				if (decision !== 'stay') {
					attempts += 1;
					timer = window.setTimeout(focusWhenIdle, 50);
				}
			};

			focusWhenIdle();

			if (typeof document === 'object') {
				containerNode.current = document.querySelector('#' + rootId) as HTMLElement | null;

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
				window.clearTimeout(timer);
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
