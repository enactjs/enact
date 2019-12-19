/**
 * A higher-order component that manages activation of components.
 *
 * @module ui/RadioDecorator
 * @exports RadioDecorator
 * @exports RadioControllerDecorator
 */

import hoc from '@enact/core/hoc';
import React from 'react';

import {RadioControllerDecorator} from './RadioControllerDecorator';
import useRadio from './useRadio';
import {forward} from '@enact/core/handle/handle';


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

/**
 * A higher-order component (HOC) that allows another component to have a mutually exclusive
 * relationship with other descendants of the same {@link ui/RadioDecorator.RadioControllerDecorator}.
 *
 * When the `activate` event for the wrapped component is called, the component is activated and the
 * previously activated component, if any, is deactivated by invoking the `deactivate` event.
 *
 * @class RadioDecorator
 * @memberof ui/RadioDecorator
 * @hoc
 * @public
 */
const RadioDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {prop, activate, deactivate} = config;

	// eslint-disable-next-line no-shadow
	return function RadioDecorator (props) {
		const radio = useRadio(props[prop], props[deactivate]);

		const updated = {
			...props,
			[activate]: (ev) => {
				radio.activate();
				forward(activate, ev, props);
			},
			[deactivate]: (ev) => {
				radio.deactivate();
				forward(deactivate, ev, props);
			}
		};

		return (
			<Wrapped {...updated} />
		);
	};
});

export default RadioDecorator;
export {
	RadioControllerDecorator,
	RadioDecorator,
	useRadio
};
