import utilEvent from '@enact/ui/Scrollable/utilEvent';
import {useRef} from 'react';

const useEventKey = () => {
	// Mutable value

	const mutableRef = useRef({
		fn: null
	});

	// Functions

	function addGlobalKeyDownEventListener (fn) {
		mutableRef.current.fn = fn;
		utilEvent('keydown').addEventListener(document, mutableRef.current.fn, {capture: true});
	}

	function removeGlobalKeyDownEventListener () {
		utilEvent('keydown').removeEventListener(document, mutableRef.current.fn, {capture: true});
		mutableRef.current.fn = null;
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
