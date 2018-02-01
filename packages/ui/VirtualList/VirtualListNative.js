import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import VirtualListBaseNative, {gridListItemSizeShape} from './VirtualListBaseNative';

/**
 * {@link moonstone/VirtualList.VirtualListNative} is a VirtualList with Moonstone styling.
 *
 * @class VirtualListNative
 * @memberof moonstone/VirtualList
 * @ui
 * @private
 */
const VirtualListNative = kind({
	name: 'ui:VirtualListNative',

	propTypes: /** @lends moonstone/VirtualList.VirtualListNative.prototype */ {
		/**
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @name component
		 * @type {Function}
		 * @required
		 * @memberof moonstone/VirtualList.VirtualListNative
		 * @instance
		 * @public
		 */

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
		 * @required
		 * @public
		 */
		itemSize: PropTypes.number.isRequired

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
		 *
		 * @name data
		 * @type {Any}
		 * @default []
		 * @memberof moonstone/VirtualList.VirtualListNative
		 * @instance
		 * @public
		 */

		/**
		 * Size of the data.
		 *
		 * @name dataSize
		 * @type {Number}
		 * @default 0
		 * @memberof moonstone/VirtualList.VirtualListNative
		 * @instance
		 * @public
		 */

		/**
		 * Direction of the list; valid values are `'horizontal'` and `'vertical'`.
		 *
		 * @name direction
		 * @type {String}
		 * @default 'vertical'
		 * @memberof moonstone/VirtualList.VirtualListNative
		 * @instance
		 * @public
		 */

		/**
		 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
		 * not move focus to the scrollbar controls.
		 *
		 * @name focusableScrollbar
		 * @type {Boolean}
		 * @memberof moonstone/VirtualList.VirtualListNative
		 * @instance
		 */

		/**
		 * Spacing between items.
		 *
		 * @name spacing
		 * @type {Number}
		 * @default 0
		 * @memberof moonstone/VirtualList.VirtualListNative
		 * @instance
		 * @public
		 */
	},

	render: (props) => <VirtualListBaseNative {...props} />
});

/**
 * {@link moonstone/VirtualList.VirtualGridListNative} is a VirtualGridList with Moonstone styling.
 *
 * @class VirtualGridListNative
 * @memberof moonstone/VirtualList
 * @ui
 * @private
 */
const VirtualGridListNative = kind({
	name: 'ui:VirtualGridListNative',

	propTypes: /** @lends moonstone/VirtualList.VirtualGridListNative.prototype */ {
		/**
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @name component
		 * @type {Function}
		 * @required
		 * @memberof moonstone/VirtualList.VirtualGridListNative
		 * @instance
		 * @public
		 */

		/**
		 * Size of an item for the VirtualGridList; valid value is an object that has `minWidth`
		 * and `minHeight` as properties.
		 *
		 * Usage:
		 * ```
		 * <VirtualGridList itemSize={{minWidth: ri.scale(180), minHeight: ri.scale(270)}}/>
		 * ```
		 *
		 * @type {moonstone/VirtualList.gridListItemSizeShape}
		 * @required
		 * @public
		 */
		itemSize: gridListItemSizeShape.isRequired

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
		 *
		 * @name data
		 * @type {Any}
		 * @default []
		 * @memberof moonstone/VirtualList.VirtualGridListNative
		 * @instance
		 * @public
		 */

		/**
		 * Size of the data.
		 *
		 * @name dataSize
		 * @type {Number}
		 * @default 0
		 * @memberof moonstone/VirtualList.VirtualGridListNative
		 * @instance
		 * @public
		 */

		/**
		 * Direction of the list; valid values are `'horizontal'` and `'vertical'`.
		 *
		 * @name direction
		 * @type {String}
		 * @default 'vertical'
		 * @memberof moonstone/VirtualList.VirtualGridListNative
		 * @instance
		 * @public
		 */

		/**
		 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
		 * not move focus to the scrollbar controls.
		 *
		 * @name focusableScrollbar
		 * @type {Boolean}
		 * @memberof moonstone/VirtualList.VirtualGridListNative
		 * @instance
		 * @public
		 */

		/**
		 * Spacing between items.
		 *
		 * @name spacing
		 * @type {Number}
		 * @default 0
		 * @memberof moonstone/VirtualList.VirtualGridListNative
		 * @instance
		 * @public
		 */
	},

	render: (props) => <VirtualListBaseNative {...props} />
});

export default VirtualListNative;
export {VirtualListNative, VirtualListBaseNative, VirtualGridListNative, gridListItemSizeShape};
export * from './GridListImageItem';
