import {getCurrent} from '@enact/spotlight';
import {useRef} from 'react';

const useEventWheel = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {
		childRef,
	} = instances;
	const {
		isScrollButtonFocused,
	} = dependencies;
	const {
		setContainerDisabled
	} = (childRef.current || {});

	/*
	 * Instance
	 */

	const variables = useRef({
		isWheeling: false
	});

	/*
	 * Functions
	 */

	function handleWheel ({delta}) {
		const focusedItem = getCurrent();

		if (focusedItem && !isScrollButtonFocused()) {
			focusedItem.blur();
		}

		if (delta !== 0) {
			variables.current.isWheeling = true;
			if (!props['data-spotlight-container-disabled']) {
				setContainerDisabled(true);
			}
		}
	}

	/*
	 * Return
	 */

	return {
		handleWheel,
		isWheeling: variables.current.isWheeling
	};
};

export default useEventWheel;
export {
	useEventWheel
};
