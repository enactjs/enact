import {useRef} from 'react';

import useChildAdapter from './useChildAdapter';
import useDecorateChildProps from './useDecorateChildProps';
import {useScrollable} from './Scrollable';

/**
 * An unstyled component that provides horizontal and vertical scrollbars and makes a render prop element scrollable.
 *
 * @function Scrollable
 * @memberof ui/Scrollable
 * @extends ui/Scrollable.ScrollableBase
 * @ui
 * @private
 */
const useScrollableComponentizable = (props) => {
	// Refs

	const scrollableContainerRef = useRef(null);
	const uiChildContainerRef = useRef();
	const horizontalScrollbarRef = useRef();
	const verticalScrollbarRef = useRef();

	// Adapters

	const [uiChildAdapter, setUiChildAdapter] = useChildAdapter();

	// Hooks

	const
		decoratedChildProps = {},
		decorateChildProps = useDecorateChildProps(decoratedChildProps);

	const {
		childWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	} = useScrollable({
		...props,
		decorateChildProps,
		get horizontalScrollbarRef () {
			return horizontalScrollbarRef;
		},
		overscrollEffectOn: props.overscrollEffectOn || { // FIXME
			arrowKey: false,
			drag: false,
			pageKey: false,
			scrollbarButton: false,
			wheel: true
		},
		scrollableContainerRef,
		setUiChildAdapter,
		type: props.type || 'JS', // FIXME
		uiChildAdapter,
		uiChildContainerRef,
		get verticalScrollbarRef () {
			return verticalScrollbarRef;
		}
	});

	decorateChildProps

	decorateChildProps('scrollableContainerProps', {ref: scrollableContainerRef});
	decorateChildProps('verticalScrollbarProps', {ref: verticalScrollbarRef});
	decorateChildProps('horizontalScrollbarProp', {ref: horizontalScrollbarRef});

	return {
		...decoratedChildProps,
		childWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	};
};

export default useScrollableComponentizable;
