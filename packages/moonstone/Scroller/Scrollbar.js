import {Announce} from '@enact/ui/AnnounceDecorator';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import Spotlight from '@enact/spotlight';

import $L from '../internal/$L';
import ScrollButton from './ScrollButton';
import ScrollThumb from './ScrollThumb';

import css from './Scrollbar.less';
import flexboxCss from './Flexbox.less';

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
	prepareNextButton = prepareButton(false);

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
	}

	componentDidMount () {
		const {containerRef} = this;

		this.prevButtonNodeRef = containerRef.children[0];
		this.nextButtonNodeRef = containerRef.children[1];
	}

	// component refs
	containerRef = null
	fadableRef = null
	prevButtonNodeRef = null
	nextButtonNodeRef = null

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
			Spotlight.focus(nextButtonNodeRef);
		} else if (shouldDisableNextButton && spotItem === nextButtonNodeRef) {
			Spotlight.focus(prevButtonNodeRef);
		}
	}

	update = (bounds) => {
		this.thumbMovableRef.update(bounds);
		this.updateButtons(bounds);
	}

	showThumb () {
		this.fadableRef.showThumb();
	}

	delayHidingThumb () {
		this.fadableRef.delayHidingThumb();
	}

	hideThumb = () => {
		this.fadableRef.hideThumb();
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

	getScrollThumbMovableRef = (node) => {
		this.thumbMovableRef = node;
	}

	getFadableRef = (node) => {
		this.fadableRef = node;
	}

	render () {
		const
			{className, disabled, onNextScroll, onPrevScroll, vertical} = this.props,
			{prevButtonDisabled, nextButtonDisabled} = this.state,
			scrollbarClassName = classNames(
				className,
				css.scrollbar,
				flexboxCss.flexContainer,
				vertical ? css.vertical : css.horizontal
			),
			prevIcon = preparePrevButton(vertical),
			nextIcon = prepareNextButton(vertical);

		return (
			<div ref={this.initContainerRef} className={scrollbarClassName}>
				<ScrollButton
					className={css.left}
					direction={vertical ? 'up' : 'left'}
					disabled={disabled || prevButtonDisabled}
					onClick={this.handlePrevScroll}
					onHoldPulse={onPrevScroll}
				>
					{prevIcon}
				</ScrollButton>
				<ScrollThumb
					className={classNames(css.bar, flexboxCss.flexItemsStretch)}
					getScrollThumbMovableRef={this.getScrollThumbMovableRef}
					ref={this.getFadableRef}
					vertical={vertical}
				/>
				<ScrollButton
					className={css.left}
					direction={vertical ? 'down' : 'right'}
					disabled={disabled || nextButtonDisabled}
					onClick={this.handleNextScroll}
					onHoldPulse={onNextScroll}
				>
					{nextIcon}
				</ScrollButton>
				<Announce ref={this.initAnnounceRef} />
			</div>
		);
	}
}

export default ScrollbarBase;
export {
	ScrollbarBase as Scrollbar,
	ScrollbarBase
};
