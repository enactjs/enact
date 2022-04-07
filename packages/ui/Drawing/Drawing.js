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
import {platform} from '@enact/core/platform';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useImperativeHandle, useEffect, useRef, useState} from 'react';

import ForwardRef from '../ForwardRef';
import ri from '../resolution';

import {drawCircle, drawing, drawRectangle, drawTriangle, fillDrawing, paint, setLineOptions} from './utils';

import css from './Drawing.module.less';

let cursors = {
	bucket: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAghJREFUeNrslj1uwjAUx5OKA+QIESeIxMgSRhaUhRE1YmDODSgzAxIbEyMSDDlCOABScoPmBuEGrv9pDK+O43yQTu2THoqesX9+X7YN46+J+eoCjDHrcrl4+J7P52lhTk3TTH9159vtNgSfqm3bbDqdfq5WqyPfmNM308LCMlRWy7LYYrEIERmjj/COx+NYhvi+zyBxHLPdbsccx3mM4f8vwWXo8XjMQfCMwoWEYfgY++DSG1SIDs55uR15bw09n8/+crlUQuvgURTlNtd1WStgsVOmg1K453l5jrMsy21BEOTzZrNZ3ATo8L6M5ALSQVUiwgzd7/eBFsr/7A+Hw0wHRfjgnUowBi/Rz2Ju4YQeKvJUBaVeIG9CVfOEwhFEsTMUUhRJ5YGBcWwOEaEFBzifbpdyWhdeuTeh+EZooaKYdNVenHZPURUS8tSXwIFSS/HduqoQw1ZVQG1F7uU3/JxOp/f7/V7KOWyTycRIkuTl8z1Nv2/JwWDwBBWN/cNbUal9eF6ZY1qlKDDR6LTgusIpdDQaZT9uKOrZ4XDwqqq9LVxupVIfC3DVWdoFXgulYN192QbeCErBt9vNq7s46uCNofTwwGnY5NaicPRnJyhEPNqagFXHK95W9H3VCCoue0xs8xjDwqr+h60J1CTvKYc/wpMO7zB3s9nkkVqv11e+xtX4F4V8CTAA/Hx+caeSjdgAAAAASUVORK5CYII=',
	pen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATFJREFUeNrs19FthDAMBuB0A0bICIyQERiB2yAjsEFGyAiMABuEDa5MEDZwceWc0oq6J52dp7MU8YL4sCOiH2N0qzeNazoX0MqtXiAiGEKAZVlgGIaCj5poKGhd4ziW7p0G6unBue97yDlf4eJjj9RR4nAa+10M7boOYoyAVw7HPacXlOkUO8FKKbE47j2N+/VO8cGI4x5yOKFAn9prKCLYzTM4oVEELfUkHkRRDp+mqYzXq6BXuHMOVMbL4dbatigWfs9v9I3+efa2Ri2lhMcB0AI1VTz5F5dEbRXOWFwSxRoKxOHS6HdIw7P1VzD7gWugWIv3/ioVPnANFAvmeb4KZjUeJMEPipvpHKXZ992s62q2bTPHcZR71nPdzvWpkYehiqeROlT/7XBaCZ+rLwEGAPhaImYfzD7mAAAAAElFTkSuQmCC'
};
let currentLine = {
		brushColor: '',
		brushSize: '',
		drawingTool: '',
		fillColor: '',
		ev: null,
		points: []
	},
	currentLinesArray = [],
	actionsIndex = -1,
	lastAction = '';

// "1" for webos since using actual ratio will slow the drawing process after calling getImageData() in the fill function
const ratio = platform.platformName === 'webos' ? 1 : window.devicePixelRatio;

