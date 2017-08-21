/**
 * Exports the {@link ui/VirtualList.VirtualList},
 * {@link ui/VirtualList.VirtualGridList}, and
 * {@link ui/VirtualList.GridListImageItem} components.
 * The default export is {@link ui/VirtualList.VirtualList}.
 *
 * @module ui/VirtualList
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import VirtualListBase, {gridListItemSizeShape} from './VirtualListBase';

/**
 * {@link ui/VirtualList.VirtualList} is a VirtualList.
 *
 * @class VirtualList
 * @memberof ui/VirtualList
 * @ui
 * @public
 */
const VirtualList = kind({
	name: 'VirtualList',

	propTypes: /** @lends ui/VirtualList.VirtualList.prototype */ {
		/**
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @name component
		 * @type {Function}
		 * @required
		 * @memberof ui/VirtualList.VirtualList
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
		 * The callback function which is called for linking scrollTo function.
		 * You should specify a callback function as the value of this prop
		 * to use scrollTo feature.
		 *
		 * The scrollTo function passed to the parent component requires below as an argument.
		 * - {position: {x, y}} - You can set a pixel value for x and/or y position
		 * - {align} - You can set one of values below for align
		 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
		 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
		 * - {index} - You can set an index of specific item. (`0` or positive integer)
		 *   This option is available only for `VirtualList` kind.
		 * - {node} - You can set a node to scroll
		 * - {animate} - When `true`, scroll occurs with animation.
		 *   Set it to `false` if you want scrolling without animation.
		 *
		 * Example:
		 * ````
		 *	// If you set cbScrollTo prop like below;
		 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
		 *	// You can simply call like below;
		 *	this.scrollTo({align: 'top'}); // scroll to the top
		 * ```
		 *
		 * @name cbScrollTo
		 * @type {Function}
		 * @memberof ui/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
		 *
		 * @name data
		 * @type {Any}
		 * @default []
		 * @memberof ui/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Size of the data.
		 *
		 * @name dataSize
		 * @type {Number}
		 * @default 0
		 * @memberof ui/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Direction of the list; valid values are `'horizontal'` and `'vertical'`.
		 *
		 * @name direction
		 * @type {String}
		 * @default 'vertical'
		 * @memberof ui/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Specifies how to show horizontal scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name horizontalScrollbar
		 * @type {String}
		 * @default 'hidden'
		 * @memberof ui/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scrolling
		 *
		 * @name onScroll
		 * @type {Function}
		 * @memberof ui/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll starts
		 *
		 * @name onScrollStart
		 * @type {Function}
		 * @memberof ui/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll stops
		 *
		 * @name onScrollStop
		 * @type {Function}
		 * @memberof ui/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Spacing between items.
		 *
		 * @name spacing
		 * @type {Number}
		 * @default 0
		 * @memberof ui/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Specifies how to show vertical scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name verticalScrollbar
		 * @type {String}
		 * @default 'hidden'
		 * @memberof ui/VirtualList.VirtualList
		 * @instance
		 * @public
		 */
	},

	render: (props) => <VirtualListBase {...props} />
});

/**
 * {@link ui/VirtualList.VirtualGridList} is a VirtualGridList.
 *
 * @class VirtualGridList
 * @memberof ui/VirtualList
 * @ui
 * @public
 */
const VirtualGridList = kind({
	name: 'VirtualGridList',

	propTypes: /** @lends ui/VirtualList.VirtualGridList.prototype */ {
		/**
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @name component
		 * @type {Function}
		 * @required
		 * @memberof ui/VirtualList.VirtualGridList
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
		 * @type {ui/VirtualList.gridListItemSizeShape}
		 * @required
		 * @public
		 */
		itemSize: gridListItemSizeShape.isRequired

		/**
		 * The callback function which is called for linking scrollTo function.
		 * You should specify a callback function as the value of this prop
		 * to use scrollTo feature.
		 *
		 * The scrollTo function passed to the parent component requires below as an argument.
		 * - {position: {x, y}} - You can set a pixel value for x and/or y position
		 * - {align} - You can set one of values below for align
		 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
		 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
		 * - {index} - You can set an index of specific item. (`0` or positive integer)
		 *   This option is available only for `VirtualList` kind.
		 * - {node} - You can set a node to scroll
		 * - {animate} - When `true`, scroll occurs with animation.
		 *   Set it to `false` if you want scrolling without animation.
		 *
		 * Example:
		 *	// If you set cbScrollTo prop like below;
		 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
		 *	// You can simply call like below;
		 *	this.scrollTo({align: 'top'}); // scroll to the top
		 * ```
		 *
		 * @name cbScrollTo
		 * @type {Function}
		 * @memberof ui/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
		 *
		 * @name data
		 * @type {Any}
		 * @default []
		 * @memberof ui/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Size of the data.
		 *
		 * @name dataSize
		 * @type {Number}
		 * @default 0
		 * @memberof ui/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Direction of the list; valid values are `'horizontal'` and `'vertical'`.
		 *
		 * @name direction
		 * @type {String}
		 * @default 'vertical'
		 * @memberof ui/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Specifies how to show horizontal scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name horizontalScrollbar
		 * @type {String}
		 * @default 'hidden'
		 * @memberof ui/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scrolling
		 *
		 * @name onScroll
		 * @type {Function}
		 * @memberof ui/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll starts
		 *
		 * @name onScrollStart
		 * @type {Function}
		 * @memberof ui/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll stops
		 *
		 * @name onScrollStop
		 * @type {Function}
		 * @memberof ui/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Spacing between items.
		 *
		 * @name spacing
		 * @type {Number}
		 * @default 0
		 * @memberof ui/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Specifies how to show vertical scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name verticalScrollbar
		 * @type {String}
		 * @default 'hidden'
		 * @memberof ui/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */
	},

	render: (props) => <VirtualListBase {...props} />
});

export default VirtualList;
export {VirtualList, VirtualGridList};
export * from './GridListImageItem';
