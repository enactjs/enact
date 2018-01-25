import Resizable from '../Resizable';
import Transition from '../Transition';

/**
 * [ExpandableTransitionContainer]{@link ui/ExpandableItem.ExpandableTransitionContainer} is a
 * transition container for [ExpandableItem]{@link ui/ExpandableItem.ExpandableItem}.
 *
 * @class ExpandableTransitionContainer
 * @memberof ui/ExpandableItem
 * @ui
 * @mixes ui/Resizable.Resizable
 * @public
 */
const ExpandableTransitionContainer = Resizable(
	{resize: 'onTransitionEnd', filter: (ev) => ev.propertyName === 'height'},
	Transition
);

export default ExpandableTransitionContainer;
export {
	ExpandableTransitionContainer
};
