let lastEvent = {
	type: null,
	timeStamp: 0
};

const checkLastMouseEvent = ({type, timeStamp}) => {
	if (lastEvent.type === 'mouseup' && type === 'click' && lastEvent.timeStamp === timeStamp) {
		return false;
	}
	lastEvent.type = type;
	lastEvent.timeStamp = timeStamp;

	return true;
};

export {
	checkLastMouseEvent
};

