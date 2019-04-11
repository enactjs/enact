// It's possible that emitting `onTap` will cause a DOM change before the mousedown fires resulting
// in multiple tap/click events for the same user action. To avoid this, we store the last touchend
// target to compare against the next mouse down. If the target is the same (or no previous target
// was set if no touch events are emitted), we allow the mousedown *across Touchable instances*.
let _lastTouchEndTarget = null;

const shouldAllowMouseDown = (ev) => {
	return (
		ev.target === _lastTouchEndTarget ||
		ev.target === null
	);
};

class ClickAllow {
	constructor () {
		this.lastTouchEndTime = 0;
		this.lastMouseUpTime = 0;
	}

	setLastTouchEnd (ev) {
		if (ev && ev.type === 'touchend') {
			this.lastTouchEndTime = ev.timeStamp;
			_lastTouchEndTarget = ev.target;
		}
	}

	setLastMouseUp (ev) {
		if (ev && ev.type === 'mouseup') {
			this.lastMouseUpTime = ev.timeStamp;
		}
	}

	shouldAllowMouseEvent (ev) {
		const {timeStamp} = ev;

		return this.lastTouchEndTime !== timeStamp && shouldAllowMouseDown(ev);
	}

	shouldAllowTap (ev) {
		const {type, timeStamp} = ev;

		// Allow the custom tap event for a “click” when it’s actually a click and it’s not from the
		// last mouseup event which would have fired the click for us
		return type === 'click' && this.lastMouseUpTime !== timeStamp;
	}
}

export default ClickAllow;
export {
	ClickAllow
};
