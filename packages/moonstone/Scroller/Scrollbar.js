import {off, on} from '@enact/core/dispatcher';
import {Announce} from '@enact/ui/AnnounceDecorator';
import ApiDecorator from '@enact/core/internal/ApiDecorator';
import classNames from 'classnames';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Spotlight from '@enact/spotlight';
import ri from '@enact/ui/resolution';

import $L from '../internal/$L';
import DisappearSpotlightDecorator from '../internal/DisappearSpotlightDecorator';

import ScrollButton from './ScrollButton';
import ScrollThumb from './ScrollThumb';

import css from './Scrollbar.less';

const
	nop = () => {},
	minThumbSize = 18, // Size in pixels
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
	prepareNextButton = prepareButton(false);

/**
 * Set CSS Varaible value.
 *
 * @method
 * @memberof core/util
 * @param {Node} element - Node.
 * @param {String} variable - CSS Variable property.
 * @param {String} value - CSS Variable value.
 */
const setCSSVariable = (element, variable, value) => {
	element.style.setProperty(variable, value);
};

/**
 * {@link moonstone/Scroller.Scrollbar} is a Scrollbar with Moonstone styling.
 * It is used in {@link moonstone/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof moonstone/Scroller
 * @ui
 * @private
 */
class ScrollbarBase extends PureComponent {
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
		 * If `true`, add the corner between vertical and horizontal scrollbars.
		 *
		 * @type {Booelan}
		 * @public
		 */
		corner: PropTypes.bool,

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
		 * Exposes this instance as the provider for its imperative API
		 *
		 * @type {Function}
		 * @private
		 */
		setApiProvider: PropTypes.func,

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
		corner: false,
		onNextScroll: nop,
		onPrevScroll: nop,
		vertical: true
	}

	constructor (props) {
		super(props);

		this.state = {
			prevButtonDisabled: true,
			nextButtonDisabled: true
		};

		this.initAnnounceRef = this.initRef('announceRef');
		this.initContainerRef = this.initRef('containerRef');
		this.initThumbRef = this.initRef('thumbRef');

		if (props.setApiProvider) {
			props.setApiProvider(this);
		}
	}

	componentDidMount () {
		const {containerRef} = this;

		this.calculateMetrics();
		this.prevButtonNodeRef = containerRef.children[0];
		this.nextButtonNodeRef = containerRef.children[1];
	}

	componentDidUpdate () {
		this.calculateMetrics();
	}

	componentWillUnmount () {
		this.hideThumbJob.stop();
		this.setIgnoreMode(false); // To remove event handler
	}

	minThumbSizeRatio = 0
	pressed = false
	ignoreMode = false
	buttonToFocus = null
	// component refs
	containerRef = null
	thumbRef = null
	prevButtonNodeRef = null
	nextButtonNodeRef = null

	setPressStatus = (isPressed) => {
		this.pressed = isPressed;
		if (!isPressed && this.buttonToFocus) {
			Spotlight.focus(this.buttonToFocus);
			this.buttonToFocus = null;
		}
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
			shouldDisableNextButton = currentPos >= maxPos,
			spotItem = window.document.activeElement;

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

		if (shouldDisablePrevButton && spotItem === prevButtonNodeRef) {
			if (this.pressed) {
				this.setIgnoreMode(true);
				this.buttonToFocus = nextButtonNodeRef;
			}
		} else if (shouldDisableNextButton && spotItem === nextButtonNodeRef) {
			if (this.pressed) {
				this.setIgnoreMode(true);
				this.buttonToFocus = prevButtonNodeRef;
			}
		}
	}

	update = (bounds) => {
		const
			{vertical} = this.props,
			{clientWidth, clientHeight, scrollWidth, scrollHeight, scrollLeft, scrollTop} = bounds,
			clientSize = vertical ? clientHeight : clientWidth,
			scrollSize = vertical ? scrollHeight : scrollWidth,
			scrollOrigin = vertical ? scrollTop : scrollLeft,

			thumbSizeRatioBase = (clientSize / scrollSize),
			scrollThumbPositionRatio = (scrollOrigin / (scrollSize - clientSize)),
			scrollThumbSizeRatio = Math.max(this.minThumbSizeRatio, Math.min(1, thumbSizeRatioBase));

		setCSSVariable(this.thumbRef, '--scrollbar-size-ratio', scrollThumbSizeRatio);
		setCSSVariable(this.thumbRef, '--scrollbar-progress-ratio', scrollThumbPositionRatio);
		this.updateButtons(bounds);
	}

	showThumb () {
		this.hideThumbJob.stop();
		this.thumbRef.classList.add(css.thumbShown);
	}

	startHidingThumb () {
		this.hideThumbJob.start();
	}

	hideThumb = () => {
		this.thumbRef.classList.remove(css.thumbShown);
	}

	hideThumbJob = new Job(this.hideThumb, 200);

	calculateMetrics = () => {
		const trackSize = this.containerRef[this.props.vertical ? 'clientHeight' : 'clientWidth'];
		this.minThumbSizeRatio = ri.scale(minThumbSize) / trackSize;
	}

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	handlePrevScroll = (ev) => {
		const {onPrevScroll, vertical} = this.props;
		onPrevScroll(ev);
		if (this.announceRef) this.announceRef.announce($L(vertical ? 'UP' : 'LEFT'));
	}

	handleNextScroll = (ev) => {
		const {onNextScroll, vertical} = this.props;
		onNextScroll(ev);
		if (this.announceRef) this.announceRef.announce($L(vertical ? 'DOWN' : 'RIGHT'));
	}

	handlePrevHoldPulse = (ev) => {
		if (!this.ignoreMode) {
			this.props.onPrevScroll(ev);
		}
	}

	handleNextHoldPulse = (ev) => {
		if (!this.ignoreMode) {
			this.props.onNextScroll(ev);
		}
	}

	depressButton = () => {
		this.setPressStatus(true);
	}

	releaseButton = () => {
		this.setPressStatus(false);
		this.setIgnoreMode(false);
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
	{api: ['hideThumb', 'showThumb', 'startHidingThumb', 'update']},
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
