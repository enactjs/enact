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

import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight, {getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Spottable from '@enact/spotlight/Spottable';
import {VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import {VirtualListBaseNative as UiVirtualListBaseNative} from '@enact/ui/VirtualList/VirtualListNative';

import {Scrollable, dataIndexAttribute} from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

const SpotlightPlaceholder = Spottable('div');

const
	SpotlightContainerConfig = {
		enterTo: 'last-focused',
		/*
		 * Returns the data-index as the key for last focused
		 */
		lastFocusedPersist: (node) => {
			const indexed = node.dataset.index ? node : node.closest('[data-index]');
			if (indexed) {
				return {
					container: false,
					element: true,
					key: indexed.dataset.index
				};
			}
		},
		/*
		 * Restores the data-index into the placeholder if its the only element. Tries to find a
		 * matching child otherwise.
		 */
		lastFocusedRestore: ({key}, all) => {
			if (all.length === 1 && 'vlPlaceholder' in all[0].dataset) {
				all[0].dataset.index = key;

				return all[0];
			}

			return all.reduce((focused, node) => {
				return focused || node.dataset.index === key && node;
			}, null);
		},
		preserveId: true,
		restrict: 'self-first'
	},
	dataContainerDisabledAttribute = 'data-container-disabled',
	isDown = is('down'),
	isLeft = is('left'),
	isRight = is('right'),
	isUp = is('up'),
	JS = 'JS',
	Native = 'Native';

const VirtualListBase = (type) => {
	const UiBase = (type === JS) ? UiVirtualListBase : UiVirtualListBaseNative;

	return class VirtualListCore extends Component {
		static displayName = 'VirtualListBase'

		static propTypes = /** @lends moonstone/VirtualList.VirtualList.prototype */ {
			/**
			 * The `render` function for an item of the list receives the following parameters:
			 * - `data` is for accessing the supplied `data` property of the list.
			 * > NOTE: In most cases, it is recommended to use data from redux store instead of using
			 * is parameters due to performance optimizations.
			 *
			 * @param {Object} event
			 * @param {Number} event.data-index It is required for Spotlight 5-way navigation. Pass to the root element in the component.
			 * @param {Number} event.index The index number of the componet to render
			 * @param {Number} event.key It MUST be passed as a prop to the root element in the component for DOM recycling.
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
			 * @type {Function}
			 * @public
			 */
			component: PropTypes.func.isRequired,

			/**
			 * The render function for the items.
			 *
			 * @type {Function}
			 * @private
			 */
			itemsRenderer: PropTypes.func.isRequired,

			/**
			 * Spotlight container Id.
			 *
			 * @type {String}
			 * @private
			 */
			'data-container-id': PropTypes.string, // eslint-disable-line react/sort-prop-types,

			/**
			 * TBD
			 */
			disabledItems: PropTypes.bool,

			/**
			 * Passes the instance of [VirtualList]{@link ui/VirtualList.VirtualList}.
			 *
			 * @type {Object}
			 * @param {Object} ref
			 * @private
			 */
			initUiChildRef: PropTypes.func,

			/**
			 * TBD
			 */
			jumpToSpottableItem: PropTypes.func,

			/**
			 * `true` if rtl, `false` if ltr.
			 * Normally, [Scrollable]{@link ui/Scrollable.Scrollable} should set this value.
			 *
			 * @type {Boolean}
			 * @private
			 */
			rtl: PropTypes.bool
		}

		componentDidMount () {
			if (type === JS) {
				const containerNode = this.uiRef.containerRef;

				// prevent native scrolling by Spotlight
				this.preventScroll = () => {
					containerNode.scrollTop = 0;
					containerNode.scrollLeft = this.props.rtl ? containerNode.scrollWidth : 0;
				};

				if (containerNode && containerNode.addEventListener) {
					containerNode.addEventListener('scroll', this.preventScroll);
					containerNode.addEventListener('keydown', this.onKeyDown);
				}
			} else {
				const contentNode = this.uiRef.contentRef;

				if (contentNode && contentNode.addEventListener) {
					contentNode.addEventListener('keydown', this.onKeyDown);
				}
			}
		}

		componentDidUpdate () {
			this.restoreFocus();
		}

		componentWillUnmount () {
			if (type === JS) {
				const containerNode = this.uiRef.containerRef;

				// remove a function for preventing native scrolling by Spotlight
				if (containerNode && containerNode.removeEventListener) {
					containerNode.removeEventListener('scroll', this.preventScroll);
					containerNode.removeEventListener('keydown', this.onKeyDown);
				}
			} else {
				const contentNode = this.uiRef.contentRef;

				if (contentNode && contentNode.removeEventListener) {
					contentNode.removeEventListener('keydown', this.onKeyDown);
				}
			}

			this.setContainerDisabled(false);
		}

		isScrolledBy5way = false
		isScrolledByJump = false
		lastFocusedIndex = null
		nodeIndexToBeFocused = null
		preservedIndex = null
		restoreLastFocused = false

		setContainerDisabled = (bool) => {
			const containerNode = (type === JS) ? this.uiRef.containerRef : this.uiRef.contentRef;

			if (containerNode) {
				containerNode.setAttribute(dataContainerDisabledAttribute, bool);

				if (bool) {
					document.addEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
				} else {
					document.removeEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
				}
			}
		}

		setRestrict = (bool) => {
			Spotlight.set(this.props['data-container-id'], {restrict: (bool) ? 'self-only' : 'self-first'});
		}

		setSpotlightContainerRestrict = (keyCode, target) => {
			const
				{dataSize} = this.uiRef.props,
				{isPrimaryDirectionVertical, dimensionToExtent} = this.uiRef,
				index = Number.parseInt(target.getAttribute(dataIndexAttribute)),
				canMoveBackward = index >= dimensionToExtent,
				canMoveForward = index < (dataSize - (((dataSize - 1) % dimensionToExtent) + 1));
			let isSelfOnly = false;

			if (isPrimaryDirectionVertical) {
				if (isUp(keyCode) && canMoveBackward || isDown(keyCode) && canMoveForward) {
					isSelfOnly = true;
				}
			} else if (isLeft(keyCode) && canMoveBackward || isRight(keyCode) && canMoveForward) {
				isSelfOnly = true;
			}

			this.setRestrict(isSelfOnly);
		}

		getIndexToScroll = (direction, currentIndex) => {
			const
				{dataSize, spacing} = this.uiRef.props,
				{dimensionToExtent, primary} = this.uiRef,
				numOfItemsInPage = Math.floor((primary.clientSize + spacing) / primary.gridSize) * dimensionToExtent,
				factor = (direction === 'down' || direction === 'right') ? 1 : -1;
			let indexToScroll = currentIndex + factor * numOfItemsInPage;

			if (indexToScroll < 0) {
				indexToScroll = currentIndex % dimensionToExtent;
			} else if (indexToScroll >= dataSize) {
				indexToScroll = dataSize - dataSize % dimensionToExtent + currentIndex % dimensionToExtent;
				if (indexToScroll >= dataSize) {
					indexToScroll = dataSize - 1;
				}
			}

			return indexToScroll === currentIndex ? -1 : indexToScroll;
		}

		scrollToNextItem = ({direction, focusedItem}) => {
			const
				focusedIndex = Number.parseInt(focusedItem.getAttribute(dataIndexAttribute)),
				{firstVisibleIndex, lastVisibleIndex} = this.uiRef.moreInfo;
			let indexToScroll = -1;

			indexToScroll = this.getIndexToScroll(direction, focusedIndex, this.uiRef);

			if (indexToScroll !== -1) {
				const
					isRtl = this.props.rtl,
					isForward = (direction === 'down' || isRtl && direction === 'left' || !isRtl && direction === 'right');

				if (type === JS) {
					// To prevent item positioning issue, make all items to be rendered.
					this.uiRef.updateFrom = null;
					this.uiRef.updateTo = null;
				}

				if (firstVisibleIndex <= indexToScroll && indexToScroll <= lastVisibleIndex) {
					const node = this.uiRef.containerRef.querySelector(`[data-index='${indexToScroll}'].spottable`);

					if (node) {
						Spotlight.focus(node);
					}
				} else {
					// Scroll to the next spottable item without animation
					if (!Spotlight.isPaused()) {
						Spotlight.pause();
					}
					focusedItem.blur();
				}
				this.nodeIndexToBeFocused = this.lastFocusedIndex = indexToScroll;
				this.uiRef.props.cbScrollTo({index: indexToScroll, stickTo: isForward ? 'end' : 'start', animate: false});
			}

			return true;
		}

		onKeyDown = (ev) => {
			const {keyCode, target} = ev;

			this.isScrolledBy5way = false;
			if (this.props.disabledItems && getDirection(keyCode)) {
				if (type === Native) {
					ev.preventDefault();
				}
				this.setSpotlightContainerRestrict(keyCode, target);
				this.isScrolledBy5way = this.props.jumpToSpottableItem({
					keyCode,
					rtl: this.props.rtl,
					setRestrict: this.setRestrict,
					target
				});
			}
			forward('onKeyDown', ev, this.props);
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

		focusOnItem = (index) => {
			const item = this.uiRef.containerRef.querySelector(`[data-index='${index}'].spottable`);

			if (Spotlight.isPaused()) {
				Spotlight.resume();
				if (type === JS) {
					this.forceUpdate();
				}
			}
			this.focusOnNode(item);
			this.nodeIndexToBeFocused = null;
		}

		focusByIndex = (index) => {
			// We have to focus node async for now since list items are not yet ready when it reaches componentDid* lifecycle methods
			setTimeout(() => {
				this.focusOnItem(index);
			}, 0);
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
					this.preservedIndex = parseInt(index);
					this.restoreLastFocused = true;
				}
			}
		}

		/**
		 * Restore the focus of VirtualList
		 */

		isPlaceholderFocused = () => {
			const current = Spotlight.getCurrent();

			if (current && current.dataset.vlPlaceholder && this.uiRef.containerRef.contains(current)) {
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
					containerId = this.props['data-container-id'],
					node = this.uiRef.containerRef.querySelector(
						`[data-container-id="${containerId}"] [data-index="${this.preservedIndex}"]`
					);

				if (node) {
					// if we're supposed to restore focus and virtual list has positioned a set of items
					// that includes lastFocusedIndex, clear the indicator
					this.restoreLastFocused = false;

					// try to focus the last focused item
					const foundLastFocused = Spotlight.focus(node);

					// but if that fails (because it isn't found or is disabled), focus the container so
					// spotlight isn't lost
					if (!foundLastFocused) {
						this.restoreLastFocused = true;
						Spotlight.focus(containerId);
					}
				}
			}
		}

		/**
		 * calculator
		 */

		calculatePositionOnFocus = ({item, scrollPosition = this.uiRef.scrollPosition}) => {
			const
				{pageScroll} = this.uiRef.props,
				{numOfItems} = this.uiRef.state,
				{primary} = this.uiRef,
				offsetToClientEnd = primary.clientSize - primary.itemSize,
				focusedIndex = Number.parseInt(item.getAttribute(dataIndexAttribute));

			if (!isNaN(focusedIndex)) {
				let gridPosition = this.uiRef.getGridPosition(focusedIndex);

				if (numOfItems > 0 && focusedIndex % numOfItems !== this.lastFocusedIndex % numOfItems) {
					const node = this.uiRef.getItemNode(this.lastFocusedIndex);

					if (node) {
						node.blur();
					}
				}
				if (type === JS) {
					this.nodeIndexToBeFocused = null;
				}
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
							gridPosition.primaryPosition = scrollPosition + (this.uiRef.scrollPosition === scrollPosition ? 0.1 : 0);
						}
					} else { // backward over
						gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
					}
				}

				// Since the result is used as a target position to be scrolled,
				// scrondaryPosition should be 0 here.
				gridPosition.secondaryPosition = 0;

				return this.uiRef.gridPositionToItemPosition(gridPosition);
			}
		}

		shouldPreventScrollByFocus = () => ((type === JS) ? (this.isScrolledBy5way) : (this.isScrolledBy5way || this.isScrolledByJump))

		setLastFocusedIndex = (param) => {
			this.lastFocusedIndex = param;
		}

		updateStatesAndBounds = ({cbScrollTo, dataSize, moreInfo, numOfItems}) => {
			const {preservedIndex} = this;

			if (this.restoreLastFocused &&
				numOfItems > 0 &&
				(preservedIndex < dataSize) &&
				(preservedIndex < moreInfo.firstVisibleIndex || preservedIndex > moreInfo.lastVisibleIndex)) {
				// If we need to restore last focus and the index is beyond the screen,
				// we call `scrollTo` to create DOM for it.
				cbScrollTo({index: preservedIndex, animate: false, focus: true});

				return true;
			} else {
				return false;
			}
		}

		getScrollBounds = () => this.uiRef.getScrollBounds()

		initUiRef = (ref) => {
			if (ref) {
				this.uiRef = ref;
				this.props.initUiChildRef(ref);
			}
		}

		render () {
			const
				{component, itemsRenderer, ...rest} = this.props,
				needsScrollingPlaceholder = this.isNeededScrollingPlaceholder();

			delete rest.disabledItems;
			delete rest.initUiChildRef;
			delete rest.jumpToSpottableItem;

			return (
				<UiBase
					{...rest}
					component={({index, ...itemRest}) => ( // eslint-disable-line react/jsx-no-bind
						component({
							... itemRest,
							[dataIndexAttribute]: index,
							index
						})
					)}
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
 * @class VirtualListBaseJS
 * @memberof moonstone/VirtualList
 * @extends ui/VirtualList.VirtualListBase
 * @ui
 * @private
 */
const VirtualListBaseJS = VirtualListBase(JS);

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
const VirtualListBaseNative = VirtualListBase(Native);

class ScrollableVirtualList extends Component {
	static propTypes = /** @lends moonstone/VirtualList.VirtualList.prototype */ {
		/**
		 * TBD
		 */
		disabledItems: PropTypes.bool,

		/**
		 * Aria role.
		 *
		 * @type {String}
		 * @private
		 */
		role: PropTypes.string
	}

	static contextTypes = {
		disabledItems: PropTypes.bool,
		getComponentProps: PropTypes.func,
		initMoonChildRef: PropTypes.func,
		initUiChildRef: PropTypes.func,
		jumpToSpottableItem: PropTypes.func,
		scrollToNextItem: PropTypes.func
	}

	render () {
		const
			{role, ...rest} = this.props,
			context = {
				disabledItems: this.context.disabledItems,
				getComponentProps: this.context.getComponentProps,
				initMoonChildRef: this.context.initMoonChildRef,
				initUiChildRef: this.context.initUiChildRef,
				jumpToSpottableItem: this.context.jumpToSpottableItem,
				scrollToNextItem: this.context.scrollToNextItem
			};

		return (
			<Scrollable
				{...rest}
				{...context}
				childRenderer={(props) => ( // eslint-disable-line react/jsx-no-bind
					<VirtualListBaseJS
						{...props}
						disabledItems={context.disabledItems}
						itemsRenderer={({cc, primary, needsScrollingPlaceholder, initItemContainerRef, handlePlaceholderFocus}) => ( // eslint-disable-line react/jsx-no-bind
							[
								cc.length ? <div key="0" ref={initItemContainerRef} role={role}>{cc}</div> : null,
								primary ?
									null :
									<SpotlightPlaceholder
										data-index={0}
										data-vl-placeholder
										key="1"
										onFocus={handlePlaceholderFocus}
										role="region"
									/>,
								needsScrollingPlaceholder ? <SpotlightPlaceholder key="2" /> : null
							]
						)}
					/>
				)}
			/>
		);
	}
}

class ScrollableVirtualListNative extends Component {
	static propTypes = /** @lends moonstone/VirtualList.VirtualListNative.prototype */ {
		/**
		 * TBD
		 */
		disabledItems: PropTypes.bool,

		/**
		 * Aria role.
		 *
		 * @type {String}
		 * @private
		 */
		role: PropTypes.string
	}

	static contextTypes = {
		disabledItems: PropTypes.bool,
		getComponentProps: PropTypes.func,
		initMoonChildRef: PropTypes.func,
		initUiChildRef: PropTypes.func,
		jumpToSpottableItem: PropTypes.func,
		scrollToNextItem: PropTypes.func
	}

	render () {
		const
			{role, ...rest} = this.props,
			context = {
				disabledItems: this.context.disabledItems,
				getComponentProps: this.context.getComponentProps,
				initMoonChildRef: this.context.initMoonChildRef,
				initUiChildRef: this.context.initUiChildRef,
				jumpToSpottableItem: this.context.jumpToSpottableItem,
				scrollToNextItem: this.context.scrollToNextItem
			};

		return (
			<ScrollableNative
				{...rest}
				{...context}
				childRenderer={(props) => ( // eslint-disable-line react/jsx-no-bind
					<VirtualListBaseNative
						{...props}
						disabledItems={context.disabledItems}
						itemsRenderer={({cc, primary, needsScrollingPlaceholder, initItemContainerRef, handlePlaceholderFocus}) => ( // eslint-disable-line react/jsx-no-bind
							[
								cc.length ? <div key="0" ref={initItemContainerRef} role={role}>{cc}</div> : null,
								primary ?
									null :
									<SpotlightPlaceholder
										data-index={0}
										data-vl-placeholder
										key="1"
										onFocus={handlePlaceholderFocus}
										role="region"
									/>,
								needsScrollingPlaceholder ? <SpotlightPlaceholder key="2" /> : null
							]
						)}
					/>
				)}
			/>
		);
	}
}

/**
 * A Moonstone-styled scrollable and spottable virtual list component.
 *
 * @class VirtualList
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.SpotlightContainerDecorator
 * @extends moonstone/VirtualList.VirtualListBaseJS
 * @ui
 * @public
 */
const VirtualList = SpotlightContainerDecorator(SpotlightContainerConfig, ScrollableVirtualList);

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
const VirtualListNative = SpotlightContainerDecorator(SpotlightContainerConfig, ScrollableVirtualListNative);

/**
 * A Moonstone-styled scrollable and spottable virtual grid list component.
 *
 * @class VirtualGridList
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.SpotlightContainerDecorator
 * @extends moonstone/VirtualList.VirtualListBaseJS
 * @ui
 * @public
 */
const VirtualGridList = VirtualList;

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
const VirtualGridListNative = VirtualListNative;

export default VirtualList;
export {
	VirtualGridList,
	VirtualGridListNative,
	VirtualList,
	VirtualListBaseJS as VirtualListBase,
	VirtualListBaseNative as VirtualListBaseNative,
	VirtualListNative
};
