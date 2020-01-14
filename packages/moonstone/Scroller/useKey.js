// scrollerNode -> containerNode
const useKey = (instance, {}, {
	handlerGlobalKeyDownCB
}) => {
	const {
		uiRefCurrent
	} = instance.current;

	/**
	 * Handle global `onKeyDown` event
	 */

	function handleGlobalKeyDown () {
		handlerGlobalKeyDownCB();
	}

	function addGlobalKeyDownEventListener () {
		document.addEventListener('keydown', handleGlobalKeyDown, {capture: true});
	}

	function removeGlobalKeyDownEventListener () {
		document.removeEventListener('keydown', handleGlobalKeyDown, {capture: true});
	}

	return {
		addGlobalKeyDownEventListener,
		removeGlobalKeyDownEventListener
	};
};

export {
	useKey
};
