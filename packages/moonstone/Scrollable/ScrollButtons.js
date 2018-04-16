import {Announce} from '@enact/ui/AnnounceDecorator';
import {is} from '@enact/core/keymap';
import {off, on} from '@enact/core/dispatcher';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Spotlight from '@enact/spotlight';

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

		if (shouldDisablePrevButton && spotItem === this.prevButtonNodeRef) {
			if (this.pressed) {
				this.setIgnoreMode(true);
				this.buttonToFocus = this.nextButtonNodeRef;
			} else {
				Spotlight.focus(this.nextButtonNodeRef);
			}
		} else if (shouldDisableNextButton && spotItem === this.nextButtonNodeRef) {
			if (this.pressed) {
				this.setIgnoreMode(true);
				this.buttonToFocus = this.prevButtonNodeRef;
			} else {
				Spotlight.focus(this.prevButtonNodeRef);
			}
		}
	}

	isOneOfScrollButtonsFocused = () => {
		const current = Spotlight.getCurrent();

		return current === this.prevButtonNodeRef || current === this.nextButtonNodeRef;
	}

	handlePrevDown = () => {
		const {vertical} = this.props;

		if (this.announce) {
			this.announce(vertical ? $L('UP') : $L('LEFT'));
		}
	}

	handleNextDown = () => {
		const {vertical} = this.props;

		if (this.announce) {
			this.announce(vertical ? $L('DOWN') : $L('RIGHT'));
		}
	}

	handlePrevScroll = (ev) => {
		const {onPrevScroll, vertical} = this.props;

		onPrevScroll({...ev, isPreviousScrollButton: true, isVerticalScrollBar: vertical});
	}

	handleNextScroll = (ev) => {
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

	depressButton = () => {
		this.setPressStatus(true);
	}

	releaseButton = (ev) => {
		const {prevButtonDisabled, nextButtonDisabled} = this.state;

		this.setPressStatus(false);
		this.setIgnoreMode(false);
		if (isPageUp(ev.keyCode)) {
			if (ev.target === this.nextButtonNodeRef && !prevButtonDisabled) {
				Spotlight.focus(this.prevButtonNodeRef);
			} else {
				this.handlePrevScroll(ev);
			}
		} else if (isPageDown(ev.keyCode)) {
			if (ev.target === this.prevButtonNodeRef && !nextButtonDisabled) {
				Spotlight.focus(this.nextButtonNodeRef);
			} else {
				this.handleNextScroll(ev);
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
			{disabled, thumbRenderer, vertical} = this.props,
			{prevButtonDisabled, nextButtonDisabled} = this.state,
			prevIcon = preparePrevButton(vertical),
			nextIcon = prepareNextButton(vertical);

		return [
			<ScrollButton
				key="prevButton"
				data-scroll-button="previous"
				direction={vertical ? 'up' : 'left'}
				disabled={disabled || prevButtonDisabled}
				onClick={this.handlePrevScroll}
				onDown={this.handlePrevDown}
				onHoldPulse={this.handlePrevHoldPulse}
				onKeyDown={this.depressButton}
				onKeyUp={this.releaseButton}
				onMouseDown={this.depressButton}
				ref={this.initPrevButtonRef}
			>
				{prevIcon}
			</ScrollButton>,
			thumbRenderer(),
			<ScrollButton
				key="nextButton"
				data-scroll-button="next"
				direction={vertical ? 'down' : 'right'}
				disabled={disabled || nextButtonDisabled}
				onClick={this.handleNextScroll}
				onDown={this.handleNextDown}
				onHoldPulse={this.handleNextHoldPulse}
				onKeyDown={this.depressButton}
				onKeyUp={this.releaseButton}
				onMouseDown={this.depressButton}
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
