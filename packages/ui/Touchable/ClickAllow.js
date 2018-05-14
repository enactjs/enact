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
		return type === 'click' && this.lastMouseUpTime !== timeStamp;
	}
}

export default ClickAllow;
export {
	ClickAllow
};
