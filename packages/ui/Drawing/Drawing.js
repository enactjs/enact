/* eslint-disable react-hooks/rules-of-hooks, react/jsx-no-bind */

/**
 * Unstyled drawing canvas components and behaviors to be customized by a theme or application.
 *
 * @module ui/Drawing
 * @exports Drawing
 * @exports DrawingBase
 * @exports DrawingDecorator
 */

import EnactPropTypes from '@enact/core/internal/prop-types';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import { useImperativeHandle, useEffect, useRef, useState } from 'react';

import ForwardRef from '../ForwardRef';
import ri from '../resolution';

import { drawing, fillDrawing, paint } from './utils';

import css from './Drawing.module.less';

let cursors = {
	bucket: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAghJREFUeNrslj1uwjAUx5OKA+QIESeIxMgSRhaUhRE1YmDODSgzAxIbEyMSDDlCOABScoPmBuEGrv9pDK+O43yQTu2THoqesX9+X7YN46+J+eoCjDHrcrl4+J7P52lhTk3TTH9159vtNgSfqm3bbDqdfq5WqyPfmNM308LCMlRWy7LYYrEIERmjj/COx+NYhvi+zyBxHLPdbsccx3mM4f8vwWXo8XjMQfCMwoWEYfgY++DSG1SIDs55uR15bw09n8/+crlUQuvgURTlNtd1WStgsVOmg1K453l5jrMsy21BEOTzZrNZ3ATo8L6M5ALSQVUiwgzd7/eBFsr/7A+Hw0wHRfjgnUowBi/Rz2Ju4YQeKvJUBaVeIG9CVfOEwhFEsTMUUhRJ5YGBcWwOEaEFBzifbpdyWhdeuTeh+EZooaKYdNVenHZPURUS8tSXwIFSS/HduqoQw1ZVQG1F7uU3/JxOp/f7/V7KOWyTycRIkuTl8z1Nv2/JwWDwBBWN/cNbUal9eF6ZY1qlKDDR6LTgusIpdDQaZT9uKOrZ4XDwqqq9LVxupVIfC3DVWdoFXgulYN192QbeCErBt9vNq7s46uCNofTwwGnY5NaicPRnJyhEPNqagFXHK95W9H3VCCoue0xs8xjDwqr+h60J1CTvKYc/wpMO7zB3s9nkkVqv11e+xtX4F4V8CTAA/Hx+caeSjdgAAAAASUVORK5CYII=',
	eraser: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAIAAABLixI0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAE1JREFUeNpiZGXnYKASYAFiAQF+fT19Sky5eOnihw8fGYDucnF1+08ZAJoANIeJgXpg1KxRs0bNGjVr1KzBaxYjsMynVj3ESMX6ESDAANA2TPNF19FGAAAAAElFTkSuQmCC',
	pen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATFJREFUeNrs19FthDAMBuB0A0bICIyQERiB2yAjsEFGyAiMABuEDa5MEDZwceWc0oq6J52dp7MU8YL4sCOiH2N0qzeNazoX0MqtXiAiGEKAZVlgGIaCj5poKGhd4ziW7p0G6unBue97yDlf4eJjj9RR4nAa+10M7boOYoyAVw7HPacXlOkUO8FKKbE47j2N+/VO8cGI4x5yOKFAn9prKCLYzTM4oVEELfUkHkRRDp+mqYzXq6BXuHMOVMbL4dbatigWfs9v9I3+efa2Ri2lhMcB0AI1VTz5F5dEbRXOWFwSxRoKxOHS6HdIw7P1VzD7gWugWIv3/ioVPnANFAvmeb4KZjUeJMEPipvpHKXZ992s62q2bTPHcZR71nPdzvWpkYehiqeROlT/7XBaCZ+rLwEGAPhaImYfzD7mAAAAAElFTkSuQmCC'
};
let currentLine = [], lines = [], actions = -1, lastLine = null;;
let currentObjectLine = {
	points: [],
	drawingTool: '',
	fillColor: '',
	brushColor: '',
	brushSize: '',
	ev: null
}, currentObjectLines = [];
/**
 * A basic drawing canvas component.
 *
 * @class DrawingBase
 * @memberof ui/Drawing
 * @ui
 * @public
 */
