import {is} from '@enact/core/keymap';
import Spotlight, {getDirection} from '@enact/spotlight';
import Accelerator from '@enact/spotlight/Accelerator';
import Pause from '@enact/spotlight/Pause';
import Spottable from '@enact/spotlight/Spottable';
import {VirtualListBase as UiVirtualListBase, VirtualListBaseNative as UiVirtualListBaseNative} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import clamp from 'ramda/src/clamp';
import React, {Component} from 'react';

import {Scrollable, dataIndexAttribute} from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

const SpotlightAccelerator = new Accelerator();
const SpotlightPlaceholder = Spottable('div');

const
	dataContainerDisabledAttribute = 'data-spotlight-container-disabled',
	isDown = is('down'),
	isEnter = is('enter'),
	isLeft = is('left'),
	isPageUp = is('pageUp'),
	isPageDown = is('pageDown'),
	isRight = is('right'),
	isUp = is('up'),
	JS = 'JS',
	Native = 'Native',
	// using 'bitwise or' for string > number conversion based on performance: https://jsperf.com/convert-string-to-number-techniques/7
	getNumberValue = (index) => index | 0,
	nop = () => {};

/**
 * The base version of [VirtualListBase]{@link moonstone/VirtualList.VirtualListBase} and
 * [VirtualListBaseNative]{@link moonstone/VirtualList.VirtualListBaseNative}.
 *
 * @class VirtualListCore
 * @memberof moonstone/VirtualList
 * @ui
 * @public
 */
