import clamp from 'ramda/src/clamp';
import {is} from '@enact/core/keymap';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Spotlight from '@enact/spotlight';

import {dataIndexAttribute} from '../Scrollable';

const
	isDown = is('down'),
	isLeft = is('left'),
	isRight = is('right'),
	isUp = is('up'),
	JS = 'JS',
	Native = 'Native';

const SpotlightVirtualListWithDisabledItemsDecoratorBase = (type) => {
	return class SVLDD extends PureComponent {
		static propTypes = {
			/**
			 * TBD
			 */
			render: PropTypes.func
		}

		moonChildRef = null
		uiChildRef = null

		/**
		 * Focus an item after scrolling
		 */

		focusOnNode = (node) => {
			if (node) {
				Spotlight.focus(node);
			}
		}

		focusOnItem = (index) => {
			const item = this.uiChildRef.containerRef.querySelector(`[data-index='${index}'].spottable`);

			if (Spotlight.isPaused()) {
				Spotlight.resume();
				if (type === JS) {
					this.moonChildRef.forceUpdate();
				}
			}
			this.focusOnNode(item);
			this.moonChildRef.nodeIndexToBeFocused = null;
		}

		initItemRef = (ref, index) => {
			if (ref) {
				if (type === JS) {
					this.focusOnItem(index);
				} else if (type === Native) {
					// If focusing the item of VirtuallistNative, `onFocus` in Scrollable will be called.
					// Then VirtualListNative tries to scroll again differently from VirtualList.
					// So we would like to skip `focus` handling when focusing the item as a workaround.
					this.moonChildRef.isScrolledByJump = true;
					this.focusOnItem(index);
					this.moonChildRef.isScrolledByJump = false;
				}
			}
		}

		getComponentProps = (index) => (
			(this.moonChildRef && index === this.moonChildRef.nodeIndexToBeFocused) ? {ref: (ref) => this.initItemRef(ref, index)} : {}
		)

		/**
		 * Handle a Page up/down key with disabled items
		 */

		findSpottableItem = (indexFrom, indexTo) => {
			const
				{data, dataSize} = this.uiChildRef.props,
				safeIndexFrom = clamp(0, dataSize - 1, indexFrom),
				safeIndexTo = clamp(-1, dataSize, indexTo),
				delta = (indexFrom < indexTo) ? 1 : -1;

			if (indexFrom < 0 && indexTo < 0 || indexFrom >= dataSize && indexTo >= dataSize) {
				return -1;
			}

			if (safeIndexFrom !== safeIndexTo) {
				for (let i = safeIndexFrom; i !== safeIndexTo; i += delta) {
					if (data[i] && data[i].disabled === false) {
						return i;
					}
				}
			}

			return -1;
		}

		getIndexToScrollDisabled = (direction, currentIndex) => {
			const
				{data, dataSize, spacing} = this.uiChildRef.props,
				{dimensionToExtent, primary} = this.uiChildRef,
				{findSpottableItem} = this,
				{firstVisibleIndex, lastVisibleIndex} = this.uiChildRef.moreInfo,
				numOfItemsInPage = (Math.floor((primary.clientSize + spacing) / primary.gridSize) * dimensionToExtent),
				isPageDown = (direction === 'down' || direction === 'right') ? 1 : -1;
			let candidateIndex = -1;

			/* First, find a spottable item in this page */
			if (isPageDown === 1) { // Page Down
				if ((lastVisibleIndex - (lastVisibleIndex % dimensionToExtent || dimensionToExtent)) >= currentIndex) {
					candidateIndex = findSpottableItem(
						lastVisibleIndex,
						currentIndex - (currentIndex % dimensionToExtent) + dimensionToExtent - 1
					);
				}
			} else if (firstVisibleIndex + dimensionToExtent <= currentIndex) { // Page Up
				candidateIndex = findSpottableItem(
					firstVisibleIndex,
					currentIndex - (currentIndex % dimensionToExtent)
				);
			}

			/* Second, find a spottable item in the next page */
			if (candidateIndex === -1) {
				if (isPageDown === 1) { // Page Down
					candidateIndex = findSpottableItem(lastVisibleIndex + numOfItemsInPage, lastVisibleIndex);
				} else { // Page Up
					candidateIndex = findSpottableItem(firstVisibleIndex - numOfItemsInPage, firstVisibleIndex);
				}
			}

			/* Last, find a spottable item in a whole data */
			if (candidateIndex === -1) {
				if (isPageDown === 1) { // Page Down
					candidateIndex = findSpottableItem(lastVisibleIndex + numOfItemsInPage + 1, dataSize);
				} else { // Page Up
					candidateIndex = findSpottableItem(firstVisibleIndex - numOfItemsInPage - 1, -1);
				}
			}

			/* For grid lists, find the nearest item from the current item */
			if (candidateIndex !== -1) {
				const
					currentPosInExtent = currentIndex % dimensionToExtent,
					firstIndexInExtent = candidateIndex - (candidateIndex % dimensionToExtent),
					lastIndexInExtent = clamp(firstIndexInExtent, dataSize - 1, firstIndexInExtent + dimensionToExtent);
				let
					minDistance = dimensionToExtent,
					distance,
					index;
				for (let i = firstIndexInExtent; i <= lastIndexInExtent; ++i) {
					if (data[i] && !data[i].disabled) {
						distance = Math.abs(currentPosInExtent - i % dimensionToExtent);
						if (distance < minDistance) {
							minDistance = distance;
							index = i;
						}
					}
				}

				return index;
			} else {
				return -1;
			}
		}

		scrollToNextItem = ({direction, focusedItem}) => {
			const
				focusedIndex = Number.parseInt(focusedItem.getAttribute(dataIndexAttribute)),
				{firstVisibleIndex, lastVisibleIndex} = this.uiChildRef.moreInfo;
			let indexToScroll = -1;

			indexToScroll = this.getIndexToScrollDisabled(direction, focusedIndex, this.uiChildRef);

			if (indexToScroll !== -1) {
				const
					isRtl = this.moonChildRef.props.rtl,
					isForward = (direction === 'down' || isRtl && direction === 'left' || !isRtl && direction === 'right');

				if (type === JS) {
					// To prevent item positioning issue, make all items to be rendered.
					this.uiChildRef.updateFrom = null;
					this.uiChildRef.updateTo = null;
				}

				if (firstVisibleIndex <= indexToScroll && indexToScroll <= lastVisibleIndex) {
					const node = this.uiChildRef.containerRef.querySelector(`[data-index='${indexToScroll}'].spottable`);

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
				this.moonChildRef.nodeIndexToBeFocused = this.moonChildRef.lastFocusedIndex = indexToScroll;
				this.uiChildRef.props.cbScrollTo({index: indexToScroll, stickTo: isForward ? 'end' : 'start', animate: false});
			}

			return true;
		}

		/**
		 * Handle `onKeyDown` event
		 */

		jumpToSpottableItem = ({keyCode, rtl, setRestrict, target}) => {
			const
				{cbScrollTo, data, dataSize} = this.uiChildRef.props,
				{firstIndex, numOfItems} = this.uiChildRef.state,
				{isPrimaryDirectionVertical} = this.uiChildRef,
				currentIndex = Number.parseInt(target.getAttribute(dataIndexAttribute));

			if (!data || !Array.isArray(data) || !data[currentIndex] || data[currentIndex].disabled) {
				return false;
			}

			const
				isForward = (
					isPrimaryDirectionVertical && isDown(keyCode) ||
					!isPrimaryDirectionVertical && (!rtl && isRight(keyCode) || rtl && isLeft(keyCode)) ||
					null
				),
				isBackward = (
					isPrimaryDirectionVertical && isUp(keyCode) ||
					!isPrimaryDirectionVertical && (!rtl && isLeft(keyCode) || rtl && isRight(keyCode)) ||
					null
				);

			let nextIndex = -1;

			if (isForward) {
				// See if the next item is spottable then delegate scroll to onFocus handler
				if (currentIndex < dataSize - 1 && !data[currentIndex + 1].disabled) {
					return false;
				}

				for (let i = currentIndex + 2; i < dataSize; i++) {
					if (!data[i].disabled) {
						nextIndex = i;
						break;
					}
				}

				// If there is no item which could get focus forward,
				// we need to set restriction option to `self-first`.
				if (nextIndex === -1) {
					setRestrict(false);
				}
			} else if (isBackward) {
				// See if the next item is spottable then delegate scroll to onFocus handler
				if (currentIndex > 0 && !data[currentIndex - 1].disabled) {
					return false;
				}

				for (let i = currentIndex - 2; i >= 0; i--) {
					if (!data[i].disabled) {
						nextIndex = i;
						break;
					}
				}

				// If there is no item which could get focus backward,
				// we need to set restriction option to `self-first`.
				if (nextIndex === -1) {
					setRestrict(false);
				}
			} else {
				return false;
			}

			if (nextIndex !== -1 && (firstIndex > nextIndex || nextIndex >= firstIndex + numOfItems)) {
				// When changing from "pointer" mode to "5way key" mode,
				// a pointer is hidden and a last focused item get focused after 30ms.
				// To make sure the item to be blurred after that, we used 50ms.
				setTimeout(() => {
					target.blur();
				}, 50);

				this.moonChildRef.nodeIndexToBeFocused = this.moonChildRef.lastFocusedIndex = nextIndex;

				if (!Spotlight.isPaused()) {
					Spotlight.pause();
				}

				cbScrollTo({
					index: nextIndex,
					stickTo: isForward ? 'end' : 'start'
				});
				return true;
			}

			return false;
		}

		initMoonChildRef = (ref) => {
			if (ref) {
				this.moonChildRef = ref;
			}
		}

		initUiChildRef = (ref) => {
			if (ref) {
				this.uiChildRef = ref;
			}
		}

		render () {
			const {render, ...rest} = this.props;

			return render({
				...rest,
				disabledItems: true,
				getComponentProps: this.getComponentProps,
				initMoonChildRef: this.initMoonChildRef,
				initUiChildRef: this.initUiChildRef,
				jumpToSpottableItem: this.jumpToSpottableItem,
				scrollToNextItem: this.scrollToNextItem
			});
		}
	};
};

const SpotlightVirtualListWithDisabledItemsDecorator = SpotlightVirtualListWithDisabledItemsDecoratorBase(JS);

const SpotlightVirtualListWithDisabledItemsDecoratorNative = SpotlightVirtualListWithDisabledItemsDecoratorBase(Native);



export default SpotlightVirtualListWithDisabledItemsDecorator;
export {
	SpotlightVirtualListWithDisabledItemsDecorator,
	SpotlightVirtualListWithDisabledItemsDecoratorNative
};
