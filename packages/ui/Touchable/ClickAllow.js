class ClickAllow {
	constructor () {
		this.lastMouseUpTime = 0;
		this.setLastMouseUp = this.setLastMouseUp.bind(this);
		this.shouldAllowClick = this.shouldAllowClick.bind(this);
	}

	setLastMouseUp (ev) {
		if (ev.type === 'mouseup') {
			this.lastMouseUpTime = ev.timeStamp;
		}
	}

	shouldAllowClick (ev) {
		const {type, timeStamp} = ev;
		return !(type === 'click' && this.lastMouseUpTime === timeStamp);
	}
}

export default ClickAllow;
export {
	ClickAllow
};
