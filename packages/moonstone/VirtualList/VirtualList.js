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
		 * The `render` function for an item of the list receives the following parameters:
		 * - `data` is for accessing the supplied `data` property of the list.
		 * > NOTE: In most cases, it is recommended to use data from redux store instead of using
		 * is parameters due to performance optimizations
		 * - `data-index` is required for Spotlight 5-way navigation.  Pass to the root element in
		 *   the component.
		 * - `index` is the index number of the componet to render
		 * - `key` MUST be passed as a prop to the root element in the component for DOM recycling.
		 *
		 * Data manipulation can be done in this function.
		 *
		 * > NOTE: The list does NOT always render a component whenever its render function is called
		 * due to performance optimization.
		 *
		 * Usage:
		 * ```
		 * renderItem = ({index, ...rest}) => {
		 *		delete rest.data;
		 *
		 *		return (
		 *			<MyComponent index={index} {...rest} />
		 *		);
		 * }
		 * ```
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
		 * A callback function that receives a reference to the `scrollTo` feature. Once received,
		 * the `scrollTo` method can be called as an imperative interface.
		 *
		 * The `scrollTo` function accepts the following paramaters:
		 * - {position: {x, y}} - Pixel value for x and/or y position
		 * - {align} - Where the scroll area should be aligned. Values are:
		 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
		 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
		 * - {index} - Index of specific item. (`0` or positive integer)
		 * - {node} - Node to scroll into view
		 * - {animate} - When `true`, scroll occurs with animation. When `false`, no
		 *   animation occurs.
		 * - {indexToFocus} - Deprecated: Use `focus` instead.
		 * - {focus} - When `true`, attempts to focus item after scroll. Only valid when scrolling
		 *   by `index` or `node`.
		 * > Note: Only specify one of: `position`, `align`, `index` or `node`
		 *
		 * Example:
		 * ```
		 *	// If you set cbScrollTo prop like below;
		 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
		 *	// You can simply call like below;
		 *	this.scrollTo({align: 'top'}); // scroll to the top
		 * ```
		 *
		 * @name cbScrollTo
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Data for passing through to the `component` prop.
		 * NOTICE: For performance reason, changing this prop does NOT always cause the list to
		 * redraw its items.
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
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 * It is not recommended to set this prop since it can cause performance degradation. Use
		 * `onScrollStart` or `onScrollStop` instead.
		 *
		 * @name onScroll
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll starts
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 * `moreInfo` has `firstVisibleIndex` and `lastVisibleIndex`
		 *
		 * @name onScrollStart
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll stops
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 * `moreInfo` has `firstVisibleIndex` and `lastVisibleIndex`
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
		 * The `render` function for an item of the list receives the following parameters:
		 * - `data` is for accessing the supplied `data` property of the list.
		 * > NOTE: In most cases, it is recommended to use data from redux store instead of using
		 * is parameters due to performance optimizations
		 * - `data-index` is required for Spotlight 5-way navigation.  Pass to the root element in
		 *   the component.
		 * - `index` is the index number of the componet to render
		 * - `key` MUST be passed as a prop to the root element in the component for DOM recycling.
		 *
		 * Data manipulation can be done in this function.
		 *
		 * > NOTE: The list does NOT always render a component whenever its render function is called
		 * due to performance optimization.
		 *
		 * Usage:
		 * ```
		 * renderItem = ({index, ...rest}) => {
		 *		delete rest.data;
		 *
		 *		return (
		 *			<MyComponent index={index} {...rest} />
		 *		);
		 * }
		 * ```
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
		 * A callback function that receives a reference to the `scrollTo` feature. Once received,
		 * the `scrollTo` method can be called as an imperative interface.
		 *
		 * The `scrollTo` function accepts the following paramaters:
		 * - {position: {x, y}} - Pixel value for x and/or y position
		 * - {align} - Where the scroll area should be aligned. Values are:
		 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
		 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
		 * - {index} - Index of specific item. (`0` or positive integer)
		 * - {node} - Node to scroll into view
		 * - {animate} - When `true`, scroll occurs with animation. When `false`, no
		 *   animation occurs.
		 * - {indexToFocus} - Deprecated: Use `focus` instead.
		 * - {focus} - When `true`, attempts to focus item after scroll. Only valid when scrolling
		 *   by `index` or `node`.
		 * > Note: Only specify one of: `position`, `align`, `index` or `node`
		 *
		 * Example:
		 * ```
		 *	// If you set cbScrollTo prop like below;
		 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
		 *	// You can simply call like below;
		 *	this.scrollTo({align: 'top'}); // scroll to the top
		 * ```
		 *
		 * @name cbScrollTo
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Data for passing it through `component` prop.
		 * NOTICE: For performance reason, changing this prop does NOT always cause redraw items.
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
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 * It is not recommended to set this prop since it can cause performance degradation. Use
		 * `onScrollStart` or `onScrollStop` instead.
		 *
		 * @name onScroll
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll starts
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 * `moreInfo` has `firstVisibleIndex` and `lastVisibleIndex`
		 *
		 * @name onScrollStart
		 * @type {Function}
		 * @memberof moonstone/VirtualList.VirtualGridList
		 * @instance
		 * @public
		 */

		/**
		 * Called when scroll stops
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 * `moreInfo` has `firstVisibleIndex` and `lastVisibleIndex`
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

	render: (props) => <VirtualListBase {...props} />
});

export default VirtualList;
export {VirtualList, VirtualGridList};
export * from './GridListImageItem';
