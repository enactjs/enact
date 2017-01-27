/**
 * Exports the {@link moonstone/ExpandableList.ExpandableList} and
 * {@link moonstone/ExpandableList.ExpandableListBase} components. The default export is
 * {@link moonstone/ExpandableList.ExpandableList}.
 *
 * @module moonstone/ExpandableList
 */

import Group from '@enact/ui/Group';
import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import CheckboxItem from '../CheckboxItem';
import {Expandable, ExpandableItemBase} from '../ExpandableItem';
import RadioItem from '../RadioItem';

/**
 * {@link moonstone/ExpandableList.ExpandableListBase} is a stateless component that
 * renders a {@link moonstone/LabeledItem.LabeledItem} that can be expanded to show
 * a selectable list of items.
 *
 * @class ExpandableListBase
 * @memberof moonstone/ExpandableList
 * @ui
 * @public
 */
const ExpandableListBase = kind({
	name: 'ExpandableList',

	propTypes: /** @lends moonstone/ExpandableList.ExpandableListBase.prototype */ {
		/**
		 * The items to be displayed in the list
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		children: PropTypes.arrayOf(PropTypes.string).isRequired,

		/**
		 * The primary text of the item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string.isRequired,

		/**
		 * When `true` and `select` is not `'multiple'`, the expandable will be closed when an item
		 * is selected.
		 *
		 * @type {Boolean}
		 * @public
		 */
		closeOnSelect: PropTypes.bool,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The secondary, or supportive text. Typically under the `title`, a subtitle. If omitted,
		 * the label will be generated as a comma-separated list of the selected items.
		 *
		 * @type {String}
		 * @default null
		 * @public
		 */
		label: PropTypes.string,

		/**
		 * When `true`, the expandable will not automatically close when the user navigates to the
		 * `title` of the component using 5-way controls.
		 *
		 * This does not affect `closeOnSelect`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoClose: PropTypes.bool,

		/**
		 * When `true`, the user may move {@glossary Spotlight} past the bottom of the expandable
		 * (when open) using 5-way controls.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noLockBottom: PropTypes.bool,

		/**
		 * Text to display when no `label` is set.
		 *
		 * @type {String}
		 */
		noneText: PropTypes.string,

		/**
		 * Called when the expandable is closing. Also called when selecting an item if
		 * `closeOnSelect` is `true`.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when the expandable is opening
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: PropTypes.func,

		/**
		 * Called when an item is selected
		 *
		 * @type {Function}
		 * @public
		 */
		onSelect: PropTypes.func,

		/**
		 * The handler to run when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * When `true`, the expandable is open with its contents visible
		 *
		 * @type {Boolean}
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Selection mode for the list
		 *
		 * * `'single'` - Allows for 0 or 1 item to be selected. The selected item may be deselected.
		 * * `'radio'` - Allows for 0 or 1 item to be selected. The selected item may only be
		 *    deselected by selecting another item.
		 * * `'multiple'` - Allows 0 to _n_ items to be selected. Each item may be selected or
		 *    deselected.
		 *
		 * @type {String}
		 * @default 'single'
		 * @public
		 */
		select: PropTypes.oneOf(['single', 'radio', 'multiple']),

		/**
		 * Index or array of indices of the selected item(s)
		 *
		 * @type {Number|Number[]}
		 * @public
		 */
		selected: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])
	},

	defaultProps: {
		select: 'single'
	},

	handlers: {
		onSelect: (ev, {closeOnSelect, onClose, onSelect, select}) => {
			// Call onClose if closeOnSelect is enabled and not selecting multiple
			if (closeOnSelect && onClose && select !== 'multiple') {
				onClose();
			}

			if (onSelect) {
				onSelect(ev);
			}
		}
	},

	computed: {
		itemProps: ({onSpotlightDisappear}) => ({onSpotlightDisappear}),

		// generate a label that concatenates the text of the selected items
		label: ({children, label, select, selected}) => {
			if (label) {
				return label;
			} else if (children.length && (selected || selected === 0)) {
				const isArray = Array.isArray(selected);
				if (select === 'multiple' && isArray) {
					return selected.map(i => children[i]).filter(str => !!str).join(', ');
				} else {
					return children[isArray ? selected[0] : selected];
				}
			}
		},

		// Selects the appropriate list item based on the selection mode
		ListItem: ({select}) => {
			return	select === 'radio' && RadioItem ||
					CheckboxItem; // for single or multiple
		},

		selected: ({select, selected}) => {
			return (select === 'single' && Array.isArray(selected)) ? selected[0] : selected;
		}
	},

	render: ({children, itemProps, ListItem, noAutoClose, noLockBottom, onSelect, select, selected, ...rest}) => {
		delete rest.closeOnSelect;
		delete rest.select;

		return (
			<ExpandableItemBase
				{...rest}
				showLabel="auto"
				autoClose={!noAutoClose}
				lockBottom={!noLockBottom}
			>
				<Group
					childComponent={ListItem}
					childSelect="onToggle"
					itemProps={itemProps}
					onSelect={onSelect}
					select={select}
					selected={selected}
					selectedProp="selected"
				>
					{children}
				</Group>
			</ExpandableItemBase>
		);
	}
});

/**
 * {@link moonstone/ExpandableList.ExpandableList} renders a
 * {@link moonstone/LabeledItem.LabeledItem} that can be expanded to show a selectable
 * list of items.
 *
 * @class ExpandableList
 * @memberof moonstone/ExpandableList
 * @ui
 * @mixes moonstone/ExpandableItem.Expandable
 * @public
 */
const ExpandableList = Expandable(ExpandableListBase);

export default ExpandableList;
export {ExpandableList, ExpandableListBase};
