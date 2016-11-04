/**
 * Exports the {@link module:@enact/moonstone/VirtualList~VirtualList} and
 * {@link module:@enact/moonstone/VirtualList~VirtualGridList} components. The default export is
 * {@link module:@enact/moonstone/VirtualList~VirtualList}.
 *
 * @module @enact/moonstone/VirtualList
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import VirtualListBase from './VirtualListBase';

/**
 * {@link module:@enact/moonstone/VirtualList~VirtualList} is a VirtualList with Moonstone styling.
 *
 * @class VirtualList
 * @ui
 * @public
 */
const VirtualList = kind({
	name: 'VirtualList',

	propTypes: {
		/**
		 * Size of an item for the VirtualList; valid value is a number.
		 * If the direction for the list is vertical, itemSize means the height of an item.
		 * For horizontal, it means the width of an item.
		 *
		 * Usage:
		 * ```
		 * <VirtualList itemSize={ri.scale(72)}/>
		 * ```
		 *
		 * @type {Number}
		 * @public
		 */
		itemSize: PropTypes.number.isRequired
	},

	render: (props) => <VirtualListBase {...props} />
});

/**
 * {@link module:@enact/moonstone/VirtualList~VirtualGridList} is a VirtualGridList with Moonstone styling.
 *
 * @class VirtualGridList
 * @ui
 * @public
 */
const VirtualGridList = kind({
	name: 'VirtualGridList',

	propTypes: {
		/**
		 * Size of an item for the VirtualGridList; valid value is an object that has `minWidth`
		 * and `minHeight` as properties.
		 *
		 * Usage:
		 * ```
		 * <VirtualGridList itemSize={{minWidth: ri.scale(180), minHeight: ri.scale(270)}}/>
		 * ```
		 *
		 * @type {Object}
		 * @public
		 */
		itemSize: PropTypes.object.isRequired
	},

	render: (props) => <VirtualListBase {...props} />
});

/**
 * {@link module:@enact/moonstone/VirtualList~VirtualEPGGridList} is a VirtualList with Moonstone styling
 * for an EGP app.
 *
 * @class VirtualEPGGridList
 * @ui
 * @public
 */
const VirtualEPGGridList = kind({
	name: 'VirtualEPGGridList',

	propTypes: {
		/**
		 * Size of an item data for the VirtualEPGGridList; valid value is an object
		 * that has `fixed` for the number of row and `variable` for the number of colume.
		 *
		 * @type {Object}
		 * @public
		 */
		dataSize: PropTypes.object.isRequired,

		/**
		 * Size of an item for the VirtualEPGGridList; valid value is an object
		 * that has `fixed` for an item height and `variable` for an variable item width.
		 *
		 * @type {Object}
		 * @public
		 */
		itemSize: PropTypes.object.isRequired
	},

	render: (props) => {
		const _props = Object.assign({}, props, {
			dataSize: props.dataSize.fixed,
			direction: 'vertical',
			directionOption: 'fixedHeightVariableWidth',
			getVariableDataSize: props.dataSize.variable,
			getVariableItemSize: props.itemSize.variable,
			itemSize: props.itemSize.fixed
		});

		return (<VirtualListBase {..._props} />);
	}
});

export default VirtualList;
export {VirtualList, VirtualGridList, VirtualEPGGridList};
export * from './GridListImageItem';
