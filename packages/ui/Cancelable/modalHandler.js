import {on, off} from '@enact/core/dispatcher';

// Contains references to modal Cancelable instances in LIFO order to allow multiple modals to be
// displayed with the last having the first priority to handle the cancel.
const modals = [];

/**
 * Dispatches the cancel event to each modal `Cancelable` instance. Consistent with
 * {@link core/handle.handle}, returning a falsey value means the event was handled and `true`
 * allows the event to pass to the next handler.
 *
 * @param	{Object}	ev	Event payload
 *
 * @returns	{undefined}
 */
const dispatchToModals = (ev) => {
	for (let i = modals.length - 1, handled = false; !handled && i >= 0; i--) {
		handled = !modals[i].handleModalCancel(ev);
	}
};

/**
 * Adds a modal `Cancelable` instance to the list of modals.
 *
 * @param	{ui/Cancelable.Cancelable}	obj	Cancelable instance
 *
 * @returns	{undefined}
 */
const addModal = (obj) => {
	if (modals.push(obj) === 1) {
		on('keyup', dispatchToModals);
	}
};

/**
 * Removes a modal `Cancelable` instance from the list of modals.
 *
 * @param	{ui/Cancelable.Cancelable}	obj	Cancelable instance
 *
 * @returns	{undefined}
 */
const removeModal = (obj) => {
	const index = modals.indexOf(obj);
	if (index >= 0) {
		modals.splice(index, 1);
	}

	if (modals.length === 0) {
		off('keyup', dispatchToModals);
	}
};

export {addModal, removeModal};
