import {on, off} from '@enact/core/dispatcher';

const modals = [];

const dispatchToModals = (ev) => {
	for (let i = modals.length - 1, handled = false; !handled && i >= 0; i--) {
		handled = !modals[i].handleModalCancel(ev);
	}
};

const addModal = (obj) => {
	if (modals.push(obj) === 1) {
		on('keyup', dispatchToModals);
	}
};

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
