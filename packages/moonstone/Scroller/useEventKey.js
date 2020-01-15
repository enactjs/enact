const useEventKey = ({}, {}, dependencies) => {
	/*
	 * Dependencies
	 */

	const {
		handlerGlobalKeyDownCB
	} = dependencies;

	/*
	 * Functions
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

	/*
	 * Retur
	 */

	return {
		addGlobalKeyDownEventListener,
		removeGlobalKeyDownEventListener
	};
};

export default useEventKey;
export {
	useEventKey
};
