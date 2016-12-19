/**
 * Exports the {@link moonstone/ExpandableItem/Expandable.Expandable} Higher-Order Component (HOC)
 *
 * @module moonstone/ExpandableItem/Expandable
 */

import Cancelable from '@enact/ui/Cancelable';
import compose from 'ramda/src/compose';
import RadioDecorator from '@enact/ui/RadioDecorator';
import Toggleable from '@enact/ui/Toggleable';

// TODO: This module may not doc correctly but we'll need to wait until our doc parsing script is
// ready

/**
 * Called by {@link ui/Cancelable.Cancelable} when a cancel event occurs and calls the
 * `onClose` handler provided by the wrapping Toggleable HOC.
 *
 * @param  {Object} props Current props object
 *
 * @returns {undefined}
 * @private
 */
const handleCancel = function (props) {
	if (props.open) {
		props.onClose();
	} else {
		// Return `true` to allow event to propagate to containers for unhandled cancel
		return true;
	}
};

/**
 * {@link moonstone/ExpandableItem.Expandable} manages the open state of a component
 * and adds {@link ui/Cancelable.Cancelable} support to call the `onClose` handler on
 * cancel.
 *
 * @class Expandable
 * @memberof moonstone/ExpandableItem/Expandable
 * @hoc
 * @private
 */
const Expandable = compose(
	Toggleable({toggle: null, activate: 'onOpen', deactivate: 'onClose', mutable: true, prop: 'open'}),
	RadioDecorator({activate: 'onOpen', deactivate: 'onClose', prop: 'open'}),
	Cancelable({component: 'span', onCancel: handleCancel})
);

export default Expandable;
export {Expandable};
