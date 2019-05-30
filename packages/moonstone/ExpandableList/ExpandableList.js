/**
 * Moonstone styled expandable list.
 *
 * @example
 * <ExpandableList
 *   noneText="Nothing is selected"
 *   select="multiple"
 *   title="Expandable List"
 * >
 *   {['Item 1', 'Item 2']}
 * </ExpandableList>
 *
 * @module moonstone/ExpandableList
 * @exports ExpandableList
 * @exports ExpandableItemBase
 */

import Changeable from '@enact/ui/Changeable';
import equals from 'ramda/src/equals';
import Group from '@enact/ui/Group';
import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import React from 'react';
import PropTypes from 'prop-types';

import CheckboxItem from '../CheckboxItem';
import {Expandable, ExpandableItemBase} from '../ExpandableItem';
import RadioItem from '../RadioItem';
import Skinnable from '../Skinnable';

import css from './ExpandableList.module.less';

const compareChildren = (a, b) => {
	if (!a || !b || a.length !== b.length) return false;

	let type = null;
	for (let i = 0; i < a.length; i++) {
		type = type || typeof a[i];
		if (type === 'string') {
			if (a[i] !== b[i]) {
				return false;
			}
		} else if (!equals(a[i], b[i])) {
			return false;
		}
	}

	return true;
};

const PureGroup = Pure(
	{propComparators: {
		children: compareChildren,
		itemProps: (a, b) => (
			a.onSpotlightDisappear === b.onSpotlightDisappear &&
			a.onSpotlightLeft === b.onSpotlightLeft &&
			a.onSpotlightRight === b.onSpotlightRight &&
			a.spotlightDisabled === b.spotlightDisabled
		)
	}},
	Group
);

/**
 * A stateless component that renders a {@link moonstone/LabeledItem.LabeledItem} that can be
 * expanded to show a selectable list of items.
 *
 * @class ExpandableListBase
 * @memberof moonstone/ExpandableList
 * @extends moonstone/ExpandableItem.ExpandableItemBase
 * @ui
 * @public
 */
