import {handle, preventDefault, returnsTrue, stop} from '@enact/core/handle';

let active;
let capturedDown = false;

// if there is a focused input (there should be) and the target is not the input
const shouldCapture = ({target}) => active && target !== active;
const isCapturing = () => capturedDown && active;
const setCapturing = (capturing) => returnsTrue(() => (capturedDown = capturing));

const handlePointerDown = handle(
	shouldCapture,				// If we should capture the click
	preventDefault,				// prevent the down event bubbling
	stop,						// (and stop propagation to support touch)
	setCapturing(true)			// and flag that we've started capturing a down event
);

const handlePointerUp = handle(
	isCapturing,				// if a down event was captured
	preventDefault,				// prevent the up event bubbling
	stop						// (and stop propagation to support touch)
);

// This is attached to both click and touchend. On some systems (e.g. Chrome), click events are
// fired when you touch anything but other systems (e.g. iOS) will only emit click events when you
// touch a clickable component (something with a tabindex). By attaching the same handler to both,
// we ensure that we do not leave this module in an unstable state where it thinks capturing is
// active but focus is not on the input.
const handleTap = handle(
	isCapturing,				// if a down event was captured
	stop,						// prevent the click event from propagating
	preventDefault,				// prevent touchend from triggering a click after releasing lock
	setCapturing(false),		// clear the capturing flag
	() => active.blur()			// and blur the active node
);

const handleTouchStart = handle(
	shouldCapture,                // If we should capture the click
	stop,                         // prevent other components from handling this event
	setCapturing(true)            // and flag that we've started capturing a down event
);

// Lock the pointer from emitting click events until released
const lockPointer = (target) => {
	active = target;
	document.addEventListener('mousedown', handlePointerDown, {capture: true});
	document.addEventListener('mouseup', handlePointerUp, {capture: true});
	document.addEventListener('touchstart', handleTouchStart, {capture: true});
	document.addEventListener('touchend', handleTap, {capture: true});
	document.addEventListener('click', handleTap, {capture: true});
};

// Release the pointer and allow subsequent click events
const releasePointer = (target) => {
	if (target === active) {
		active = null;
		document.removeEventListener('mousedown', handlePointerDown, {capture: true});
		document.removeEventListener('mouseup', handlePointerUp, {capture: true});
		document.removeEventListener('touchstart', handlePointerDown, {capture: true});
		document.removeEventListener('touchend', handleTap, {capture: true});
		document.removeEventListener('click', handleTap, {capture: true});
	}
};

export {
	lockPointer,
	releasePointer
};
