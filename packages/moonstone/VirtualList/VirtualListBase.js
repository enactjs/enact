import {VirtualListBase as UiVirtualListBase, VirtualListBaseNative as UiVirtualListBaseNative} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import warning from 'warning';

import {Scrollable, dataIndexAttribute} from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

import usePreventScroll from './usePreventScroll';
import useSpottable from './useSpottable';

const
	JS = 'JS',
	Native = 'Native';

/**
 * The base version of [VirtualListBase]{@link moonstone/VirtualList.VirtualListBase} and
 * [VirtualListBaseNative]{@link moonstone/VirtualList.VirtualListBaseNative}.
 *
 * @function VirtualListCore
 * @memberof moonstone/VirtualList
 * @ui
 * @private
 */
const VirtualListBaseFactory = (type) => {
	const UiBase = (type === JS) ? UiVirtualListBase : UiVirtualListBaseNative;

	const VirtualListCore = (props) => {
		/*
		 * Dependencies
		 */

		const {spotlightId} = props;

		/*
		 * Instance
		 */

		const variables = useRef({
			uiRefCurrent: null,
		});

		/*
		 * Hooks
		 */

		const {
			getNodeIndexToBeFocused,
			handlePlaceholderFocus,
			handleRestoreLastFocus,
			initItemRef,
			isNeededScrollingPlaceholder,
			SpotlightPlaceholder,
			updateStatesAndBounds
		} = useSpottable(props, {virtualListBase: variables}, {type});

		const containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
		usePreventScroll(props, {}, {
			containerNode,
			type
		});

		/*
		 * Functions
		 */

		function getComponentProps (index) {
			return (index === getNodeIndexToBeFocused()) ? {ref: (ref) => initItemRef(ref, index)} : {};
		}

		function initUiRef (ref) {
			if (ref) {
				variables.current.uiRefCurrent = ref;
				props.initUiChildRef(ref);
			}
		}

		/*
		 * Render
		 */

		const
			{itemRenderer, itemsRenderer, role, ...rest} = props,
			needsScrollingPlaceholder = isNeededScrollingPlaceholder();

		delete rest.initUiChildRef;
		// not used by VirtualList
		delete rest.focusableScrollbar;
		delete rest.scrollAndFocusScrollbarButton;
		delete rest.spotlightId;
		delete rest.wrap;

		return (
			<UiBase
				{...rest}
				getComponentProps={getComponentProps}
				itemRenderer={({index, ...itemRest}) => ( // eslint-disable-line react/jsx-no-bind
					itemRenderer({
						...itemRest,
						[dataIndexAttribute]: index,
						index
					})
				)}
				onUpdateItems={handleRestoreLastFocus}
				ref={initUiRef}
				updateStatesAndBounds={updateStatesAndBounds}
				itemsRenderer={(itemsRendererProps) => { // eslint-disable-line react/jsx-no-bind
					return itemsRenderer({
						...itemsRendererProps,
						handlePlaceholderFocus: handlePlaceholderFocus,
						needsScrollingPlaceholder,
						role,
						SpotlightPlaceholder
					});
				}}
			/>
		);
	};

	VirtualListCore.propTypes = /** @lends moonstone/VirtualList.VirtualListBase.prototype */ {
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
		 * Passes the instance of [VirtualList]{@link ui/VirtualList.VirtualList}.
		 *
		 * @type {Object}
		 * @param {Object} ref
		 * @private
		 */
		initUiChildRef: PropTypes.func,

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

	VirtualListCore.defaultProps = {
		dataSize: 0,
		focusableScrollbar: false,
		pageScroll: false,
		spacing: 0,
		wrap: false
	};

	return VirtualListCore;
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
const VirtualListBase = VirtualListBaseFactory(JS);
VirtualListBase.displayName = 'VirtualListBase';

/**
 * A Moonstone-styled base component for [VirtualListNative]{@link moonstone/VirtualList.VirtualListNative} and
 * [VirtualGridListNative]{@link moonstone/VirtualList.VirtualGridListNative}.
 *
 * @class VirtualListBaseNative
 * @memberof moonstone/VirtualList
 * @extends ui/VirtualList.VirtualListBaseNative
 * @ui
 * @private
 */
const VirtualListBaseNative = VirtualListBaseFactory(Native);
VirtualListBaseNative.displayName = 'VirtualListBaseNative';

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

/* eslint-disable enact/prop-types */
const listItemsRenderer = (props) => {
	const {
		cc,
		handlePlaceholderFocus,
		itemContainerRef: initUiItemContainerRef,
		needsScrollingPlaceholder,
		primary,
		role,
		SpotlightPlaceholder
	} = props;

	return (
		<React.Fragment>
			{cc.length ? (
				<div ref={initUiItemContainerRef} role={role}>{cc}</div>
			) : null}
			{primary ? null : (
				<SpotlightPlaceholder
					data-index={0}
					data-vl-placeholder
					// a zero width/height element can't be focused by spotlight so we're giving
					// the placeholder a small size to ensure it is navigable
					style={{width: 10}}
					onFocus={handlePlaceholderFocus}
				/>
			)}
			{needsScrollingPlaceholder ? (
				<SpotlightPlaceholder />
			) : null}
		</React.Fragment>
	);
};
/* eslint-enable enact/prop-types */

const ScrollableVirtualList = ({role, ...rest}) => { // eslint-disable-line react/jsx-no-bind
	warning(
		!rest.itemSizes || !rest.cbScrollTo,
		'VirtualList with `minSize` in `itemSize` prop does not support `cbScrollTo` prop'
	);

	return (
		<Scrollable
			{...rest}
			childRenderer={(childProps) => ( // eslint-disable-line react/jsx-no-bind
				<VirtualListBase
					{...childProps}
					focusableScrollbar={rest.focusableScrollbar}
					itemsRenderer={listItemsRenderer}
					role={role}
				/>
			)}
		/>
	);
};

ScrollableVirtualList.propTypes = /** @lends moonstone/VirtualList.VirtualListBase.prototype */ {
	cbScrollTo: PropTypes.func,
	direction: PropTypes.oneOf(['horizontal', 'vertical']),
	focusableScrollbar: PropTypes.bool,
	itemSizes: PropTypes.array,
	preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),
	role: PropTypes.string
};

ScrollableVirtualList.defaultProps = {
	direction: 'vertical',
	focusableScrollbar: false,
	preventBubblingOnKeyDown: 'programmatic',
	role: 'list'
};

const ScrollableVirtualListNative = ({role, ...rest}) => {
	warning(
		!rest.itemSizes || !rest.cbScrollTo,
		'VirtualList with `minSize` in `itemSize` prop does not support `cbScrollTo` prop'
	);

	return (
		<ScrollableNative
			{...rest}
			childRenderer={(childProps) => ( // eslint-disable-line react/jsx-no-bind
				<VirtualListBaseNative
					{...childProps}
					focusableScrollbar={rest.focusableScrollbar}
					itemsRenderer={listItemsRenderer}
					role={role}
				/>
			)}
		/>
	);
};

ScrollableVirtualListNative.propTypes = /** @lends moonstone/VirtualList.VirtualListBaseNative.prototype */ {
	cbScrollTo: PropTypes.func,
	direction: PropTypes.oneOf(['horizontal', 'vertical']),
	focusableScrollbar: PropTypes.bool,
	itemSizes: PropTypes.array,
	preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),
	role: PropTypes.string
};

ScrollableVirtualListNative.defaultProps = {
	direction: 'vertical',
	focusableScrollbar: false,
	preventBubblingOnKeyDown: 'programmatic',
	role: 'list'
};

export default VirtualListBase;
export {
	ScrollableVirtualList,
	ScrollableVirtualListNative,
	VirtualListBase,
	VirtualListBaseNative
};
