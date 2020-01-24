import {forward} from '@enact/core/handle';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import {is} from '@enact/core/keymap';
import {Announce} from '@enact/ui/AnnounceDecorator';
import Spotlight, {getDirection} from '@enact/spotlight';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

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
	isPageDown = is('pageDown'),
	consumeEvent = (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
	};

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
		 * When it is `true`, it allows 5 way navigation to the ScrollButtons.
		 * This value is set by `Scrollable`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		focusableScrollButtons: PropTypes.bool,

		/**
		 * Sets the hint string read when focusing the next button in the scroll bar.
		 *
		 * @type {String}
		 * @public
		 */
		nextButtonAriaLabel: PropTypes.string,

		/**
		 * Called when the scrollbar's button is pressed and needs to be bubbled.
		 *
		 * @type {Function}
		 * @private
		 */
		onKeyDownButton: PropTypes.func,

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
		 * Specifies preventing keydown events from bubbling up to applications.
		 * Valid values are `'none'`, and `'programmatic'`.
		 *
		 * When it is `'none'`, every keydown event is bubbled.
		 * When it is `'programmatic'`, an event bubbling is not allowed for a keydown input
		 * which invokes programmatic spotlight moving.
		 *
		 * @type {String}
		 * @private
		 */
		preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),

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
		 * The scrollbar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		vertical: PropTypes.bool
	}

	static defaultProps = {
		focusableScrollButtons: false,
		onKeyDownButton: nop,
		onNextScroll: nop,
		onPrevScroll: nop
	}

	constructor (props) {
		super(props);

		this.state = {
			prevButtonDisabled: true,
			nextButtonDisabled: true
		};

		this.announceRef = React.createRef();
		this.nextButtonRef = React.createRef();
		this.prevButtonRef = React.createRef();
	}

	componentDidMount () {
		this.nextButtonRef.current.addEventListener('keydown', this.onKeyDownNext);
		this.prevButtonRef.current.addEventListener('keydown', this.onKeyDownPrev);
	}

	componentWillUnmount () {
		this.nextButtonRef.current.removeEventListener('keydown', this.onKeyDownNext);
		this.prevButtonRef.current.removeEventListener('keydown', this.onKeyDownPrev);
	}

	updateButtons = (bounds) => {
		const
			{vertical} = this.props,
			currentPos = vertical ? bounds.scrollTop : bounds.scrollLeft,
			maxPos = vertical ? bounds.maxTop : bounds.maxLeft,
			shouldDisablePrevButton = currentPos <= 0,
			/* If a scroll size or a client size is not integer,
			   browser's max scroll position could be smaller than maxPos by 1 pixel.*/
			shouldDisableNextButton = maxPos - currentPos <= 1,
			updatePrevButton = (this.state.prevButtonDisabled !== shouldDisablePrevButton),
			updateNextButton = (this.state.nextButtonDisabled !== shouldDisableNextButton);

		if (updatePrevButton || updateNextButton) {
			this.setState(() => {
				if (updatePrevButton && updateNextButton) {
					return {prevButtonDisabled: shouldDisablePrevButton, nextButtonDisabled: shouldDisableNextButton};
				} else if (updatePrevButton) {
					return {prevButtonDisabled: shouldDisablePrevButton};
				} else if (updateNextButton) {
					return {nextButtonDisabled: shouldDisableNextButton};
				}
			});
		}

	}

	isOneOfScrollButtonsFocused = () => {
		const current = Spotlight.getCurrent();
		return current === this.prevButtonRef.current || current === this.nextButtonRef.current;
	}

	onDownPrev = () => {
		if (this.announceRef.current.announce) {
			const {rtl, vertical} = this.props;
			this.announceRef.current.announce(vertical && $L('UP') || rtl && $L('RIGHT') || $L('LEFT'));
		}
	}

	onDownNext = () => {
		if (this.announceRef.current.announce) {
			const {rtl, vertical} = this.props;
			this.announceRef.current.announce(vertical && $L('DOWN') || rtl && $L('LEFT') || $L('RIGHT'));
		}
	}

	onClickPrev = (ev) => {
		const {onPrevScroll, vertical} = this.props;
		onPrevScroll({...ev, isPreviousScrollButton: true, isVerticalScrollBar: vertical});
	}

	onClickNext = (ev) => {
		const {onNextScroll, vertical} = this.props;
		onNextScroll({...ev, isPreviousScrollButton: false, isVerticalScrollBar: vertical});
	}

	focusOnButton = (isPrev) => {
		Spotlight.focus(isPrev ? this.prevButtonRef.current : this.nextButtonRef.current);
	}

	focusOnOppositeScrollButton = (ev, direction) => {
		const buttonNode = (ev.target === this.nextButtonRef.current) ? this.prevButtonRef.current : this.nextButtonRef.current;

		if (!Spotlight.focus(buttonNode)) {
			Spotlight.move(direction);
		}
	}

	onKeyDownButton = (ev, position) => {
		const
			{focusableScrollButtons, vertical, preventBubblingOnKeyDown} = this.props,
			{keyCode} = ev,
			direction = getDirection(ev.keyCode),
			preventBubbling = preventBubblingOnKeyDown === 'programmatic',
			isNextButton = position === 'next',
			isPrevButton = position === 'prev',
			nextButton = {
				disabled: this.state.nextButtonDisabled,
				ref: this.nextButtonRef.current,
				click: this.onClickNext
			},
			prevButton = {
				disabled: this.state.prevButtonDisabled,
				ref: this.prevButtonRef.current,
				click: this.onClickPrev
			},
			currentButton = isPrevButton ? prevButton : nextButton,
			oppositeButton = isPrevButton ? nextButton : prevButton;

		if (isPageDown(keyCode) || isPageUp(keyCode)) {
			if (!vertical) {
				// should not call stopPropagation() here
				ev.preventDefault();
				return;
			}

			if (isPrevButton && isPageDown(keyCode) || isNextButton && isPageUp(keyCode)) {
				if (focusableScrollButtons && !Spotlight.getPointerMode()) {
					consumeEvent(ev);
					Spotlight.setPointerMode(false);
					Spotlight.focus(ReactDOM.findDOMNode(oppositeButton.ref)); // eslint-disable-line react/no-find-dom-node
				} else if (!oppositeButton.disabled) {
					consumeEvent(ev);
					oppositeButton.click(ev);
				}
			} else if (!currentButton.disabled) {
				consumeEvent(ev);
				currentButton.click(ev);
			}
		} else if (direction) {
			const
				{rtl} = this.props,
				isDown = direction === 'down',
				isLeftMovement = direction === (rtl ? 'right' : 'left'),
				isRightMovement = direction === (rtl ? 'left' : 'right'),
				isUp = direction === 'up',
				fromNextToPrev = vertical ? isUp : isLeftMovement,
				fromPrevToNext = vertical ? isDown : isRightMovement;

			Spotlight.setPointerMode(false);

			if (isNextButton && fromNextToPrev || isPrevButton && fromPrevToNext) {
				if (focusableScrollButtons) {
					consumeEvent(ev);
					this.focusOnOppositeScrollButton(ev, direction);
					if (!preventBubbling) {
						forward('onKeyDownButton', ev, this.props);
					}
				}
			} else {
				const
					// If it is vertical `Scrollable`, move focus to the left for ltr or to the right for rtl
					// If is is horizontal `Scrollable`, move focus to the up
					directionToContent = !vertical && 'up' || rtl && 'right' || 'left',
					isLeavingDown = vertical && isNextButton && isDown,
					isLeavingUp = vertical && isPrevButton && isUp,
					isLeavingLeft = !vertical && isPrevButton && isLeftMovement,
					isLeavingRight = !vertical && isNextButton && isRightMovement,
					isDirectionToLeave =
						(vertical && isRightMovement || isLeavingUp || isLeavingDown) ||
						(!vertical && isDown || isLeavingLeft || isLeavingRight);

				if (isDirectionToLeave) {
					if (!focusableScrollButtons && !getTargetByDirectionFromElement(direction, ev.target)) {
						if (preventBubbling && isLeavingDown || isLeavingUp || isLeavingLeft || isLeavingRight) {
							consumeEvent(ev);
						}
						// move focus into contents and allow bubbling
						Spotlight.move(directionToContent);
					}
				} else if (preventBubbling) {
					// move focus directly to stop bubbling
					consumeEvent(ev);
					Spotlight.move(direction);
				}
			}
		}
	}

	onKeyDownPrev = (ev) => {
		this.onKeyDownButton(ev, 'prev');
	}

	onKeyDownNext = (ev) => {
		this.onKeyDownButton(ev, 'next');
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
				data-spotlight-overflow="ignore"
				disabled={disabled || prevButtonDisabled}
				key="prevButton"
				onClick={this.onClickPrev}
				onDown={this.onDownPrev}
				onHoldPulse={this.onClickPrev}
				ref={this.prevButtonRef}
			>
				{prevIcon}
			</ScrollButton>,
			thumbRenderer(),
			<ScrollButton
				aria-label={rtl && !vertical ? previousButtonAriaLabel : nextButtonAriaLabel}
				data-spotlight-overflow="ignore"
				disabled={disabled || nextButtonDisabled}
				key="nextButton"
				onClick={this.onClickNext}
				onDown={this.onDownNext}
				onHoldPulse={this.onClickNext}
				ref={this.nextButtonRef}
			>
				{nextIcon}
			</ScrollButton>,
			<Announce
				key="announce"
				ref={this.announceRef}
			/>
		];
	}
}

export default ScrollButtons;
export {
	ScrollButtons
};
