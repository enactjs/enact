import {onWindowReady} from '@enact/core/snapshot';
import Spotlight from '@enact/spotlight';
import {useEffect, useRef} from 'react';

/*
 * Track the last position of the pointer to check if a list should scroll by
 * page up/down keys when the pointer is on a list without any focused node.
 * `keydown` event does not occur if there is no focus on the node and
 * its descendants, we add `keydown` handler to `document` also.
 */
const
	lastPointer = {x: 0, y: 0},
	scrollables = new Map();
const pointerTracker = (ev) => {
	lastPointer.x = ev.clientX;
	lastPointer.y = ev.clientY;
};
// An app could have lists and/or scrollers more than one,
// so we should test all of them when page up/down key is pressed.
const pageKeyHandler = (ev) => {
	const {keyCode} = ev;
	if (Spotlight.getPointerMode() && !Spotlight.getCurrent() && (isPageUp(keyCode) || isPageDown(keyCode))) {
		const
			{x, y} = lastPointer,
			elem = document.elementFromPoint(x, y);

		if (elem) {
			for (const [key, value] of scrollables) {
				if (value.contains(elem)) {
					/* To handle page keys in nested scrollable components,
					* break the loop only when `scrollByPageOnPointerMode` returns `true`.
					* This approach assumes that an inner scrollable component is
					* mounted earlier than an outer scrollable component.
					*/
					if (key.scrollByPageOnPointerMode(ev)) {
						break;
					}
				}
			}
		}
	}
};

const useEventMonitor = ({}, instances) => {
	/*
	 * Dependencies
	 */

	const {uiRef} = instances;

	/*
	 * useEffects
	 */

	useEffect(() => {
		// componentDidMount
		// TODO: Replace `this` to something.
		setMonitorEventTarget(uiRef.current.containerRef.current);

		// componentWillUnmount
		return () => {
			// TODO: Replace `this` to something.
			deleteMonitorEventTarget();
		};
	}, []);	// TODO : Handle exhaustive-deps ESLint rule.

	/*
	 * Functions
	 */

	function setMonitorEventTarget (target) {
		// TODO: Replace `this` to something.
		scrollables.set(/* this */null, target);
	}

	function deleteMonitorEventTarget() {
		scrollables.delete(/* this */ null);
	}
};

onWindowReady(() => {
	document.addEventListener('mousemove', pointerTracker);
	document.addEventListener('keydown', pageKeyHandler);
});

export default useEventMonitor;
export {
	useEventMonitor
};
