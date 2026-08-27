import classNames from 'classnames';
import {checkPropTypes, Job} from '@enact/core/util';
import {memo, MutableRefObject, RefObject, useCallback, useEffect, useLayoutEffect, useRef} from 'react';

import ri from '../resolution';

import ScrollbarTrack from './ScrollbarTrack';

import componentCss from './Scrollbar.module.less';
import {CallbackObject} from '../types';

export interface ScrollbarProps /** @lends ui/useScroll.Scrollbar.prototype */ {
	/**
	 * Client size of the container; valid values are an object that has `clientWidth` and `clientHeight`.
	 *
	 * @type {Object}
	 * @property {Number}    clientHeight    The client height of the list.
	 * @property {Number}    clientWidth    The client width of the list.
	 * @public
	 */
	clientSize: {clientHeight: number, clientWidth: number},

	/**
	 * Adds a corner between the vertical and horizontal scrollbars.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	corner: boolean,

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
	css: CallbackObject<string>,

	/**
	 * The minimum size of the thumb.
	 *
	 * This value will be scaled.
	 *
	 * @type {number}
	 * @public
	 */
	minThumbSize: number,

	/**
	 * If `true`, the scrollbar will be oriented vertically.
	 *
	 * @type {Boolean}
	 * @default true
	 * @public
	 */
	vertical: boolean
}

export interface UseScrollbarProps {
	className?: string,
	clientSize: {clientHeight: number, clientWidth: number},
	corner: boolean,
	css: CallbackObject<string>,
	minThumbSize: number,
	scrollbarHandle?: RefObject<CallbackObject>,
	vertical: boolean
}

const scrollbarTrackHidingDelay = 900; // 900ms + 100ms(fade out duration) = 1000ms.

const addClass = (element: HTMLDivElement, className: string) => {
	if (element) {
		element.classList.add(className);
	}
};

const removeClass = (element: HTMLDivElement, className: string) => {
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
const setCSSVariable = (element: HTMLDivElement, variable: string, value: string | null) => {
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
const useScrollbar = (props: UseScrollbarProps) => {
	const {className, clientSize, corner, css, minThumbSize, scrollbarHandle: scrollbarHandleRef, vertical, ...rest} = props;
	// Refs
	const scrollbarContainerRef = useRef<HTMLDivElement>(null);
	const scrollbarTrackRef = useRef<HTMLDivElement>(null);
	const hideScrollbarTrackJob = useRef<Job>(null);

	const hideScrollbarTrack = useCallback(() => {
		if (scrollbarTrackRef.current) {
			removeClass(scrollbarTrackRef.current, css.scrollbarTrackShown);
		}
	}, [css.scrollbarTrackShown]);

	const getContainerRef = useCallback(() => {
		return scrollbarContainerRef;
	}, []);

	const showScrollbarTrack = useCallback(() => {
		hideScrollbarTrackJob.current?.stop();

		if (scrollbarTrackRef.current) {
			addClass(scrollbarTrackRef.current, css.scrollbarTrackShown);
		}
	}, [css.scrollbarTrackShown]);

	const startHidingScrollbarTrack = useCallback(() => {
		hideScrollbarTrackJob.current?.start();
	}, []);

	const update = useCallback((bounds: HTMLDivElement) => {
		const
			primaryDimension = vertical ? 'clientHeight' : 'clientWidth',
			trackSize = (clientSize ? clientSize[primaryDimension] : scrollbarContainerRef.current?.[primaryDimension]) || 1,
			scrollViewSize = vertical ? bounds.clientHeight : bounds.clientWidth,
			scrollContentSize = vertical ? bounds.scrollHeight : bounds.scrollWidth,
			scrollOrigin = vertical ? bounds.scrollTop : bounds.scrollLeft,
			scrollbarThumbSizeRatioBase = scrollContentSize !== 0 ? (scrollViewSize / scrollContentSize) : 1,
			scrollbarThumbProgressRatio = (scrollContentSize - scrollViewSize) !== 0 ? (scrollOrigin / (scrollContentSize - scrollViewSize)) : 0,
			scrollbarThumbSizeRatio = trackSize !== 0 ? Math.max(ri.scale(minThumbSize) / trackSize, Math.min(1, scrollbarThumbSizeRatioBase)) : 1;

		if (scrollbarTrackRef.current) {
			setCSSVariable(scrollbarTrackRef.current, '--scrollbar-thumb-size-ratio', `${scrollbarThumbSizeRatio}`);
			setCSSVariable(scrollbarTrackRef.current, '--scrollbar-thumb-progress-ratio', `${scrollbarThumbProgressRatio}`);
		}
	}, [clientSize, minThumbSize, vertical]);

	useLayoutEffect(() => {
		if (scrollbarHandleRef) {
			scrollbarHandleRef.current = {
				getContainerRef,
				showScrollbarTrack,
				startHidingScrollbarTrack,
				update
			};
		}

		hideScrollbarTrackJob.current = hideScrollbarTrackJob.current || new Job(hideScrollbarTrack, scrollbarTrackHidingDelay);
	}, [getContainerRef, hideScrollbarTrack, scrollbarHandleRef, showScrollbarTrack, startHidingScrollbarTrack, update]);

	useEffect(() => {
		return () => {
			if (hideScrollbarTrackJob.current) {
				hideScrollbarTrackJob.current.stop();
			}
		};
	}, []);

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
const Scrollbar = memo(({corner = false, css = componentCss, minThumbSize = 18, vertical = true, ...rest}: ScrollbarProps) => {
	const props = {corner, css, minThumbSize, vertical, ...rest};
	const {
		restProps,
		scrollbarProps,
		scrollbarTrackProps
	} = useScrollbar(props);
	checkPropTypes(Scrollbar, props);

	return (
		<div {...restProps} {...scrollbarProps}>
			<ScrollbarTrack {...scrollbarTrackProps} />
		</div>
	);
});

Scrollbar.displayName = 'ui:Scrollbar';

export default Scrollbar;
export {
	Scrollbar,
	Scrollbar as ScrollbarBase,
	ScrollbarTrack,
	useScrollbar
};
