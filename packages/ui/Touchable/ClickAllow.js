class ClickAllow {
	constructor () {
		this.lastMouseUpTime = 0;
	}

	setLastMouseUp (ev) {
		if (ev.type === 'mouseup') {
			this.lastMouseUpTime = ev.timeStamp;
		}
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