const VirtualListBaseFactory = (type) => {
	const UiBase = (type === JS) ? UiVirtualListBase : UiVirtualListBaseNative;

	return class VirtualListCore extends Component {
		/* No displayName here. We set displayName to returned components of this factory function. */

		static propTypes = /** @lends moonstone/VirtualList.VirtualListCore.prototype */ {
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
			 * Passes the instance of [VirtualList]{@link ui/VirtualList.VirtualList}.
			 *
			 * @type {Object}
			 * @param {Object} ref
			 * @private
			 */
			initUiChildRef: PropTypes.func,

			/*
			 * It scrolls by page when `true`, by item when `false`.
			 *
			 * @type {Boolean}
			 * @default false
			 * @private
			 */
			pageScroll: PropTypes.bool,

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
		}

		static defaultProps = {
			dataSize: 0,
			pageScroll: false,
			spacing: 0,
			wrap: false
		}

		constructor (props) {
			super(props);

			const {spotlightId} = props;
			if (spotlightId) {
				this.configureSpotlight(spotlightId);
			}

			this.pause = new Pause('VirtualListBase');
		}

		componentDidMount () {
			const containerNode = this.uiRefCurrent.containerRef.current;

			if (type === JS) {
				// prevent native scrolling by Spotlight
				this.preventScroll = () => {
					containerNode.scrollTop = 0;
					containerNode.scrollLeft = this.props.rtl ? containerNode.scrollWidth : 0;
				};

				if (containerNode && containerNode.addEventListener) {
					containerNode.addEventListener('scroll', this.preventScroll);
				}
			}

			if (containerNode && containerNode.addEventListener) {
				containerNode.addEventListener('keydown', this.onKeyDown);
				containerNode.addEventListener('keyup', this.onKeyUp);
			}
		}

		componentDidUpdate (prevProps) {
			if (prevProps.spotlightId !== this.props.spotlightId) {
				this.configureSpotlight(this.props.spotlightId);
			}
			this.restoreFocus();
		}

		componentWillUnmount () {
			const containerNode = this.uiRefCurrent.containerRef.current;

			if (type === JS) {
				// remove a function for preventing native scrolling by Spotlight
				if (containerNode && containerNode.removeEventListener) {
					containerNode.removeEventListener('scroll', this.preventScroll);
				}
			}

			if (containerNode && containerNode.removeEventListener) {
				containerNode.removeEventListener('keydown', this.onKeyDown);
				containerNode.removeEventListener('keyup', this.onKeyUp);
			}

			this.pause.resume();
			SpotlightAccelerator.reset();

			this.setContainerDisabled(false);
		}

		isScrolledBy5way = false
		isScrolledByJump = false
		isWrappedBy5way = false
		lastFocusedIndex = null
		nodeIndexToBeFocused = null
		preservedIndex = null
		restoreLastFocused = false
		uiRefCurrent = null

		setContainerDisabled = (bool) => {
			const
				{spotlightId} = this.props,
				containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);

			if (containerNode) {
				containerNode.setAttribute(dataContainerDisabledAttribute, bool);

				if (bool) {
					document.addEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
				} else {
					document.removeEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
				}
			}
		}

		configureSpotlight = (spotlightId) => {
			const {spacing} = this.props;

			Spotlight.set(spotlightId, {
				enterTo: 'last-focused',
				/*
				 * Returns the data-index as the key for last focused
				 */
				lastFocusedPersist: this.lastFocusedPersist,
				/*
				 * Restores the data-index into the placeholder if its the only element. Tries to find a
				 * matching child otherwise.
				 */
				lastFocusedRestore: this.lastFocusedRestore,
				/*
				 * Directs spotlight focus to favor straight elements that are within range of `spacing`
				 * over oblique elements, like scroll buttons.
				 */
				obliqueMultiplier: spacing > 0 ? spacing : 1
			});
		}

		lastFocusedPersist = () => {
			if (this.lastFocusedIndex != null) {
				return {
					container: false,
					element: true,
					key: this.lastFocusedIndex
				};
			}
		}

		/*
		 * Restores the data-index into the placeholder if it exists. Tries to find a matching child
		 * otherwise.
		 */
		lastFocusedRestore = ({key}, all) => {
			const placeholder = all.find(el => 'vlPlaceholder' in el.dataset);
			if (placeholder) {
				placeholder.dataset.index = key;

				return placeholder;
			}

			return all.reduce((focused, node) => {
				return focused || Number(node.dataset.index) === key && node;
			}, null);
		}

		findSpottableItem = (indexFrom, indexTo) => {
			const {dataSize} = this.props;

			if (indexFrom < 0 && indexTo < 0 || indexFrom >= dataSize && indexTo >= dataSize) {
				return -1;
			} else {
				return clamp(0, dataSize - 1, indexFrom);
			}
		}

		getNextIndex = ({index, keyCode, repeat}) => {
			const {dataSize, rtl, wrap} = this.props;
			const {isPrimaryDirectionVertical, dimensionToExtent} = this.uiRefCurrent;
			const column = index % dimensionToExtent;
			const row = (index - column) % dataSize / dimensionToExtent;
			const isDownKey = isDown(keyCode);
			const isLeftMovement = (!rtl && isLeft(keyCode)) || (rtl && isRight(keyCode));
			const isRightMovement = (!rtl && isRight(keyCode)) || (rtl && isLeft(keyCode));
			const isUpKey = isUp(keyCode);
			const isNextRow = index + dimensionToExtent < dataSize;
			const isNextAdjacent = column < dimensionToExtent - 1 && index < (dataSize - 1);
			const isBackward = (
				isPrimaryDirectionVertical && isUpKey ||
				!isPrimaryDirectionVertical && isLeftMovement ||
				null
			);
			const isForward = (
				isPrimaryDirectionVertical && isDownKey ||
				!isPrimaryDirectionVertical && isRightMovement ||
				null
			);
			let isWrapped = false;
			let nextIndex = -1;
			let targetIndex = -1;

			if (isPrimaryDirectionVertical) {
				if (isUpKey && row) {
					targetIndex = index - dimensionToExtent;
				} else if (isDownKey && isNextRow) {
					targetIndex = index + dimensionToExtent;
				} else if (isLeftMovement && column) {
					targetIndex = index - 1;
				} else if (isRightMovement && isNextAdjacent) {
					targetIndex = index + 1;
				}
			} else if (isLeftMovement && row) {
				targetIndex = index - dimensionToExtent;
			} else if (isRightMovement && isNextRow) {
				targetIndex = index + dimensionToExtent;
			} else if (isUpKey && column) {
				targetIndex = index - 1;
			} else if (isDownKey && isNextAdjacent) {
				targetIndex = index + 1;
			}

			if (targetIndex >= 0) {
				nextIndex = targetIndex;
			}

			if (!repeat && nextIndex === -1 && wrap) {
				if (isForward && this.findSpottableItem((row + 1) * dimensionToExtent, dataSize) < 0) {
					nextIndex = this.findSpottableItem(0, index);
					isWrapped = true;
				} else if (isBackward && this.findSpottableItem(-1, row * dimensionToExtent - 1) < 0) {
					nextIndex = this.findSpottableItem(dataSize, index);
					isWrapped = true;
				}
			}

			return {isBackward, isForward, isLeftMovement, isRightMovement, isWrapped, nextIndex};
		}

		/**
		 * Handle `onKeyDown` event
		 */

		onAcceleratedKeyDown = ({isWrapped, keyCode, nextIndex, repeat, target}) => {
			const {cbScrollTo, spacing, wrap} = this.props;
			const {dimensionToExtent, primary: {clientSize, gridSize}, scrollPosition} = this.uiRefCurrent;
			const index = getNumberValue(target.dataset.index);

			this.isScrolledBy5way = false;
			this.isScrolledByJump = false;

			if (nextIndex >= 0) {
				const numOfItemsInPage = Math.floor((clientSize + spacing) / gridSize) * dimensionToExtent;
				const firstFullyVisibleIndex = Math.ceil(scrollPosition / gridSize) * dimensionToExtent;
				const isNextItemInView = nextIndex >= firstFullyVisibleIndex && nextIndex < firstFullyVisibleIndex + numOfItemsInPage;

				this.lastFocusedIndex = nextIndex;

				if (isNextItemInView) {
					this.focusByIndex(nextIndex);
				} else {
					this.isScrolledBy5way = true;
					this.isWrappedBy5way = isWrapped;

					if (isWrapped && (
						this.uiRefCurrent.containerRef.current.querySelector(`[data-index='${nextIndex}'].spottable`) == null
					)) {
						if (wrap === true) {
							this.pause.pause();
							target.blur();
						} else {
							this.focusByIndex(nextIndex);
						}

						this.nodeIndexToBeFocused = nextIndex;
					} else {
						this.focusByIndex(nextIndex);
					}

					cbScrollTo({
						index: nextIndex,
						stickTo: index < nextIndex ? 'end' : 'start',
						animate: !(isWrapped && wrap === 'noAnimation')
					});
				}

			} else if (!repeat && Spotlight.move(getDirection(keyCode))) {
				SpotlightAccelerator.reset();
			}
		}

		onKeyDown = (ev) => {
			const {keyCode} = ev;
			const direction = getDirection(keyCode);

			if (direction) {
				Spotlight.setPointerMode(false);

				if (SpotlightAccelerator.processKey(ev, nop)) {
					ev.stopPropagation();
				} else {
					const {repeat, target} = ev;
					const index = getNumberValue(target.dataset.index);
					const {isBackward, isForward, isLeftMovement, isRightMovement, isWrapped, nextIndex} = this.getNextIndex({index, keyCode, repeat});

					if (nextIndex >= 0) {
						ev.preventDefault();
						ev.stopPropagation();
						this.onAcceleratedKeyDown({isWrapped, keyCode, nextIndex, repeat, target});
					} else {
						const {dataSize} = this.props;
						const {dimensionToExtent} = this.uiRefCurrent;
						const column = index % dimensionToExtent;
						const row = (index - column) % dataSize / dimensionToExtent;
						const isLeaving = isBackward && row === 0 ||
							isForward && row === Math.floor((dataSize - 1) % dataSize / dimensionToExtent) ||
							isLeftMovement && column === 0 ||
							isRightMovement && column === dimensionToExtent - 1;

						if (repeat && isLeaving) {
							ev.preventDefault();
							ev.stopPropagation();
						} else if (!isLeaving && Spotlight.move(direction)) {
							ev.preventDefault();
							ev.stopPropagation();
							this.onAcceleratedKeyDown({keyCode, nextIndex: getNumberValue(Spotlight.getCurrent().dataset.index), repeat, target});
						}
					}
				}
			} else if (isPageUp(keyCode) || isPageDown(keyCode)) {
				this.isScrolledBy5way = false;
			}
		}

		onKeyUp = ({keyCode}) => {
			if (getDirection(keyCode) || isEnter(keyCode)) {
				SpotlightAccelerator.reset();
			}
		}

		/**
		 * Handle global `onKeyDown` event
		 */

		handleGlobalKeyDown = () => {
			this.setContainerDisabled(false);
		}

		/**
		 * Focus on the Node of the VirtualList item
		 */

		focusOnNode = (node) => {
			if (node) {
				Spotlight.focus(node);
			}
		}

		focusByIndex = (index) => {
			const item = this.uiRefCurrent.containerRef.current.querySelector(`[data-index='${index}'].spottable`);

			if (this.isWrappedBy5way) {
				SpotlightAccelerator.reset();
				this.isWrappedBy5way = false;
			}

			this.pause.resume();
			this.focusOnNode(item);
			this.nodeIndexToBeFocused = null;
			this.isScrolledByJump = false;
		}

		initItemRef = (ref, index) => {
			if (ref) {
				if (type === JS) {
					this.focusByIndex(index);
				} else {
					// If focusing the item of VirtuallistNative, `onFocus` in Scrollable will be called.
					// Then VirtualListNative tries to scroll again differently from VirtualList.
					// So we would like to skip `focus` handling when focusing the item as a workaround.
					this.isScrolledByJump = true;
					this.focusByIndex(index);
				}
			}
		}

		/**
		 * Manage a placeholder
		 */

		isNeededScrollingPlaceholder = () => this.nodeIndexToBeFocused != null && Spotlight.isPaused();

		handlePlaceholderFocus = (ev) => {
			const placeholder = ev.currentTarget;

			if (placeholder) {
				const index = placeholder.dataset.index;

				if (index) {
					this.preservedIndex = getNumberValue(index);
					this.restoreLastFocused = true;
				}
			}
		}

		handleUpdateItems = ({firstIndex, lastIndex}) => {
			if (this.restoreLastFocused && this.preservedIndex >= firstIndex && this.preservedIndex <= lastIndex) {
				this.restoreFocus();
			}
		}

		/**
		 * Restore the focus of VirtualList
		 */

		isPlaceholderFocused = () => {
			const current = Spotlight.getCurrent();

			if (current && current.dataset.vlPlaceholder && this.uiRefCurrent.containerRef.current.contains(current)) {
				return true;
			}

			return false;
		}

		restoreFocus = () => {
			if (
				this.restoreLastFocused &&
				!this.isPlaceholderFocused()
			) {
				const
					{spotlightId} = this.props,
					node = this.uiRefCurrent.containerRef.current.querySelector(
						`[data-spotlight-id="${spotlightId}"] [data-index="${this.preservedIndex}"]`
					);

				if (node) {
					// if we're supposed to restore focus and virtual list has positioned a set of items
					// that includes lastFocusedIndex, clear the indicator
					this.restoreLastFocused = false;

					// try to focus the last focused item
					this.isScrolledByJump = true;
					const foundLastFocused = Spotlight.focus(node);
					this.isScrolledByJump = false;

					// but if that fails (because it isn't found or is disabled), focus the container so
					// spotlight isn't lost
					if (!foundLastFocused) {
						this.restoreLastFocused = true;
						Spotlight.focus(spotlightId);
					}
				}
			}
		}

		/**
		 * calculator
		 */

		calculatePositionOnFocus = ({item, scrollPosition = this.uiRefCurrent.scrollPosition}) => {
			const
				{pageScroll} = this.props,
				{numOfItems} = this.uiRefCurrent.state,
				{primary} = this.uiRefCurrent,
				offsetToClientEnd = primary.clientSize - primary.itemSize,
				focusedIndex = getNumberValue(item.getAttribute(dataIndexAttribute));

			if (!isNaN(focusedIndex)) {
				let gridPosition = this.uiRefCurrent.getGridPosition(focusedIndex);

				if (numOfItems > 0 && focusedIndex % numOfItems !== this.lastFocusedIndex % numOfItems) {
					const node = this.uiRefCurrent.getItemNode(this.lastFocusedIndex);

					if (node) {
						node.blur();
					}
				}
				this.nodeIndexToBeFocused = null;
				this.lastFocusedIndex = focusedIndex;

				if (primary.clientSize >= primary.itemSize) {
					if (gridPosition.primaryPosition > scrollPosition + offsetToClientEnd) { // forward over
						gridPosition.primaryPosition -= pageScroll ? 0 : offsetToClientEnd;
					} else if (gridPosition.primaryPosition >= scrollPosition) { // inside of client
						if (type === JS) {
							gridPosition.primaryPosition = scrollPosition;
						} else {
							// This code uses the trick to change the target position slightly which will not affect the actual result
							// since a browser ignore `scrollTo` method if the target position is same as the current position.
							gridPosition.primaryPosition = scrollPosition + (this.uiRefCurrent.scrollPosition === scrollPosition ? 0.1 : 0);
						}
					} else { // backward over
						gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
					}
				}

				// Since the result is used as a target position to be scrolled,
				// scrondaryPosition should be 0 here.
				gridPosition.secondaryPosition = 0;

				return this.uiRefCurrent.gridPositionToItemPosition(gridPosition);
			}
		}

		shouldPreventScrollByFocus = () => ((type === JS) ? (this.isScrolledBy5way) : (this.isScrolledBy5way || this.isScrolledByJump))

		shouldPreventOverscrollEffect = () => (this.isWrappedBy5way)

		setLastFocusedNode = (node) => {
			this.lastFocusedIndex = node.dataset && getNumberValue(node.dataset.index);
		}

		updateStatesAndBounds = ({dataSize, moreInfo, numOfItems}) => {
			const {preservedIndex} = this;

			return (this.restoreLastFocused && numOfItems > 0 && preservedIndex < dataSize && (
				preservedIndex < moreInfo.firstVisibleIndex || preservedIndex > moreInfo.lastVisibleIndex
			));
		}

		getScrollBounds = () => this.uiRefCurrent.getScrollBounds()

		getComponentProps = (index) => (
			(index === this.nodeIndexToBeFocused) ? {ref: (ref) => this.initItemRef(ref, index)} : {}
		)

		initUiRef = (ref) => {
			if (ref) {
				this.uiRefCurrent = ref;
				this.props.initUiChildRef(ref);
			}
		}

		render () {
			const
				{itemRenderer, itemsRenderer, ...rest} = this.props,
				needsScrollingPlaceholder = this.isNeededScrollingPlaceholder();

			delete rest.initUiChildRef;
			// not used by VirtualList
			delete rest.scrollAndFocusScrollbarButton;
			delete rest.spotlightId;
			delete rest.wrap;

			return (
				<UiBase
					{...rest}
					getComponentProps={this.getComponentProps}
					itemRenderer={({index, ...itemRest}) => ( // eslint-disable-line react/jsx-no-bind
						itemRenderer({
							... itemRest,
							[dataIndexAttribute]: index,
							index
						})
					)}
					onUpdateItems={this.handleUpdateItems}
					ref={this.initUiRef}
					updateStatesAndBounds={this.updateStatesAndBounds}
					itemsRenderer={(props) => { // eslint-disable-line react/jsx-no-bind
						return itemsRenderer({
							...props,
							handlePlaceholderFocus: this.handlePlaceholderFocus,
							needsScrollingPlaceholder
						});
					}}
				/>
			);
		}
	};
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
 * Activates the component for voice control.
 *
 * @name data-webos-voice-focused
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {Boolean}
 * @public
 */

