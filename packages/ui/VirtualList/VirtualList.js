/**
 * Unstyled virtual list components and behaviors to be customized by a theme or application.
 *
 * @module ui/VirtualList
 * @exports gridListImageSizeShape
 * @exports VirtualGridList
 * @exports VirtualGridListNative
 * @exports VirtualList
 * @exports VirtualListBase
 * @exports VirtualListBaseNative
 * @exports VirtualListNative
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import {gridListItemSizeShape, ScrollableVirtualList, ScrollableVirtualListNative, VirtualListBase, VirtualListBaseNative} from './VirtualListBase';

/**
 * An unstyled scrollable virtual list component with touch support.
 *
 * @class VirtualList
 * @memberof ui/VirtualList
 * @extends ui/Scrollable.Scrollable
 * @extends ui/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualList = kind({
	name: 'ui:VirtualList',

	propTypes: /** @lends ui/VirtualList.VirtualList.prototype */ {
		/**
		 * Size of an item for the `VirtualList`.
		 *
		 * Valid value is a number. If the direction for the list is vertical,
		 * `itemSize` means the height of an item. For horizontal, it means the width of an item.
		 *
		 * Example:
		 * ```
		 * <VirtualList itemSize={ri.scale(72)} />
		 * ```
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		itemSize: PropTypes.number.isRequired
	},

	render: (props) => (
		<ScrollableVirtualList {...props} />
	)
});

/**
 * An unstyled scrollable virtual grid list component with touch support.
 *
 * @class VirtualGridList
 * @memberof ui/VirtualList
 * @extends ui/Scrollable.Scrollable
 * @extends ui/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualGridList = kind({
	name: 'ui:VirtualGridList',

	propTypes: /** @lends ui/VirtualList.VirtualGridList.prototype */ {
		/**
		 * Size of an item for the `VirtualGridList`.
		 *
		 * * Valid value is an object that has `minWidth` and `minHeight` as properties.
		 *
		 * Example:
		 * ```
		 * <VirtualGridList
		 * 	itemSize={{
		 * 		minWidth: ri.scale(180),
		 * 		minHeight: ri.scale(270)
		 * 	}}
		 * />
		 * ```
		 *
		 * @type {gridListItemSizeShape}
		 * @required
		 * @public
		 */
		itemSize: gridListItemSizeShape.isRequired
	},

	render: (props) => (
		<ScrollableVirtualList {...props} />
	)
});

/**
 * An unstyled scrollable virtual native list component with touch support.
 *
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualListNative
 * @memberof ui/VirtualList
 * @extends ui/Scrollable.ScrollableNative
 * @extends ui/VirtualList.VirtualListBaseNative
 * @ui
 * @private
 */
const VirtualListNative = kind({
	name: 'ui:VirtualListNative',

	propTypes: /** @lends ui/VirtualList.VirtualListNative.prototype */ {
		/**
		 * Size of an item for the `VirtualList`.
		 *
		 * If the direction for the list is vertical, `itemSize` means the height of an item.
		 * For `horizontal`, it means the width of an item.
		 *
		 * Example:
		 * ```
		 * <VirtualListNative itemSize={ri.scale(72)} />
		 * ```
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		itemSize: PropTypes.number.isRequired
	},

	render: (props) => (
		<ScrollableVirtualListNative {...props} />
	)
});

/**
 * An unstyled scrollable virtual native grid list component with touch support.
 *
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualGridListNative
 * @memberof ui/VirtualList
 * @extends ui/Scrollable.ScrollableNative
 * @extends ui/VirtualList.VirtualListBaseNative
 * @ui
 * @private
 */
const VirtualGridListNative = kind({
	name: 'ui:VirtualGridListNative',

	propTypes: /** @lends ui/VirtualList.VirtualGridListNative.prototype */ {
		/**
		 * Size of an item for the `VirtualGridList`
		 *
		 * * Valid value is an object that has `minWidth` and `minHeight` as properties.
		 *
		 * Example:
		 * ```
		 * <VirtualGridListNative
		 * 	itemSize={{
		 * 		minWidth: ri.scale(180),
		 * 		minHeight: ri.scale(270)
		 * 	}}
		 * />
		 * ```
		 *
		 * @type {gridListItemSizeShape}
		 * @required
		 * @public
		 */
		itemSize: gridListItemSizeShape.isRequired
	},

	render: (props) => (
		<ScrollableVirtualListNative {...props} />
	)
});

export default VirtualList;
export {
	gridListItemSizeShape,
	VirtualGridList,
	VirtualGridListNative,
	VirtualList,
	VirtualListBase,
	VirtualListBaseNative,
	VirtualListNative
};
