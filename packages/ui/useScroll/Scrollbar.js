import classNames from 'classnames';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {forwardRef, memo, useEffect, useImperativeHandle, useRef} from 'react';
import ReactDOM from 'react-dom';

import ri from '../resolution';

import ScrollbarTrack from './ScrollbarTrack';

import componentCss from './Scrollbar.module.less';

const scrollbarTrackHidingDelay = 400; // in milliseconds

const addClass = (element, className) => {
	ReactDOM.findDOMNode(element).classList.add(className); // eslint-disable-line react/no-find-dom-node
};

const removeClass = (element, className) => {
	ReactDOM.findDOMNode(element).classList.remove(className); // eslint-disable-line react/no-find-dom-node
};

/*
 * Set CSS Varaible value.
 *
 * @method
 * @param {Node} element - Node.
 * @param {String} variable - CSS Variable property.
 * @param {String} value - CSS Variable value.
 */
const setCSSVariable = (element, variable, value) => {
	ReactDOM.findDOMNode(element).style.setProperty(variable, value); // eslint-disable-line react/no-find-dom-node
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
	const {className, clientSize, corner, css, minThumbSize, vertical, ...scrollbarProps} = props;
	// Refs
	const uiScrollbarContainerRef = useRef();
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
		return uiScrollbarContainerRef;
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
			primaryDimenstion = vertical ? 'clientHeight' : 'clientWidth',
			trackSize = clientSize ? clientSize[primaryDimenstion] : uiScrollbarContainerRef.current[primaryDimenstion],
			scrollViewSize = vertical ? bounds.clientHeight : bounds.clientWidth,
			scrollContentSize = vertical ? bounds.scrollHeight : bounds.scrollWidth,
			scrollOrigin = vertical ? bounds.scrollTop : bounds.scrollLeft,
			scrollbarSizeRatioBase = (scrollViewSize / scrollContentSize),
			scrollbarProgressRatio = (scrollOrigin / (scrollContentSize - scrollViewSize)),
			scrollbarSizeRatio = Math.max(ri.scale(minThumbSize) / trackSize, Math.min(1, scrollbarSizeRatioBase));

		setCSSVariable(scrollbarTrackRef.current, '--scrollbar-size-ratio', scrollbarSizeRatio);
		setCSSVariable(scrollbarTrackRef.current, '--scrollbar-progress-ratio', scrollbarProgressRatio);
	}

	return {
		className: classNames(
			className,
			{[corner]: css.corner},
			css.scrollbar,
			vertical ? css.vertical : css.horizontal
		),
		getContainerRef,
		scrollbarProps,
		scrollbarTrackRef,
		showScrollbarTrack,
		startHidingScrollbarTrack,
		uiScrollbarContainerRef,
		update,
		vertical
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
const Scrollbar = memo(forwardRef((props, ref) => {
	const {
		className,
		getContainerRef,
		scrollbarProps,
		scrollbarTrackRef,
		showScrollbarTrack,
		startHidingScrollbarTrack,
		uiScrollbarContainerRef,
		update,
		vertical
	} = useScrollbar(props);

	useImperativeHandle(ref, () => ({
		getContainerRef,
		showScrollbarTrack,
		startHidingScrollbarTrack,
		update
	}));

	return (
		<div {...scrollbarProps} className={className} ref={uiScrollbarContainerRef}>
			<ScrollbarTrack
				ref={scrollbarTrackRef}
				vertical={vertical}
			/>
		</div>
	);
}));

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
	 * If `true`, add the corner between vertical and horizontal scrollbars.
	 *
	 * @type {Booelan}
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
	 * This value will be applied ri.scale.
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

Scrollbar.defaultProps = {
	corner: false,
	css: componentCss,
	minThumbSize: 18,
	vertical: true
};

export default Scrollbar;
export {
	Scrollbar,
	Scrollbar as ScrollbarBase,
	ScrollbarTrack,
	useScrollbar
};
