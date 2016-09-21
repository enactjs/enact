/**
 * Exports the {@link module:enact-ui/Group~Group} and {@link module:enact-ui/Group~GroupBase}
 * components.  The default export is {@link module:enact-ui/Group~Group}. `Group` is stateless
 * and is the same as `GroupBase`.
 *
 * @module enact-ui/Group
 */

import R from 'ramda';
import React, {PropTypes} from 'react';
import kind from 'enact-core/kind';

import Repeater from '../Repeater';

import {GroupItem, pickGroupItemProps} from './GroupItem';

/**
 * {@link module:enact-ui/Group~GroupBase} is a stateless component that supports single-select of
 * its child items via configurable properties and events.
 *
 * @class GroupBase
 * @ui
 * @public
 */
const GroupBase = kind({
	name: 'Group',

	propTypes: {
		// Somehow, incorporate propTypes from Repeater...
		...Repeater.propTypes,

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
		 * The index of the currently activated item.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		index: PropTypes.number,

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
		...Repeater.defaultProps,
		activate: 'onClick',
		selectedProp: 'data-selected',
		index: 0
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
