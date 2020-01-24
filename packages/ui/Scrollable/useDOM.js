import Spotlight, {} from '@enact/spotlight';
import {useEffect, useRef} from 'react';

// At the end, wes should not use DOM APIs as well as the APIs in the `useDOM`. If we use them, we have to try to remove them first if possible.

const useDOM = () => {
	/*
	 * Functions
	 */

	function containsDangerously (ref, target) {
		if (!target) {
			return false;
		} else if (ref.current) {
			return ref.current.contains(target)
		} else if (ref) {
			return ref.contains(target);
		}

		return false;
	}

	// TBD
	// Need to define functions for the following DOM APIs
	// getBoundingClientRect
	// dataset.spotlightId
	// getRect
	// setAttribute
	// removeAttribute
	// scrollLeft
	// scrollTop
	function datasetDangerously () {}
	function getBoundingClientRectDangerously () {}
	function getRectDangerously () {}
	function removeAttributeDangerously () {}
	function setAttributeDangerously () {}
	const scrollLeftDangerously = 0;
	const scrollTopDangerously = 0;

	/*
	 * Return
	 */

	return {
		containsDangerously,
		datasetDangerously,
		getBoundingClientRectDangerously,
		getRectDangerously,
		removeAttributeDangerously,
		setAttributeDangerously,
		scrollLeftDangerously,
		scrollTopDangerously
	};
};

export default useDOM;
export {
	useDOM
};
