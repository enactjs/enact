/*
 * Calls a given function for all horizontal and vertical neighbors of the given point.
 */
const forAllNeighbors = (point, fn) => {
	fn({x: point.x, y: point.y + 1});
	fn({x: point.x, y: point.y - 1});
	fn({x: point.x + 1, y: point.y});
	fn({x: point.x - 1, y: point.y});
};

function deltaE(rgbA, rgbB) {
	let labA = rgb2lab(rgbA);
	let labB = rgb2lab(rgbB);
	let deltaL = labA[0] - labB[0];
	let deltaA = labA[1] - labB[1];
	let deltaB = labA[2] - labB[2];
	let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
	let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
	let deltaC = c1 - c2;
	let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
	deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
	let sc = 1.0 + 0.045 * c1;
	let sh = 1.0 + 0.015 * c1;
	let deltaLKlsl = deltaL / (1.0);
	let deltaCkcsc = deltaC / (sc);
	let deltaHkhsh = deltaH / (sh);
	let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
	return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb){
	let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
	r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
	g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
	b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
	x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
	y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
	z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
	x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
	y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
	z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
	return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

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
//console.log(color1HexString, color2HexString)
	const delta = deltaE([parseInt(color1HexString.substring(6), 16), parseInt(color1HexString.substring(4,6), 16), parseInt(color1HexString.substring(2,4),16)], [parseInt(color2HexString.substring(6), 16), parseInt(color2HexString.substring(4,6), 16), parseInt(color2HexString.substring(2,4),16)])


	// const dr = parseInt(color1HexString.substring(6), 16) - parseInt(color2HexString.substring(6), 16);
	// const dg = parseInt(color1HexString.substring(4,6), 16) - parseInt(color2HexString.substring(4,6), 16);
	// const db = parseInt(color1HexString.substring(2,4), 16) - parseInt(color2HexString.substring(2,4), 16);
	// const da = parseInt(color1HexString.substring(0,2), 16) - parseInt(color2HexString.substring(0,2), 16);

	// check if the analyzed pixel has a similar color as the starting point in order to handle the anti-aliasing of the drawn border
	// if (dr * dr + dg * dg + db * db + da * da < 4) {
	// 	//console.log(dr * dr + dg * dg + db * db + da * da)
	// 	return true;
	// }
	// return false;

	if (delta < 20) {
		//console.log(dr * dr + dg * dg + db * db + da * da)
		return true;
	}
	return false;

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
		const pixelList = [startPos.x, startPos.y];
		while (pixelList.length > 0) {
			const y = pixelList.pop();
			const x = pixelList.pop();

			const currentColor = getPixelValue(pixelData, x, y);
			if(currentColor !== -1 && targetColor !== -1) {
				if (targetColor === currentColor) {
					pixelData.data[y * pixelData.width + x] = fillColorHexNumber;
					pixelList.push(x + 1, y);
					pixelList.push(x - 1, y);
					pixelList.push(x, y + 1);
					pixelList.push(x, y - 1);
				}
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
