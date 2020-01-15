import classNames from 'classnames';
import platform from '@enact/core/platform';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import {ScrollableBaseNative as UiScrollableBaseNative} from '@enact/ui/Scrollable/ScrollableNative';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import PropTypes from 'prop-types';
import React from 'react';

import $L from '../internal/$L';
import Skinnable from '../Skinnable';

import Scrollbar from './Scrollbar';
import useSpottable from './useSpottable';

import overscrollCss from './OverscrollEffect.module.less';

/**
 * A Moonstone-styled native component that provides horizontal and vertical scrollbars.
 *
 * @function ScrollableBaseNative
 * @memberof moonstone/ScrollableNative
 * @extends ui/Scrollable.ScrollableBaseNative
 * @ui
 * @private
 */
const ScrollableBaseNative = (props) => {
	/*
	 * Dependencies
	 */

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
		...rest
	} = props;

	/*
	 * Refs
	 */

	const
		childRef = React.useRef(),
		overscrollRefs = {
			horizontal: React.useRef(),
			vertical: React.useRef()
		},
		uiRef = React.useRef();

	/*
	 * useEffects
	 */

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
		scrollStopOnScroll,
		start
	} = useSpottable(props, {
			childRef,
			overscrollRefs,
			uiRef
	}, {
		type: 'Native'
	});

	/*
	 * Render
	 */

	const
		downButtonAriaLabel = scrollDownAriaLabel == null ? $L('scroll down') : scrollDownAriaLabel,
		upButtonAriaLabel = scrollUpAriaLabel == null ? $L('scroll up') : scrollUpAriaLabel,
		rightButtonAriaLabel = scrollRightAriaLabel == null ? $L('scroll right') : scrollRightAriaLabel,
		leftButtonAriaLabel = scrollLeftAriaLabel == null ? $L('scroll left') : scrollLeftAriaLabel;

	return (
		<UiScrollableBaseNative
			noScrollByDrag={!platform.touchscreen}
			{...rest}
			addEventListeners={addEventListeners}
			applyOverscrollEffect={applyOverscrollEffect}
			clearOverscrollEffect={clearOverscrollEffect}
			handleResizeWindow={handleResizeWindow}
			onFlick={handleFlick}
			onKeyDown={handleKeyDown}
			onMouseDown={handleMouseDown}
			onScroll={handleScroll}
			onWheel={handleWheel}
			ref={uiRef}
			removeEventListeners={removeEventListeners}
			scrollStopOnScroll={scrollStopOnScroll}
			scrollTo={scrollTo}
			start={start}
			containerRenderer={({ // eslint-disable-line react/jsx-no-bind
				childComponentProps,
				childWrapper: ChildWrapper,
				childWrapperProps: {className: contentClassName, ...restChildWrapperProps},
				className,
				componentCss,
				containerRef: uiContainerRef,
				horizontalScrollbarProps,
				initChildRef: initUiChildRef,
				isHorizontalScrollbarVisible,
				isVerticalScrollbarVisible,
				rtl,
				// TODO : change name "scrollToInContainer"
				scrollTo: scrollToInContainer,
				style,
				verticalScrollbarProps
			}) => (
				<div
					className={classNames(className, overscrollCss.scrollable)}
					data-spotlight-container={spotlightContainer}
					data-spotlight-container-disabled={spotlightContainerDisabled}
					data-spotlight-id={spotlightId}
					onTouchStart={handleTouchStart}
					ref={uiContainerRef}
					style={style}
				>
					<div className={classNames(componentCss.container, overscrollCss.overscrollFrame, overscrollCss.vertical, isHorizontalScrollbarVisible ? overscrollCss.horizontalScrollbarVisible : null)} ref={overscrollRefs.vertical}>
						<ChildWrapper className={classNames(contentClassName, overscrollCss.overscrollFrame, overscrollCss.horizontal)} ref={overscrollRefs.horizontal} {...restChildWrapperProps}>
							{childRenderer({
								...childComponentProps,
								cbScrollTo: scrollToInContainer,
								className: componentCss.scrollableFill,
								initUiChildRef,
								isHorizontalScrollbarVisible,
								isVerticalScrollbarVisible,
								onUpdate: handleScrollerUpdate,
								ref: childRef,
								rtl,
								scrollAndFocusScrollbarButton: scrollAndFocusScrollbarButton,
								spotlightId
							})}
						</ChildWrapper>
						{isVerticalScrollbarVisible ?
							<Scrollbar
								{...verticalScrollbarProps}
								{...scrollbarProps}
								disabled={!isVerticalScrollbarVisible}
								focusableScrollButtons={focusableScrollbar}
								nextButtonAriaLabel={downButtonAriaLabel}
								onKeyDownButton={handleKeyDown}
								preventBubblingOnKeyDown={preventBubblingOnKeyDown}
								previousButtonAriaLabel={upButtonAriaLabel}
								rtl={rtl}
							/> :
							null
						}
					</div>
					{isHorizontalScrollbarVisible ?
						<Scrollbar
							{...horizontalScrollbarProps}
							{...scrollbarProps}
							corner={isVerticalScrollbarVisible}
							disabled={!isHorizontalScrollbarVisible}
							focusableScrollButtons={focusableScrollbar}
							nextButtonAriaLabel={rightButtonAriaLabel}
							onKeyDownButton={handleKeyDown}
							preventBubblingOnKeyDown={preventBubblingOnKeyDown}
							previousButtonAriaLabel={leftButtonAriaLabel}
							rtl={rtl}
						/> :
						null
					}
				</div>
			)}
		/>
	);
};

