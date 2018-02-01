/**
 * Provides Moonstone specific expandable behaviors to apply to
 * [ExpandableItem]{@link moonstone/ExpandableItem.ExpandableItemBase}.
 *
 * @module moonstone/ExpandableItem
 * @exports Expandable
 */

import {Expandable as UiExpandable} from '@enact/ui/ExpandableItem';
import hoc from '@enact/core/hoc';
import compose from 'ramda/src/compose';

import ExpandableSpotlightDecorator from './ExpandableSpotlightDecorator';

/**
 * Default config for {@link moonstone/ExpandableItem.Expandable}.
 *
 * @memberof moonstone/ExpandableItem.Expandable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * When `true` and used in conjunction with `noAutoFocus` when `false`, the contents of the
	 * container will receive spotlight focus expanded, even in pointer mode.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof moonstone/ExpandableItem.Expandable.defaultConfig
	 * @public
	 */
	noPointerMode: false
};

/**
 * {@link moonstone/ExpandableItem.Expandable} manages the open state of a component
 * and adds {@link ui/Cancelable.Cancelable} support to call the `onClose` handler on
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
	return compose(
		UiExpandable,
		ExpandableSpotlightDecorator({noPointerMode: config.noPointerMode})
	)(Wrapped);
});

export default Expandable;
export {
	Expandable
};
