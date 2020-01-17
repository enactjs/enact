import Registry from '@enact/core/internal/Registry';
import React from 'react';

const RadioContext = React.createContext();

function activate (state, item) {
	// if the active radio item isn't item and item is active, try to deactivate all the
	// other radio items
	if (state.active && state.active !== item) {
		state.registry.notify({action: 'deactivate'}, i => i === state.active);
	}

	state.active = item;
}

function deactivate (state, item) {
	if (state.active === item) {
		state.active = null;
	}
}

function createRegistry (state) {
	if (state.registry) return;

	function handleNotify (ev, instance) {
		if (ev.action === 'activate') {
			activate(state, instance);
		} else if (ev.action === 'deactivate') {
			deactivate(state, instance);
		}
	}

	state.active = null;
	state.registry = Registry.create(handleNotify);
}

/**
 * A higher-order component that establishes a radio group context for its descendants.
 *
 * Any descendants that are wrapped by {@link ui/RadioDecorator.RadioDecorator} will be mutually exclusive.
 *
 * @class RadioControllerDecorator
 * @memberof ui/RadioDecorator
 * @hoc
 * @public
 */
function useRadioController () {
	const {current: state} = React.useRef({
		active: null,
		registry: null
	});

	createRegistry(state);

	return [RadioContext, state.registry.register];
}

export default useRadioController;
export {
	useRadioController,
	RadioContext
};
