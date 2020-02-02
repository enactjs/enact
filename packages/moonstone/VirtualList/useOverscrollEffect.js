import {useRef} from 'react';

const useOverscrollEffect = () => {
	// Mutable value

	const mutableRef = useRef({
		isWrappedBy5way: false
	});

	// Functions

	function setWrappedBy5way (bool) {
		mutableRef.current.isWrappedBy5way = bool;
	}

	// Return

	return [mutableRef.current.isWrappedBy5way, setWrappedBy5way];
};

export default useOverscrollEffect;
export {
	useOverscrollEffect
};
