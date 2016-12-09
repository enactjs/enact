/**
 * Exports the {@link moonstone/VirtualVariableList.VirtualVariableList} component.
 *
 * @module moonstone/VirtualVariableList
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import VirtualVariableListBase from './VirtualVariableListBase';

/**
 * {@link module:@enact/moonstone/VirtualVariableList~VirtualVariableList} is a VirtualVariableList with Moonstone styling
 * which has a variable width or height.
 *
 * @class VirtualVariableList
 * @ui
 * @public
 */
const VirtualVariableList = kind({
	name: 'VirtualVariableList',

	propTypes: {
		/**
		 * Size of data for the VirtualVariableList; valid value is an object
		 * that has `fixed` for the data size of fixed dimension and `variable` for
		 * the data size of variable dimension.
		 *
		 * @type {Object}
		 * @public
		 */
		dataSize: PropTypes.object.isRequired,

		/**
		 * Size of an item for the VirtualVariableList; valid value is an object
		 * that has `fixed` for the item size of fixed dimension
		 * and `variable` for the item sizes of variable dimension.
		 *
		 * @type {Object}
		 * @public
		 */
		itemSize: PropTypes.object.isRequired
	},

	render: (orgProps) => {
		const props = Object.assign({}, orgProps);

		if (props.variableDimension === 'height') {
			props.direction = 'horizontal';
		}

		return (<VirtualVariableListBase {...props} />);
	}
});

export default VirtualVariableList;
export {VirtualVariableList};
