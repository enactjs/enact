import R from 'ramda';
import React from 'react';
import kind from 'enact-core/kind';

// Pick the GroupItem-specific props into a 'private' itemProps key to be extracted by GroupItem
// before passing the remaining on to the repeated `childComponent`
const pickGroupItemProps = R.compose(
	R.objOf('$$GroupItem'),
	R.pick(['activate', 'childProp', 'index', 'indexProp', 'onActivate', 'selectedProp', 'childComponent'])
);

const GroupItemBase = kind({
	displayName: 'GroupItem',

	render: (props) => {
		const {
			$$GroupItem: {
				activate,
				childComponent: Component,
				childProp,
				index: selectedIndex,
				indexProp,
				onActivate,
				selectedProp
			},
			...rest
		} = props;

		const index = rest[indexProp];
		const data = rest[childProp];
		const selected = index === selectedIndex;
		if (selectedProp) rest[selectedProp] = selected;
		if (activate) rest[activate] = (ev) => onActivate({...ev, index, data});

		return <Component {...rest} />;
	}
});

export default GroupItemBase;
export {GroupItemBase as GroupItem, GroupItemBase, pickGroupItemProps};
