import classNames from 'classnames';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import {memo, useEffect, useRef} from 'react';

import ri from '../resolution';

import ScrollbarTrack from './ScrollbarTrack';

import * as componentCss from './Scrollbar.module.less';

const scrollbarTrackHidingDelay = 900; // 900ms + 100ms(fade out duration) = 1000ms.

const addClass = (element, className) => {
	if (element) {
		element.classList.add(className);
	}
};

const removeClass = (element, className) => {
	if (element) {
		element.classList.remove(className);
	}
};

/*
 * Set CSS Variable value.
 *
 * @method
 * @param {Node} element - Node.
 * @param {String} variable - CSS Variable property.
 * @param {String} value - CSS Variable value.
 */
const setCSSVariable = (element, variable, value) => {
	element.style.setProperty(variable, value);
};

/**
 * A custom hook that passes scrollbar behavior information as its render prop.
 *
 * @class
 * @memberof ui/useScroll
 * @ui
 * @private
 */
const useScrollbar = (props) => {
	const {className, clientSize, corner, css, minThumbSize, scrollbarHandle, vertical, ...rest} = props;
	// Refs
	const scrollbarContainerRef = useRef();
	const scrollbarTrackRef = useRef();
	const hideScrollbarTrackJob = useRef(null);

	hideScrollbarTrackJob.current = hideScrollbarTrackJob.current || new Job(hideScrollbarTrack, scrollbarTrackHidingDelay);

	function hideScrollbarTrack () {
		removeClass(scrollbarTrackRef.current, css.scrollbarTrackShown);
	}

	useEffect(() => {
		return () => {
			hideScrollbarTrackJob.current.stop();
		};
	}, []);

	function getContainerRef () {
		return scrollbarContainerRef;
	}

	function showScrollbarTrack () {
		hideScrollbarTrackJob.current.stop();
		addClass(scrollbarTrackRef.current, css.scrollbarTrackShown);
	}

	function startHidingScrollbarTrack () {
		hideScrollbarTrackJob.current.start();
	}

	function update (bounds) {
		const
			primaryDimension = vertical ? 'clientHeight' : 'clientWidth',
			trackSize = clientSize ? clientSize[primaryDimension] : scrollbarContainerRef.current[primaryDimension],
			scrollViewSize = vertical ? bounds.clientHeight : bounds.clientWidth,
			scrollContentSize = vertical ? bounds.scrollHeight : bounds.scrollWidth,
			scrollOrigin = vertical ? bounds.scrollTop : bounds.scrollLeft,
			scrollbarThumbSizeRatioBase = scrollContentSize !== 0 ? (scrollViewSize / scrollContentSize) : 1,
			scrollbarThumbProgressRatio = (scrollContentSize - scrollViewSize) !== 0 ? (scrollOrigin / (scrollContentSize - scrollViewSize)) : 0,
			scrollbarThumbSizeRatio = trackSize !== 0 ? Math.max(ri.scale(minThumbSize) / trackSize, Math.min(1, scrollbarThumbSizeRatioBase)) : 1;

		setCSSVariable(scrollbarTrackRef.current, '--scrollbar-thumb-size-ratio', scrollbarThumbSizeRatio);
		setCSSVariable(scrollbarTrackRef.current, '--scrollbar-thumb-progress-ratio', scrollbarThumbProgressRatio);
	}

	if (scrollbarHandle) {
		scrollbarHandle.current = {
			getContainerRef,
			showScrollbarTrack,
			startHidingScrollbarTrack,
			update
		};
	}

	return {
		restProps: rest,
		scrollbarProps: {
			className: classNames(
				className,
				corner ? css.corner : null,
				css.scrollbar,
				vertical ? css.vertical : css.horizontal
			),
			ref: scrollbarContainerRef
		},
		scrollbarTrackProps: {
			ref: scrollbarTrackRef,
			vertical
		}
	};
};

/**
 * An unstyled scroll bar.
 *
 * @class Scrollbar
 * @memberof ui/useScroll
 * @ui
 * @private
 */
const Scrollbar = memo(({corner = false, css = componentCss, minThumbSize = 18, vertical = true, ...rest}) => {
	const props = {corner, css, minThumbSize, vertical, ...rest};
	const {
		restProps,
		scrollbarProps,
		scrollbarTrackProps
	} = useScrollbar(props);

	return (
		<div {...restProps} {...scrollbarProps}>
			<ScrollbarTrack {...scrollbarTrackProps} />
		</div>
	);
});

Scrollbar.displayName = 'ui:Scrollbar';

Scrollbar.propTypes = /** @lends ui/useScroll.Scrollbar.prototype */ {
	/**
	 * Client size of the container; valid values are an object that has `clientWidth` and `clientHeight`.
	 *
	 * @type {Object}
	 * @property {Number}    clientHeight    The client height of the list.
	 * @property {Number}    clientWidth    The client width of the list.
	 * @public
	 */
	clientSize: PropTypes.shape({
		clientHeight: PropTypes.number.isRequired,
		clientWidth: PropTypes.number.isRequired
	}),

	/**
	 * Adds a corner between the vertical and horizontal scrollbars.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	corner: PropTypes.bool,

	/**
	 * Customizes the component by mapping the supplied collection of CSS class names to the
	 * corresponding internal elements and states of this component.
	 *
	 * The following classes are supported:
	 *
	 * * `scrollbar` - The scrollbar component class
	 *
	 * @type {Object}
	 * @public
	 */
	css: PropTypes.object,

	/**
	 * The minimum size of the thumb.
	 *
	 * This value will be scaled.
	 *
	 * @type {number}
	 * @public
	 */
	minThumbSize: PropTypes.number,

	/**
	 * If `true`, the scrollbar will be oriented vertically.
	 *
	 * @type {Boolean}
	 * @default true
	 * @public
	 */
	vertical: PropTypes.bool
};

export default Scrollbar;
export {
	Scrollbar,
	Scrollbar as ScrollbarBase,
	ScrollbarTrack,
	useScrollbar
};