ScrollableBaseNative.displayName = 'ScrollableNative';
ScrollableBaseNative.propTypes = /** @lends moonstone/ScrollableNative.ScrollableNative.prototype */ {
	/**
	 * Render function.
	 *
	 * @type {Function}
	 * @required
	 * @private
	 */
	childRenderer: PropTypes.func.isRequired,

	/**
	 * This is set to `true` by SpotlightContainerDecorator
	 *
	 * @type {Boolean}
	 * @private
	 */
	'data-spotlight-container': PropTypes.bool,

	/**
	 * `false` if the content of the list or the scroller could get focus
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	'data-spotlight-container-disabled': PropTypes.bool,

	/**
	 * This is passed onto the wrapped component to allow
	 * it to customize the spotlight container for its use case.
	 *
	 * @type {String}
	 * @private
	 */
	'data-spotlight-id': PropTypes.string,

	/**
	 * Direction of the list or the scroller.
	 * `'both'` could be only used for[Scroller]{@link moonstone/Scroller.Scroller}.
	 *
	 * Valid values are:
	 * * `'both'`,
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @private
	 */
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

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
	 * A unique identifier for the scrollable component.
	 *
	 * When specified and when the scrollable is within a SharedStateDecorator, the scroll
	 * position will be shared and restored on mount if the component is destroyed and
	 * recreated.
	 *
	 * @type {String}
	 * @public
	 */
	id: PropTypes.string,

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

	/**
	 * Specifies preventing keydown events from bubbling up to applications.
	 * Valid values are `'none'`, and `'programmatic'`.
	 *
	 * When it is `'none'`, every keydown event is bubbled.
	 * When it is `'programmatic'`, an event bubbling is not allowed for a keydown input
	 * which invokes programmatic spotlight moving.
	 *
	 * @type {String}
	 * @default 'none'
	 * @private
	 */
	preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),

	/**
	 * Sets the hint string read when focusing the next button in the vertical scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll down')
	 * @public
	 */
	scrollDownAriaLabel: PropTypes.string,

	/**
	 * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll left')
	 * @public
	 */
	scrollLeftAriaLabel: PropTypes.string,

	/**
	 * Sets the hint string read when focusing the next button in the horizontal scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll right')
	 * @public
	 */
	scrollRightAriaLabel: PropTypes.string,

	/**
	 * Sets the hint string read when focusing the previous button in the vertical scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll up')
	 * @public
	 */
	scrollUpAriaLabel: PropTypes.string
};

ScrollableBaseNative.defaultProps = {
	'data-spotlight-container-disabled': false,
	focusableScrollbar: false,
	overscrollEffectOn: {
		arrowKey: false,
		drag: false,
		pageKey: false,
		scrollbarButton: false,
		wheel: true
	},
	preventBubblingOnKeyDown: 'none'
};

/**
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @class ScrollableNative
 * @memberof moonstone/ScrollableNative
 * @mixes spotlight/SpotlightContainerDecorator
 * @extends moonstone/Scrollable.ScrollableBaseNative
 * @ui
 * @private
 */
const ScrollableNative = Skinnable(
	SpotlightContainerDecorator(
		{
			overflow: true,
			preserveId: true,
			restrict: 'self-first'
		},
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			ScrollableBaseNative
		)
	)
);

export default ScrollableNative;
export {
	ScrollableBaseNative,
	ScrollableNative
};
