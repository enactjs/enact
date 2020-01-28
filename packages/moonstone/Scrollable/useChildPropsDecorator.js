import platform from '@enact/core/platform';
import {useScrollable} from '@enact/ui/Scrollable';
import {useChildAdapter as useUiChildAdapter} from '@enact/ui/Scrollable/useChildAdapter';
import {utilDecorateChildProps} from '@enact/ui/Scrollable/useChildPropsDecorator';
import useScrollableAdapter from '@enact/ui/Scrollable/useScrollableAdapter';
import React, {useRef} from 'react';

import $L from '../internal/$L/$L';

import useChildAdapter from './useChildAdapter';
import {useSpottableScrollable} from './useSpottableScrollable';

import overscrollCss from './OverscrollEffect.module.less';

/**
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @function ScrollableBase
 * @memberof moonstone/Scrollable
 * @extends ui/Scrollable.ScrollableBase
 * @ui
 * @public
 */
const useChildPropsDecorator = (props) => {
	const {
		childRenderer,
		'data-spotlight-container': spotlightContainer,
		'data-spotlight-container-disabled': spotlightContainerDisabled,
		'data-spotlight-id': spotlightId,
		focusableScrollbar,
		preventBubblingOnKeyDown,
		scrollDownAriaLabel,
		scrollLeftAriaLabel,
		scrollRightAriaLabel,
		scrollUpAriaLabel,
		type,
		...rest
	} = props;

	// Mutable value

	const scrollableContainerRef = useRef();
	const uiChildContainerRef = useRef();

	const overscrollRefs = {
		horizontal: React.useRef(),
		vertical: React.useRef()
	};

	const horizontalScrollbarRef = useRef();
	const verticalScrollbarRef = useRef();

	// Adapters

	const [childAdapter, setChildAdapter] = useChildAdapter();

	const [uiScrollableAdapter, setUiScrollableAdapter] = useScrollableAdapter();

	const [uiChildAdapter, setUiChildAdapter] = useUiChildAdapter();

	// Hooks

	const instance = {
		// Ref
		scrollableContainerRef,
		overscrollRefs,
		uiChildContainerRef,
		horizontalScrollbarRef,
		verticalScrollbarRef,

		// Adapter
		childAdapter,
		uiScrollableAdapter,
		uiChildAdapter
	};

	const
		decoratedChildProps = {},
		decorateChildProps = utilDecorateChildProps(decoratedChildProps);

	const {
		addEventListeners,
		applyOverscrollEffect,
		clearOverscrollEffect,
		handleFlick,
		handleKeyDown,
		handleMouseDown,
		handleResizeWindow,
		handleScroll,
		handleScrollerUpdate,
		handleTouchStart,
		handleWheel,
		removeEventListeners,
		scrollAndFocusScrollbarButton,
		scrollbarProps,
		scrollStopOnScroll, // Native
		scrollTo,
		start, // Native
		stop // JS
	} = useSpottableScrollable(props, instance, {type});

	// Render

	const
		downButtonAriaLabel = scrollDownAriaLabel == null ? $L('scroll down') : scrollDownAriaLabel,
		upButtonAriaLabel = scrollUpAriaLabel == null ? $L('scroll up') : scrollUpAriaLabel,
		rightButtonAriaLabel = scrollRightAriaLabel == null ? $L('scroll right') : scrollRightAriaLabel,
		leftButtonAriaLabel = scrollLeftAriaLabel == null ? $L('scroll left') : scrollLeftAriaLabel,
		scrollableBaseProp = {};

	if (type === 'JS') {
		scrollableBaseProp.stop = stop;
	} else {
		scrollableBaseProp.scrollStopOnScroll = scrollStopOnScroll;
		scrollableBaseProp.start = start;
	}

	decorateChildProps('scrollableContainerProps', {
		className: [overscrollCss.scrollable],
		'data-spotlight-container': spotlightContainer,
		'data-spotlight-container-disabled': spotlightContainerDisabled,
		'data-spotlight-id': spotlightId,
		onTouchStart: handleTouchStart
	});

	decorateChildProps('flexLayoutProps', {
		className: [overscrollCss.overscrollFrame, overscrollCss.vertical]
	});

	decorateChildProps('childWrapperProps', {
		className: [overscrollCss.overscrollFrame, overscrollCss.horizontal]
	});

	decorateChildProps('childProps', {
		onUpdate: handleScrollerUpdate,
		scrollAndFocusScrollbarButton,
		setChildAdapter,
		spotlightId,
		uiScrollableAdapter,
	});

	decorateChildProps('verticalScrollbarProps', {
		...scrollbarProps,
		focusableScrollButtons: focusableScrollbar,
		nextButtonAriaLabel: downButtonAriaLabel,
		onKeyDownButton: handleKeyDown,
		preventBubblingOnKeyDown,
		previousButtonAriaLabel: upButtonAriaLabel
	});

	decorateChildProps('horizontalScrollbarProps', {
		...scrollbarProps,
		focusableScrollButtons: focusableScrollbar,
		nextButtonAriaLabel: rightButtonAriaLabel,
		onKeyDownButton: handleKeyDown,
		preventBubblingOnKeyDown,
		previousButtonAriaLabel: leftButtonAriaLabel
	});

	const {
		childWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	} = useScrollable({
		...rest,
		...scrollableBaseProp,
		decorateChildProps,
		noScrollByDrag: !platform.touchscreen,
		addEventListeners,
		applyOverscrollEffect,
		clearOverscrollEffect,
		handleResizeWindow,
		horizontalScrollbarRef,
		onFlick: handleFlick,
		onKeyDown: handleKeyDown,
		onMouseDown: handleMouseDown,
		onScroll: handleScroll,
		onWheel: handleWheel,
		removeEventListeners,
		scrollableContainerRef,
		scrollTo: scrollTo,
		setUiChildAdapter,
		setUiScrollableAdapter,
		type,
		uiChildAdapter,
		uiChildContainerRef,
		verticalScrollbarRef
	});

	decorateChildProps('flexLayoutProps', {
		className: [...(isHorizontalScrollbarVisible ? overscrollCss.horizontalScrollbarVisible : [])]
	});

	decorateChildProps('scrollableContainerProps', {ref: scrollableContainerRef});
	decorateChildProps('flexLayoutProps', {ref: scrollableContainerRef});
	decorateChildProps('childWrapperProps', {ref: overscrollRefs.vertical});
	decorateChildProps('childProps', {uiChildAdapter, uiChildContainerRef});
	decorateChildProps('verticalScrollbarProps', {ref: verticalScrollbarRef});
	decorateChildProps('horizontalScrollbarProp', {ref: horizontalScrollbarRef});

	return {
		...decoratedChildProps,
		childWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	};
};

export default useChildPropsDecorator;
export {
	useChildPropsDecorator
};
