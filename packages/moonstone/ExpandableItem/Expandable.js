import hoc from '@enact/core/hoc';
import React from 'react';

import {configureExpandable, defaultConfig, useExpandable} from './useExpandable';

/**
 * A higher-order component that manages the open state of a component and adds {@link ui/Cancelable.Cancelable}
 * support to call the `onClose` handler on
 * cancel.
 *
 * @class Expandable
 * @memberof moonstone/ExpandableItem
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Cancelable.Cancelable
 * @hoc
 * @public
 */
const Expandable = hoc(defaultConfig, (config, Wrapped) => {
	const hook = configureExpandable(config);

	// eslint-disable-next-line no-shadow
	return function Expandable (props) {
		return (
			<Wrapped
				{...props}
				{...hook(props)}
			/>
		);
	};
});

export default Expandable;
export {
	configureExpandable,
	Expandable,
	useExpandable
};
