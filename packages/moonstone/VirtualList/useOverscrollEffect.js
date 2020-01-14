import {useRef} from 'react';

const useOverscrollEffect = () => {
	const variables = useRef({isWrappedBy5way: false});

	function setWrappedBy5way (bool) {
		variables.current.isWrappedBy5way = bool;
	}

	return [variables.current.isWrappedBy5way, setWrappedBy5way];
};

export {
	useOverscrollEffect
};
