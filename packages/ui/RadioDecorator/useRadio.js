/**
 * A higher-order component that manages activation of components.
 *
 * @module ui/RadioDecorator
 * @exports RadioDecorator
 * @exports RadioControllerDecorator
 */

import handle, {forward} from '@enact/core/handle';
import React from 'react';

import {RadioContext} from './RadioControllerDecorator';

/**
 * Default config for `RadioDecorator`.
 *
 * @memberof ui/RadioDecorator.RadioDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The event indicating the wrapped component is activated
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/RadioDecorator.RadioDecorator.defaultConfig
	 */
	activate: null,

	/**
	 * The event indicating the wrapped component is deactivated
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/RadioDecorator.RadioDecorator.defaultConfig
	 */
	deactivate: null,

	/**
	 * The name of a boolean prop that activates the wrapped component when it is true.
	 *
	 * @type {String}
	 * @default 'active'
	 * @memberof ui/RadioDecorator.RadioDecorator.defaultConfig
	 */
	prop: 'active'
};

function notifyController (state, active) {
	if (state.controller && active) {
		state.controller.notify({action: 'activate'});
	}
}

function mountEffect (state, context) {
	return () => {
		if (context && typeof context === 'function') {
			state.controller = context(() => state.deactivate());

			return () => {
				state.controller.unregister();
			};
		}
	};
}

function notifyEffect (state, active) {
	return () => notifyController(state, active);
}

const notify = (action) => (ev, props, context) => {
	context.state.controller.notify({action});
};

function configureRadio (config) {
	const {activate, deactivate, prop} = {...defaultConfig, ...config};

	const handleActivate = handle(
		forward(activate),
		notify('activate')
	);

	const handleDeactivate = handle(
		forward(deactivate),
		notify('deactivate')
	);

	// eslint-disable-next-line no-shadow
	return function useRadio (props) {
		const radioContext = React.useContext(RadioContext);
		const [state] = React.useState({});

		// bind deactivate on each render to capture the latest props
		state.deactivate = (ev) => forward(deactivate, ev, props);

		React.useEffect(mountEffect(state, radioContext), []);
		React.useEffect(notifyEffect(state, props[prop]), [props[prop]]);

		const context = {state};
		const updated = {};
		if (activate) updated[activate] = (ev) => handleActivate(ev, props, context);
		if (deactivate) updated[deactivate] = (ev) => handleDeactivate(ev, props, context);

		return updated;
	};
}

const useRadio = configureRadio();
useRadio.configure = configureRadio;

export default useRadio;
export {
	configureRadio,
	useRadio
};
