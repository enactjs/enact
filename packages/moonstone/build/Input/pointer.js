"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.releasePointer = exports.lockPointer = void 0;

var _handle = require("@enact/core/handle");

var active;
var capturedDown = false; // if there is a focused input (there should be) and the target is not the input

var shouldCapture = function shouldCapture(_ref) {
  var target = _ref.target;
  return active && target !== active;
};

var isCapturing = function isCapturing() {
  return capturedDown && active;
};

var setCapturing = function setCapturing(capturing) {
  return (0, _handle.returnsTrue)(function () {
    return capturedDown = capturing;
  });
};

var handlePointerDown = (0, _handle.handle)(shouldCapture, // If we should capture the click
_handle.preventDefault, // prevent the down event bubbling
_handle.stop, // (and stop propagation to support touch)
setCapturing(true) // and flag that we've started capturing a down event
);
var handlePointerUp = (0, _handle.handle)(isCapturing, // if a down event was captured
_handle.preventDefault, // prevent the up event bubbling
_handle.stop // (and stop propagation to support touch)
); // This is attached to both click and touchend. On some systems (e.g. Chrome), click events are
// fired when you touch anything but other systems (e.g. iOS) will only emit click events when you
// touch a clickable component (something with a tabindex). By attaching the same handler to both,
// we ensure that we do not leave this module in an unstable state where it thinks capturing is
// active but focus is not on the input.

var handleTap = (0, _handle.handle)(isCapturing, // if a down event was captured
_handle.stop, // prevent the click event from propagating
_handle.preventDefault, // prevent touchend from triggering a click after releasing lock
setCapturing(false), // clear the capturing flag
function () {
  return active.blur();
} // and blur the active node
);
var handleTouchStart = (0, _handle.handle)(shouldCapture, // If we should capture the click
_handle.stop, // prevent other components from handling this event
setCapturing(true) // and flag that we've started capturing a down event
); // Lock the pointer from emitting click events until released

var lockPointer = function lockPointer(target) {
  active = target;
  document.addEventListener('mousedown', handlePointerDown, {
    capture: true
  });
  document.addEventListener('mouseup', handlePointerUp, {
    capture: true
  });
  document.addEventListener('touchstart', handleTouchStart, {
    capture: true
  });
  document.addEventListener('touchend', handleTap, {
    capture: true
  });
  document.addEventListener('click', handleTap, {
    capture: true
  });
}; // Release the pointer and allow subsequent click events


exports.lockPointer = lockPointer;

var releasePointer = function releasePointer(target) {
  if (target === active) {
    active = null;
    document.removeEventListener('mousedown', handlePointerDown, {
      capture: true
    });
    document.removeEventListener('mouseup', handlePointerUp, {
      capture: true
    });
    document.removeEventListener('touchstart', handleTouchStart, {
      capture: true
    });
    document.removeEventListener('touchend', handleTap, {
      capture: true
    });
    document.removeEventListener('click', handleTap, {
      capture: true
    });
  }
};

exports.releasePointer = releasePointer;