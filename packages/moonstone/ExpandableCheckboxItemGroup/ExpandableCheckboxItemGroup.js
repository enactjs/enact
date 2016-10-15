/**
 * Exports the {@link module:@enact/moonstone/ExpandableCheckboxItemGroup~ExpandableCheckboxItemGroup} component.
 *
 * @module @enact/moonstone/ExpandableCheckboxItemGroup
 */

import React from 'react';
import GroupBase from '@enact/ui/Group';
import Expandable from '../Expandable';
import CheckboxItem from '../CheckboxItem';

/**
 * {@link module:@enact/moonstone/ExpandableCheckboxItemGroup~CheckboxItemGroupBase} is a stateless
 * component that is composed of {@link module:@enact/ui/Group~Group} with {@link module:@enact/moonstone/CheckboxItem~CheckboxItem}
 * as a default `childComponent.
 *
 * @class CheckboxItemGroupBase
 * @ui
 * @public
 */
const CheckboxItemGroupBase = (props) => (
	<GroupBase
		childComponent={CheckboxItem}
		select={'onToggle'}
		selectedProp={'checked'}
		{...props}
	/>
);

const ExpandableCheckboxItemGroup = Expandable({
	close: 'onSelect'
}, CheckboxItemGroupBase);

export default ExpandableCheckboxItemGroup;
export {ExpandableCheckboxItemGroup, CheckboxItemGroupBase};
