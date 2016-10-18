/**
 * Exports the {@link module:@enact/moonstone/Scroller/Scrollbar~Scrollbar} component.
 *
 * @module @enact/moonstone/Scroller/Scrollbar
 */

import classNames from 'classnames';
import React, {Component, PropTypes} from 'react';
import ri from '@enact/ui/resolution';
import Spotlight from '@enact/spotlight';
import {startJob, stopJob} from '@enact/core/jobs';

import IconButton from '../IconButton';

import css from './Scrollbar.less';

const
	upDownInfo = {
		prevIcon: 'arrowsmallup',
		nextIcon: 'arrowsmalldown',
		prevButtonClass: css.scrollbarUpButton,
		nextButtonClass: css.scrollbarBottomButton,
		scrollbarClass: css.scrollbarContainerVColumn,
		thumbClass: css.scrollbarVthumb,
		sizeProperty: 'clientHeight',
		matrix: (position, scaledSize, natualSize) => (
			'matrix3d(1, 0, 0, 0, 0,' + (scaledSize / natualSize) + ', 0, 0, 0, 0, 1, 0, 0, ' + position + ', 1, 1)'
		)
	},
	leftRightInfo = {
		prevIcon: 'arrowsmallleft',
		nextIcon: 'arrowsmallright',
		prevButtonClass: css.scrollbarLeftButton,
		nextButtonClass: css.scrollbarRightButton,
		scrollbarClass: css.scrollbarContainerHColumn,
		thumbClass: css.scrollerHthumb,
		sizeProperty: 'clientWidth',
		matrix: (position, scaledSize, natualSize) => (
			'matrix3d(' + (scaledSize / natualSize) + ', 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + position + ', 0, 1, 1)'
		)
	},
	autoHideDelay = 200,
	minThumbSize = ri.scale(4),
	// spotlight
	doc = (typeof window === 'object') ? window.document : {};

/**
 * {@link module:@enact/moonstone/Scroller/Scrollbar~Scrollbar} is a Scrollbar with Moonstone styling.
 * It is used in {@link module:@enact/moonstone/Scrollable~Scrollable}.
 *
 * @class Scrollbar
 * @ui
 * @public
 */
