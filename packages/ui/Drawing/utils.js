/*
 * Calls a given function for all horizontal and vertical neighbors of the given point.
 */
const forAllNeighbors = (point, fn) => {
	fn({x: point.x, y: point.y + 1});
	fn({x: point.x, y: point.y - 1});
	fn({x: point.x + 1, y: point.y});
	fn({x: point.x - 1, y: point.y});
};

/*
 * Given two positions, returns true when they have a similar same color.
 */
const isSimilarColor = (data, pos1, pos2) => {
	// each 4 elements in the data array contains the RGBA information of a pixel
	const offset1 = (pos1.x + pos1.y * data.width) * 4;
	const offset2 = (pos2.x + pos2.y * data.width) * 4;

	const dr = data.data[offset1] - data.data[offset2];
	const dg = data.data[offset1 + 1] - data.data[offset2 + 1];
	const db = data.data[offset1 + 2] - data.data[offset2 + 2];
	const da = data.data[offset1 + 3] - data.data[offset2 + 3];

	// check if the analyzed pixel has a similar color as the starting point in order to handle the anti-aliasing of the drawn border
	if (dr * dr + dg * dg + db * db + da * da > 128 * 128) {
		return false;
	}
	return true;
};

/*
 * Returns the relative position on the viewport of the given element.
 */
const relativePosition = (event, element) => {
	const rect = element.getBoundingClientRect();
	return {x: Math.floor(event.clientX - rect.left),
		y: Math.floor(event.clientY - rect.top)};
};

/*
 * Executes the fill drawing on the canvas.
 */
const fillDrawing = (event, contextRef) => {
	const canvas = contextRef.current.canvas;
	const startPos = relativePosition(event, canvas);

	const data = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
	// An array with one place for each pixel in the image.
	const alreadyFilled = new Array(data.width * data.height);

	// This is the list of same-colored pixel coordinates as the starting point that were not handled yet.
	const pixelList = [startPos];
	while (pixelList.length) {
		const pos = pixelList.pop();
		const offset = pos.x + data.width * pos.y;
		if (alreadyFilled[offset]) continue;

		contextRef.current.fillRect(pos.x, pos.y, 1, 1);
		alreadyFilled[offset] = true;

		forAllNeighbors(pos, function (neighbor) {
			if (neighbor.x >= 0 && neighbor.x < data.width &&
				neighbor.y >= 0 && neighbor.y < data.height &&
				isSimilarColor(data, startPos, neighbor)) {
				pixelList.push(neighbor);
			}
		});
	}
};

/*
 * Executes the drawing on the canvas.
 */
const drawing = (beginPoint, controlPoint, endPoint, contextRef) => {
	contextRef.current.beginPath();
	contextRef.current.moveTo(beginPoint.x, beginPoint.y);
	contextRef.current.quadraticCurveTo(
		controlPoint.x,
		controlPoint.y,
		endPoint.x,
		endPoint.y
	);
	contextRef.current.stroke();
	contextRef.current.closePath();
};

export {
	drawing,
	fillDrawing
};