/**
 * The voice control group label.
 *
 * @name data-webos-voice-group-label
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @public
 */

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

/* eslint-disable enact/prop-types */
const listItemsRenderer = (props) => {
	const {
		cc,
		handlePlaceholderFocus,
		initItemContainerRef: initUiItemContainerRef,
		needsScrollingPlaceholder,
		primary
	} = props;

	return (
		<React.Fragment>
			{cc.length ? (
				<div ref={initUiItemContainerRef} role="list">{cc}</div>
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

const ScrollableVirtualList = (props) => ( // eslint-disable-line react/jsx-no-bind
	<Scrollable
		{...props}
		childRenderer={(childProps) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBase
				{...childProps}
				itemsRenderer={listItemsRenderer}
			/>
		)}
	/>
);

ScrollableVirtualList.propTypes = /** @lends moonstone/VirtualList.VirtualListBase.prototype */ {
	/**
	 * Direction of the list.
	 *
	 * Valid values are:
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @default 'vertical'
	 * @public
	 */
	direction: PropTypes.oneOf(['horizontal', 'vertical']),

	/**
	 * Unique identifier for the component.
	 *
	 * When defined and when the `VirtualList` is within a [Panel]{@link moonstone/Panels.Panel},
	 * the `VirtualList` will store its scroll position and restore that position when returning to
	 * the `Panel`.
	 *
	 * @type {String}
	 * @public
	 */
	id: PropTypes.string
};

ScrollableVirtualList.defaultProps = {
	direction: 'vertical'
};

const ScrollableVirtualListNative = (props) => (
	<ScrollableNative
		{...props}
		childRenderer={(childProps) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBaseNative
				{...childProps}
				itemsRenderer={listItemsRenderer}
			/>
		)}
	/>
);

ScrollableVirtualListNative.propTypes = /** @lends moonstone/VirtualList.VirtualListBaseNative.prototype */ {
	/**
	 * Direction of the list.
	 *
	 * Valid values are:
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @default 'vertical'
	 * @public
	 */
	direction: PropTypes.oneOf(['horizontal', 'vertical']),

	/**
	 * Unique identifier for the component.
	 *
	 * When defined and when the `VirtualList` is within a [Panel]{@link moonstone/Panels.Panel},
	 * the `VirtualList` will store its scroll position and restore that position when returning to
	 * the `Panel`.
	 *
	 * @type {String}
	 * @public
	 */
	id: PropTypes.string
};

ScrollableVirtualListNative.defaultProps = {
	direction: 'vertical'
};

export default VirtualListBase;
export {
	ScrollableVirtualList,
	ScrollableVirtualListNative,
	VirtualListBase,
	VirtualListBaseNative
};
