/**
 * Exports the {@link module:@enact/ui/Group~GroupItem} and {@link module:@enact/ui/Group~GroupItemBase}
 * components as well as the `pickGroupItemProps` method.  The default export is {@link module:@enact/ui/Group~GroupItem}.
 * `GroupItem` is stateless and is the same as `GroupItemBase`.
 *
 * @module @enact/ui/Group/GroupItem
 */

import R from 'ramda';
import React from 'react';
import kind from '@enact/core/kind';

/**
 * Pick the GroupItem-specific props into a 'private' itemProps key to be extracted by GroupItem
 * before passing the remaining on to the repeated `childComponent`
 * @private
 */
const pickGroupItemProps = R.compose(
	R.objOf('$$GroupItem'),
	R.pick(['childComponent', 'childProp', 'indexProp', 'onSelect', 'select', 'selected', 'selectedProp'])
);

/**
 * {@link module:@enact/ui/Group~GroupItemBase} is a stateless component that is used within a
 * {@link module:@enact/ui/Group~Group}.  It supports passing the configurable selected property and
 * handler to its configured `childComponent`.
 *
 * Note: It receives its properties through the `$$GroupItem` property passed from `Group`'s
 * {@link module:@enact/ui/Repeater~Repeater}.
 *
 * @class GroupItemBase
 * @ui
 * @private
 */
const GroupItemBase = kind({
	name: 'GroupItem',
	// TODO: Add propTypes

	render: (props) => {
		const {
			$$GroupItem: {
				childComponent: Component,
				childProp,
				indexProp,
				onSelect,
				select,
				selected,
				selectedProp
			},
			...rest
		} = props;

		const index = rest[indexProp];
		const data = rest[childProp];
		const isSelected = Array.isArray(selected) ? selected.indexOf(index) >= 0 : index === selected;
		if (selectedProp) rest[selectedProp] = isSelected;
		if (select && onSelect) rest[select] = () => onSelect({selected: index, data});

		return <Component {...rest} />;
	}
});

export default GroupItemBase;
export {GroupItemBase as GroupItem, GroupItemBase, pickGroupItemProps};
