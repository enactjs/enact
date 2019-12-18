import hoc from '@enact/core/hoc';
import React from 'react';

import useRadioController from './useRadioController';

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
const RadioControllerDecorator = hoc((config, Wrapped) => {	// eslint-disable-line no-unused-vars

	// eslint-disable-next-line no-shadow
	return function RadioControllerDecorator (props) {
		const [Context, value] = useRadioController();
		return (
			<Context.Provider value={value}>
				<Wrapped {...props} />
			</Context.Provider>
		);
	};
});

export default RadioControllerDecorator;
export {
	RadioControllerDecorator
};
