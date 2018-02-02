/**
 * Provides Moonstone specific expandable behaviors to apply to
 * [ExpandableItem]{@link moonstone/ExpandableItem.ExpandableItemBase}.
 *
 * @module moonstone/ExpandableItem
 * @exports Expandable
 */

import {Expandable as UiExpandable} from '@enact/ui/ExpandableItem';
import compose from 'ramda/src/compose';

import ExpandableSpotlightDecorator from './ExpandableSpotlightDecorator';

/**
 * Manages the open state of a component and adds moonstone-specific behavior.
 *
 * @class Expandable
 * @memberof moonstone/ExpandableItem
 * @mixes moonstone/ExpandableItem.ExpandableSpotlightDecorator
 * @mixes ui/ExpandableItem.Expandable
 * @hoc
 * @public
 */
const Expandable = compose(
	ExpandableSpotlightDecorator,
	UiExpandable
);

export default Expandable;
export {
	Expandable
};
