import useEvent from '@enact/ui/Scrollable/useEvent';
import {useRef} from 'react';

const useEventKey = () => {
	// Mutable value

	const variables = useRef({
		fn: null
	});

	// Functions

	function addGlobalKeyDownEventListener (fn) {
		variables.current.fn = fn;
		useEvent('keydown').addEventListener(document, variables.current.fn, {capture: true});
	}

	function removeGlobalKeyDownEventListener () {
		useEvent('keydown').removeEventListener(document, variables.current.fn, {capture: true});
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
