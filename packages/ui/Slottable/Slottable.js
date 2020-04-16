/**
 * Provides a higher-order component that render child components into pre-designated slots.
 *
 * See [SlotItem]{@link ui/SlotItem.SlotItemDecorator} for the use of `Slottable`.
 *
 * @module ui/Slottable
 * @exports Slottable
 */

import hoc from '@enact/core/hoc';
import React from 'react';

import useSlots from './useSlots';

/**
 * Default config for `Slottable`.
 *
 * @memberof ui/Slottable.Slottable
 * @hocconfig
 * @public
 */
const defaultConfig = {
	/**
	 * Array of slot names which will be extracted from `children` and distributed to props.
	 *
	 * @type {String[]}
	 * @memberof ui/Slottable.Slottable.defaultConfig
	 */
	slots: null
};

/**
 * A higher-order component that allows wrapped components to separate children into pre-designated 'slots'.
 *
 * To use `Slottable`, you must configure it by passing in a config object with the `slots` member set to an
 * array of slot names.  Any children whose `slot` or `defaultSlot` property matches a named slot or whose
 * type matches a named slot will be placed into a property of the same name on the wrapped component.
 *
 * @class Slottable
 * @memberof ui/Slottable
 * @hoc
 * @public
 */
const Slottable = hoc(defaultConfig, (config, Wrapped) => {
	const slots = config.slots;

	// eslint-disable-next-line no-shadow
	return function Slottable (props) {
		const distributed = useSlots({slots, children: props.children});
		return (
			<Wrapped {...props} {...distributed} />
		);
	};
});

export default Slottable;
export {Slottable};
