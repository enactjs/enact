import {add} from '@enact/core/keymap';
import useClass from '@enact/core/useClass';
import React from 'react';

import {Cancel, isCancel} from './Cancel';
import {addCancelHandler, removeCancelHandler} from './cancelHandler';
import {addModal, removeModal} from './modalHandler';

// Add keymap for escape key
add('cancel', 27);

function mountEffect (state, modal) {
	// layout effect order doesn't appear to be consistent with request order so we must invoked
	// addModal synchronously with render. addModal guards against dupliate entries so calling
	// on effect creation is safe but we still need a cleanup fn in order to remove the modal on
	// unmount (which is guaranteed to be only once with the empty memo array below).
	if (modal) addModal(state);

	return () => () => {
		if (modal) removeModal(state);
	};
}

/**
 * Configuration for `useCancel`
 *
 * @typedef {Object} useCancelConfig
 * @memberof ui/Cancelable
 * @property {Boolean}  [modal = false] The flag to cancel events globally
 * @property {Function} [onCancel]      The event including the `stopPropagation` function will be passed as the first parameter.
 *                                      If the functions is not called, it allows event propagation.
 *                                      If the function is called, it calls `stop` and `stopImmediate`.
 * @private
 */

/**
 * Object returned by `useCancel`
 *
 * @typedef {Object} useCancelInterface
 * @memberof ui/Cancelable
 * @property {Function} [cancle] Handle to run when needed to cancel.
 * @private
 */

/**
 * Manages a cancel action.
 *
 * The cancel action is handled via the configured `onCancel` handler.
 *
 * @param {useCancelConfig} config Configuration options
 * @returns {useCancelInterface}
 * @private
 */
function useCancel ({modal = false, onCancel, ...rest} = {}) {
	const cancel = useClass(Cancel, {onCancel});

	React.useLayoutEffect(mountEffect(cancel, modal), [cancel]); // eslint-disable-line react-hooks/exhaustive-deps

	cancel.setContext(rest);

	return {
		cancel: cancel.handleCancel
	};
}

export default useCancel;
export {
	addCancelHandler,
	isCancel,
	removeCancelHandler,
	useCancel
};

