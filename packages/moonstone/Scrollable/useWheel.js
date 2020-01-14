import Spotlight from '@enact/spotlight';
import {useEffect, useRef} from 'react';

const useWheel = (instance, props ,{
	childRef,
	isScrollButtonFocused,
	uiRef
}) => {
	// const {

	// } = instance.current;
	// const {

	// } = props;

	const variables = useRef({
		isWheeling: false
	});

	// useEffects

	useEffect(() => {

	}, []);

	// functions

	function handleWheel ({delta}) {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem && !isScrollButtonFocused()) {
			focusedItem.blur();
		}

		if (delta !== 0) {
			variables.current.isWheeling = true;
			if (!props['data-spotlight-container-disabled']) {
				childRef.current.setContainerDisabled(true);
			}
		}
	}

	return {
		handleWheel
	};
}

export {
	useWheel
};
