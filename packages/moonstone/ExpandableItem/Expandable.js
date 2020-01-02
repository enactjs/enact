import hoc from '@enact/core/hoc';
import React from 'react';

import {defaultConfig, useExpandable} from './useExpandable';

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
	// eslint-disable-next-line no-shadow
	return function Expandable (props) {
		return (
			<Wrapped
				{...props}
				{...useExpandable(config, props)}
			/>
		);
	};
});

export default Expandable;
export {
	Expandable,
	useExpandable
};
