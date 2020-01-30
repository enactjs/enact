import {onWindowReady} from '@enact/core/snapshot';
import Spotlight from '@enact/spotlight';
import {constants} from '@enact/ui/Scrollable/Scrollable';
import utilDOM from '@enact/ui/Scrollable/utilDOM';
import utilEvent from '@enact/ui/Scrollable/utilEvent';
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
				if (utilDOM().containsDangerously(value, elem)) {
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

const useEventMonitor = (props, instances, context) => {
	const {scrollableContainerRef} = instances;
	const {lastPointer: lastPointerProp, scrollByPageOnPointerMode} = context;

	// Mutable value

	const variables = useRef({pageKeyHandlerObj: {scrollByPageOnPointerMode}});

	lastPointer = lastPointerProp;

	// Hooks

	useEffect(() => {
		const setMonitorEventTarget = (target) => {
			scrollables.set(variables.current.pageKeyHandlerObj, target);
		};

		const deleteMonitorEventTarget = () => {
			scrollables.delete(variables.current.pageKeyHandlerObj);
		};

		setMonitorEventTarget(scrollableContainerRef.current);

		return () => {
			// TODO: Replace `this` to something.
			deleteMonitorEventTarget();
		};
	}, [scrollableContainerRef]);
};

onWindowReady(() => {
	utilEvent('mousemove').addEventListener(document, pointerTracker);
	utilEvent('keydown').addEventListener(document, pageKeyHandler);
});

export default useEventMonitor;
export {
	useEventMonitor
};
