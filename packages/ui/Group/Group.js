/**
 * Exports the {@link module:@enact/ui/Group~Group} and {@link module:@enact/ui/Group~GroupBase}
 * components.  The default export is {@link module:@enact/ui/Group~Group}. `Group` is stateless
 * and is the same as `GroupBase`.
 *
 * @module @enact/ui/Group
 */

import R from 'ramda';
import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';

import Repeater from '../Repeater';

import {GroupItem, pickGroupItemProps} from './GroupItem';

/**
 * {@link module:@enact/ui/Group~GroupBase} is a stateless component that supports single-select of
 * its child items via configurable properties and events.
 *
 * @class GroupBase
 * @ui
 * @public
 */
const GroupBase = kind({
	name: 'Group',

	propTypes: {
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
		 * Callback method to be invoked when an item is activated.
		 *
		 * @type {Function}
		 * @public
		 */
		onActivate: PropTypes.func.isRequired,

		/**
		 * The name of the event that triggers activation.
		 *
		 * @type {String}
		 * @default 'onClick'
		 * @public
		 */
		activate: PropTypes.string,

		/**
		 * The property on each `childComponent` that receives the data in `children`
		 *
		 * @type {String}
		 * @default 'children'
		 * @public
		 */
		childProp: PropTypes.string,

		/**
		 * The index of the currently activated item.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		index: PropTypes.number,

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
		 * The name of the DOM property that represents the selected state.
		 *
		 * @type {String}
		 * @default 'data-selected'
		 * @public
		 */
		selectedProp: PropTypes.string
	},

	defaultProps: {
		activate: 'onClick',
		index: 0,
		indexProp: 'data-index',
		childProp: 'children',
		selectedProp: 'data-selected'
	},

	computed: {
		itemProps: R.converge(R.merge, [
			pickGroupItemProps,
			R.prop('itemProps')
		])
	},

	render: (props) => {
		delete props.onActivate;
		delete props.activate;
		delete props.index;
		delete props.selectedProp;

		return <Repeater {...props} childComponent={GroupItem} />;
	}
});

export default GroupBase;
export {GroupBase as Group, GroupBase, GroupItem};
