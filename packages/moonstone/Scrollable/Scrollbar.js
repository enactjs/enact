import $L from '@enact/moonstone/internal/$L';
import {off, on} from '@enact/core/dispatcher';
import {Announce} from '@enact/ui/AnnounceDecorator';
import ApiDecorator from '@enact/core/internal/ApiDecorator';
import classNames from 'classnames';
import DisappearSpotlightDecorator from '@enact/moonstone/internal/DisappearSpotlightDecorator';
import {is} from '@enact/core/keymap';
import PropTypes from 'prop-types';
import React from 'react';
import Spotlight from '@enact/spotlight';

import {ScrollbarBase as UiScrollbarBase} from '@enact/ui/Scrollable/Scrollbar';
import ScrollButton from './ScrollButton';
import ScrollThumb from '@enact/ui/Scrollable/ScrollThumb';

import css from './Scrollbar.less';

const
	nop = () => {},
	prepareButton = (isPrev) => (isVertical) => {
		let direction;

		if (isVertical) {
			direction = isPrev ? 'up' : 'down';
		} else {
			direction = isPrev ? 'left' : 'right';
		}

		return 'arrowsmall' + direction;
	},
	preparePrevButton = prepareButton(true),
	prepareNextButton = prepareButton(false),
	isPageUp = is('pageUp'),
	isPageDown = is('pageDown');

/**
 * {@link moonstone/Scroller.Scrollbar} is a Scrollbar with Moonstone styling.
 * It is used in {@link moonstone/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof moonstone/Scroller
 * @ui
 * @private
 */
class ScrollbarBase extends UiScrollbarBase {
	static displayName = 'Scrollbar'

	static propTypes = /** @lends moonstone/Scroller.Scrollbar.prototype */ {
		/**
		 * Can be called to alert the user for accessibility notifications.
		 *
		 * @type {Function}
		 * @public
		 */
		announce: PropTypes.func,

		/**
		 * Specifies to reflect scrollbar's disabled property to the paging controls.
		 * When it is `true`, both prev/next buttons are going to be disabled.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Called when the scrollbar's down/right button is pressed.
		 *
		 * @type {Function}
		 * @public
		 */
		onNextScroll: PropTypes.func,

		/**
		 * Called when the next button is disabled
		 *
		 * @type {Function}
		 * @private
		 */
		onNextSpotlightDisappear: PropTypes.func,

		/**
		 * Called when the scrollbar's up/left button is pressed.
		 *
		 * @type {Function}
		 * @public
		 */
		onPrevScroll: PropTypes.func,

		/**
		 * Called when the previous button is disabled
		 *
		 * @type {Function}
		 * @private
		 */
		onPrevSpotlightDisappear: PropTypes.func
	}

	static defaultProps = {
		onNextScroll: nop,
		onPrevScroll: nop
	}

	constructor (props) {
		super(props);

		this.state = {
			prevButtonDisabled: true,
			nextButtonDisabled: true
		};

		this.initAnnounceRef = this.initRef('announceRef');
	}

	componentDidMount () {
		super.componentDidMount();
		this.prevButtonNodeRef = this.containerRef.children[0];
		this.nextButtonNodeRef = this.containerRef.children[2];
	}

	componentWillUnmount () {
		super.componentWillUnmount();
		this.setIgnoreMode(false); // To remove event handler
	}

	pressed = false
	// component refs
	prevButtonNodeRef = null
	nextButtonNodeRef = null

	setPressStatus = (isPressed) => {
		this.pressed = isPressed;
	}

	setIgnoreMode = (shouldIgnore) => {
		if (shouldIgnore !== this.ignoreMode) {
			if (shouldIgnore) {
				this.ignoreMode = true;
				on('mousemove', this.releaseButton);
				on('mouseup', this.releaseButton);
			} else {
				this.ignoreMode = false;
				off('mousemove', this.releaseButton);
				off('mouseup', this.releaseButton);
			}
		}
	}

	updateButtons = (bounds) => {
		const
			{prevButtonNodeRef, nextButtonNodeRef} = this,
			{vertical} = this.props,
			currentPos = vertical ? bounds.scrollTop : bounds.scrollLeft,
			maxPos = vertical ? bounds.maxTop : bounds.maxLeft,
			shouldDisablePrevButton = currentPos <= 0,
			/* If a scroll size or a client size is not integer,
			   browsers's max scroll position could be smaller than maxPos by 1 pixel.*/
			shouldDisableNextButton = maxPos - currentPos <= 1,
			spotItem = Spotlight.getCurrent();

		this.setState((prevState) => {
			const
				updatePrevButton = (prevState.prevButtonDisabled !== shouldDisablePrevButton),
				updateNextButton = (prevState.nextButtonDisabled !== shouldDisableNextButton);

			if (updatePrevButton && updateNextButton) {
				return {prevButtonDisabled: shouldDisablePrevButton, nextButtonDisabled: shouldDisableNextButton};
			} else if (updatePrevButton) {
				return {prevButtonDisabled: shouldDisablePrevButton};
			} else if (updateNextButton) {
				return {nextButtonDisabled: shouldDisableNextButton};
			}
		});

		if (this.pressed && (
			shouldDisablePrevButton && spotItem === prevButtonNodeRef ||
			shouldDisableNextButton && spotItem === nextButtonNodeRef
		)) {
			this.setIgnoreMode(true);
		}
	}

