// It's possible that emitting `onTap` will cause a DOM change before the mousedown fires resulting
// in multiple tap/click events for the same user action. To avoid this, we store the last touchend
// target and timestamp to compare against the next mouse down. If the timestamp is different (e.g
// we're on a hybrid device that emitted a touch event but the next was a mouse event) or the target
// is the same (or no previous target was set if no touch events have been emitted), we allow the
// mousedown *across Touchable instances*.
let _lastTouchEnd = {
	target: null,
	timeStamp: 0
};

const shouldAllowMouseDown = (ev) => {
	return ev.timeStamp !== _lastTouchEnd.timeStamp || (
		ev.target === _lastTouchEnd.target ||
		_lastTouchEnd.target === null
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
			_lastTouchEnd.timeStamp = ev.timeStamp;
			_lastTouchEnd.target = ev.target;
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
