/**
 * Provides a higher-order component that render child components into pre-designated slots.
 *
 * See {@link ui/SlotItem.SlotItemDecorator|SlotItem} for the use of `Slottable`.
 *
 * @module ui/Slottable
 * @exports Slottable
 */

import hoc from '@enact/core/hoc';

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
		// extract the slots into a new object but populating the default value to be undefined so
		// the key exists in order to allow the current "harmful" behavior below. Must be undefined
		// in order to trigger defaultProps on downstream components.
		const slotProps = {children: props.children};
		slots.forEach(k => (slotProps[k] = undefined)); // eslint-disable-line no-undefined

		// Slottable allows there to be other values in the destination slot and merges them.
		// However, consumers can't avoid key warnings when merging the two lists so we should
		// "consider this harmful" and not continue to support this with the hook and instead
		// encourage using the slot as the default with the prop as a fallback as implemented by the
		// hook.
		const distributed = useSlots(slotProps);
		slots.forEach(slot => {
			const dist = distributed[slot];
			const prop = props[slot];
			if (prop != null && dist != null) {
				distributed[slot] = [].concat(prop, dist);
			} else if (prop != null) {
				distributed[slot] = prop;
			}
		});

		return (
			<Wrapped {...props} {...distributed} />
		);
	};
});

export default Slottable;
export {
	Slottable,
	useSlots
};
