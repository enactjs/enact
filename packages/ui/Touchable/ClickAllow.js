class ClickAllow {
	constructor () {
		this.lastTouchEndTime = 0;
		this.lastMouseUpTime = 0;
	}

	setLastTouchEnd (ev) {
		if (ev && ev.type === 'touchend') {
			this.lastTouchEndTime = ev.timeStamp;
		}
	}

	setLastMouseUp (ev) {
		if (ev && ev.type === 'mouseup') {
			this.lastMouseUpTime = ev.timeStamp;
		}
	}

	shouldAllowMouseEvent (ev) {
		const {type, timeStamp} = ev;

		return type.substring(0, 5) === 'mouse' && this.lastTouchEndTime !== timeStamp;
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
