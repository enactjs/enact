/**
 * Exports the {@link moonstone/VirtualList.VirtualList},
 * {@link moonstone/VirtualList.VirtualGridList}, and
 * {@link moonstone/VirtualList.GridListImageItem} components.
 * The default export is {@link moonstone/VirtualList.VirtualList}.
 *
 * @module moonstone/VirtualList
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import VirtualListBase, {gridListItemSizeShape} from './VirtualListBase';

/**
 * {@link moonstone/VirtualList.VirtualList} is a VirtualList with Moonstone styling.
 *
 * @class VirtualList
 * @memberof moonstone/VirtualList
 * @ui
 * @public
 */
const VirtualList = kind({
	name: 'VirtualList',

	propTypes: /** @lends moonstone/VirtualList.VirtualList.prototype */ {
		/**
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @name component
		 * @type {Function}
		 * @required
		 * @memberof moonstone/VirtualList.VirtualList
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
		 *   This option is available for only VirtualList kind.
		 * - {node} - You can set a node to scroll
		 * - {animate} - When `true`, scroll occurs with animation.
		 *   Set it to `false`, if you want scrolling without animation.
		 * - {indexToFocus} - Deprecated: Use `focus` insead.
		 * - {focus} - Set it `true`, if you want the item to be focused after scroll.
		 *   This option is only valid when you scroll by `index` or `node`.
		 *
		 * @name cbScrollTo
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualList
		 * @example
		 *	// If you set cbScrollTo prop like below;
		 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
		 *	// You can simply call like below;
		 *	this.scrollTo({align: 'top'}); // scroll to the top
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
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Size of the data.
		 *
		 * @name dataSize
		 * @type {Number}
		 * @default 0
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Direction of the list; valid values are `'horizontal'` and `'vertical'`.
		 *
		 * @name direction
		 * @type {String}
		 * @default 'vertical'
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
		 * not move focus to the scrollbar controls.
		 *
		 * @name focusableScrollbar
		 * @type {Boolean}
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Specifies how to show horizontal scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name horizontalScrollbar
		 * @type {String}
		 * @default 'auto'
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scrolling
		 *
		 * @name onScroll
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll starts
		 *
		 * @name onScrollStart
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll stops
		 *
		 * @name onScrollStop
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Spacing between items.
		 *
		 * @name spacing
		 * @type {Number}
		 * @default 0
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Specifies how to show vertical scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name verticalScrollbar
		 * @type {String}
		 * @default 'auto'
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */
	},

	render: (props) => <VirtualListBase {...props} />
});

/**
 * {@link moonstone/VirtualList.VirtualGridList} is a VirtualGridList with Moonstone styling.
 *
 * @class VirtualGridList
 * @memberof moonstone/VirtualList
 * @ui
 * @public
 */
const VirtualGridList = kind({
	name: 'VirtualGridList',

	propTypes: /** @lends moonstone/VirtualList.VirtualGridList.prototype */ {
		/**
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @name component
		 * @type {Function}
		 * @required
		 * @memberof moonstone/VirtualList.VirtualGridList
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
		 *   This option is available for only VirtualList kind.
		 * - {node} - You can set a node to scroll
		 * - {animate} - When `true`, scroll occurs with animation.
		 *   Set it to `false`, if you want scrolling without animation.
		 * - {indexToFocus} - Deprecated: Use `focus` insead.
		 * - {focus} - Set it `true`, if you want the item to be focused after scroll.
		 *   This option is only valid when you scroll by `index` or `node`.
		 *
		 * @name cbScrollTo
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @example
		 *	// If you set cbScrollTo prop like below;
		 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
		 *	// You can simply call like below;
		 *	this.scrollTo({align: 'top'}); // scroll to the top
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
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Size of the data.
		 *
		 * @name dataSize
		 * @type {Number}
		 * @default 0
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Direction of the list; valid values are `'horizontal'` and `'vertical'`.
		 *
		 * @name direction
		 * @type {String}
		 * @default 'vertical'
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
		 * not move focus to the scrollbar controls.
		 *
		 * @name focusableScrollbar
		 * @type {Boolean}
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Specifies how to show horizontal scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name horizontalScrollbar
		 * @type {String}
		 * @default 'auto'
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scrolling
		 *
		 * @name onScroll
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll starts
		 *
		 * @name onScrollStart
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll stops
		 *
		 * @name onScrollStop
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Spacing between items.
		 *
		 * @name spacing
		 * @type {Number}
		 * @default 0
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Specifies how to show vertical scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name verticalScrollbar
		 * @type {String}
		 * @default 'auto'
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */
	},

	render: (props) => <VirtualListBase {...props} pageScroll />
});

export default VirtualList;
export {VirtualList, VirtualGridList};
export * from './GridListImageItem';
