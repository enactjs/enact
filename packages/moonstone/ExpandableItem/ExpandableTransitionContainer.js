import Resizable from '@enact/ui/Resizable';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Transition from '@enact/ui/Transition';

/**
 * Changes spotlight focus to transition container when opening the container if the previously focused
 * component is contained.
 *
 * @class ExpandableTransitionContainer
 * @private
 */

const ExpandableTransitionContainerBase = SpotlightContainerDecorator(
	{preventScroll: true},
	Resizable(
		{resize: 'onTransitionEnd', filter: (ev) => ev.propertyName === 'height'},
		Transition
	)
);

export default ExpandableTransitionContainerBase;
export {
	ExpandableTransitionContainerBase as ExpandableTransitionContainer,
	ExpandableTransitionContainerBase
};
