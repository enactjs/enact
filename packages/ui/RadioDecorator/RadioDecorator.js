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
import {configureRadio, defaultConfig, useRadio} from './useRadio';

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
	const hook = configureRadio(config);

	// eslint-disable-next-line no-shadow
	return function RadioDecorator (props) {
		return (
			<Wrapped
				{...props}
				{...hook(props)}
			/>
		);
	};
});

export default RadioDecorator;
export {
	configureRadio,
	RadioControllerDecorator,
	RadioDecorator,
	useRadio
};
