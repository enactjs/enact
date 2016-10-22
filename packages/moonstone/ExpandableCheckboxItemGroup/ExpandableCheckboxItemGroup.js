/**
 * Exports the {@link module:@enact/moonstone/ExpandableCheckboxItemGroup~ExpandableCheckboxItemGroup} and
 * {@link module:@enact/moonstone/CheckboxItemGroupBase~ExpandableCheckboxItemGroupBase} components.
 *
 * @module @enact/moonstone/ExpandableCheckboxItemGroup
 */

import React from 'react';
import GroupBase from '@enact/ui/Group';
import Expandable from '../Expandable';
import CheckboxItem from '../CheckboxItem';

/**
 * {@link module:@enact/moonstone/ExpandableCheckboxItemGroup~ExpandableCheckboxItemGroupBase} is a stateless
 * component that is composed of {@link module:@enact/ui/Group~Group} with
 * {@link module:@enact/moonstone/CheckboxItem~CheckboxItem} as a default `childComponent`. This
 * base version is *not* expandable. You likely want to use
 * {@link module:@enact/moonstone/ExpandableCheckboxItemGroup~ExpandableCheckboxItemGroup}
 *
 * @class ExpandableCheckboxItemGroupBase
 * @ui
 * @public
 */
const ExpandableCheckboxItemGroupBase = (props) => (
	<GroupBase
		childComponent={CheckboxItem}
		select="onToggle"
		selectedProp="checked"
		{...props}
	/>
);

/**
 * {@link module:@enact/moonstone/ExpandableCheckboxItemGroup~ExpandableCheckboxItemGroup} is an
 * expandable picker comprising grouped CheckboxItems. Pass in the labels for the CheckboxItems
 * as children of the ExpandableCheckboxItemGroup.
 *
 * Usage:
 * ```
 * <ExpandableCheckboxItemGroup onSelect={handleSelect}>
 *     option1
 *     option2
 *     option3
 * </ExpandableCheckboxItemGroup>
 * ```
 *
 * @class ExpandableCheckboxItemGroup
 * @ui
 * @public
 */
const ExpandableCheckboxItemGroup = Expandable(ExpandableCheckboxItemGroupBase);

export default ExpandableCheckboxItemGroup;
export {ExpandableCheckboxItemGroup, ExpandableCheckboxItemGroupBase};
