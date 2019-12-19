/**
 * A higher-order component that manages activation of components.
 *
 * @module ui/RadioDecorator
 * @exports RadioDecorator
 * @exports RadioControllerDecorator
 */

import React from 'react';

import {RadioContext} from './useRadioController';

function notifyController (state, active) {
	if (state.controller && active) {
		state.controller.notify({action: 'activate'});
	}
}

function mountEffect (state, context) {
	return () => {
		if (context && typeof context === 'function') {
			state.controller = context(() => state.deactivate && state.deactivate());

			return () => {
				state.controller.unregister();
			};
		}
	};
}

function notifyEffect (state, active) {
	return () => notifyController(state, active);
}

const notify = (action, state) => {
	if (state.controller) {
		state.controller.notify({action});
	}
};

function useRadio (active, deactivate) {
	const radioContext = React.useContext(RadioContext);
	const [state] = React.useState({});

	// bind deactivate on each render to capture the latest props
	state.deactivate = deactivate;

	React.useEffect(mountEffect(state, radioContext), []);
	React.useEffect(notifyEffect(state, active), [active]);

	return {
		activate: () => notify('activate', state),
		deactivate: () => notify('deactivate', state)
	};
}

export default useRadio;
export {
	useRadio
};
