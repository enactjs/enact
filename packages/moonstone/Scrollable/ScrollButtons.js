import {Announce} from '@enact/ui/AnnounceDecorator';
import {is} from '@enact/core/keymap';
import {off, on} from '@enact/core/dispatcher';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight from '@enact/spotlight';

import $L from '../internal/$L';
import DisappearSpotlightDecorator from '../internal/DisappearSpotlightDecorator';

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
 * A moonstone-styled component for [Scrollbar]{@link moonstone/Scrollable.Scrollbar}.
 *
 * @class ScrollButtonsBase
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
class ScrollButtonsBase extends Component {
	static displayName = 'ScrollButtonsBase'

	static propTypes = /** @lends moonstone/Scrollable.ScrollButtonsBase.prototype */ {
		/**
		 * Render function for children
		 *
		 * @type {Function}
		 * @private
		 */
		render: PropTypes.func.isRequired,

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
		onPrevSpotlightDisappear: PropTypes.func,

		/**
		 * Called when the component contructed
		 *
		 * @type {Function}
		 * @private
		 */
		setRef: PropTypes.func,

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

		if (props.setRef) {
			props.setRef(this);
		}
	}

	componentWillUnmount () {
		this.setIgnoreMode(false); // To remove event handler
	}

	ignoreMode = false
	pressed = false
	announce = null

	// elements

	prevButtonElement = null
	nextButtonElement = null

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

		if (this.pressed && (
			shouldDisablePrevButton && spotItem && spotItem === this.prevButtonElement ||
			shouldDisableNextButton && spotItem && spotItem === this.nextButtonElement
		)) {
			this.setIgnoreMode(true);
		}
	}

	isOneOfScrollButtonsFocused = () => {
		const current = Spotlight.getCurrent();

		return current === this.prevButtonElement || current === this.nextButtonElement;
	}

	handlePrevScroll = (ev) => {
		const {onPrevScroll, vertical} = this.props;

		onPrevScroll({...ev, isPreviousScrollButton: true, isVerticalScrollBar: vertical});
		if (this.announce) {
			this.announce(vertical ? $L('UP') : $L('LEFT'));
		}
	}

	handleNextScroll = (ev) => {
		const {onNextScroll, vertical} = this.props;

		onNextScroll({...ev, isPreviousScrollButton: false, isVerticalScrollBar: vertical});
		if (this.announce) {
			this.announce(vertical ? $L('DOWN') : $L('RIGHT'));
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
		const {prevButtonDisabled, nextButtonDisabled} = this.state;

		this.setPressStatus(false);
		this.setIgnoreMode(false);
		if (isPageUp(ev.keyCode)) {
			if (ev.target === this.nextButtonElement && !prevButtonDisabled) {
				Spotlight.focus(this.prevButtonElement);
			} else {
				this.handlePrevScroll(ev);
			}
		} else if (isPageDown(ev.keyCode)) {
			if (ev.target === this.prevButtonElement && !nextButtonDisabled) {
				Spotlight.focus(this.nextButtonElement);
			} else {
				this.handleNextScroll(ev);
			}
		}
	}

	render () {
		const
			{disabled, onNextSpotlightDisappear, onPrevSpotlightDisappear, render, vertical} = this.props,
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
				onHoldPulse={this.handlePrevHoldPulse}
				onKeyDown={this.depressButton}
				onKeyUp={this.releaseButton}
				onMouseDown={this.depressButton}
				onSpotlightDisappear={onPrevSpotlightDisappear}
				ref={(ref) => { // eslint-disable-line react/jsx-no-bind
					if (ref) {
						this.prevButtonElement = ref;
					}
				}}
			>
				{prevIcon}
			</ScrollButton>,
			render(),
			<ScrollButton
				key="nextButton"
				data-scroll-button="next"
				direction={vertical ? 'down' : 'right'}
				disabled={disabled || nextButtonDisabled}
				onClick={this.handleNextScroll}
				onHoldPulse={this.handleNextHoldPulse}
				onKeyDown={this.depressButton}
				onKeyUp={this.releaseButton}
				onMouseDown={this.depressButton}
				onSpotlightDisappear={onNextSpotlightDisappear}
				ref={(ref) => { // eslint-disable-line react/jsx-no-bind
					if (ref) {
						this.nextButtonElement = ref;
					}
				}}
			>
				{nextIcon}
			</ScrollButton>,
			<Announce
				key="announce"
				ref={(ref) => { // eslint-disable-line react/jsx-no-bind
					if (ref) {
						this.announce = ref.announce;
					}
				}}
			/>
		];
	}
}

/**
 * A moonstone-styled scroll bar. It is used in [Scrollable]{@link moonstone/Scrollable.Scrollable}.
 *
 * @class ScrollButtons
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
const ScrollButtons = DisappearSpotlightDecorator(
	{events: {
		onNextSpotlightDisappear: '[data-scroll-button="previous"]',
		onPrevSpotlightDisappear: '[data-scroll-button="next"]'
	}}
)(ScrollButtonsBase);

export default ScrollButtons;
export {
	ScrollButtons,
	ScrollButtonsBase
};
