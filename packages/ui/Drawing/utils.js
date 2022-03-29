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
 * Given two color, returns true when they are similar.
 */
const isSimilarColor = (color1, color2) => {
	if (color1 === 0) {
		color1 = 0xFF000000;
	}
	if (color2 === 0) {
		color2 = 0xFF000000;
	}
//console.log(color1, color2)
	const color1HexString = parseInt(color1, 10).toString(16);
	const color2HexString = parseInt(color2, 10).toString(16);

	const dr = parseInt(color1HexString.substring(6), 16) - parseInt(color2HexString.substring(6), 16);
	const dg = parseInt(color1HexString.substring(4,6), 16) - parseInt(color2HexString.substring(4,6), 16);
	const db = parseInt(color1HexString.substring(2,4), 16) - parseInt(color2HexString.substring(2,4), 16);
	const da = parseInt(color1HexString.substring(0,2), 16) - parseInt(color2HexString.substring(0,2), 16);

	// check if the analyzed pixel has a similar color as the starting point in order to handle the anti-aliasing of the drawn border
	if (dr * dr + dg * dg + db * db + da * da > 128 * 128) {
		return false;
	}
	return true;

// 		// get red/green/blue int values of hex1
// 		let r1 = parseInt(color1HexString.substring(6), 16);
// 		let g1 = parseInt(color1HexString.substring(4, 6), 16);
// 		let b1 = parseInt(color1HexString.substring(2, 4), 16);
// 		// get red/green/blue int values of hex2
// 		let r2 = parseInt(color2HexString.substring(6), 16);
// 		let g2 = parseInt(color2HexString.substring(4, 6), 16);
// 		let b2 = parseInt(color2HexString.substring(2, 4), 16);
// 		// calculate differences betweeimageDatan reds, greens and blues
// 	let r = 255 - Math.abs(r1 - r2);
// 	let g = 255 - Math.abs(g1 - g2);
// 	let b = 255 - Math.abs(b1 - b2);
// 		// limit differences between 0 and 1
// 		r /= 255;
// 		g /= 255;
// 		b /= 255;
// 		// 0 means opposite colors, 1 means same colors
// //console.log(((r + g + b) / 3 ) > 0.99)
// 		return (((r + g + b) / 3 ) === 1);
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
const getPixelValue = (pixelData, x, y) => {
	if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
		return -1;
	} else {
		return pixelData.data[y * pixelData.width + x];
	}
}

/*
 * Executes the fill drawing on the canvas.
 */
const fillDrawing = (contextRef, event, fillColor) => {
	const canvas = contextRef.current.canvas;
	const startPos = relativePosition(event, canvas);

	const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);

	// make a Uint32Array view on the pixels so one 32bit value is handled at a time instead of 4 bytes per pixel
	const pixelData = {
		width: imageData.width,
		height: imageData.height,
		data: new Uint32Array(imageData.data.buffer),
	};

	const fillColorHexNumber = Number('0xFF' + fillColor.substring(5) + fillColor.substring(3,5) + fillColor.substring(1,3));

	const targetColor = getPixelValue(pixelData, startPos.x, startPos.y);

	if (targetColor !== fillColorHexNumber) {
		const pixelList = [startPos];
		while (pixelList.length) {
			const pos = pixelList.pop();

			const currentColor = getPixelValue(pixelData, pos.x, pos.y);
			if (isSimilarColor(currentColor, targetColor) && currentColor !== -1) {
				pixelData.data[pos.y * pixelData.width + pos.x] = fillColorHexNumber;
				// pixelsToCheck.push(x + 1, y);
				// pixelsToCheck.push(x - 1, y);
				// pixelsToCheck.push(x, y + 1);
				// pixelsToCheck.push(x, y - 1);
				forAllNeighbors(pos, function (neighbor) {
					if (neighbor.x >= 0 && neighbor.x < imageData.width &&
						neighbor.y >= 0 && neighbor.y < imageData.height &&
						isSimilarColor(getPixelValue(pixelData, neighbor.x, neighbor.y), targetColor))
						{
							pixelList.push(neighbor);
					}
				});
			}
		}

		contextRef.current.putImageData(imageData, 0, 0);
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
