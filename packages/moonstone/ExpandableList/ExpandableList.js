/**
 * Exports the {@link moonstone/ExpandableList.ExpandableList} and
 * {@link moonstone/ExpandableList.ExpandableListBase} components. The default export is
 * {@link moonstone/ExpandableList.ExpandableList}.
 *
 * @module moonstone/ExpandableList
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

import css from './ExpandableList.less';

const PureGroup = Pure(
	{propComparators: {
		// children has already by checked by ExpandableList but we can't allow it to pass through
		// to the default implementation which fails on non-ReactElement object arrays
		children: () => true,
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
		 * The items to be displayed in the list. This supports two data types. If an array of
		 * strings is provided, the strings will be used in the generated components as the readable
		 * text. If an array of objects is provided, each object will be spread onto the generated
		 * component with no interpretation. You'll be responsible for setting properties like
		 * `disabled`, `className`, and setting the text content using the `children` key.
		 *
		 * @type {String[]|Object[]}
		 * @required
		 * @public
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.arrayOf(PropTypes.object)
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
		 * @type {Node}
		 * @default null
		 * @public
		 */
		label: PropTypes.node,

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
		 * The handler to run prior to focus leaving the expandable when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

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
		selected: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),

		/**
		 * When `true`, the component cannot be navigated using spotlight.
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

		itemProps: ({
			onSpotlightDisappear,
			onSpotlightLeft,
			onSpotlightRight,
			spotlightDisabled
		}) => ({
			className: css.listItem,
			onSpotlightDisappear,
			onSpotlightLeft,
			onSpotlightRight,
			spotlightDisabled
		}),

		// generate a label that concatenates the text of the selected items
		label: ({children, label, select, selected}) => {
			if (label) {
				return label;
			} else if (children.length && (selected || selected === 0)) {
				const isArray = Array.isArray(selected);
				if (select === 'multiple' && isArray) {
					return selected.map(i => typeof children[i] === 'object' ? children[i].children : children[i]).filter(str => !!str).join(', ');
				} else if (typeof children[selected] === 'object') {
					return children[selected].children;
				} else {
					return children[isArray ? selected[0] : selected];
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
 * {@link moonstone/ExpandableList.ExpandableList} renders a
 * {@link moonstone/LabeledItem.LabeledItem} that can be expanded to show a selectable
 * list of items.
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
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const ExpandableList = Pure(
	{propComparators: {
		children: (a, b) => {
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
		}
	}},
	Expandable(
		Changeable(
			{change: 'onSelect', prop: 'selected'},
			ExpandableListBase
		)
	)
);

export default ExpandableList;
export {ExpandableList, ExpandableListBase};
