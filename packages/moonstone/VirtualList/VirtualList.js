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

import {gridListItemSizeShape} from '@enact/ui/VirtualList';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {SpottableVirtualList, SpottableVirtualListNative, VirtualListBase, VirtualListBaseNative} from './VirtualListBase';

/**
 * A Moonstone-styled scrollable and spottable virtual list component.
 *
 * @class VirtualList
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.SpotlightContainerDecorator
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
		<SpottableVirtualList {...props} />
	)
});

/**
 * A Moonstone-styled scrollable and spottable virtual grid list component.
 *
 * @class VirtualGridList
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.SpotlightContainerDecorator
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
		<SpottableVirtualList {...props} />
	)
});


/**
 * A Moonstone-styled scrollable and spottable virtual native list component.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualListNative
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.SpotlightContainerDecorator
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
		<SpottableVirtualListNative {...props} />
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
 * @mixes moonstone/Scrollable.SpotlightContainerDecorator
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
		<SpottableVirtualListNative {...props} />
	)
});

/**
 * A Moonstone-styled scrollable and spottable virtual list component for Easy TV.
 *
 * @class VirtualListEasy
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualList
 * @ui
 * @public
 */
class VirtualListEasy extends Component {
	static displayName = 'VirtualListEasy'

	static propTypes = /** @lends moonstone/VirtualList.VirtualListEasy.prototype */ {
		/**
		 * When `true`, if the spotlight focus moves in wraparound manner to the other side,
		 * it scrolles with an animation.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		wrapAnimated: PropTypes.bool
	}

	static defaultProps = {
		wrapAnimated: false
	}

	render () {
		return <VirtualList {...this.props} wrap />;
	}
}

/**
 * A Moonstone-styled scrollable and spottable virtual grid list component for Easy TV.
 *
 * @class VirtualGridListEasy
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualGridList
 * @ui
 * @public
 */
class VirtualGridListEasy extends Component {
	static displayName = 'VirtualGridListEasy'

	static propTypes = /** @lends moonstone/VirtualList.VirtualGridListEasy.prototype */ {
		/**
		 * When `true`, if the spotlight focus moves in wraparound manner to the other side,
		 * it scrolles with an animation.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		wrapAnimated: PropTypes.bool
	}

	static defaultProps = {
		wrapAnimated: false
	}

	render () {
		return <VirtualGridList {...this.props} wrap />;
	}
}

/**
 * A Moonstone-styled scrollable and spottable virtual native list component for Easy TV.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualListEasyNative
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListNative
 * @ui
 * @private
 */
class VirtualListEasyNative extends Component {
	static displayName = 'VirtualListEasyNative'

	static propTypes = /** @lends moonstone/VirtualList.VirtualListEasyNative.prototype */ {
		/**
		 * When `true`, if the spotlight focus moves in wraparound manner to the other side,
		 * it scrolles with an animation.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		wrapAnimated: PropTypes.bool
	}

	static defaultProps = {
		wrapAnimated: false
	}

	render () {
		return <VirtualListNative {...this.props} wrap />;
	}
}

/**
 * A Moonstone-styled scrollable and spottable virtual grid native list component for Easy TV.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualGridListEasyNative
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualGridListNative
 * @ui
 * @private
 */
class VirtualGridListEasyNative extends Component {
	static displayName = 'VirtualGridListEasyNative'

	static propTypes = /** @lends moonstone/VirtualList.VirtualGridListEasyNative.prototype */ {
		/**
		 * When `true`, if the spotlight focus moves in wraparound manner to the other side,
		 * it scrolles with an animation.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		wrapAnimated: PropTypes.bool
	}

	static defaultProps = {
		wrapAnimated: false
	}

	render () {
		return <VirtualGridListNative {...this.props} wrap />;
	}
}

export default VirtualList;
export {
	VirtualGridList,
	VirtualGridListEasy,
	VirtualGridListEasyNative,
	VirtualGridListNative,
	VirtualList,
	VirtualListBase,
	VirtualListBaseNative,
	VirtualListEasy,
	VirtualListEasyNative,
	VirtualListNative
};
