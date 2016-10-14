import React from 'react';
import GroupBase from '@enact/ui/Group';
import Expandable from '../Expandable';
import CheckboxItem from '../CheckboxItem';

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
