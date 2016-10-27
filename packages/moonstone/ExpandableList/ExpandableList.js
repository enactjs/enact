import Group from '@enact/ui/Group';
import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import CheckboxItem from '../CheckboxItem';
import {Expandable, ExpandableItemBase} from '../ExpandableItem';
import RadioItem from '../RadioItem';

const ExpandableListBase = kind({
	name: 'ExpandableList',

	propTypes: {
		/**
		 * The items to be displayed in the list
		 *
		 * @type {String[]}
		 * @public
		 */
		children: PropTypes.arrayOf(PropTypes.string).isRequired,

		/**
		 * When `true` and `select` is not `'multiple'`, the expandable will be closed when an item
		 * is selected.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		autoClose: PropTypes.bool,

		/**
		 * Called when the expandable is closing. Invoked `onSelect` if `autoClose` is `true`.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when an item is selected
		 *
		 * @type {Function}
		 * @public
		 */
		onSelect: PropTypes.func,

		/**
		 * Selection mode for the list
		 *
		 * * `single` - Allows for 0 or 1 item to be selected. The selected item may be deselected.
		 * * `radio` - Allows for 0 or 1 item to be selected. The selected item may only be
		 *    deselected by selecting another item.
		 * * `multiple` - Allows 0 to _n_ items to be selected. Each item may be selected or
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
		 * @type {Number}
		 * @public
		 */
		selected: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])
	},

	defaultProps: {
		autoClose: true,
		select: 'single'
	},

	computed: {
		// generate a label that concatenates the text of the selected items
		label: ({children, select, selected}) => {
			if (children.length && (selected || selected === 0)) {
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
		}
	},

	render: ({children, ListItem, onSelect, select, selected, ...rest}) => {
		delete rest.autoClose;
		delete rest.select;

		return (
			<ExpandableItemBase {...rest}>
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

const ExpandableList = Expandable(ExpandableListBase);

export default ExpandableList;
export {ExpandableList, ExpandableListBase};
