import Resizable from '../Resizable';
import Transition from '../Transition';

/**
 * Changes spotlight focus to transition container when opening the container if the previously focused
 * component is contained.
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