const DrawingBase = kind({
	name: 'ui:Drawing',

	functional: true,

	propTypes: /** @lends ui/Drawing.DrawingBase.prototype */ {

		/**
		 * Indicates the image used for the background of the canvas.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		backgroundImage: PropTypes.string,

		/**
		 * Indicates the color of the brush.
		 *
		 * @type {String}
		 * @default 'green'
		 * @public
		 */
		brushColor: PropTypes.string,

		/**
		 * Indicates the size of the brush.
		 *
		 * @type {Number}
		 * @default 5
		 * @public
		 */
		brushSize: PropTypes.number,

		/**
		 * Indicates the background color of the canvas.
		 *
		 * @type {String}
		 * @default 'black'
		 * @public
		 */
		canvasColor: PropTypes.string,

		/**
		 * Applies the `disabled` class.
		 *
		 * When `true`, the canvas is shown as disabled.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Called with a reference to the root component.
		 *
		 * When using {@link ui/Drawing.Drawing}, the `ref` prop is forwarded to this
		 * component as `componentRef`.
		 *
		 * @type {Object|Function}
		 * @public
		 */
		drawingRef: EnactPropTypes.ref,

		/**
		 * Indicates the tool used for drawing.
		 *
		 * Allowed values include:
		 * `'brush'` - a curved line will be drawn
		 * `'fill'` - an entire area of the canvas will be filled with the color indicated by `fillColor`
		 *
		 * @type {String}
		 * @default 'brush'
		 * @public
		 */
		drawingTool: PropTypes.oneOf(['brush', 'fill', 'triangle', 'rectangle', 'circle', 'erase']),

		/**
		 * Indicates the color used for filling a canvas area when `drawingTool` is set to `'fill'`.
		 *
		 * @type {String}
		 * @default 'red'
		 * @public
		 */
		fillColor: PropTypes.string,

		/**
		 * Contains the coordinates of the points that will be drawn on the canvas.
		 *
		 * @type {Array}
		 * @private
		 */
		points: PropTypes.array,

		/**
		 * Called when canvas is currently being drawn.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @private
		 */
		setIsDrawing: PropTypes.func
	},

	defaultProps: {
		backgroundImage: '',
		brushColor: 'green',
		brushSize: 5,
		canvasColor: 'black',
		drawingTool: 'brush',
		fillColor: 'red',
		points: []
	},

	styles: {
		css,
		className: 'drawing',
		publicClassNames: true
	},

	handlers: {
		draw: (event, { drawingTool, points }) => {
			const {
				beginPointRef,
				contextRef,
				ev,
				isDrawing,
				offset,
				setIsDrawing,
				brushColor,
				brushSize,
				fillColor
			} = event;
			const nativeEvent = ev.nativeEvent;

			// TODO check condition for future drawing tools
			if (!isDrawing || drawingTool === 'fill') return;
			let offsetX, offsetY;

			if (nativeEvent.pointerType === 'mouse') {
				offsetX = nativeEvent.offsetX;
				offsetY = nativeEvent.offsetY;
			} else {
				offsetX = nativeEvent.pageX - offset.x;
				offsetY = nativeEvent.pageY - offset.y;
			}

			if (
				offsetY > ri.scale(1000) ||
				offsetX > ri.scale(2000) ||
				offsetX < 0 ||
				offsetY < 0
			) {
				setIsDrawing(false);
				return;
			}
			points.push({ x: offsetX, y: offsetY });
			currentLine.push({ x: offsetX, y: offsetY });
			currentObjectLine['points'].push({ x: offsetX, y: offsetY });
			currentObjectLine['drawingTool'] = drawingTool;
			currentObjectLine['fillColor'] = fillColor;
			currentObjectLine['brushColor'] = brushColor;
			currentObjectLine['brushSize'] = brushSize;
			currentObjectLine['ev'] = ev;

			// console.log('points from drawing')
			// console.log(points)
			if (points.length > 3) {
				const lastTwoPoints = points.slice(-2);
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
		},

		finishDrawing: (event, { points }) => {
			const { contextRef, setIsDrawing } = event;

			contextRef.current.closePath();
			setIsDrawing(false);
			console.log('from finisHDrawing');
			console.log(currentObjectLines);
			currentObjectLines.push(currentObjectLine);

			currentObjectLine = {
				points: [],
				drawingTool: '',
				fillColor: '',
				brushColor: '',
				brushSize: ''
			};

			lines.push(currentLine)
			currentLine = [];
			actions++;
		},

		startDrawing: (event, { points, drawingTool }) => {
			const { beginPointRef, contextRef, disabled, ev, setIsDrawing, fillColor, brushSize, brushColor } = event;
			// console.log('ev from startDrawing')
			// console.log(ev)
			const nativeEvent = ev.nativeEvent;
			if (disabled) return;

			const { offsetX, offsetY } = nativeEvent;
			contextRef.current.beginPath(); // start a canvas path
			contextRef.current.moveTo(offsetX, offsetY); // move the starting point to initial position
			points.push({ x: offsetX, y: offsetY });

			currentLine.push({ x: offsetX, y: offsetY });
			currentObjectLine['points'].push({ x: offsetX, y: offsetY });
			currentObjectLine['drawingTool'] = drawingTool;
			currentObjectLine['fillColor'] = fillColor;
			currentObjectLine['brushColor'] = brushColor;
			currentObjectLine['brushSize'] = brushSize;
			currentObjectLine['ev'] = ev;
			if (drawingTool === 'brush') {
				contextRef.current.lineTo(offsetX, offsetY); // draw a single point
				contextRef.current.stroke();
			} else if (drawingTool === 'fill') {
				fillDrawing(ev, contextRef);
			} else if (drawingTool === 'triangle') {
				const newOffsetY = offsetY - (100 * Math.sqrt(3) / 3);
				contextRef.current.moveTo(offsetX, newOffsetY);
				contextRef.current.lineTo(offsetX - 50, newOffsetY + 100);
				contextRef.current.lineTo(offsetX + 50, newOffsetY + 100);
				contextRef.current.lineTo(offsetX, newOffsetY);
				contextRef.current.stroke();
				return;
			} else if (drawingTool === 'rectangle') {
				const height = 75;
				const width = 100;
				contextRef.current.rect(offsetX - (width / 2), offsetY - (height / 2), width, height);
				contextRef.current.stroke();
				return;
			} else if (drawingTool === 'circle') {
				contextRef.current.beginPath();
				contextRef.current.arc(offsetX, offsetY, 50, 0, 2 * Math.PI);
				contextRef.current.stroke();
				return;
			}
			// currentObjectLine['drawingTool'] = drawingTool;
			// currentObjectLine['fillColor'] = fillColor;
			// currentObjectLine['brushColor'] = brushColor;
			// currentObjectLine['brushSize'] = brushSize;
			// currentObjectLine['ev'] = ev;
			beginPointRef.current = { x: offsetX, y: offsetY };
			setIsDrawing(true);
			// console.log('points from startDrawing')
			// console.log(points)
		}
	},

	computed: {
		canvasStyle: ({backgroundImage, canvasColor, drawingTool}) => {

			let cursor;
			if (drawingTool === 'erase') {
				cursor = cursors.eraser;
			} else {
				cursor = (drawingTool === 'fill') ? cursors.bucket : cursors.pen;
			}

			if (!backgroundImage) return { backgroundColor: `${canvasColor}`, cursor: `url(${cursor}) 3 27, auto` };

			return {
				backgroundImage: `url(${backgroundImage})`,
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				cursor: `url(${cursor}) 3 27, auto`
			};
		}
	},

	render: ({
		backgroundImage,
		brushColor,
		brushSize,
		canvasColor,
		canvasStyle,
		disabled,
		draw,
		drawingRef,
		drawingTool,
		fillColor,
		finishDrawing,
		startDrawing,
		points,
		...rest
	}) => {
		console.log("\n**************************************\n");
		console.log(drawingTool)
		const [isDrawing, setIsDrawing] = useState(false);
		const beginPointRef = useRef(null);
		const canvasRef = useRef(null);
		const contextRef = useRef(null);
		const [offset, setOffset] = useState();
		// console.log(points)
		// console.log('beginPointRef.current')
		// console.log(beginPointRef.current)
		// console.log(lines)
		// const [lines, setLines] = useState([])
		// const [currentLine, setCurrentLine] = useState([]);
		// console.log('from render')
		// console.log('lines')
		// console.log(lines)
		// console.log('currentObjectLine')
		// console.log(currentObjectLine)
		console.log('current object lines')
		console.log(currentObjectLines)

		// console.log('current line')
		// console.log(currentLine)
		// console.log('actions')
		// console.log(actions)
		// console.log('**********************')
		useEffect(() => {
			const canvas = canvasRef.current;
			canvas.height = ri.scale(1000);
			canvas.width = ri.scale(2000);
			canvas.style.height = `${ri.scale(1000)}px`;
			canvas.style.width = `${ri.scale(2000)}px`;
			const context = canvas.getContext('2d');
			context.lineCap = 'round';
			context.lineWidth = brushSize;
			context.strokeStyle = brushColor;
			context.fillStyle = fillColor;
			contextRef.current = context;

			setOffset({
				x: canvas.getBoundingClientRect().left,
				y: canvas.getBoundingClientRect().top
			});
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		useEffect(() => {
			console.log('changing brush size: ', brushSize)
			const canvas = canvasRef.current;

			const context = canvas.getContext('2d');
			context.lineWidth = brushSize;
			context.strokeStyle = brushColor;
			context.fillStyle = fillColor;
		}, [brushColor, brushSize, fillColor]);

		useImperativeHandle(drawingRef, () => ({
			clearCanvas: () => {
				if (disabled) return;

				const canvas = canvasRef.current;
				const context = canvas.getContext('2d');

				contextRef.current.globalCompositeOperation = 'destination-out';
				context.fillRect(0, 0, canvas.width, canvas.height);

				if (drawingTool === 'erase') {
					contextRef.current.globalCompositeOperation = 'destination-out';
				} else {
					contextRef.current.globalCompositeOperation = 'source-over';
				}
			},

			undo: () => {
				if (currentObjectLines.length == 0) return;

				console.log('*************UNDO************');
				console.log(currentObjectLines);
				// const canvas = canvasRef.current;
				// const context = canvas.getContext('2d');

				// contextRef.current.globalCompositeOperation = 'destination-out';
				// context.fillRect(0, 0, canvas.width, canvas.height);

				// contextRef.current.globalCompositeOperation = 'source-over';

				lastLine = { ...currentObjectLines[currentObjectLines.length - 1] };

				currentObjectLines.pop();

				paint(canvasRef, contextRef, beginPointRef, currentObjectLines, actions, drawingTool, brushSize, brushColor, fillColor);
				// for(let objIndex = 0; objIndex < actions; objIndex++){
				// 	const line = currentObjectLines[objIndex];
				// 	context.lineWidth = line.brushSize;
				// 	context.strokeStyle = line.brushColor;
				// 	context.fillStyle = line.fillColor;
				// 	beginPointRef.current = line.points[0];
				// 	console.log('line')
				// 	console.log(line.drawingTool)
				// 	console.log(drawingTool)
				// 	if (line.drawingTool === 'erase') {
				// 		// console.log('avem radiera')
				// 		contextRef.current.globalCompositeOperation = 'destination-out';
				// 	} else {
				// 		// console.log('n-avem radiera')
				// 		contextRef.current.globalCompositeOperation = 'source-over';
				// 	}
				// 	if (line.points.length === 1) {
				// 		const nativeEvent = line.ev.nativeEvent;
				// 		const { offsetX, offsetY } = nativeEvent;

				// 		// if (line.drawingTool === 'fill') {
				// 		// 	fillDrawing(line.ev, contextRef);
				// 		// }
				// 		contextRef.current.beginPath(); // start a canvas path
				// 		contextRef.current.moveTo(line.points[0].x, line.points[0].y); // move the starting point to initial position
				// 		if (line.drawingTool === 'fill') {
				// 			fillDrawing(line.ev, contextRef);
				// 		} else if (line.drawingTool === 'triangle') {
				// 			console.log('facem triunglu')
				// 			const newOffsetY = offsetY - (100 * Math.sqrt(3) / 3);
				// 			contextRef.current.moveTo(offsetX, newOffsetY);
				// 			contextRef.current.lineTo(offsetX - 50, newOffsetY + 100);
				// 			contextRef.current.lineTo(offsetX + 50, newOffsetY + 100);
				// 			contextRef.current.lineTo(offsetX, newOffsetY);
				// 			contextRef.current.stroke();
				// 			contextRef.current.closePath();
				// 			return;
				// 		} else if (line.drawingTool === 'rectangle') {
				// 			const height = 75;
				// 			const width = 100;
				// 			contextRef.current.rect(offsetX - (width / 2), offsetY - (height / 2), width, height);
				// 			contextRef.current.stroke();
				// 			contextRef.current.closePath();
				// 			return;

				// 		} else if (line.drawingTool === 'circle') {
				// 			contextRef.current.beginPath();
				// 			contextRef.current.arc(offsetX, offsetY, 50, 0, 2 * Math.PI);
				// 			contextRef.current.stroke();
				// 			contextRef.current.closePath();
				// 			return;

				// 		}
				// 		else {
				// 			line.points.forEach(point => {
				// 				// console.log('point')
				// 				// console.log(point)
				// 				contextRef.current.beginPath(); // start a canvas path
				// 				contextRef.current.moveTo(point.x, point.y); // move the starting point to initial position
				// 				contextRef.current.lineTo(point.x, point.y);
				// 				contextRef.current.stroke();
				// 				contextRef.current.closePath();
				// 			})
				// 		}

				// 	} else {
				// 		for (let index = 2; index <= line.points.length; index++) {

				// 			const lastTwoPoints = [line.points[index - 2], line.points[index - 1]];
				// 			const controlPoint = lastTwoPoints[0];
				// 			const endPoint = {
				// 				x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
				// 				y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
				// 			};
				// 			drawing(
				// 				beginPointRef.current,
				// 				controlPoint,
				// 				endPoint,
				// 				contextRef
				// 			);
				// 			beginPointRef.current = endPoint;
				// 		}
				// 	}
				// 	if (drawingTool === 'erase') {
				// 		// console.log('am radiera in tool')
				// 		contextRef.current.globalCompositeOperation = 'destination-out';
				// 	} else {
				// 		// console.log('n-am radiera in tool')
				// 		contextRef.current.globalCompositeOperation = 'source-over';
				// 	}
				// 	contextRef.current.closePath();
				// 	context.lineWidth = brushSize;
				// 	context.strokeStyle = brushColor;
				// 	context.fillStyle = fillColor;
				// }


				// currentObjectLines.forEach(line => {
				// 	context.lineWidth = line.brushSize;
				// 	context.strokeStyle = line.brushColor;
				// 	context.fillStyle = line.fillColor;
				// 	beginPointRef.current = line.points[0];
				// 	console.log('line')
				// 	console.log(line.drawingTool)
				// 	console.log(drawingTool)
				// 	if (line.drawingTool === 'erase') {
				// 		// console.log('avem radiera')
				// 		contextRef.current.globalCompositeOperation = 'destination-out';
				// 	} else {
				// 		// console.log('n-avem radiera')
				// 		contextRef.current.globalCompositeOperation = 'source-over';
				// 	}
				// 	if (line.points.length === 1) {
				// 		const nativeEvent = line.ev.nativeEvent;
				// 		const { offsetX, offsetY } = nativeEvent;

				// 		// if (line.drawingTool === 'fill') {
				// 		// 	fillDrawing(line.ev, contextRef);
				// 		// }
				// 		contextRef.current.beginPath(); // start a canvas path
				// 		contextRef.current.moveTo(line.points[0].x, line.points[0].y); // move the starting point to initial position
				// 		if (line.drawingTool === 'fill') {
				// 			fillDrawing(line.ev, contextRef);
				// 		} else if (line.drawingTool === 'triangle') {
				// 			console.log('facem triunglu')
				// 			const newOffsetY = offsetY - (100 * Math.sqrt(3) / 3);
				// 			contextRef.current.moveTo(offsetX, newOffsetY);
				// 			contextRef.current.lineTo(offsetX - 50, newOffsetY + 100);
				// 			contextRef.current.lineTo(offsetX + 50, newOffsetY + 100);
				// 			contextRef.current.lineTo(offsetX, newOffsetY);
				// 			contextRef.current.stroke();
				// 			contextRef.current.closePath();
				// 			return;
				// 		} else if (line.drawingTool === 'rectangle') {
				// 			const height = 75;
				// 			const width = 100;
				// 			contextRef.current.rect(offsetX - (width / 2), offsetY - (height / 2), width, height);
				// 			contextRef.current.stroke();
				// 			contextRef.current.closePath();
				// 			return;

				// 		} else if (line.drawingTool === 'circle') {
				// 			contextRef.current.beginPath();
				// 			contextRef.current.arc(offsetX, offsetY, 50, 0, 2 * Math.PI);
				// 			contextRef.current.stroke();
				// 			contextRef.current.closePath();
				// 			return;

				// 		}
				// 		else {
				// 			line.points.forEach(point => {
				// 				// console.log('point')
				// 				// console.log(point)
				// 				contextRef.current.beginPath(); // start a canvas path
				// 				contextRef.current.moveTo(point.x, point.y); // move the starting point to initial position
				// 				contextRef.current.lineTo(point.x, point.y);
				// 				contextRef.current.stroke();
				// 				contextRef.current.closePath();
				// 			})
				// 		}

				// 	} else {
				// 		for (let index = 2; index <= line.points.length; index++) {

				// 			const lastTwoPoints = [line.points[index - 2], line.points[index - 1]];
				// 			const controlPoint = lastTwoPoints[0];
				// 			const endPoint = {
				// 				x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
				// 				y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
				// 			};
				// 			drawing(
				// 				beginPointRef.current,
				// 				controlPoint,
				// 				endPoint,
				// 				contextRef
				// 			);
				// 			beginPointRef.current = endPoint;
				// 		}
				// 	}
				// 	if (drawingTool === 'erase') {
				// 		console.log('am radiera in tool')
				// 		contextRef.current.globalCompositeOperation = 'destination-out';
				// 	} else {
				// 		console.log('n-am radiera in tool')
				// 		contextRef.current.globalCompositeOperation = 'source-over';
				// 	}
				// 	contextRef.current.closePath();
				// 	context.lineWidth = brushSize;
				// 	context.strokeStyle = brushColor;
				// 	context.fillStyle = fillColor;
				// })


				actions--;
				if (drawingTool === 'erase') {
					// console.log('am radiera in tool')
					contextRef.current.globalCompositeOperation = 'destination-out';
				} else {
					// console.log('n-am radiera in tool')
					contextRef.current.globalCompositeOperation = 'source-over';
				}
				// if (currentObjectLines.length === 0) {
				// 	context.lineWidth = brushSize;
				// 	context.strokeStyle = brushColor;
				// 	context.fillStyle = fillColor;
				// }

			},

			redo: () => {
				console.log('redo');
				currentObjectLines.push(lastLine);
				console.log(currentObjectLines)
				lastLine = {
					points: [],
					drawingTool: '',
					fillColor: '',
					brushColor: '',
					brushSize: '',
					ev: null
				}
				paint(canvasRef, contextRef, beginPointRef, currentObjectLines, actions, drawingTool, brushSize, brushColor, fillColor);

			},

			saveCanvas: () => {
				const canvas = canvasRef.current;
				const newCanvas = document.createElement('canvas');

				newCanvas.height = canvas.height;
				newCanvas.width = canvas.width;

				const newContext = newCanvas.getContext('2d');

				if (!backgroundImage) {
					newContext.drawImage(canvas, 0, 0);
					newContext.globalCompositeOperation = 'destination-over';
					newContext.fillStyle = canvasColor;
					newContext.fillRect(0, 0, canvas.width, canvas.height);
				} else {
					const img = document.createElement('img');
					img.src = backgroundImage;

					// get the scale
					let scale = Math.max(canvas.width / img.width, canvas.height / img.height);

					// get the top left position of the image
					let x = (canvas.width / 2) - (img.width / 2) * scale;
					let y = (canvas.height / 2) - (img.height / 2) * scale;
					newContext.drawImage(img, x, y, img.width * scale, img.height * scale);

					newContext.globalCompositeOperation = 'source-over';
					newContext.drawImage(canvas, 0, 0);
				}

				const link = document.createElement('a');
				link.download = 'image.png';
				newCanvas.toBlob(function (blob) {
					link.href = URL.createObjectURL(blob);
					link.click();
				}, 'image/png');
			}
		}));

		useEffect(() => {
			if (drawingTool === 'erase') {
				contextRef.current.globalCompositeOperation = 'destination-out';
			} else {
				contextRef.current.globalCompositeOperation = 'source-over';
			}
		}, [drawingTool]);

		delete rest.drawingTool;
		delete rest.currentLine;
		delete rest.line;

		return (
			<canvas
				{...rest}
				style={canvasStyle}
				ref={canvasRef}
				onPointerDown={(ev) =>
					startDrawing({
						setIsDrawing,
						ev,
						contextRef,
						disabled,
						beginPointRef,
						brushColor,
						brushSize,
						fillColor
					})
				}
				onPointerMove={(ev) =>
					draw({
						isDrawing,
						contextRef,
						beginPointRef,
						ev,
						setIsDrawing,
						offset,
						brushColor,
						brushSize,
						fillColor
					})
				}
				onPointerUp={(ev) => finishDrawing({ ev, contextRef, setIsDrawing })}
			/>
		);
	}
});

/**
 * Applies Drawing behaviors.
 *
 * @hoc
 * @memberof ui/Drawing
 * @mixes ui/ForwardRef.ForwardRef
 * @public
 */
const DrawingDecorator = compose(ForwardRef({ prop: 'drawingRef' }));

/**
 * A simple, unstyled drawing canvas component.
 *
 * @class Drawing
 * @memberof ui/Drawing
 * @extends ui/Drawing.DrawingBase
 * @mixes ui/Drawing.DrawingDecorator
 * @omit drawingRef
 * @ui
 * @public
 */
const Drawing = DrawingDecorator(DrawingBase);

export default Drawing;
export {
	Drawing,
	DrawingBase,
	DrawingDecorator
};
