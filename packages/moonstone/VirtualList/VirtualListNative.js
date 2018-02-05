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
	name: 'VirtualListNative',

	propTypes: /** @lends moonstone/VirtualList.VirtualListNative.prototype */ {
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
		 * The callback function which is called for linking scrollTo function.
		 * You should specify a callback function as the value of this prop
		 * to use scrollTo feature.
		 *
		 * The scrollTo function passed to the parent component accepts below as an argument.
		 * - {position: {x, y}} - You can set a pixel value for x and/or y position
		 * - {align} - You can set one of values below for align
		 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
		 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
		 * - {index} - You can set an index of specific item. (`0` or positive integer)
		 *   This option is available only for `VirtualList` kind.
		 * - {node} - You can set a node to scroll
		 * - {animate} - When `true`, scroll occurs with animation.
		 *   Set it to `false` if you want scrolling without animation.
		 * - {indexToFocus} - Deprecated: Use `focus` instead.
		 * - {focus} - Set `true` if you want the item to be focused after scroll.
		 *   This option is only valid when you scroll by `index` or `node`.
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
		 * @memberof moonstone/VirtualList.VirtualListNative
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
		 * @public
		 */

		/**
		 * Specifies how to show horizontal scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name horizontalScrollbar
		 * @type {String}
		 * @default 'auto'
		 * @memberof moonstone/VirtualList.VirtualListNative
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
		 * @memberof moonstone/VirtualList.VirtualListNative
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
		 * @memberof moonstone/VirtualList.VirtualListNative
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
		 * @memberof moonstone/VirtualList.VirtualListNative
		 * @instance
		 * @public
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

		/**
		 * Specifies how to show vertical scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name verticalScrollbar
		 * @type {String}
		 * @default 'auto'
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
	name: 'VirtualGridListNative',

	propTypes: /** @lends moonstone/VirtualList.VirtualGridListNative.prototype */ {
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
		 * The callback function which is called for linking scrollTo function.
		 * You should specify a callback function as the value of this prop
		 * to use scrollTo feature.
		 *
		 * The scrollTo function passed to the parent component accepts below as an argument.
		 * - {position: {x, y}} - You can set a pixel value for x and/or y position
		 * - {align} - You can set one of values below for align
		 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
		 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
		 * - {index} - You can set an index of specific item. (`0` or positive integer)
		 *   This option is available only for `VirtualList` kind.
		 * - {node} - You can set a node to scroll
		 * - {animate} - When `true`, scroll occurs with animation.
		 *   Set it to `false` if you want scrolling without animation.
		 * - {indexToFocus} - Deprecated: Use `focus` instead.
		 * - {focus} - Set `true` if you want the item to be focused after scroll.
		 *   This option is only valid when you scroll by `index` or `node`.
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
		 * @memberof moonstone/VirtualList.VirtualGridListNative
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
		 * Specifies how to show horizontal scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name horizontalScrollbar
		 * @type {String}
		 * @default 'auto'
		 * @memberof moonstone/VirtualList.VirtualGridListNative
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
		 * @memberof moonstone/VirtualList.VirtualGridListNative
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
		 * @memberof moonstone/VirtualList.VirtualGridListNative
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

		/**
		 * Specifies how to show vertical scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @name verticalScrollbar
		 * @type {String}
		 * @default 'auto'
		 * @memberof moonstone/VirtualList.VirtualGridListNative
		 * @instance
		 * @public
		 */
	},

	render: (props) => <VirtualListBaseNative {...props} />
});

export default VirtualListNative;
export {VirtualListNative, VirtualGridListNative};
export * from './GridListImageItem';
