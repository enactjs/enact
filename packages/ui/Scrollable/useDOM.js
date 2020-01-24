import Spotlight, {} from '@enact/spotlight';
import {useEffect, useRef} from 'react';

// useEvent
// https://github.com/facebook/react/pull/17651

const useDOM = () => {
	/*
	 * Functions
	 */

	function dangerouslyContains (ref, target) {
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
	function dangerously_getBoundingClientRect () {}
	function dangerously_dataset () {}
	function dangerously_GetRect () {}
	function dangerously_setAttribute () {}
	function dangerously_removeAttribute () {}
	const dangerously_scrollLeft = 0;
	const dangerously_scrollTop = 0;

	/*
	 * Return
	 */

	return {
		dangerouslyContains,
		dangerously_getBoundingClientRect,
		dangerously_dataset,
		dangerously_GetRect,
		dangerously_setAttribute,
		dangerously_removeAttribute,
		dangerously_scrollLeft,
		dangerously_scrollTop
	};
};

export default useDOM;
export {
	useDOM
};
