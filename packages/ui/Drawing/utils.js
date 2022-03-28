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
	const ratio = window.devicePixelRatio;

	return {x: Math.floor((event.clientX - rect.left) * ratio),
		y: Math.floor((event.clientY - rect.top) * ratio)};
};

/*
 * Returns the pixel value for the selected position.
 */
function getPixelValue(pixelData, x, y) {
	if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
		return -1;  // impossible color
	} else {
		return pixelData.data[y * pixelData.width + x];
	}
}

/*
 * Executes the fill drawing on the canvas.
 */
function fillDrawing(ctx, event, fillColor) {
	const canvas = ctx.current.canvas;
	const startPos = relativePosition(event, canvas);
	// read the pixels in the canvas
	const imageData = ctx.current.getImageData(0, 0, canvas.width, canvas.height);

	// make a Uint32Array view on the pixels so we can manipulate pixels
	// one 32bit value at a time instead of as 4 bytes per pixel
	const pixelData = {
		width: imageData.width,
		height: imageData.height,
		data: new Uint32Array(imageData.data.buffer),
	};

	const fillColorHexNumber = Number('0xFF' + fillColor.substring(5) + fillColor.substring(3,5) + fillColor.substring(1,3));

	const targetColor = getPixelValue(pixelData, startPos.x, startPos.y);

	if (targetColor !== fillColorHexNumber) {
		const pixelsToCheck = [startPos.x, startPos.y];
		while (pixelsToCheck.length > 0) {
			const y = pixelsToCheck.pop();
			const x = pixelsToCheck.pop();

			const currentColor = getPixelValue(pixelData, x, y);
			if (currentColor === targetColor) {
				pixelData.data[y * pixelData.width + x] = fillColorHexNumber;
				pixelsToCheck.push(x + 1, y);
				pixelsToCheck.push(x - 1, y);
				pixelsToCheck.push(x, y + 1);
				pixelsToCheck.push(x, y - 1);
			}
		}

		// put the data back
		ctx.current.putImageData(imageData, 0, 0);
	}
}

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
	const ratio = window.devicePixelRatio;

	contextRef.current.globalCompositeOperation = 'destination-out';
	context.fillRect(0, 0, Math.round(canvas.width / ratio), Math.round(canvas.height / ratio));

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
				fillDrawing(contextRef, line.ev, fillColor)
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
};

export {
	drawCircle,
	drawing,
	drawRectangle,
	drawTriangle,
	fillDrawing,
	paint,
	setLineOptions
};
