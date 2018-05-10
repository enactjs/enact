let lastMouseUpTime = 0;

const setLastMouseUp = (ev) => {
	if (ev.type === 'mouseup') {
		lastMouseUpTime = ev.timestamp;
	}
}

const shouldAllowClick = (ev) => {
	const {type, timeStamp} = ev;

	return !(type === 'click' && lastMouseUpTime === timeStamp);
};

export default shouldAllowClick;
export {
	setLastMouseUp,
	shouldAllowClick
};

