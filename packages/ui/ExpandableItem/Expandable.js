/**
 * Provides expandable behaviors.
 *
 * @module ui/ExpandableItem
 * @exports Expandable
 */

import Cancelable from '../Cancelable';
import RadioDecorator from '../RadioDecorator';
import Toggleable from '../Toggleable';
import compose from 'ramda/src/compose';

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
		return true;
	}
};

/**
 * {@link ui/Expandable.Expandable} manages the open state of a component
 * and adds {@link ui/Cancelable.Cancelable} support to call the `onClose` handler on
 * cancel.
 *
 * @class Expandable
 * @memberof ui/ExpandableItem
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Cancelable.Cancelable
 * @hoc
 * @public
 */
const Expandable = compose(
	Toggleable({toggle: null, activate: 'onOpen', deactivate: 'onClose', prop: 'open'}),
	RadioDecorator({activate: 'onOpen', deactivate: 'onClose', prop: 'open'}),
	Cancelable({onCancel: handleCancel})
);

// const AccordionDecorator = compose(
// 	Toggleable({toggle: null, activate: 'onOpen', deactivate: 'onClose', prop: 'open'}),
// 	RadioDecorator({activate: 'onOpen', deactivate: 'onClose', prop: 'open'}),
// 	// Cancelable({component: 'span', onCancel: handleCancel})
// 	Cancelable({onCancel: handleCancel})
// );

export default Expandable;
export {Expandable};
