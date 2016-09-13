import R from 'ramda';
import React from 'react';
import kind from 'enact-core/kind';

// Pick the GroupItem-specific props into a 'private' itemProps key to be extracted by GroupItem
// before passing the remaining on to the repeated `type`
const pickGroupItemProps = R.compose(
	R.objOf('$$GroupItem'),
	R.pick(['activate', 'childProp', 'index', 'indexProp', 'onActivate', 'selectedProp', 'type'])
);

const GroupItem = kind({
	displayName: 'GroupItem',

	render: (props) => {
		const {
			$$GroupItem: {
				activate,
				childProp,
				index: selectedIndex,
				indexProp,
				onActivate,
				selectedProp,
				type: Type
			},
			...rest
		} = props;

		const index = rest[indexProp];
		const data = rest[childProp];
		const selected = index === selectedIndex;
		if (selectedProp) rest[selectedProp] = selected;
		if (activate) rest[activate] = () => onActivate({index, data});

		return <Type {...rest} />;
	}
});

export default GroupItem;
export {GroupItem, pickGroupItemProps};
