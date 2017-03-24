/**
 * Exports the {@link ui/Group.Group} and {@link ui/Group.GroupItem}
 * components.  The default export is {@link ui/Group.Group}.
 *
 * @module ui/Group
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Repeater from '../Repeater';

import {GroupItem, pickGroupItemProps} from './GroupItem';

/**
 * {@link ui/Group.Group} is a stateless component that supports single-select of
 * its child items via configurable properties and events.
 *
 * @class Group
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
		 * @type {Element}
		 * @public
		 */
		childComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,

		/**
		 * An array of data to be mapped onto the `childComponent`.  For example, an array of
		 * strings.
		 *
		 * @type {Array}
		 * @public
		 */
		children: PropTypes.array.isRequired,

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
		 * @type {Number | Array}
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

export default GroupBase;
export {GroupBase as Group, GroupBase, GroupItem};
