import {onWindowReady} from '@enact/core/snapshot';
import Spotlight from '@enact/spotlight';
import {constants} from '@enact/ui/Scrollable/Scrollable';
import {useEffect, useRef} from 'react';

const {isPageDown, isPageUp} = constants;

/*
 * Track the last position of the pointer to check if a list should scroll by
 * page up/down keys when the pointer is on a list without any focused node.
 * `keydown` event does not occur if there is no focus on the node and
 * its descendants, we add `keydown` handler to `document` also.
 */
const scrollables = new Map();
let lastPointer = {x: 0, y: 0};
// An app could have lists and/or scrollers more than one,
// so we should test all of them when page up/down key is pressed.
const pointerTracker = (ev) => {
	lastPointer.x = ev.clientX;
	lastPointer.y = ev.clientY;
};
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

const useEventMonitor = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {uiScrollableAdapter} = instances;
	const {lastPointer: lastPointerProp, scrollByPageOnPointerMode} = dependencies;

	/*
	 * Instance
	 */

	const variables = useRef({pageKeyHandlerObj: {scrollByPageOnPointerMode}});

	lastPointer = lastPointerProp;

	/*
	 * Hooks
	 */

	useEffect(() => {
		function setMonitorEventTarget (target) {
			scrollables.set(variables.pageKeyHandlerObj, target);
		}

		function deleteMonitorEventTarget () {
			scrollables.delete(variables.pageKeyHandlerObj);
		}

		setMonitorEventTarget(uiScrollableAdapter.current.containerRef.current);

		return () => {
			// TODO: Replace `this` to something.
			deleteMonitorEventTarget();
		};
	}, [uiScrollableAdapter]);
};

onWindowReady(() => {
	document.addEventListener('mousemove', pointerTracker);
	document.addEventListener('keydown', pageKeyHandler);
});

export default useEventMonitor;
export {
	useEventMonitor
};
