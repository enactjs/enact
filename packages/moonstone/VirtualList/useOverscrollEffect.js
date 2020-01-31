import {useRef} from 'react';

const useOverscrollEffect = () => {
	// Mutable value

	const variables = useRef({
		isWrappedBy5way: false
	});

	// Functions

	function setWrappedBy5way (bool) {
		variables.current.isWrappedBy5way = bool;
	}

	// Return

	return [variables.current.isWrappedBy5way, setWrappedBy5way];
};

export default useOverscrollEffect;
export {
	useOverscrollEffect
};
