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

/*
 * Function used to draw a triangle on the canvas
 */
const drawTriangle = (contextRef, offsetX, offsetY) => {
	const newOffsetY = offsetY - (100 * Math.sqrt(3) / 3);
	contextRef.current.beginPath();
	contextRef.current.moveTo(offsetX, newOffsetY);
	contextRef.current.lineTo(offsetX - 50, newOffsetY + 100);
	contextRef.current.lineTo(offsetX + 50, newOffsetY + 100);
	contextRef.current.lineTo(offsetX, newOffsetY);
	contextRef.current.closePath();
	contextRef.current.stroke();
};

/*
 * Function used to draw a rectangle on the canvas
 */
const drawRectangle = (contextRef, offsetX, offsetY) => {
	const height = 75;
	const width = 100;
	contextRef.current.rect(offsetX - (width / 2), offsetY - (height / 2), width, height);
	contextRef.current.stroke();
	contextRef.current.closePath();
};

/*
 * Function used to draw a circle on the canvas
 */
const drawCircle = (contextRef, offsetX, offsetY) => {
	contextRef.current.beginPath();
	contextRef.current.arc(offsetX, offsetY, 50, 0, 2 * Math.PI);
	contextRef.current.stroke();
	contextRef.current.closePath();
};

/*
 * Function used to draw a line on the canvas
 */
const drawLine = (contextRef, offsetX, offsetY) => {
	contextRef.current.beginPath(); // start a canvas path
	contextRef.current.moveTo(offsetX, offsetY); // move the starting point to initial position
	contextRef.current.lineTo(offsetX, offsetY);
	contextRef.current.stroke();
	contextRef.current.closePath();
};

/*
 * Paints a single point, line or shape for the undo/redo functionality
 */
const paint = (canvasRef, contextRef, beginPointRef, currentObjectLines, actions, drawingTool, brushSize, brushColor, fillColor) => {
	const canvas = canvasRef.current;
	const context = canvas.getContext('2d');

	contextRef.current.globalCompositeOperation = 'destination-out';
	context.fillRect(0, 0, canvas.width, canvas.height);

	contextRef.current.globalCompositeOperation = 'source-over';

	for (let lineIndex = 0; lineIndex <= actions; lineIndex++) {
		const line = currentObjectLines[lineIndex];
		context.lineWidth = line.brushSize;
		context.strokeStyle = line.brushColor;
		context.fillStyle = line.fillColor;
		beginPointRef.current = line.points[0];

		if (line.drawingTool === 'erase') {
			contextRef.current.globalCompositeOperation = 'destination-out';
		} else {
			contextRef.current.globalCompositeOperation = 'source-over';
		}

		if (line.points.length === 1) {
			const nativeEvent = line.ev.nativeEvent;
			const {offsetX, offsetY} = nativeEvent;

			contextRef.current.beginPath(); // start a canvas path
			contextRef.current.moveTo(line.points[0].x, line.points[0].y); // move the starting point to initial position

			if (line.drawingTool === 'fill') {
				fillDrawing(line.ev, contextRef);
			} else if (line.drawingTool === 'triangle') {
				drawTriangle(contextRef, offsetX, offsetY);
			} else if (line.drawingTool === 'rectangle') {
				drawRectangle(contextRef, offsetX, offsetY);
			} else if (line.drawingTool === 'circle') {
				drawCircle(contextRef, offsetX, offsetY);
			} else {
				line.points.forEach(point => {
					drawLine(contextRef, point.x, point.y);
				});
			}
		} else {
			for (let index = 2; index <= line.points.length; index++) {

				const lastTwoPoints = [line.points[index - 2], line.points[index - 1]];
				const controlPoint = lastTwoPoints[0];
				const endPoint = {
					x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
					y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
				};
				drawing(
					beginPointRef.current,
					controlPoint,
					endPoint,
					contextRef
				);
				beginPointRef.current = endPoint;
			}
		}
		if (drawingTool === 'erase') {
			contextRef.current.globalCompositeOperation = 'destination-out';
		} else {
			contextRef.current.globalCompositeOperation = 'source-over';
		}
		contextRef.current.closePath();
		context.lineWidth = brushSize;
		context.strokeStyle = brushColor;
		context.fillStyle = fillColor;
	}
};

const setLineOptions = (brushColor, brushSize, currentLine, drawingTool, ev, fillColor, offsetX, offsetY) => {
	currentLine['points'].push({x: offsetX, y: offsetY});
	currentLine['drawingTool'] = drawingTool;
	currentLine['fillColor'] = fillColor;
	currentLine['brushColor'] = brushColor;
	currentLine['brushSize'] = brushSize;
	currentLine['ev'] = ev;
}

export {
	drawCircle,
	drawing,
	drawRectangle,
	drawTriangle,
	fillDrawing,
	paint,
	setLineOptions
};
