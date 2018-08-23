/**
 * Provides a component that renders a group of components given a set of data.
 *
 * @module ui/Group
 * @exports Group
 * @exports GroupBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Changeable from '../Changeable';
import Repeater from '../Repeater';

import {GroupItem, pickGroupItemProps} from './GroupItem';

/**
 * A stateless component that supports selection of its child items via configurable
 * properties and events.
 *
 * @class GroupBase
 * @memberof ui/Group
 * @ui
 * @public
 */
const GroupBase = kind({
	name: 'Group',

	propTypes: /** @lends ui/Group.Group.prototype */ {
		/**
		 * Component type to repeat. This can be a React component or a string describing a DOM
		 * node (e.g. `'div'`)
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		childComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,

		/**
		 * An array of data to be mapped onto the `childComponent`.

		 * This supports two data types. If an array of strings is provided, the strings will be
		 * used in the generated `childComponent` as the content (i.e. passed as `children`). If
		 * an array of objects is provided, each object will be spread onto the generated
		 * `childComponent` with no interpretation. You'll be responsible for setting properties
		 * like `disabled`, `className`, and setting the content using `children`.
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
		 * The property on each `childComponent` that receives the data in `children`
		 *
		 * @type {String}
		 * @default 'children'
		 * @public
		 */
		childProp: PropTypes.string,

		/**
		 * The name of the event that triggers activation.
		 *
		 * @type {String}
		 * @default 'onClick'
		 * @public
		 */
		childSelect: PropTypes.string,

		/**
		 * The property on each `childComponent` that receives the index of the item
		 *
		 * @type {String}
		 * @default 'data-index'
		 * @public
		 */
		indexProp: PropTypes.string,

		/**
		 * An object containing properties to be passed to each child.
		 *
		 * @type {Object}
		 * @public
		 */
		itemProps: PropTypes.object,

		/**
		 * Callback method to be invoked when an item is activated.
		 *
		 * @type {Function}
		 * @public
		 */
		onSelect: PropTypes.func,

		/**
		 * Selection mode for the group
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
		 * The index(es) of the currently activated item.
		 *
		 * @type {Number|Array}
		 * @public
		 */
		selected: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),

		/**
		 * The name of the DOM property that represents the selected state.
		 *
		 * @type {String}
		 * @default 'data-selected'
		 * @public
		 */
		selectedProp: PropTypes.string
	},

	defaultProps: {
		childProp: 'children',
		childSelect: 'onClick',
		indexProp: 'data-index',
		select: 'single',
		selectedProp: 'data-selected'
	},

	computed: {
		'aria-multiselectable': ({select}) => select === 'multiple',

		itemProps: (props) => Object.assign({},
			pickGroupItemProps(props),
			props.itemProps
		)
	},

	render: (props) => {
		delete props.onSelect;
		delete props.childSelect;
		delete props.select;
		delete props.selected;
		delete props.selectedProp;

		return <Repeater role="group" {...props} childComponent={GroupItem} />;
	}
});

/**
 * A component that supports selection of its child items via configurable properties and
 * events.
 *
 * Selected item is managed by {@link ui/Changeable.Changeable}.
 *
 * @class Group
 * @memberof ui/Group
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const Group = Changeable(
	{change: 'onSelect', prop: 'selected'},
	GroupBase
);

export default Group;
export {Group, GroupBase, GroupItem};
