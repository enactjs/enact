/**
 * Provides Moonstone-themed virtual list components and behaviors.
 *
 * @module moonstone/VirtualList
 * @exports VirtualGridList
 * @exports VirtualGridListNative
 * @exports VirtualList
 * @exports VirtualListBase
 * @exports VirtualListBaseNative
 * @exports VirtualListNative
 */

import kind from '@enact/core/kind';
import {gridListItemSizeShape} from '@enact/ui/VirtualList';
import warning from 'warning';
import PropTypes from 'prop-types';
import React from 'react';

import {ScrollableVirtualList, ScrollableVirtualListNative, VirtualListBase, VirtualListBaseNative} from './VirtualListBase';

/**
 * A Moonstone-styled scrollable and spottable virtual list component.
 *
 * @class VirtualList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualList = kind({
	name: 'VirtualList',

	propTypes: /** @lends moonstone/VirtualList.VirtualList.prototype */ {
		/**
		 * Size of an item for the VirtualList; valid value is a number.
		 * If the direction for the list is vertical, itemSize means the height of an item.
		 * For horizontal, it means the width of an item.
		 *
		 * Usage:
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
 * A Moonstone-styled scrollable and spottable virtual grid list component.
 *
 * @class VirtualGridList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualGridList = kind({
	name: 'VirtualGridList',

	propTypes: /** @lends moonstone/VirtualList.VirtualGridList.prototype */ {
		/**
		 * Size of an item for the VirtualGridList; valid value is an object that has `minWidth`
		 * and `minHeight` as properties.
		 *
		 * Usage:
		 * ```
		 * <VirtualGridList
		 * 	itemSize={{
		 * 		minWidth: ri.scale(180),
		 * 		minHeight: ri.scale(270)
		 * 	}}
		 * />
		 * ```
		 *
		 * @type {ui/VirtualList.gridListItemSizeShape}
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
 * A Moonstone-styled scrollable and spottable virtual list component with items having various height.
 *
 * @class NewVirtualList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @private
 */
const NewVirtualList = kind({
	name: 'NewVirtualList',

	propTypes: /** @lends moonstone/VirtualList.NewVirtualList.prototype */ {
		/**
		 * Callback method of scrollTo.
		 * But `'NewVirtualList'` do not support it.
		 *
		 * @type {Function}
		 * @private
		 */
		cbScrollTo: PropTypes.any,

		/**
		 * The layout direction of the list.
		 * But `'NewVirtualList'` do not support it.
		 *
		 * @type {String}
		 * @default 'vertical'
		 * @public
		 */
		direction: PropTypes.any,

		/**
		 * Size of an item for the VirtualList; valid value is a number.
		 * A horizontal NewVirtualList is not supported.
		 *
		 * Usage:
		 * ```
		 * <NewVirtualList itemSize={ri.scale(72)} />
		 * ```
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		itemSize: PropTypes.any.isRequired
	},

	render: ({cbScrollTo, direction, itemSize, ...rest}) => {
		warning(
			!cbScrollTo,
			'NewVirtualListNative does not support `cbScrollTo` prop'
		);

		warning(
			!direction,
			'NewVirtualListNative does not support `orientaion` prop'
		);

		return <ScrollableVirtualListNative {...rest} itemSize={itemSize.minSize} type="NewVirtualList" variableGridSizes={itemSize.size} />;
	}
});

/**
 * A Moonstone-styled scrollable and spottable virtual native list component.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualListNative
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBaseNative
 * @ui
 * @private
 */
const VirtualListNative = kind({
	name: 'VirtualListNative',

	propTypes: /** @lends moonstone/VirtualList.VirtualListNative.prototype */ {
		/**
		 * Size of an item for the VirtualList; valid value is a number.
		 * If the direction for the list is vertical, itemSize means the height of an item.
		 * For horizontal, it means the width of an item.
		 *
		 * Usage:
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
 * A Moonstone-styled scrollable and spottable virtual grid native list component.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualGridListNative
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBaseNative
 * @ui
 * @private
 */
const VirtualGridListNative = kind({
	name: 'VirtualGridListNative',

	propTypes: /** @lends moonstone/VirtualList.VirtualGridListNative.prototype */ {
		/**
		 * Size of an item for the VirtualGridList; valid value is an object that has `minWidth`
		 * and `minHeight` as properties.
		 *
		 * Usage:
		 * ```
		 * <VirtualGridListNative
		 * 	itemSize={{
		 * 		minWidth: ri.scale(180),
		 * 		minHeight: ri.scale(270)
		 * 	}}
		 * />
		 * ```
		 *
		 * @type {ui/VirtualList.gridListItemSizeShape}
		 * @required
		 * @public
		 */
		itemSize: gridListItemSizeShape.isRequired
	},

	render: (props) => (
		<ScrollableVirtualListNative {...props} />
	)
});

/**
 * A Moonstone-styled scrollable and spottable virtual native list component with items having various height.
 *
 * @class NewVirtualListNative
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBaseNative
 * @ui
 * @private
 */
const NewVirtualListNative = kind({
	name: 'NewVirtualListNative',

	propTypes: /** @lends moonstone/VirtualList.NewVirtualListNative.prototype */ {
		/**
		 * Callback method of scrollTo.
		 * But `'NewVirtualListNative'` do not support it.
		 *
		 * @type {Function}
		 * @private
		 */
		cbScrollTo: PropTypes.any,

		/**
		 * The layout direction of the list.
		 * But `'NewVirtualListNative'` do not support it.
		 *
		 * @type {String}
		 * @default 'vertical'
		 * @public
		 */
		direction: PropTypes.any,

		/**
		 * Size of an item for the VirtualList; valid value is a number.
		 * A horizontal NewVirtualList is not supported.
		 *
		 * Usage:
		 * ```
		 * <NewVirtualList itemSize={ri.scale(72)} />
		 * ```
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		itemSize: PropTypes.any.isRequired
	},

	render: ({cbScrollTo, direction, itemSize, ...rest}) => {
		warning(
			!cbScrollTo,
			'NewVirtualListNative does not support `cbScrollTo` prop'
		);

		warning(
			!direction,
			'NewVirtualListNative does not support `orientaion` prop'
		);

		return <ScrollableVirtualListNative {...rest} itemSize={itemSize.minSize} type="NewVirtualList" variableGridSizes={itemSize.size} />;
	}
});

export default VirtualList;
export {
	NewVirtualList,
	NewVirtualListNative,
	VirtualGridList,
	VirtualGridListNative,
	VirtualList,
	VirtualListBase,
	VirtualListBaseNative,
	VirtualListNative
};
