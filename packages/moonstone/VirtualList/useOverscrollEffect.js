import {useRef} from 'react';

const useOverscrollEffect = () => {
	/*
	 * Instance
	 */

	const variables = useRef({
		isWrappedBy5way: false
	});

	/*
	 * Functions
	 */

	function setWrappedBy5way (bool) {
		variables.current.isWrappedBy5way = bool;
	}

	return [variables.current.isWrappedBy5way, setWrappedBy5way];
};

export default useOverscrollEffect;
export {
	useOverscrollEffect
};
