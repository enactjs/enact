/**
 * Provides Moonstone-themed virtual list components and behaviors.
 *
 * @module moonstone/VirtualList
 * @exports VirtualGridList
 * @exports VirtualList
 * @exports VirtualListBase
 */

import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {ResizeContext} from '@enact/ui/Resizable';
import {gridListItemSizeShape, itemSizesShape, VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import React from 'react';
import warning from 'warning';

import useScroll from '../Scrollable';
import Scrollbar from '../Scrollable/Scrollbar';
import Skinnable from '../Skinnable';

import {useSpottableVirtualList, VirtualListBase} from './VirtualListBase';

/**
 * A Moonstone-styled scrollable and spottable virtual list component.
 *
 * @class VirtualList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @public
 */
let VirtualList = ({itemSize, role, ...rest}) => {
	const props = itemSize && itemSize.minSize ?
		{
			itemSize: itemSize.minSize,
			itemSizes: itemSize.size
		} :
		{
			itemSize
		};

	warning(
		!rest.itemSizes || !rest.cbScrollTo,
		'VirtualList with `minSize` in `itemSize` prop does not support `cbScrollTo` prop'
	);

	// Hooks

	const {
		// Variables
		childWrapper: ChildWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible,

		// Child Props
		resizeContextProps,
		scrollContainerProps,
		innerScrollContainerProps,
		childWrapperProps,
		childProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScroll({...rest, ...props});

	const uiChildProps = useSpottableVirtualList({
		...childProps,
		focusableScrollbar: rest.focusableScrollbar,
		role: role
	});

	return (
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollContainerProps}>
				<div {...innerScrollContainerProps}>
					<ChildWrapper {...childWrapperProps}>
						<UiVirtualListBase {...uiChildProps} />
					</ChildWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext.Provider>
	);
};

VirtualList.displayName = 'VirtualList';

// TBD: indentation is broken intentionally to help comparing
/* eslint-disable indent */
VirtualList.propTypes = /** @lends moonstone/VirtualList.VirtualList.prototype */ {
		/**
		 * Size of an item for the VirtualList; valid value is a number generally.
		 * For different item size, value is an object that has `minSize`
		 * and `size` as properties.
		 * If the direction for the list is vertical, itemSize means the height of an item.
		 * For horizontal, it means the width of an item.
		 *
		 * Usage:
		 * ```
		 * <VirtualList itemSize={ri.scale(72)} />
		 * ```
		 *
		 * @type {Number|ui/VirtualList.itemSizesShape}
		 * @required
		 * @public
		 */
		itemSize: PropTypes.oneOfType([PropTypes.number, itemSizesShape]).isRequired,

		cbScrollTo: PropTypes.func,

		/**
		 * `false` if the content of the list or the scroller could get focus
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		'data-spotlight-container-disabled': PropTypes.bool,

		direction: PropTypes.oneOf(['horizontal', 'vertical']),
		focusableScrollbar: PropTypes.bool,

		/**
		 * Specifies how to show horizontal scrollbar.
		 *
		 * Valid values are:
		 * * `'auto'`,
		 * * `'visible'`, and
		 * * `'hidden'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		horizontalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

		itemSizes: PropTypes.array,

		/**
		 * Specifies overscroll effects shows on which type of inputs.
		 *
		 * @type {Object}
		 * @default {
		 *	arrowKey: false,
		*	drag: false,
		*	pageKey: false,
		*	scrollbarButton: false,
		*	wheel: true
		* }
		* @private
		*/
		overscrollEffectOn: PropTypes.shape({
			arrowKey: PropTypes.bool,
			drag: PropTypes.bool,
			pageKey: PropTypes.bool,
			scrollbarButton: PropTypes.bool,
			wheel: PropTypes.bool
		}),

		preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),
		role: PropTypes.string,

		type: PropTypes.string,

		/**
		 * Specifies how to show vertical scrollbar.
		 *
		 * Valid values are:
		 * * `'auto'`,
		 * * `'visible'`, and
		 * * `'hidden'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden'])
};

VirtualList.defaultProps = {
	'data-spotlight-container-disabled': false,
	direction: 'vertical',
	focusableScrollbar: false,
	horizontalScrollbar: 'auto',
	overscrollEffectOn: {
		arrowKey: false,
		drag: false,
		pageKey: false,
		scrollbarButton: false,
		wheel: true
	},
	preventBubblingOnKeyDown: 'none',
	role: 'list',
	type: 'JS',
	verticalScrollbar: 'auto'
};

VirtualList = Skinnable(
	SpotlightContainerDecorator(
		{
			overflow: true,
			preserveId: true,
			restrict: 'self-first'
		},
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			VirtualList
		)
	)
);

/**
 * A Moonstone-styled scrollable and spottable virtual grid list component.
 *
 * @class VirtualGridList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @public
 */
let VirtualGridList = ({role, ...rest}) => {
	const {
		// Variables
		childWrapper: ChildWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible,

		// Child Props
		resizeContextProps,
		scrollContainerProps,
		innerScrollContainerProps,
		childWrapperProps,
		childProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScroll(rest);

	const uiChildProps = useSpottableVirtualList({
		...childProps,
		focusableScrollbar: rest.focusableScrollbar,
		role: role
	});

	return (
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollContainerProps}>
				<div {...innerScrollContainerProps}>
					<ChildWrapper {...childWrapperProps}>
						<UiVirtualListBase {...uiChildProps} />
					</ChildWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext.Provider>
	);
};

VirtualGridList.displayName = 'VirtualGridList';

// TBD: indentation is broken intentionally to help comparing
/* eslint-disable indent */
VirtualGridList.propTypes = /** @lends moonstone/VirtualList.VirtualGridList.prototype */ {
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
		itemSize: gridListItemSizeShape.isRequired,

		cbScrollTo: PropTypes.func,

		/**
		 * `false` if the content of the list or the scroller could get focus
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		'data-spotlight-container-disabled': PropTypes.bool,

		direction: PropTypes.oneOf(['horizontal', 'vertical']),
		focusableScrollbar: PropTypes.bool,
		/**
		 * Specifies how to show horizontal scrollbar.
		 *
		 * Valid values are:
		 * * `'auto'`,
		 * * `'visible'`, and
		 * * `'hidden'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		horizontalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

		itemSizes: PropTypes.array,

		/**
		 * Specifies overscroll effects shows on which type of inputs.
		 *
		 * @type {Object}
		 * @default {
		 *	arrowKey: false,
		*	drag: false,
		*	pageKey: false,
		*	scrollbarButton: false,
		*	wheel: true
		* }
		* @private
		*/
		overscrollEffectOn: PropTypes.shape({
			arrowKey: PropTypes.bool,
			drag: PropTypes.bool,
			pageKey: PropTypes.bool,
			scrollbarButton: PropTypes.bool,
			wheel: PropTypes.bool
		}),

		preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),
		role: PropTypes.string,
		type: PropTypes.string,

		/**
		 * Specifies how to show vertical scrollbar.
		 *
		 * Valid values are:
		 * * `'auto'`,
		 * * `'visible'`, and
		 * * `'hidden'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden'])
};

VirtualGridList.defaultProps = {
	'data-spotlight-container-disabled': false,
	direction: 'vertical',
	focusableScrollbar: false,
	horizontalScrollbar: 'auto',
	overscrollEffectOn: {
		arrowKey: false,
		drag: false,
		pageKey: false,
		scrollbarButton: false,
		wheel: true
	},
	preventBubblingOnKeyDown: 'none',
	role: 'list',
	type: 'JS',
	verticalScrollbar: 'auto'
};

VirtualGridList = Skinnable(
	SpotlightContainerDecorator(
		{
			overflow: true,
			preserveId: true,
			restrict: 'self-first'
		},
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			VirtualGridList
		)
	)
);

export default VirtualList;
export {
	VirtualGridList,
	VirtualList,
	VirtualListBase
};
