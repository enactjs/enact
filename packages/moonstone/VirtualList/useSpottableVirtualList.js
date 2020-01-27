import {VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

import {dataIndexAttribute, Scrollable} from '../Scrollable/Scrollable';

import usePreventScroll from './usePreventScroll';
import useSpottable from './useSpottable';
import virtualListItemsRenderer from './virtualListItemsRenderer';

/**
 * The base version of [useSpottableVirtualList]{@link moonstone/VirtualList.useSpottableVirtualList}
 *
 * @function useSpottableVirtualList
 * @memberof moonstone/VirtualList
 * @ui
 * @private
 */
const useSpottableVirtualList = (props) => {
	const {type, uiChildAdapter, uiChildContainerRef} = props;
	const {spotlightId} = props;

	// Hooks

	const instance = {uiChildAdapter, uiChildContainerRef};

	const {
		calculatePositionOnFocus,
		focusByIndex,
		focusOnNode,
		getNodeIndexToBeFocused,
		getScrollBounds,
		handlePlaceholderFocus,
		handleRestoreLastFocus,
		initItemRef,
		isNeededScrollingPlaceholder,
		setContainerDisabled,
		setLastFocusedNode,
		shouldPreventOverscrollEffect,
		shouldPreventScrollByFocus,
		SpotlightPlaceholder,
		updateStatesAndBounds
	} = useSpottable(props, instance, {type});

	const containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
	usePreventScroll(props, instance, {
		containerNode,
		type
	});

	useEffect(() => {
		props.setChildAdapter({
			calculatePositionOnFocus,
			focusByIndex,
			focusOnNode,
			getScrollBounds,
			setContainerDisabled,
			setLastFocusedNode,
			shouldPreventOverscrollEffect,
			shouldPreventScrollByFocus
		});
	}, []);

	
	// Functions

	function getComponentProps (index) {
		return (index === getNodeIndexToBeFocused()) ? {ref: (ref) => initItemRef(ref, index)} : {};
	}

	// Render

	const
		{itemRenderer, itemsRenderer, role, ...rest} = props,
		needsScrollingPlaceholder = isNeededScrollingPlaceholder();

	// not used by VirtualList
	delete rest.dangerouslyContainsInScrollable;
	// not used by VirtualList
	delete rest.focusableScrollbar;
	delete rest.scrollAndFocusScrollbarButton;
	delete rest.spotlightId;
	delete rest.uiScrollableAdapter;
	delete rest.wrap;

	return {
		...rest,
		getComponentProps: getComponentProps,
		itemRenderer: ({index, ...itemRest}) => (
			itemRenderer({
				...itemRest,
				[dataIndexAttribute]: index,
				index
			})
		),
		itemsRenderer: (itemsRendererProps) => {
			return virtualListItemsRenderer({
				...itemsRendererProps,
				handlePlaceholderFocus: handlePlaceholderFocus,
				needsScrollingPlaceholder,
				role,
				SpotlightPlaceholder
			});
		},
		onUpdateItems: handleRestoreLastFocus,
		updateStatesAndBounds: updateStatesAndBounds
	};
};

const VirtualListBase = {};

VirtualListBase.propTypes = /** @lends moonstone/VirtualList.VirtualListBase.prototype */ {
	/**
	 * The `render` function called for each item in the list.
	 *
	 * > NOTE: The list does NOT always render a component whenever its render function is called
	 * due to performance optimization.
	 *
	 * Usage:
	 * ```
	 * renderItem = ({index, ...rest}) => {
	 * 	return (
	 * 		<MyComponent index={index} {...rest} />
	 * 	);
	 * }
	 * ```
	 *
	 * @type {Function}
	 * @param {Object} event
	 * @param {Number} event.data-index It is required for Spotlight 5-way navigation. Pass to the root element in the component.
	 * @param {Number} event.index The index number of the component to render
	 * @param {Number} event.key It MUST be passed as a prop to the root element in the component for DOM recycling.
	 *
	 * @required
	 * @public
	 */
	itemRenderer: PropTypes.func.isRequired,

	/**
	 * The render function for the items.
	 *
	 * @type {Function}
	 * @required
	 * @private
	 */
	itemsRenderer: PropTypes.func.isRequired,

	/**
	 * Callback method of scrollTo.
	 * Normally, [Scrollable]{@link ui/Scrollable.Scrollable} should set this value.
	 *
	 * @type {Function}
	 * @private
	 */
	cbScrollTo: PropTypes.func,

	/**
	 * Size of the data.
	 *
	 * @type {Number}
	 * @default 0
	 * @public
	 */
	dataSize: PropTypes.number,

	/**
	 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
	 * not move focus to the scrollbar controls.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	focusableScrollbar: PropTypes.bool,

	/**
	 * Prop to check if horizontal Scrollbar exists or not.
	 *
	 * @type {Boolean}
	 * @private
	 */
	isHorizontalScrollbarVisible: PropTypes.bool,

	/**
	 * Prop to check if vertical Scrollbar exists or not.
	 *
	 * @type {Boolean}
	 * @private
	 */
	isVerticalScrollbarVisible: PropTypes.bool,

	/**
	 * The array for individually sized items.
	 *
	 * @type {Number[]}
	 * @private
	 */
	itemSizes: PropTypes.array,

	/**
	 * It scrolls by page when `true`, by item when `false`.
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	pageScroll: PropTypes.bool,

	/**
	 * The ARIA role for the list.
	 *
	 * @type {String}
	 * @default 'list'
	 * @public
	 */
	role: PropTypes.string,

	/**
	 * `true` if rtl, `false` if ltr.
	 * Normally, [Scrollable]{@link ui/Scrollable.Scrollable} should set this value.
	 *
	 * @type {Boolean}
	 * @private
	 */
	rtl: PropTypes.bool,

	/**
	 * Spacing between items.
	 *
	 * @type {Number}
	 * @default 0
	 * @public
	 */
	spacing: PropTypes.number,

	/**
	 * Spotlight Id. It would be the same with [Scrollable]{@link ui/Scrollable.Scrollable}'s.
	 *
	 * @type {String}
	 * @private
	 */
	spotlightId: PropTypes.string,

	/**
	 * TBD
	 */
	type: PropTypes.string,

	/**
	 * When it's `true` and the spotlight focus cannot move to the given direction anymore by 5-way keys,
	 * a list is scrolled with an animation to the other side and the spotlight focus moves in wraparound manner.
	 *
	 * When it's `'noAnimation'`, the spotlight focus moves in wraparound manner as same as when it's `true`
	 * except that a list is scrolled without an animation.
	 *
	 * @type {Boolean|String}
	 * @default false
	 * @public
	 */
	wrap: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.oneOf(['noAnimation'])
	])
};