const generateEraseCursor = (brushSize) => {
	let canvas = document.createElement('canvas');
	canvas.width = canvas.height = brushSize;

	let ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	ctx.fillRect(0, 0, brushSize, brushSize);
	ctx.strokeRect(0, 0, brushSize, brushSize);

	return canvas.toDataURL();
};

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
		 * Sets the height of canvas.
		 *
		 * @type {Number}
		 * @default 500
		 * @public
		 */
		canvasHeight: PropTypes.number,

		/**
		 * Sets the width of canvas.
		 *
		 * @type {Number}
		 * @default 800
		 * @public
		 */
		canvasWidth: PropTypes.number,

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
		canvasHeight: 500,
		canvasWidth: 800,
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
		draw: (event, {canvasHeight, canvasWidth, drawingTool, points}) => {
			const {
				beginPointRef,
				brushColor,
				brushSize,
				contextRef,
				ev,
				fillColor,
				isDrawing,
				setIsDrawing
			} = event;
			const nativeEvent = ev.nativeEvent;

			// TODO check condition for future drawing tools
			if (!isDrawing || drawingTool === 'fill') return;

			const offsetX = nativeEvent.offsetX,
				offsetY = nativeEvent.offsetY;

			if (
				offsetY > ri.scale(canvasHeight) ||
				offsetX > ri.scale(canvasWidth) ||
				offsetX < 0 ||
				offsetY < 0
			) {
				setIsDrawing(false);
				return;
			}

			points.push({x: offsetX, y: offsetY});
			setLineOptions(brushColor, brushSize, currentLine, drawingTool, ev, fillColor, offsetX, offsetY);

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

		finishDrawing: (event) => {
			const {contextRef, setIsDrawing} = event;

			contextRef.current.closePath();
			setIsDrawing(false);
			currentLinesArray.push(currentLine);

			currentLine = {
				brushColor: '',
				brushSize: '',
				drawingTool: '',
				ev: null,
				fillColor: '',
				points: []
			};

			actionsIndex++;
		},

		startDrawing: (event, {points, drawingTool}) => {
			const {beginPointRef, brushColor, brushSize, contextRef, disabled, ev, fillColor, setIsDrawing} = event;
			const nativeEvent = ev.nativeEvent;

			if (disabled) return;

			if (lastAction === 'undo' || lastAction === 'redo') {
				lastAction = 'draw';
				currentLinesArray = [...currentLinesArray.slice(0, actionsIndex + 1)];
			}

			const {offsetX, offsetY} = nativeEvent;
			contextRef.current.beginPath(); // start a canvas path
			contextRef.current.moveTo(offsetX, offsetY); // move the starting point to initial position
			points.push({x: offsetX, y: offsetY});
			setLineOptions(brushColor, brushSize, currentLine, drawingTool, ev, fillColor, offsetX, offsetY);

			if (drawingTool === 'brush') {
				contextRef.current.lineTo(offsetX, offsetY); // draw a single point
				contextRef.current.stroke();
			} else if (drawingTool === 'fill') {
				fillDrawing(ev, contextRef, fillColor);
				return;
			} else if (drawingTool === 'triangle') {
				drawTriangle(contextRef, offsetX, offsetY);
				return;
			} else if (drawingTool === 'rectangle') {
				drawRectangle(contextRef, offsetX, offsetY);
				return;
			} else if (drawingTool === 'circle') {
				drawCircle(contextRef, offsetX, offsetY);
				return;
			}

			beginPointRef.current = {x: offsetX, y: offsetY};
			setIsDrawing(true);
		}
	},

	computed: {
		canvasStyle: ({backgroundImage, brushSize, canvasColor, drawingTool}) => {
			let cursor, cursorHotspot;

			if (drawingTool === 'erase') {
				cursor = generateEraseCursor(brushSize);
				cursorHotspot = `${brushSize / 2} ${brushSize / 2}`;
			} else {
				cursor = (drawingTool === 'fill') ? cursors.bucket : cursors.pen;
				cursorHotspot = '3 27';
			}

			if (!backgroundImage) return {backgroundColor: `${canvasColor}`, cursor: `url(${cursor}) ${cursorHotspot}, auto`};

			return {
				backgroundImage: `url(${backgroundImage})`,
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				cursor: `url(${cursor}) ${cursorHotspot}, auto`
			};
		}
	},

	render: ({
		backgroundImage,
		brushColor,
		brushSize,
		canvasColor,
		canvasHeight,
		canvasStyle,
		canvasWidth,
		disabled,
		draw,
		drawingRef,
		drawingTool,
		fillColor,
		finishDrawing,
		startDrawing,
		...rest
	}) => {
		const [isDrawing, setIsDrawing] = useState(false);
		const beginPointRef = useRef(null);
		const canvasRef = useRef(null);
		const contextRef = useRef(null);

		useEffect(() => {
			const canvas = canvasRef.current;
			canvas.height = Math.floor(ri.scale(canvasHeight * ratio));
			canvas.width = Math.floor(ri.scale(canvasWidth * ratio));
			canvas.style.height = `${ri.scale(canvasHeight)}px`;
			canvas.style.width = `${ri.scale(canvasWidth)}px`;
			const context = canvas.getContext('2d');
			context.scale(ratio, ratio);
			context.lineCap = 'round';
			context.lineWidth = brushSize;
			context.strokeStyle = brushColor;
			context.fillStyle = fillColor;
			contextRef.current = context;
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		useEffect(() => {
			const canvas = canvasRef.current;
			const context = canvas.getContext('2d');

			context.lineWidth = brushSize;
			context.strokeStyle = brushColor;
			context.fillStyle = fillColor;
		}, [brushColor, brushSize, fillColor]);

		useImperativeHandle(drawingRef, () => ({
			clearCanvas: () => {
				if (disabled) return;

				currentLinesArray = [];
				actionsIndex = -1;

				const canvas = canvasRef.current;
				const context = canvas.getContext('2d');

				contextRef.current.globalCompositeOperation = 'destination-out';
				context.fillRect(0, 0, Math.round(canvas.width / ratio), Math.round(canvas.height / ratio));

				if (drawingTool === 'erase') {
					contextRef.current.globalCompositeOperation = 'destination-out';
				} else {
					contextRef.current.globalCompositeOperation = 'source-over';
				}
			},

			undo: () => {
				lastAction = 'undo';

				if (currentLinesArray.length === 0 || actionsIndex < 0) return;

				actionsIndex--;
				paint(canvasRef, contextRef, beginPointRef, currentLinesArray, actionsIndex, drawingTool, brushSize, brushColor, fillColor);

				if (drawingTool === 'erase') {
					contextRef.current.globalCompositeOperation = 'destination-out';
				} else {
					contextRef.current.globalCompositeOperation = 'source-over';
				}
			},

			redo: () => {
				lastAction = 'redo';

				if (actionsIndex >= currentLinesArray.length - 1) return;

				actionsIndex++;
				paint(canvasRef, contextRef, beginPointRef, currentLinesArray, actionsIndex, drawingTool, brushSize, brushColor, fillColor);
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

		// Handle width and height of canvas dynamically
		useEffect(() => {
			const canvas = canvasRef.current;
			const context = canvas.getContext('2d');
			const handleResize = () => {
				canvas.height = Math.floor(ri.scale(canvasHeight * ratio));
				canvas.width = Math.floor(ri.scale(canvasWidth * ratio));
				canvas.style.height = `${ri.scale(canvasHeight)}px`;
				canvas.style.width = `${ri.scale(canvasWidth)}px`;
				context.scale(ratio, ratio);
				context.lineCap = 'round';
				context.lineWidth = brushSize;
				context.strokeStyle = brushColor;
				context.fillStyle = fillColor;
				contextRef.current = context;
			};

			canvas.addEventListener('resize', handleResize);
			handleResize();
		}, [canvasHeight, canvasWidth]); // eslint-disable-line react-hooks/exhaustive-deps

		delete rest.drawingTool;

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
						brushColor,
						brushSize,
						fillColor
					})
				}
				onPointerUp={(ev) => finishDrawing({ev, contextRef, setIsDrawing})}
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
const DrawingDecorator = compose(ForwardRef({prop: 'drawingRef'}));

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
