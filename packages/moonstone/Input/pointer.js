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
	stop,						// (and stop propagation to support touch)
	(e) => {
		if (active !== e.target) active.blur()
		else active.focus();
	}
);

const handlePointerClick = handle(
	isCapturing,				// if a down event was captured
	stop,						// prevent the click event from propagating
	setCapturing(false),		// clear the capturing flag
	() => active.blur()			// and blur the active node
);

// Lock the pointer from emitting click events until released
const lockPointer = (target) => {
	active = target;
	document.addEventListener('mousedown', handlePointerDown, {capture: true});
	document.addEventListener('mouseup', handlePointerUp, {capture: true});
	document.addEventListener('touchstart', handlePointerDown, {capture: true});
	document.addEventListener('touchend', handlePointerUp, {capture: true});
	document.addEventListener('click', handlePointerClick, {capture: true});
};

// Release the pointer and allow subsequent click events
const releasePointer = (target) => {
	if (target === active) {
		active = null;
		document.removeEventListener('mousedown', handlePointerDown, {capture: true});
		document.removeEventListener('mouseup', handlePointerUp, {capture: true});
		document.removeEventListener('touchstart', handlePointerDown, {capture: true});
		document.removeEventListener('touchend', handlePointerUp, {capture: true});
		document.removeEventListener('click', handlePointerClick, {capture: true});
	}
};

export {
	lockPointer,
	releasePointer
};
