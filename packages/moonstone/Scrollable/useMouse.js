import {useEffect, useRef} from 'react';

const useMouse = (instance, props ,{uiRef}) => {
	// const {

	// } = instance.current;
	// const {

	// } = props;

	const variables = useRef({

	});

	// useEffects

	useEffect(() => {

	}, []);

	// functions

	function handleFlick ({direction}) {
		const bounds = uiRef.current.getScrollBounds();
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		if ((
			direction === 'vertical' && uiRef.current.canScrollVertically(bounds) ||
			direction === 'horizontal' && uiRef.current.canScrollHorizontally(bounds)
		) && !props['data-spotlight-container-disabled']) {
			childRef.current.setContainerDisabled(true);
		}
	}

	function handleMouseDown (ev) {
		if (isScrollButtonFocused()) {
			ev.preventDefault();
		}

		if (props['data-spotlight-container-disabled']) {
			ev.preventDefault();
		}
	}

	return {
		handleFlick,
		handleMouseDown
	};
}

export {
	useMouse
};
