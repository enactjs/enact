import React from 'react';
import GroupBase from '@enact/ui/Group';
import Selectable from '@enact/ui/Selectable';
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

const ExpandableGroup = Expandable({
	close: 'onSelect'
}, Selectable(CheckboxItemGroupBase));

export default ExpandableGroup;
