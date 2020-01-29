import useChildAdapter from './useChildAdapter';
import {useScrollable} from './Scrollable';

import classNames from 'classnames';
import warning from 'warning';
import {useRef} from 'react';

const utilDecorateChildProps = (instance) => (childComponentName, props) => {
	if (!instance[childComponentName]) {
		instance[childComponentName] = {};
	}

	if (typeof props === 'object') {
		for (const prop in props) {
			if (prop === 'className') {

				warning(
					Array.isArray(props.className),
					'Unsupported other types for `className` prop except Array'
				);

				instance[childComponentName].className = instance[childComponentName].className ?
					instance[childComponentName].className + ' ' + props.className.join(' ') :
					props.className.join(' ');
			} else {
				warning(
					!instance[childComponentName][prop],
					'Unsupported to push value in the same ' + prop + ' prop.'
				);

				// Override the previous value.
				instance[childComponentName][prop] = props[prop];
			}
		}
	}
};

/**
 * An unstyled component that provides horizontal and vertical scrollbars and makes a render prop element scrollable.
 *
 * @function Scrollable
 * @memberof ui/Scrollable
 * @extends ui/Scrollable.ScrollableBase
 * @ui
 * @private
 */
const useChildPropsDecorator = (props) => {
	// Mutable value

	const scrollableContainerRef = useRef(null);
	const uiChildContainerRef = useRef();
	const horizontalScrollbarRef = useRef();
	const verticalScrollbarRef = useRef();

	// Adapters

	const [uiChildAdapter, setUiChildAdapter] = useChildAdapter();

	// Hooks

	const
		decoratedChildProps = {},
		decorateChildProps = utilDecorateChildProps(decoratedChildProps);

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

	decorateChildProps('scrollableContainerProps', {ref: scrollableContainerRef});
	decorateChildProps('childProps', {uiChildAdapter, uiChildContainerRef});
	decorateChildProps('verticalScrollbarProps', {ref: verticalScrollbarRef});
	decorateChildProps('horizontalScrollbarProp', {ref: horizontalScrollbarRef});

	// Return

	return {
		...decoratedChildProps,
		childWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	};
};

export default useChildPropsDecorator;
export {
	useChildPropsDecorator,
	utilDecorateChildProps
};
