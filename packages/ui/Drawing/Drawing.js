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
import {useImperativeHandle, useEffect, useRef, useState} from 'react';

import ForwardRef from '../ForwardRef';

import css from './Drawing.module.less';

const fillDrawing = (event, contextRef) => {
	const canvas = contextRef.current.canvas;
	const startPos = relativePos(event, canvas);

	const data = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
	// An array with one place for each pixel in the image.
	const alreadyFilled = new Array(data.width * data.height);

	// This is a list of same-colored pixel coordinates that we have
	// not handled yet.
	const workList = [startPos];
	while (workList.length) {
		const pos = workList.pop();
		const offset = pos.x + data.width * pos.y;
		if (alreadyFilled[offset]) continue;

		contextRef.current.fillRect(pos.x, pos.y, 1, 1);
		alreadyFilled[offset] = true;

		forAllNeighbors(pos, function (neighbor) {
			if (neighbor.x >= 0 && neighbor.x < data.width &&
				neighbor.y >= 0 && neighbor.y < data.height &&
				isSameColor(data, startPos, neighbor)) {
				workList.push(neighbor);
			}
		});
	}
};

/*
 * Executes the drawing on the canvas.
 */
const drawing = (beginPoint, controlPoint, endPoint, contextRef, isErasing, event, drawingTool) => {
		contextRef.current.beginPath();
		if (isErasing) {
			contextRef.current.globalCompositeOperation = 'destination-out';
		} else {
			contextRef.current.globalCompositeOperation = 'source-over';
		}
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

// Call a given function for all horizontal and vertical neighbors
// of the given point.
function forAllNeighbors (point, fn) {
	fn({x: point.x, y: point.y + 1});
	fn({x: point.x, y: point.y - 1});
	fn({x: point.x + 1, y: point.y});
	fn({x: point.x - 1, y: point.y});
}

// Given two positions, returns true when they hold the same color.
function isSameColor (data, pos1, pos2) {
	const offset1 = (pos1.x + pos1.y * data.width) * 4;
	const offset2 = (pos2.x + pos2.y * data.width) * 4;

	const dr = data.data[offset1] - data.data[offset2];
	//console.log(dr);
	const dg = data.data[offset1+1] - data.data[offset2+1];
	const db = data.data[offset1+2] - data.data[offset2+2];
	const da = data.data[offset1+3] - data.data[offset2+3];
	if (dr * dr + dg * dg + db * db + da * da > 128*128) {
		//console.log("test")
		return false;
	}
	return true;
}

function relativePos (event, element) {
	const rect = element.getBoundingClientRect();
	return {x: Math.floor(event.clientX - rect.left),
		y: Math.floor(event.clientY - rect.top)};
}

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
		drawingTool: PropTypes.oneOf(['brush', 'fill']),

		/**
		 * Indicates the color used for filling a canvas area when `drawingTool` is set to `'fill'`.
		 *
		 * @type {String}
		 * @default 'red'
		 * @public
		 */
		fillColor: PropTypes.string,

		/**
		 * Indicates if the drawing is in erasing mode.
		 *
		 * When `true`, the canvas' globalCompositeOperation property will be 'destination-out'.
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		isErasing: PropTypes.bool,

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
		brushColor: 'green',
		brushSize: 5,
		canvasColor: 'black',
		drawingTool: 'brush',
		fillColor: 'red',
		isErasing: false,
		points: []
	},

	styles: {
		css,
		className: 'drawing',
		publicClassNames: true
	},

	handlers: {
		draw: (event, {drawingTool, points}) => {
			const {
				beginPointRef,
				contextRef,
				ev,
				isDrawing,
				isErasing,
				offset,
				setIsDrawing
			} = event;
			const nativeEvent = ev.nativeEvent;

			if (!isDrawing) return;
			let offsetX, offsetY;
			if (nativeEvent.type === 'mousemove') {
				offsetX = nativeEvent.offsetX;
				offsetY = nativeEvent.offsetY;
			} else {
				offsetX = nativeEvent.targetTouches[0].pageX - offset.x;
				offsetY = nativeEvent.targetTouches[0].pageY - offset.y;
			}
			if (
				offsetY > window.innerHeight / 1.5 ||
                offsetX > window.innerWidth / 1.5 ||
                offsetX < 0 ||
                offsetY < 0
			) {
				setIsDrawing(false);
				return;
			}
			points.push({x: offsetX, y: offsetY});

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
					contextRef,
					isErasing,
					ev,
					drawingTool
				);
				beginPointRef.current = endPoint;
			}
		},

		finisDrawing: (event) => {
			const {contextRef, setIsDrawing} = event;

			contextRef.current.closePath();
			setIsDrawing(false);
		},

		startDrawing: (event, {points, drawingTool}) => {
			const {beginPointRef, contextRef, disabled, ev, setIsDrawing} = event;
			const nativeEvent = ev.nativeEvent;
			if (disabled) return;

			const {offsetX, offsetY} = nativeEvent;
			contextRef.current.beginPath(); // start a canvas path
			contextRef.current.moveTo(offsetX, offsetY); // move the starting point to initial position
			points.push({x: offsetX, y: offsetY});

			if(drawingTool === 'brush') {
				contextRef.current.lineTo(offsetX, offsetY); // draw a single point
				contextRef.current.stroke();
			} else {
				fillDrawing(ev, contextRef);
			}

			beginPointRef.current = {x: offsetX, y: offsetY};
			setIsDrawing(true);
		}
	},

	render: ({
		brushColor,
		brushSize,
		canvasColor,
		disabled,
		draw,
		drawingRef,
		fillColor,
		finisDrawing,
		isErasing,
		startDrawing,
		...rest
	}) => {

		const [isDrawing, setIsDrawing] = useState(false);
		const beginPointRef = useRef(null);
		const canvasRef = useRef(null);
		const contextRef = useRef(null);
		const [offset, setOffset] = useState();

		useEffect(() => {
			const canvas = canvasRef.current;
			canvas.height = window.innerHeight / 1.5;
			canvas.width = window.innerWidth / 1.5;
			canvas.style.height = `${window.innerHeight / 1.5}px`;
			canvas.style.width = `${window.innerWidth / 1.5}px`;
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
				contextRef.current.globalCompositeOperation = 'source-over';
			}
		}));

		delete rest.drawingTool;

		return (
			<canvas
				{...rest}
				style={{
					backgroundColor: `${canvasColor}`
				}}
				ref={canvasRef}
				onMouseDown={(ev) =>
					startDrawing({
						setIsDrawing,
						ev,
						contextRef,
						disabled,
						beginPointRef
					})
				}
				onMouseMove={(ev) =>
					draw({
						isDrawing,
						isErasing,
						contextRef,
						beginPointRef,
						ev,
						setIsDrawing,
						offset
					})
				}
				onMouseUp={() => finisDrawing({contextRef, setIsDrawing})}
				onTouchStart={(ev) =>
					startDrawing({
						setIsDrawing,
						disabled,
						ev,
						contextRef,
						beginPointRef
					})
				}
				onTouchMove={(ev) =>
					draw({
						isDrawing,
						isErasing,
						contextRef,
						beginPointRef,
						ev,
						setIsDrawing,
						offset
					})
				}
				onTouchEnd={() => finisDrawing({contextRef, setIsDrawing})}
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
