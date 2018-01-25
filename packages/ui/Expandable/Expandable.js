import Cancelable from '../Cancelable';
import RadioDecorator from '../RadioDecorator';
import Resizable from '../Resizable';
import Toggleable from '../Toggleable';
import Transition from '../Transition';
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
 * @memberof ui/Expandable
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Cancelable.Cancelable
 * @hoc
 * @public
 */
const Expandable = compose(
	Toggleable({toggle: null, activate: 'onOpen', deactivate: 'onClose', prop: 'open'}),
	RadioDecorator({activate: 'onOpen', deactivate: 'onClose', prop: 'open'}),
	Cancelable({component: 'span', onCancel: handleCancel})
);

/**
 * Changes spotlight focus to transition container when opening the container if the previously focused
 * component is contained.
 *
 * @class ExpandableTransitionContainer
 * @private
 */
const ExpandableTransitionContainer = Resizable(
	{resize: 'onTransitionEnd', filter: (ev) => ev.propertyName === 'height'},
	Transition
);

export default Expandable;
export {Expandable, ExpandableTransitionContainer};
