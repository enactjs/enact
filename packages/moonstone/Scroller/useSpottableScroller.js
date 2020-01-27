import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

import useSpottable from './useSpottable';

/**
 * A Moonstone-styled base component for [Scroller]{@link moonstone/Scroller.Scroller}.
 * In most circumstances, you will want to use the
 * [SpotlightContainerDecorator]{@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}
 * and the Scrollable version, [Scroller]{@link moonstone/Scroller.Scroller}.
 *
 * @function useSpottableScroller
 * @memberof moonstone/Scroller
 * @extends ui/Scroller.useSpottableScroller
 * @ui
 * @public
 */
const useSpottableScroller = (props) => {
	const {uiChildAdapter, uiChildContainerRef} = props;

	// Hooks

	const {calculatePositionOnFocus, focusOnNode, setContainerDisabled} = useSpottable(props, {uiChildAdapter, uiChildContainerRef});

	useEffect(() => {
		props.setChildAdapter({
			calculatePositionOnFocus,
			focusOnNode,
			setContainerDisabled
		});
	}, []);

	// Render

	const propsObject = Object.assign({}, props);

	delete propsObject.dangerouslyContainsInScrollable;
	delete propsObject.onUpdate;
	delete propsObject.scrollAndFocusScrollbarButton;
	delete propsObject.setChildAdapter;
	delete propsObject.spotlightId;
	delete propsObject.uiScrollableAdapter;

	return propsObject;
};

const ScrollerBase = {};

ScrollerBase.displayName = 'ScrollerBase';

ScrollerBase.propTypes = /** @lends moonstone/Scroller.ScrollerBase.prototype */ {
	/**
	 * Called when [Scroller]{@link moonstone/Scroller.Scroller} updates.
	 *
	 * @type {function}
	 * @private
	 */
	onUpdate: PropTypes.func,

	/**
	 * `true` if rtl, `false` if ltr.
	 *
	 * @type {Boolean}
	 * @private
	 */
	rtl: PropTypes.bool,

	/**
	 * Called when [Scroller]{@link moonstone/Scroller.Scroller} should be scrolled
	 * and the focus should be moved to a scrollbar button.
	 *
	 * @type {function}
	 * @private
	 */
	scrollAndFocusScrollbarButton: PropTypes.func,

	/**
	 * The spotlight id for the component.
	 *
	 * @type {String}
	 * @private
	 */
	spotlightId: PropTypes.string
};

export default useSpottableScroller;
export {
	ScrollerBase,
	useSpottableScroller
};
