import Cancelable from '@enact/ui/Cancelable';
import R from 'ramda';
import Toggleable from '@enact/ui/Toggleable';

// TODO: This module may not doc correctly but we'll need to wait until our doc parsing script is
// ready

/**
 * Called by {@link module:@enact/ui/Cancelable~Cancelable} when a cancel event occurs and calls the
 * `onClose` handler provided by the wrapping Toggleable HOC.
 *
 * @param  {Object} props Current props object
 *
 * @returns {undefined}
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
 * {@link module:@enact/moonstone/ExpandableItem~Expandable} manages the open state of a component
 * and adds {@link module:@enact/ui/Cancelable~Cancelable} support to call the `onClose` handler on
 * cancel.
 *
 * @class Expandable
 * @ui
 * @private
 */
const Expandable = R.compose(
	Toggleable({toggle: null, activate: 'onOpen', deactivate: 'onClose', mutable: true, prop: 'open'}),
	Cancelable({component: 'span', onCancel: handleCancel})
);

export default Expandable;
export {Expandable};
