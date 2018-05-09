let event = {
	type: null,
	timeStamp: 0
};

const checkLastMouseEvent = ({type, timeStamp}) => {
	if (event.type === 'mouseup' && type === 'click' && event.timeStamp === timeStamp) {
		return false;
	}
	event.type = type;
	event.timeStamp = timeStamp;

	return true;
};

export {
	checkLastMouseEvent
};

