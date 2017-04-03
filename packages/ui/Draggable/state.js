import clamp from 'ramda/src/clamp';

const setContainerBounds = (nodeBounds, containerBounds) => () => {
	const bounds = {
		minX: containerBounds.left,
		minY: containerBounds.top,
		maxX: containerBounds.right,
		maxY: containerBounds.bottom
	};

	// TODO: add position support to allow node to positioned by 9-box (e.g. top left, bottom middle, center)

	return bounds;
};

const setPositionFromValue = (value) => ({maxX, maxY, minX, minY}) => {
	return {
		x: (maxX - minX) * value,
		y: (maxY - minY) * value
	};
};

const startTrack = () => () => {
	return {
		tracking: true
	};
};

const updatePosition = (clientX, clientY) => ({maxX, maxY, minX, minY}) => {
	return {
		x: clamp(minX, maxX, clientX) - minX,
		y: clamp(minY, maxY, clientY) - minY
	};
};

const stopTrack = () => {
	return {
		tracking: false
	};
};

export {
	setContainerBounds,
	setPositionFromValue,
	startTrack,
	stopTrack,
	updatePosition
};
