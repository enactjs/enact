import {Announce} from '@enact/ui/AnnounceDecorator';
import {is} from '@enact/core/keymap';
import {off, on} from '@enact/core/dispatcher';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Spotlight, {getDirection} from '@enact/spotlight';

import $L from '../internal/$L';

import ScrollButton from './ScrollButton';

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
 * A Moonstone-styled scroll buttons. It is used in [Scrollbar]{@link moonstone/Scrollable.Scrollbar}.
 *
 * @class ScrollButtons
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
class ScrollButtons extends Component {
	static displayName = 'ScrollButtons'

	static propTypes = /** @lends moonstone/Scrollable.ScrollButtons.prototype */ {
		/**
		 * The render function for thumb.
		 *
		 * @type {Function}
		 * @required
		 * @private
		 */
		thumbRenderer: PropTypes.func.isRequired,

		/**
		 * Called to alert the user for accessibility notifications.
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
		* Sets the hint string read when focusing the next button in the scroll bar.
		*
		* @type {String}
		* @public
		*/
		nextButtonAriaLabel: PropTypes.string,

		/**
		 * Called when the scrollbar's down/right button is pressed.
		 *
		 * @type {Function}
		 * @public
		 */
		onNextScroll: PropTypes.func,

		/**
		 * Called when the scrollbar's up/left button is pressed.
		 *
		 * @type {Function}
		 * @public
		 */
		onPrevScroll: PropTypes.func,

		/**
		 * Sets the hint string read when focusing the previous button in the scroll bar.
		 *
		 * @type {String}
		 * @public
		 */
		previousButtonAriaLabel: PropTypes.string,

		/**
		 * `true` if rtl, `false` if ltr.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * If `true`, the scrollbar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		vertical: PropTypes.bool
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
	}

	componentWillUnmount () {
		this.setIgnoreMode(false); // To remove event handler
	}

	ignoreMode = false
	pressed = false
	announce = null

	// elements

	prevButtonNodeRef = null
	nextButtonNodeRef = null

	setPressStatus = (isPressed) => {
		this.pressed = isPressed;
	}

	setIgnoreMode = (shouldIgnore) => {
		if (shouldIgnore !== this.ignoreMode) {
			if (shouldIgnore) {
				this.ignoreMode = true;
				on('mousemove', this.handleUp);
				on('mouseup', this.handleUp);
			} else {
				this.ignoreMode = false;
				off('mousemove', this.handleUp);
				off('mouseup', this.handleUp);
			}
		}
	}

	updateButtons = (bounds) => {
		const
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
			shouldDisablePrevButton && spotItem && spotItem === this.prevButtonNodeRef ||
			shouldDisableNextButton && spotItem && spotItem === this.nextButtonNodeRef
		)) {
			this.setIgnoreMode(true);
		}
	}

	isOneOfScrollButtonsFocused = () => {
		const current = Spotlight.getCurrent();

		return current === this.prevButtonNodeRef || current === this.nextButtonNodeRef;
	}

	handlePrevDown = () => {
		this.setPressStatus(true);

		if (this.announce) {
			const {rtl, vertical} = this.props;
			this.announce(vertical && $L('UP') || rtl && $L('RIGHT') || $L('LEFT'));
		}
	}

	handleNextDown = () => {
		this.setPressStatus(true);

		if (this.announce) {
			const {rtl, vertical} = this.props;
			this.announce(vertical && $L('DOWN') || rtl && $L('LEFT') || $L('RIGHT'));
		}
	}

	handlePrevClick = (ev) => {
		const {onPrevScroll, vertical} = this.props;

		onPrevScroll({...ev, isPreviousScrollButton: true, isVerticalScrollBar: vertical});
	}

	handleNextClick = (ev) => {
		const {onNextScroll, vertical} = this.props;

		onNextScroll({...ev, isPreviousScrollButton: false, isVerticalScrollBar: vertical});
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

	// Handle up / down / left / right keydown events after Spotlight handled them
	handleSpotlight = (ev) => {
		const
			{rtl, vertical} = this.props,
			{keyCode, target} = ev,
			direction = getDirection(keyCode),
			fromNextToPrev = (vertical && direction === 'up') || (!vertical && direction === (rtl ? 'right' : 'left')),
			fromPrevToNext = (vertical && direction === 'down') || (!vertical && direction === (rtl ? 'left' : 'right'));

		// manually focus the opposite scroll button when 5way pressed
		if ((fromNextToPrev && target === this.nextButtonNodeRef) ||
			(fromPrevToNext && target === this.prevButtonNodeRef)) {
			// Focus on opposite ScrollButton
			const buttonNode = (ev.target === this.nextButtonNodeRef) ? this.prevButtonNodeRef : this.nextButtonNodeRef;

			ev.preventDefault();
			ev.nativeEvent.stopPropagation();

			if (!Spotlight.focus(buttonNode)) {
				Spotlight.move(direction);
			}
		}
	}

	handleUp = () => {
		this.setPressStatus(false);
		this.setIgnoreMode(false);
	}

	handleKeyDown = (ev) => {
		const
			{prevButtonDisabled, nextButtonDisabled} = this.state,
			{keyCode} = ev,
			isPreviousScrollButton = (ev.target === this.prevButtonNodeRef);

		if (isPageUp(keyCode)) {
			if (!isPreviousScrollButton && !prevButtonDisabled) {
				Spotlight.focus(this.prevButtonNodeRef);
			} else {
				this.handlePrevClick(ev);
			}
		} else if (isPageDown(keyCode)) {
			if (isPreviousScrollButton && !nextButtonDisabled) {
				Spotlight.focus(this.nextButtonNodeRef);
			} else {
				this.handleNextClick(ev);
			}
		}
	}

	initAnnounceRef = (ref) => {
		if (ref) {
			this.announce = ref.announce;
		}
	}

	initNextButtonRef = (ref) => {
		if (ref) {
			this.nextButtonNodeRef = ReactDOM.findDOMNode(ref); // eslint-disable-line react/no-find-dom-node
		}
	}

	initPrevButtonRef = (ref) => {
		if (ref) {
			this.prevButtonNodeRef = ReactDOM.findDOMNode(ref); // eslint-disable-line react/no-find-dom-node
		}
	}

	render () {
		const
			{disabled, nextButtonAriaLabel, previousButtonAriaLabel, rtl, thumbRenderer, vertical} = this.props,
			{prevButtonDisabled, nextButtonDisabled} = this.state,
			prevIcon = preparePrevButton(vertical),
			nextIcon = prepareNextButton(vertical);

		return [
			<ScrollButton
				aria-label={rtl && !vertical ? nextButtonAriaLabel : previousButtonAriaLabel}
				key="prevButton"
				data-spotlight-overflow="ignore"
				direction={vertical ? 'up' : 'left'}
				disabled={disabled || prevButtonDisabled}
				onClick={this.handlePrevClick}
				onDown={this.handlePrevDown}
				onHoldPulse={this.handlePrevHoldPulse}
				onKeyDown={this.handleKeyDown}
				onSpotlightDown={this.handleSpotlight}
				onSpotlightLeft={this.handleSpotlight}
				onSpotlightRight={this.handleSpotlight}
				onUp={this.handleUp}
				ref={this.initPrevButtonRef}
			>
				{prevIcon}
			</ScrollButton>,
			thumbRenderer(),
			<ScrollButton
				aria-label={rtl && !vertical ? previousButtonAriaLabel : nextButtonAriaLabel}
				key="nextButton"
				data-spotlight-overflow="ignore"
				direction={vertical ? 'down' : 'right'}
				disabled={disabled || nextButtonDisabled}
				onClick={this.handleNextClick}
				onDown={this.handleNextDown}
				onHoldPulse={this.handleNextHoldPulse}
				onKeyDown={this.handleKeyDown}
				onSpotlightLeft={this.handleSpotlight}
				onSpotlightRight={this.handleSpotlight}
				onSpotlightUp={this.handleSpotlight}
				onUp={this.handleUp}
				ref={this.initNextButtonRef}
			>
				{nextIcon}
			</ScrollButton>,
			<Announce
				key="announce"
				ref={this.initAnnounceRef}
			/>
		];
	}
}

export default ScrollButtons;
export {
	ScrollButtons
};
