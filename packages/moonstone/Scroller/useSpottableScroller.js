import PropTypes from 'prop-types';
import {useEffect} from 'react';

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
	}, [calculatePositionOnFocus, focusOnNode, props, props.setChildAdapter, setContainerDisabled]);

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

export default useSpottableScroller;
export {
	useSpottableScroller
};
