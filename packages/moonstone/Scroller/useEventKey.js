import {useRef} from 'react';

const useEventKey = () => {
	// Instance

	const variables = useRef({
		fn: null
	});

	// Functions

	function addGlobalKeyDownEventListener (fn) {
		variables.current.fn = fn;
		document.addEventListener('keydown', variables.current.fn, {capture: true});
	}

	function removeGlobalKeyDownEventListener () {
		document.removeEventListener('keydown', variables.current.fn, {capture: true});
		variables.current.fn = null;
	}

	// Return

	return {
		addGlobalKeyDownEventListener,
		removeGlobalKeyDownEventListener
	};
};

export default useEventKey;
export {
	useEventKey
};
