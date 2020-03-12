import classNames from 'classnames';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React, {forwardRef, memo, useEffect, useImperativeHandle, useRef} from 'react';
import ReactDOM from 'react-dom';

import ri from '../resolution';

import ScrollThumb from './ScrollThumb';

import componentCss from './Scrollbar.module.less';

const thumbHidingDelay = 400; // in milliseconds

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
 * An unstyled base component for a scroll bar.
 *
 * @function ScrollbarBase
 * @memberof ui/useScroll
 * @ui
 * @private
 */
const ScrollbarBase = memo(forwardRef((props, ref) => {
	console.log("ui/ScrollbarBase start==============================");
	// Refs
	const uiScrollbarContainerRef = useRef();
	const thumbRef = useRef();
	const hideThumbJob = useRef(null);
	// Render
	const
		{childRenderer, className, corner, css, minThumbSize, vertical, ...rest} = props,
		containerClassName = classNames(
			className,
			corner && css.corner,
			css.scrollbar,
			vertical ? css.vertical : css.horizontal
		);

	delete rest.clientSize;

	hideThumbJob.current = hideThumbJob.current || new Job(hideThumb, thumbHidingDelay);

	function hideThumb () {
		removeClass(thumbRef.current, css.thumbShown);
	}

	useEffect(() => {
		console.log("ui/ScrollbarBase useEffect1 nothing");
		return () => {
			console.log("ui/ScrollbarBase useEffect1 cleanup hideThumbjob stop");
			hideThumbJob.current.stop();
		};
	}, []);

	useImperativeHandle(ref, () => ({
		getContainerRef: () => (uiScrollbarContainerRef),
		showThumb: () => {
			hideThumbJob.current.stop();
			addClass(thumbRef.current, css.thumbShown);
		},
		startHidingThumb: () => {
			hideThumbJob.current.start();
		},
		update: (bounds) => {
			const
				{clientSize} = props,
				primaryDimenstion = vertical ? 'clientHeight' : 'clientWidth',
				trackSize = clientSize ? clientSize[primaryDimenstion] : uiScrollbarContainerRef.current[primaryDimenstion],
				scrollViewSize = vertical ? bounds.clientHeight : bounds.clientWidth,
				scrollContentSize = vertical ? bounds.scrollHeight : bounds.scrollWidth,
				scrollOrigin = vertical ? bounds.scrollTop : bounds.scrollLeft,
				thumbSizeRatioBase = (scrollViewSize / scrollContentSize),
				scrollThumbPositionRatio = (scrollOrigin / (scrollContentSize - scrollViewSize)),
				scrollThumbSizeRatio = Math.max(ri.scale(minThumbSize) / trackSize, Math.min(1, thumbSizeRatioBase));

			setCSSVariable(thumbRef.current, '--scrollbar-size-ratio', scrollThumbSizeRatio);
			setCSSVariable(thumbRef.current, '--scrollbar-progress-ratio', scrollThumbPositionRatio);
		}
	}));

	console.log("ui/ScrollbarBase render");
	return (
		<div {...rest} className={containerClassName} ref={uiScrollbarContainerRef}>
			{childRenderer({thumbRef})}
		</div>
	);
}));

ScrollbarBase.displayName = 'ui:ScrollbarBase';

ScrollbarBase.propTypes = /** @lends ui/useScroll.Scrollbar.prototype */ {
	/**
	 * The render function for child.
	 *
	 * @type {Function}
	 * @required
	 * @private
	 */
	childRenderer: PropTypes.func.isRequired,

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

ScrollbarBase.defaultProps = {
	corner: false,
	css: componentCss,
	minThumbSize: 18,
	vertical: true
};

/**
 * An unstyled scroll bar.
 *
 * @class Scrollbar
 * @memberof ui/useScroll
 * @ui
 * @private
 */
const Scrollbar = forwardRef((props, ref) => {
	const scrollbarBaseRef = useRef(null);

	useImperativeHandle(ref, () => {
		const {getContainerRef, showThumb, startHidingThumb, update} = scrollbarBaseRef.current;

		return {
			getContainerRef,
			showThumb,
			startHidingThumb,
			update
		};
	}, [scrollbarBaseRef]);

	console.log("ui/Scrollbar render");
	return (
		<ScrollbarBase
			{...props}
			ref={scrollbarBaseRef}
			childRenderer={({thumbRef}) => { // eslint-disable-line react/jsx-no-bind
				return (
					<ScrollThumb
						key="thumb"
						ref={thumbRef}
						vertical={props.vertical}
					/>
				);
			}}
		/>
	);
});

Scrollbar.displayName = 'ui:Scrollbar';

Scrollbar.propTypes = /** @lends ui/useScroll.Scrollbar.prototype */ {
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
	vertical: true
};

export default Scrollbar;
export {
	Scrollbar,
	ScrollbarBase,
	ScrollThumb
};
