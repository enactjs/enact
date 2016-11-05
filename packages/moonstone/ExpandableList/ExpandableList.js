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
 * {@link moonstone/ExpandableList.ExpandableList} is a stateless component that
 * renders a {@link moonstone/LabeledItem.LabeledItem} that can be expanded to show
 * a selectable list of items.
 *
 * @class ExpandableListBase
 * @memberof moonstone/ExpandableList
 * @ui
 * @private
 */
const ExpandableListBase = kind({
	name: 'ExpandableList',

	propTypes: /** @lends moonstone/ExpandableList.ExpandableListBase.prototype */ {
		/**
		 * The items to be displayed in the list
		 *
		 * @type {String[]}
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
		autoClose: PropTypes.bool,

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
		 * Text to display when no `label` is set.
		 *
		 * @type {String}
		 */
		noneText: PropTypes.string,

		/**
		 * Called when the expandable is closing. Also called when selecting an item if `autoClose`
		 * is `true`.
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

	computed: {
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

		onSelect: ({autoClose, onClose, onSelect: handler, select}) => (ev) => {
			// Call onClose if autoClose is enabled and not selecting multiple
			if (autoClose && onClose && select !== 'multiple') {
				onClose();
			}

			if (handler) {
				handler(ev);
			}
		},

		selected: ({select, selected}) => {
			return (select === 'single' && Array.isArray(selected)) ? selected[0] : selected;
		}
	},

	render: ({children, ListItem, onSelect, select, selected, ...rest}) => {
		delete rest.autoClose;
		delete rest.select;

		return (
			<ExpandableItemBase {...rest} showLabel="auto">
				<Group
					childComponent={ListItem}
					childSelect="onToggle"
					onSelect={onSelect}
					select={select}
					selected={selected}
					selectedProp="checked"
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
