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
	preventDefault = (ev) => {
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
			   browsers's max scroll position could be smaller than maxPos by 1 pixel.*/
			shouldDisableNextButton = maxPos - currentPos <= 1;

		const
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

		preventDefault(ev);
		Spotlight.setPointerMode(false);

		if (!Spotlight.focus(buttonNode)) {
			Spotlight.move(direction);
		}
	}

	onSpotlight = (ev) => {
		const direction = getDirection(ev.keyCode);
		if (direction) {
			const
				{focusableScrollButtons, rtl, vertical} = this.props,
				{target} = ev,
				isDown = direction === 'down',
				isLeftMovement = direction === (rtl ? 'right' : 'left'),
				isRightMovement = direction === (rtl ? 'left' : 'right'),
				isUp = direction === 'up',
				isNextButton = target === this.nextButtonRef.current,
				isPrevButton = target === this.prevButtonRef.current;

			// We don't need to navigate manually if `focusableScrollButtons` is `false`
			if (focusableScrollButtons) {
				const
					fromNextToPrev = vertical ? isUp : isLeftMovement,
					fromPrevToNext = vertical ? isDown : isRightMovement;

				// manually focus the opposite scroll button when 5way pressed
				if (isNextButton && fromNextToPrev || isPrevButton && fromPrevToNext) {
					this.focusOnOppositeScrollButton(ev, direction);
				}
			} else {
				const
					// If it is vertical `Scrollable`, move focus to the left for ltr or to the right for rtl
					// If is is horizontal `Scrollable`, move focus to the up
					directionToContent = !vertical && 'up' || rtl && 'right' || 'left',
					isDirectionToLeave =
						vertical && (isRightMovement || isPrevButton && isUp || isNextButton && isDown) ||
						!vertical && (isDown || isPrevButton && isLeftMovement || isNextButton && isRightMovement);

				if (isDirectionToLeave) {
					preventDefault(ev);
					if (!Spotlight.move(direction) && Spotlight.getCurrent() === target) {
						Spotlight.move(directionToContent);
					}
				}
			}
		}
	}

	onKeyDownPrev = (ev) => {
		const
			{focusableScrollButtons} = this.props,
			{nextButtonDisabled, prevButtonDisabled} = this.state,
			{keyCode} = ev;

		if (isPageDown(keyCode)) {
			if (focusableScrollButtons && !Spotlight.getPointerMode()) {
				preventDefault(ev);
				Spotlight.setPointerMode(false);
				Spotlight.focus(ReactDOM.findDOMNode(this.nextButtonRef.current)); // eslint-disable-line react/no-find-dom-node
			} else if (!nextButtonDisabled) {
				preventDefault(ev);
				this.onClickNext(ev);
			}
		} else if (isPageUp(keyCode)) {
			if (!prevButtonDisabled) {
				preventDefault(ev);
				this.onClickPrev(ev);
			}
		}
	}

	onKeyDownNext = (ev) => {
		const
			{focusableScrollButtons} = this.props,
			{nextButtonDisabled, prevButtonDisabled} = this.state,
			{keyCode} = ev;

		if (isPageUp(keyCode)) {
			if (focusableScrollButtons && !Spotlight.getPointerMode()) {
				preventDefault(ev);
				Spotlight.setPointerMode(false);
				Spotlight.focus(ReactDOM.findDOMNode(this.prevButtonRef.current)); // eslint-disable-line react/no-find-dom-node
			} else if (!prevButtonDisabled) {
				preventDefault(ev);
				this.onClickPrev(ev);
			}
		} else if (isPageDown(keyCode)) {
			if (!nextButtonDisabled) {
				preventDefault(ev);
				this.onClickNext(ev);
			}
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
				data-spotlight-overflow="ignore"
				disabled={disabled || prevButtonDisabled}
				key="prevButton"
				onClick={this.onClickPrev}
				onDown={this.onDownPrev}
				onHoldPulse={this.onClickPrev}
				onSpotlightDown={this.onSpotlight}
				onSpotlightLeft={this.onSpotlight}
				onSpotlightRight={this.onSpotlight}
				onSpotlightUp={this.onSpotlight}
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
				onSpotlightDown={this.onSpotlight}
				onSpotlightLeft={this.onSpotlight}
				onSpotlightRight={this.onSpotlight}
				onSpotlightUp={this.onSpotlight}
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
