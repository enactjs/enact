/*
 * Exports the {@link ui/Group.GroupItem} and {@link ui/Group.GroupItemBase}
 * components as well as the `pickGroupItemProps` method.  The default export is {@link ui/Group.GroupItem}.
 * `GroupItem` is stateless and is the same as `GroupItemBase`.
 * NOTE: not jsdoc on purpose.
 */

import kind from '@enact/core/kind';
import {isSelected, select as selectItem} from '@enact/core/selection';
import rCompose from 'ramda/src/compose';
import rObjOf from 'ramda/src/objOf';
import rPick from 'ramda/src/pick';
import React from 'react';

/**
 * Pick the GroupItem-specific props into a 'private' itemProps key to be extracted by GroupItem
 * before passing the remaining on to the repeated `childComponent`
 * @private
 */
const pickGroupItemProps = rCompose(
	rObjOf('$$GroupItem'),
	rPick(['childComponent', 'childProp', 'childSelect', 'indexProp', 'onSelect', 'select', 'selected', 'selectedProp'])
);

/**
 * {@link ui/Group.GroupItemBase} is a stateless component that is used within a
 * {@link ui/Group.Group}.  It supports passing the configurable selected property and
 * handler to its configured `childComponent`.
 *
 * Note: It receives its properties through the `$$GroupItem` property passed from `Group`'s
 * {@link ui/Repeater.Repeater}.
 *
 * @class GroupItemBase
 * @memberof ui/Group
 * @ui
 * @private
 */
const GroupItemBase = kind({
	name: 'GroupItem',
	// TODO: Add propTypes
	/* eslint-disable enact/prop-types */

	render: (props) => {
		const {
			$$GroupItem: {
				childComponent: Component,
				childProp,
				childSelect,
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

		if (selectedProp) {
			rest[selectedProp] = isSelected(index, selected);
		}

		if (childSelect && onSelect) {
			rest[childSelect] = () => {
				onSelect({
					data,
					selected: selectItem(select, index, selected)
				});
			};
		}

		return <Component {...rest} />;
	}
});

export default GroupItemBase;
export {GroupItemBase as GroupItem, GroupItemBase, pickGroupItemProps};