class Scrollbar extends Component {
	static propTypes = {
		className: PropTypes.any,

		/**
		* If `true`, the scrollbar will be oriented vertically.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		isVertical: PropTypes.bool,

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
		onPrevScroll: PropTypes.func
	}

	static defaultProps = {
		isVertical: true,
		onNextScroll: () => {},
		onPrevScroll: () => {}
	}

	prevButtonDisabled = false
	nextButtonDisabled = false
	autoHide = true
	thumbSize = 0
	minThumbSizeRatio = 0
	trackSize = 0
	jobName = ''

	// component refs
	containerRef = null
	thumbRef = null
	prevButtonNodeRef = null
	nextButtonNodeRef = null

	constructor (props) {
		super(props);

		this.scrollInfo = {
			...((props.isVertical) ? upDownInfo : leftRightInfo),
			clickPrevHandler: props.onPrevScroll,
			clickNextHandler: props.onNextScroll
		};

		this.initContainerRef = this.initRef('containerRef');
		this.initThumbRef = this.initRef('thumbRef');
	}

	updateDisabledAttribute = (type, disabled) => {
		const
			buttonDisabled = type + 'ButtonDisabled',
			buttonNodeRef = this[type + 'ButtonNodeRef'];

		if (disabled !== this[buttonDisabled]) {
			this[buttonDisabled] = disabled;
			if (disabled) {
				buttonNodeRef.setAttribute('disabled', true);
			} else {
				buttonNodeRef.removeAttribute('disabled');
			}
		}
	}

	updateButtons = (bounds) => {
		const
			{prevButtonNodeRef, nextButtonNodeRef} = this,
			currentPos = this.props.isVertical ? bounds.scrollTop : bounds.scrollLeft,
			maxPos = this.props.isVertical ? bounds.maxTop : bounds.maxLeft,
			prevButtonDisabled = currentPos <= 0,
			nextButtonDisabled = currentPos >= maxPos;

		this.updateDisabledAttribute('prev', prevButtonDisabled);
		this.updateDisabledAttribute('next', nextButtonDisabled);

		if (prevButtonDisabled && doc.activeElement === prevButtonNodeRef) {
			Spotlight.focus(nextButtonNodeRef);
		} else if (nextButtonDisabled && doc.activeElement === nextButtonNodeRef) {
			Spotlight.focus(prevButtonNodeRef);
		}
	}

	update (bounds) {
		let
			{trackSize, minThumbSizeRatio} = this,
			{clientWidth, clientHeight, scrollWidth, scrollHeight, scrollLeft, scrollTop} = bounds,
			thumbSizeRatioBase = this.props.isVertical ?
				Math.min(1, clientHeight / scrollHeight) :
				Math.min(1, clientWidth / scrollWidth),
			thumbSizeRatio = Math.max(minThumbSizeRatio, thumbSizeRatioBase),
			thumbPositionRatio = this.props.isVertical ?
				scrollTop / (scrollHeight - clientHeight) :
				scrollLeft / (scrollWidth - clientWidth),
			thumbSize, thumbPosition;

		// overscroll cases
		if (thumbPositionRatio < 0) {
			thumbSizeRatio = Math.max(minThumbSizeRatio, thumbSizeRatio + thumbPositionRatio);
			thumbPositionRatio = 0;
		} else if (thumbPositionRatio > 1) {
			thumbSizeRatio = Math.max(minThumbSizeRatio, thumbSizeRatio + (1 - thumbPositionRatio));
			thumbPositionRatio = 1;
		}

		thumbSize = Math.round(thumbSizeRatio * trackSize);
		thumbPositionRatio = thumbPositionRatio * (1 - thumbSizeRatio);
		thumbPosition = Math.round(thumbPositionRatio * trackSize);

		this.thumbRef.style.transform = this.scrollInfo.matrix(thumbPosition, thumbSize, this.thumbSize);
		this.updateButtons(bounds);
	}

	showThumb () {
		this.thumbRef.classList.add(css.thumbShown);
		this.thumbRef.classList.remove(css.thumbHidden);

		this.jobName = this.props.isVertical ? 'vThumbHide' : 'hThumbHide';
		if (this.autoHide) {
			stopJob(this.jobName);
			startJob(this.jobName, () => {
				this.hideThumb();
			}, autoHideDelay);
		}
	}

	hideThumb () {
		this.thumbRef.classList.add(css.thumbHidden);
		this.thumbRef.classList.remove(css.thumbShown);

		this.jobName = this.props.isVertical ? 'vThumbHide' : 'hThumbHide';
	}

	calculateMetrics () {
		this.thumbSize = this.thumbRef[this.scrollInfo.sizeProperty];
		this.trackSize = this.containerRef[this.scrollInfo.sizeProperty];
		this.minThumbSizeRatio = minThumbSize / this.trackSize;
	}

	componentDidMount () {
		const {containerRef} = this;

		this.calculateMetrics();
		this.prevButtonNodeRef = containerRef.children[0];
		this.nextButtonNodeRef = containerRef.children[2];
	}

	shouldComponentUpdate = (nextProps) => (
		// We do not support to change onNextScroll, onPrevScroll props dynamically. So we do not need to check them here.
		(nextProps.className !== this.props.className) ||
		(nextProps.isVertical !== this.props.isVertical)
	)

	componentDidUpdate () {
		this.calculateMetrics();
	}

	componentWillUnmount () {
		stopJob(this.jobName);
	}

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	render () {
		const
			{className} = this.props,
			{prevIcon, nextIcon, scrollbarClass, thumbClass,
			prevButtonClass, nextButtonClass, clickPrevHandler, clickNextHandler} = this.scrollInfo,
			scrollbarClassNames = classNames(className, scrollbarClass);

		return (
			<div ref={this.initContainerRef} className={scrollbarClassNames}>
				<IconButton small className={prevButtonClass} onClick={clickPrevHandler}>
					{prevIcon}
				</IconButton>
				<div ref={this.initThumbRef} className={thumbClass} />
				<IconButton small className={nextButtonClass} onClick={clickNextHandler}>
					{nextIcon}
				</IconButton>
			</div>
		);
	}
}

export default Scrollbar;
export {Scrollbar};
