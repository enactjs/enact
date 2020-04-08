import classNames from 'classnames';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {memo, useEffect, useRef} from 'react';
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
			primaryDimenstion = vertical ? 'clientHeight' : 'clientWidth',
			trackSize = clientSize ? clientSize[primaryDimenstion] : scrollbarContainerRef.current[primaryDimenstion],
			scrollViewSize = vertical ? bounds.clientHeight : bounds.clientWidth,
			scrollContentSize = vertical ? bounds.scrollHeight : bounds.scrollWidth,
			scrollOrigin = vertical ? bounds.scrollTop : bounds.scrollLeft,
			scrollbarThumbSizeRatioBase = (scrollViewSize / scrollContentSize),
			scrollbarThumbProgressRatio = (scrollOrigin / (scrollContentSize - scrollViewSize)),
			scrollbarThumbSizeRatio = Math.max(ri.scale(minThumbSize) / trackSize, Math.min(1, scrollbarThumbSizeRatioBase));

		setCSSVariable(scrollbarTrackRef.current, '--scrollbar-thumb-size-ratio', scrollbarThumbSizeRatio);
		setCSSVariable(scrollbarTrackRef.current, '--scrollbar-thumb-progress-ratio', scrollbarThumbProgressRatio);
	}

	scrollbarHandle.current = {
		getContainerRef,
		showScrollbarTrack,
		startHidingScrollbarTrack,
		update
	};

	return {
		restProps: rest,
		scrollbarHandle,
		scrollbarProps: {
			className: classNames(
				className,
				{[corner]: css.corner},
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
const Scrollbar = memo((props) => {
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
