/*
 * Exports the {@link ui/Group.GroupItem} and {@link ui/Group.GroupItemBase}
 * components as well as the `pickGroupItemProps` method.  The default export is {@link ui/Group.GroupItem}.
 * `GroupItem` is stateless and is the same as `GroupItemBase`.
 * NOTE: not jsdoc on purpose.
 */

import kind from '@enact/core/kind';
import React from 'react';

import {isSelected, select as selectItem} from '../internal/selection';

/**
 * Pick the `GroupItem`-specific props into a [private]{@link /developer-guide/glossary/#private} `itemProps` key to be extracted by
 * `GroupItem` before passing the remaining on to the repeated `childComponent`
 *
 * @function
 * @param {Object} props `Group` props
 * @returns {Object} `GroupItem` props
 * @private
 */
const pickGroupItemProps = (props) => ({
	$$GroupItem: {
		childComponent: props.childComponent,
		childProp: props.childProp,
		childSelect: props.childSelect,
		indexProp: props.indexProp,
		onSelect: props.onSelect,
		select: props.select,
		selected: props.selected,
		selectedProp: props.selectedProp
	}
});

/**
 * {@link ui/Group.GroupItem} is a stateless component that is used within a
 * {@link ui/Group.Group}.  It supports passing the configurable selected property and
 * handler to its configured `childComponent`.
 *
 * **Note**: It receives its properties through the `$$GroupItem` property passed from `Group`'s
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

	handlers: {
		handleSelect: (ev, props) => {
			const {
				$$GroupItem: {
					childProp,
					indexProp,
					onSelect,
					select,
					selected
				}
			} = props;

			if (onSelect) {
				const index = props[indexProp];
				const data = props[childProp];

				onSelect({
					data,
					selected: selectItem(select, index, selected)
				});
			}
		}
	},

	render: (props) => {
		const {
			$$GroupItem: {
				childComponent: Component,
				childSelect,
				indexProp,
				selected,
				selectedProp
			},
			handleSelect,
			...rest
		} = props;

		if (selectedProp) {
			const index = rest[indexProp];
			rest[selectedProp] = isSelected(index, selected);
		}

		if (childSelect) {
			rest[childSelect] = handleSelect;
		}

		return <Component {...rest} />;
	}
});

export default GroupItemBase;
export {GroupItemBase as GroupItem, GroupItemBase, pickGroupItemProps};