	update (bounds) {
		super.update(bounds);
		this.updateButtons(bounds);
	}

	isThumbFocused = () => Spotlight.getCurrent() === this.prevButtonNodeRef || Spotlight.getCurrent() === this.nextButtonNodeRef

	handlePrevScroll = (ev) => {
		const {onPrevScroll, vertical} = this.props;

		onPrevScroll({...ev, isPreviousScrollButton: true, isVerticalScrollBar: vertical});
		if (this.announceRef) {
			this.announceRef.announce(vertical ? $L('UP') : $L('LEFT'));
		}
	}

	handleNextScroll = (ev) => {
		const {onNextScroll, vertical} = this.props;

		onNextScroll({...ev, isPreviousScrollButton: false, isVerticalScrollBar: vertical});
		if (this.announceRef) {
			this.announceRef.announce(vertical ? $L('DOWN') : $L('RIGHT'));
		}
	}

	handlePrevHoldPulse = (ev) => {
		const {onPrevScroll, vertical} = this.props;

		if (!this.ignoreMode) {
			onPrevScroll({...ev, isPreviousScrollButton: true, isVerticalScrollBar: vertical});
		}
	}

	handleNextHoldPulse = (ev) => {
		const {onNextScroll, vertical} = this.props;

		if (!this.ignoreMode) {
			onNextScroll({...ev, isPreviousScrollButton: false, isVerticalScrollBar: vertical});
		}
	}

	depressButton = () => {
		this.setPressStatus(true);
	}

	releaseButton = (ev) => {
		const
			{prevButtonNodeRef, nextButtonNodeRef} = this,
			{prevButtonDisabled, nextButtonDisabled} = this.state;

		this.setPressStatus(false);
		this.setIgnoreMode(false);
		if (isPageUp(ev.keyCode)) {
			if (ev.target === nextButtonNodeRef && !prevButtonDisabled) {
				Spotlight.focus(prevButtonNodeRef);
			} else {
				this.handlePrevScroll(ev);
			}
		} else if (isPageDown(ev.keyCode)) {
			if (ev.target === prevButtonNodeRef && !nextButtonDisabled) {
				Spotlight.focus(nextButtonNodeRef);
			} else {
				this.handleNextScroll(ev);
			}
		}
	}

	render () {
		const
			{className, corner, disabled, onNextSpotlightDisappear, onPrevSpotlightDisappear, vertical} = this.props,
			{prevButtonDisabled, nextButtonDisabled} = this.state,
			containerClassName = classNames(
				className,
				css.scrollbar,
				corner ? css.corner : null,
				vertical ? css.vertical : css.horizontal
			),
			prevIcon = preparePrevButton(vertical),
			nextIcon = prepareNextButton(vertical);

		return (
			<div ref={this.initContainerRef} className={containerClassName}>
				<ScrollButton
					data-scroll-button="previous"
					direction={vertical ? 'up' : 'left'}
					disabled={disabled || prevButtonDisabled}
					onClick={this.handlePrevScroll}
					onHoldPulse={this.handlePrevHoldPulse}
					onKeyDown={this.depressButton}
					onKeyUp={this.releaseButton}
					onMouseDown={this.depressButton}
					onSpotlightDisappear={onPrevSpotlightDisappear}
				>
					{prevIcon}
				</ScrollButton>
				<ScrollThumb
					className={css.scrollThumb}
					getScrollThumbRef={this.initThumbRef}
					vertical={vertical}
				/>
				<ScrollButton
					data-scroll-button="next"
					direction={vertical ? 'down' : 'right'}
					disabled={disabled || nextButtonDisabled}
					onClick={this.handleNextScroll}
					onHoldPulse={this.handleNextHoldPulse}
					onKeyDown={this.depressButton}
					onKeyUp={this.releaseButton}
					onMouseDown={this.depressButton}
					onSpotlightDisappear={onNextSpotlightDisappear}
				>
					{nextIcon}
				</ScrollButton>
				<Announce ref={this.initAnnounceRef} />
			</div>
		);
	}
}

const Scrollbar = ApiDecorator(
	{api: ['containerRef', 'hideThumb', 'isThumbFocused', 'showThumb', 'startHidingThumb', 'update']},
	DisappearSpotlightDecorator(
		{events: {
			onNextSpotlightDisappear: '[data-scroll-button="previous"]',
			onPrevSpotlightDisappear: '[data-scroll-button="next"]'
		}},
		ScrollbarBase
	)
);

export default Scrollbar;
export {
	Scrollbar,
	ScrollbarBase
};
