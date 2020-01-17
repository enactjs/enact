import {forward, handle, stop, stopImmediate} from '@enact/core/handle';
import {add} from '@enact/core/keymap';
import invariant from 'invariant';
import React from 'react';

import {forCancel, addCancelHandler, removeCancelHandler} from './cancelHandler';
import {addModal, removeModal} from './modalHandler';

/**
 * Default config for {@link ui/Cancelable.Cancelable}
 *
 * @memberof ui/Cancelable.Cancelable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Called when a cancel action is invoked by the user.
	 *
	 * If it is a string, the cancel handler will attempt to invoke a function passed as a prop of
	 * that name. If it is a function, that function will be called with the current props as the
	 * only argument.
	 *
	 * If the function handles the cancel action, it should call `stopPropagation()` on the provided
	 * event object prevent container or `modal` Cancelable instances from also handling the action.
	 *
	 * @type {String|Function}
	 * @required
	 * @memberof ui/Cancelable.Cancelable.defaultConfig
	 */
	onCancel: null,

	/**
	 * Subscribes to cancel events globally for this instance.
	 *
	 * When `true`, the `Cancelable` instance will handle cancel events globally that successfully
	 * bubble up to `window` regardless of which component is focused.
	 *
	 * `modal` cancel handlers are processed in reverse of the order they are created such that the
	 * innermost instance (in terms of the component hierarchy) have the first opportunity to handle
	 * the event before its container components.
	 *
	 * @type {String}
	 * @default false
	 * @memberof ui/Cancelable.Cancelable.defaultConfig
	 */
	modal: false,

	/**
	 * The component that will contain the wrapped component.
	 *
	 * When set, the wrapped component will be contained within an instance of `component`. This may
	 * be necessary if the props passed to the wrapped component are not placed on the root element.
	 *
	 * @type {Component}
	 * @default null
	 * @memberof ui/Cancelable.Cancelable.defaultConfig
	 */
	component: null
};

// Add keymap for escape key
add('cancel', 27);

function configureCancel (config) {
	const {
		onCancel,
		modal
	} = {...defaultConfig, ...config};

	const onCancelIsString = typeof onCancel === 'string';
	const onCancelIsFunction = typeof onCancel === 'function';
	const dispatchCancelToConfig = function (ev, props) {
		// by default, we return false which allows event propagation because it will "break" the
		// handler chain and not call `stop` and `stopImmediate` below
		let stopped = false;

		const cancelEvent = {
			type: 'onCancel',
			stopPropagation: () => {
				stopped = true;
			}
		};

		if (onCancelIsString && typeof props[onCancel] === 'function') {
			// use the custom event name from the config
			cancelEvent.type = onCancel;
			props[onCancel](cancelEvent);
		} else if (onCancelIsFunction) {
			onCancel(cancelEvent, props);
		}

		return stopped;
	};

	const handleCancel = handle(
		forCancel,
		forward('onCancel'),
		dispatchCancelToConfig,
		stop,
		stopImmediate
	);

	const handleKeyUp = handle(
		forward('onKeyUp'),
		// nesting handlers for DRYness. note that if any conditions return false in handleCancel(),
		// this handler chain will stop too
		handleCancel
	);

	function mountEffect (state) {
		return () => {
			addModal(state);

			return () => {
				removeModal(state);
			};
		};
	}

	// eslint-disable-next-line no-shadow
	return function useCancel (props) {
		invariant(onCancel, 'onCancel must be specified with Cancelable');

		if (modal) {
			const {current: state} = React.useRef({
				handleCancel: null,
				rendered: false
			});
			// handleCancel is invoked by the modal listener and needs a reference to the current
			// props
			state.handleCancel = (ev) => handleCancel(ev, props);
			React.useLayoutEffect(mountEffect(state), []);

			return {};
		}

		return {
			onKeyUp: (ev) => handleKeyUp(ev, props)
		};
	};
}

const useCancel = configureCancel();
useCancel.configure = configureCancel;

export default useCancel;
export {
	addCancelHandler,
	configureCancel,
	defaultConfig,
	removeCancelHandler,
	useCancel
};
