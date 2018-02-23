import {Announce} from '@enact/ui/AnnounceDecorator';
import ApiDecorator from '@enact/core/internal/ApiDecorator';
import compose from 'ramda/src/compose';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {off, on} from '@enact/core/dispatcher';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Scrollbar as UiScrollbar} from '@enact/ui/Scrollable/Scrollbar';
import Spotlight from '@enact/spotlight';

import $L from '../internal/$L';
import DisappearSpotlightDecorator from '../internal/DisappearSpotlightDecorator';

import componentCss from './Scrollbar.less';
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
 * A moonstone-styled HoC for [Scrollbar]{@link moonstone/Scrollable.Scrollbar}.
 *
 * @memberof moonstone/Scrollable
 * @hoc
 * @private
 */
const SpottableScrollbarDecorator = hoc((config, Wrapped) => (
	class SpottableScrollbar extends Component {
		static displayName = 'SpottableScrollbarDecorator'

		static propTypes = /** @lends moonstone/Scrollable.ScrollbarBase.prototype */ {
			/**
			 * Can be called to alert the user for accessibility notifications.
			 *
			 * @type {Function}
			 * @public
			 */
			announce: PropTypes.func,

			/**
			 * The callback function which is called for linking alertThumb function.
			 *
			 * @type {Function}
			 * @private
			 */
			cbAlertThumb: PropTypes.func,

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
			setApiProvider: PropTypes.func
		}

		static defaultProps = {
			cbAlertThumb: nop,
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
			this.initUiScrollbarRef = this.initRef('uiScrollbarRef');

			if (props.setApiProvider) {
				props.setApiProvider(this);
			}
		}

		componentDidMount () {
			this.prevButtonNodeRef = this.uiScrollbarRef.containerRef.children[0];
			this.nextButtonNodeRef = this.uiScrollbarRef.containerRef.children[2];
		}

		componentDidUpdate () {
			this.props.cbAlertThumb();
		}

		componentWillUnmount () {
			this.setIgnoreMode(false); // To remove event handler
		}

		pressed = false

		// component refs
		prevButtonNodeRef = null
		nextButtonNodeRef = null
		uiScrollbarRef = null
		announceRef = null

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
				{vertical} = this.uiScrollbarRef.props,
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
			this.uiScrollbarRef.update(bounds);
			this.updateButtons(bounds);
		}

		showThumb () {
			this.uiScrollbarRef.showThumb();
		}

		startHidingThumb () {
			this.uiScrollbarRef.startHidingThumb();
		}

		isOneOfScrollButtonsFocused = () => Spotlight.getCurrent() === this.prevButtonNodeRef || Spotlight.getCurrent() === this.nextButtonNodeRef

		handlePrevScroll = (ev) => {
			const
				{onPrevScroll} = this.props,
				{vertical} = this.uiScrollbarRef.props;

			onPrevScroll({...ev, isPreviousScrollButton: true, isVerticalScrollBar: vertical});
			if (this.announceRef) {
				this.announceRef.announce(vertical ? $L('UP') : $L('LEFT'));
			}
		}

		handleNextScroll = (ev) => {
			const
				{onNextScroll} = this.props,
				{vertical} = this.uiScrollbarRef.props;

			onNextScroll({...ev, isPreviousScrollButton: false, isVerticalScrollBar: vertical});
			if (this.announceRef) {
				this.announceRef.announce(vertical ? $L('DOWN') : $L('RIGHT'));
			}
		}

		handlePrevHoldPulse = (ev) => {
			const
				{onPrevScroll} = this.props,
				{vertical} = this.uiScrollbarRef.props;

			if (!this.ignoreMode) {
				onPrevScroll({...ev, isPreviousScrollButton: true, isVerticalScrollBar: vertical});
			}
		}

		handleNextHoldPulse = (ev) => {
			const
				{onNextScroll} = this.props,
				{vertical} = this.uiScrollbarRef.props;

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

		initRef (name) {
			return (ref) => {
				this[name] = ref;
			};
		}

		renderChildren = (thumb, vertical) => {
			const
				{disabled, onNextSpotlightDisappear, onPrevSpotlightDisappear} = this.props,
				{prevButtonDisabled, nextButtonDisabled} = this.state,
				prevIcon = preparePrevButton(vertical),
				nextIcon = prepareNextButton(vertical);

			return ([
				<ScrollButton
					key="0"
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
				</ScrollButton>,
				thumb,
				<ScrollButton
					key="2"
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
				</ScrollButton>,
				<Announce key="3" ref={this.initAnnounceRef} />
			]);
		}

		render () {
			return (
				<Wrapped
					{...this.props}
					css={componentCss}
					ref={this.initUiScrollbarRef}
					render={this.renderChildren}
				/>
			);
		}
	}
));
/**
 * A moonstone-styled scroll bar. It is used in [Scrollable]{@link moonstone/Scrollable.Scrollable}.
 *
 * @memberof moonstone/Scrollable
 * @hoc
 * @private
 */
const ScrollbarDecorator = compose(
	ApiDecorator({api: ['isOneOfScrollButtonsFocused', 'showThumb', 'startHidingThumb', 'update']}),
	DisappearSpotlightDecorator(
		{events: {
			onNextSpotlightDisappear: '[data-scroll-button="previous"]',
			onPrevSpotlightDisappear: '[data-scroll-button="next"]'
		}}
	),
	SpottableScrollbarDecorator
);

/**
 * A moonstone-styled scroll bar. It is used in [Scrollable]{@link moonstone/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
const Scrollbar = ScrollbarDecorator(UiScrollbar);

export default Scrollbar;
export {
	Scrollbar,
	ScrollbarDecorator
};