VirtualListBase.defaultProps = {
	dataSize: 0,
	focusableScrollbar: false,
	pageScroll: false,
	spacing: 0,
	type: 'JS',
	wrap: false
};

/**
 * A Moonstone-styled base component for [VirtualList]{@link moonstone/VirtualList.VirtualList} and
 * [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
 *
 * @class VirtualListBase
 * @memberof moonstone/VirtualList
 * @extends ui/VirtualList.VirtualListBase
 * @ui
 * @public
 */
VirtualListBase.displayName = 'VirtualListBase';

/**
 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
 * not move focus to the scrollbar controls.
 *
 * @name focusableScrollbar
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Unique identifier for the component.
 *
 * When defined and when the `VirtualList` is within a [Panel]{@link moonstone/Panels.Panel},
 * the `VirtualList` will store its scroll position and restore that position when returning to
 * the `Panel`.
 *
 * @name id
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the vertical scroll bar.
 *
 * @name scrollDownAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll down')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
 *
 * @name scrollLeftAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll left')
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the horizontal scroll bar.
 *
 * @name scrollRightAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll right')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the vertical scroll bar.
 *
 * @name scrollUpAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll up')
 * @public
 */

export default useSpottableVirtualList;
export {
	useSpottableVirtualList,
	VirtualListBase
};
