import Spotlight from '@enact/spotlight';
import {useEffect, useRef} from 'react';

const useTouch = (instance, props , {
	isScrollButtonFocused
}) => {
	// const {

	// } = instance.current;
	// const {

	// } = props;

	// useEffects

	useEffect(() => {

	}, []);

	// functions

	function handleTouchStart () {
		const focusedItem = Spotlight.getCurrent();

		if (!Spotlight.isPaused() && focusedItem && !isScrollButtonFocused()) {
			focusedItem.blur();
		}
	}

	return {
		handleTouchStart
	};
}

export {
	useTouch
};