const ExpandableListBase = kind({
	name: 'ExpandableList',

	propTypes: /** @lends moonstone/ExpandableList.ExpandableListBase.prototype */ {
		/**
		 * The items to be displayed in the list. This supports two data types. If an array of
		 * strings is provided, the strings will be used in the generated components as the readable
		 * text. If an array of objects is provided, each object will be spread onto the generated
		 * component with no interpretation. You'll be responsible for setting properties like
		 * `disabled`, `className`, and setting the content using `children`.
		 *
		 * NOTE: When providing an array of objects be sure a unique `key` is assigned to each
		 * item. [Read about keys](https://reactjs.org/docs/lists-and-keys.html#keys) for more
		 * information.
		 *
		 * @type {String[]|Object[]}
		 * @required
		 * @public
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.arrayOf(PropTypes.shape({
				key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
			}))
		]).isRequired,

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
		 * Disables voice control.
		 *
		 * @type {Boolean}
		 * @public
		 */
		'data-webos-voice-disabled': PropTypes.bool,

		/**
		 * Disables ExpandableList and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The secondary, or supportive text. Typically under the `title`, a subtitle. If omitted,
		 * the label will be generated as a comma-separated list of the selected items.
		 *
		 * @type {Node}
		 * @default null
		 * @public
		 */
		label: PropTypes.node,

		/**
		 * Keeps the expandable open when the user navigates to the `title` of the component using
		 * 5-way controls and the user must select/tap the title to close the expandable.
		 *
		 * This does not affect `closeOnSelect`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoClose: PropTypes.bool,

		/**
		 * Allows the user to move [Spotlight] {@link /docs/developer-guide/glossary/#spotlight} past the bottom of the expandable
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
		 * Called when the expandable is opening.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: PropTypes.func,

		/**
		 * Called when an item is selected.
		 *
		 * @type {Function}
		 * @public
		 */
		onSelect: PropTypes.func,

		/**
		 * Called when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

		/**
		 * Opens the expandable with its contents visible.
		 *
		 * @type {Boolean}
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Selection mode for the list.
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
		 * Index or array of indices of the selected item(s).
		 *
		 * @type {Number|Number[]}
		 * @public
		 */
		selected: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),

		/**
		 * Disables spotlight navigation into the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool
	},

	defaultProps: {
		select: 'radio',
		spotlightDisabled: false
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

	styles: {
		css,
		className: 'expandableList'
	},

	computed: {
		'aria-multiselectable': ({select}) => select === 'multiple',

		disabled: ({children, disabled}) => {
			return disabled || !children || children.length === 0;
		},

		itemProps: ({
			'data-webos-voice-disabled': voiceDisabled,
			onSpotlightDisappear,
			onSpotlightLeft,
			onSpotlightRight,
			spotlightDisabled
		}) => ({
			className: css.listItem,
			onSpotlightDisappear,
			onSpotlightLeft,
			onSpotlightRight,
			spotlightDisabled,
			'data-webos-voice-disabled': voiceDisabled
		}),

		// generate a label that concatenates the text of the selected items
		label: ({children, label, select, selected}) => {
			if (label) {
				return label;
			} else if (children.length && (selected || selected === 0)) {
				const firstSelected = Array.isArray(selected) ? selected[0] : selected;
				if (select === 'multiple' && Array.isArray(selected)) {
					return selected.map(i => typeof children[i] === 'object' ? children[i].children : children[i]).filter(str => !!str).join(', ');
				} else if (typeof children[firstSelected] === 'object') {
					return children[firstSelected].children;
				} else {
					return children[firstSelected];
				}
			}
		},

		// Selects the appropriate list item based on the selection mode
		ListItem: ({select}) => {
			return	(select === 'radio' || select === 'single') && RadioItem ||
					CheckboxItem; // for single or multiple
		},

		role: ({select}) => select === 'radio' ? 'radiogroup' : 'group',

		selected: ({select, selected}) => {
			return (select === 'single' && Array.isArray(selected)) ? selected[0] : selected;
		}
	},

	render: ({
		children,
		itemProps,
		ListItem,
		noAutoClose,
		noLockBottom,
		onSelect,
		select,
		selected,
		...rest
	}) => {
		delete rest.closeOnSelect;

		return (
			<ExpandableItemBase
				{...rest}
				showLabel="auto"
				autoClose={!noAutoClose}
				lockBottom={!noLockBottom}
			>
				<PureGroup
					childComponent={ListItem}
					childSelect="onToggle"
					itemProps={itemProps}
					onSelect={onSelect}
					select={select}
					selected={selected}
					selectedProp="selected"
				>
					{children}
				</PureGroup>
			</ExpandableItemBase>
		);
	}
});

/**
 * A component that renders a {@link moonstone/LabeledItem.LabeledItem} that can be expanded to
 * show a selectable list of items.
 *
 * By default, `ExpandableList` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onChange` events.
 *
 * `ExpandableList` maintains its open/closed state by default. The initial state can be supplied
 * using `defaultOpen`. In order to directly control the open/closed state, supply a value for
 * `open` at creation time and update its value in response to `onClose`/`onOpen` events.
 *
 * @class ExpandableList
 * @memberof moonstone/ExpandableList
 * @extends moonstone/ExpandableList.ExpandableListBase
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const ExpandableList = Pure(
	{propComparators: {
		children: compareChildren
	}},
	Changeable(
		{change: 'onSelect', prop: 'selected'},
		Expandable(
			{
				getChildFocusTarget: (node, {selected = 0}) => {
					let selectedIndex = selected;
					if (Array.isArray(selected) && selected.length) {
						selectedIndex = selected[0];
					}

					let selectedNode = null;
					if (node) {
						selectedNode = node.querySelector(`[data-index="${selectedIndex}"]`);
					}

					return selectedNode;
				}
			},
			Skinnable(
				ExpandableListBase
			)
		)
	)
);

export default ExpandableList;
export {ExpandableList, ExpandableListBase};
