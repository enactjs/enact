import Group from '@enact/ui/Group';
import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import {select as selectItem} from '@enact/core/selection';

import CheckboxItem from '../CheckboxItem';
import Expandable from '../Expandable';
import ExpandableItem from '../ExpandableItem';
import Item from '../Item';
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
		 * Called when an item is selected
		 *
		 * @type {Function}
		 * @public
		 */
		onSelect: PropTypes.func,

		/**
		 * Selection mode for the list
		 *
		 * * `none` - Items are not selectable but clicking an item will fire an onSelect event
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
		select: PropTypes.oneOf(['none', 'single', 'radio', 'multiple']),

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
			if (select !== 'none' && children.length && (selected || selected === 0)) {
				if (Array.isArray(selected)) {
					return selected.map(i => children[i]).filter(str => !!str).join(', ');
				} else {
					return children[selected];
				}
			}
		},

		// Selects the appropriate list item based on the selection mode
		ListItem: ({select}) => {
			return	select === 'none' && Item ||
					select === 'radio' && RadioItem ||
					CheckboxItem; // for single or multiple
		},

		// Hides the label when selection mode is 'none'
		showLabel: ({select}) => {
			return select === 'none' ? false : 'auto';
		},

		// Use 'onClick' to trigger onSelect events for Items, 'onToggle' for everything else
		childSelect: ({select}) => {
			return select === 'none' ? 'onClick' : 'onToggle';
		},

		// selectedProp is only meaningful when select !== 'null'
		selectedProp: ({select}) => {
			return select === 'none' ? null : 'checked';
		},

		onSelect: ({autoClose, onClose, onSelect: handler, select, selected}) => {
			// To intelligently support autoClose, we'll always attach an listener for onSelect
			// and only conditionally manage selection if we received an onSelect handler
			return (ev) => {
				// Call onClose if autoClose is enabled and not selecting multiple
				if (autoClose && onClose && select !== 'multiple') {
					onClose();
				}

				if (handler) {
					if (select === 'none') {
						handler(ev);
					} else {
						handler({
							selected: selectItem(select, ev.selected, selected)
						});
					}
				}
			};
		}
	},

	render: ({children, ListItem, onSelect, childSelect, selected, selectedProp, ...rest}) => {
		delete rest.select;
		delete rest.selected;

		return (
			<ExpandableItem {...rest}>
				<Group childComponent={ListItem} childSelect={childSelect} onSelect={onSelect} selected={selected} selectedProp={selectedProp}>
					{children}
				</Group>
			</ExpandableItem>
		);
	}
});

const ExpandableList = Expandable(ExpandableListBase);

export default ExpandableList;
export {ExpandableList, ExpandableListBase};
