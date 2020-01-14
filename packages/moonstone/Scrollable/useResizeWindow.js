import Spotlight from '@enact/spotlight';
import {useEffect, useRef} from 'react';

const useResizeWindow = () => {
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

	function handleResizeWindow () {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}
	}

	return {
		handleResizeWindow
	};
}

export {
	useResizeWindow
};
