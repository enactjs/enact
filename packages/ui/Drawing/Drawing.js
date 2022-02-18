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

/*
 * Executes the drawing on the canvas.
 */
const drawing = (beginPoint, controlPoint, endPoint, contextRef, isErasing) => {
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
		 * Indicates if the drawing is in fill mode.
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		fillMode: PropTypes.bool,

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
		fillMode: false,
		isErasing: false,
		points: []
	},

	styles: {
		css,
		className: 'drawing',
		publicClassNames: true
	},

	handlers: {
		draw: (event, {points}) => {
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
					isErasing
				);
				beginPointRef.current = endPoint;
			}
		},

		finishDrawing: (event) => {
			const {contextRef, setIsDrawing} = event;

			contextRef.current.closePath();
			setIsDrawing(false);
		},

		startDrawing: (event, {points}) => {
			const {beginPointRef, contextRef, disabled, ev, setIsDrawing} = event;
			const nativeEvent = ev.nativeEvent;
			if (disabled) return;

			const {offsetX, offsetY} = nativeEvent;
			contextRef.current.beginPath(); // start a canvas path
			contextRef.current.moveTo(offsetX, offsetY); // move the starting point to initial position
			points.push({x: offsetX, y: offsetY});
			contextRef.current.lineTo(offsetX, offsetY); // draw a single point
			contextRef.current.stroke();
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
		fillMode,
		isErasing,
		finishDrawing,
		startDrawing,
		...rest
	}) => {

		const [isDrawing, setIsDrawing] = useState(false);
		const beginPointRef = useRef(null);
		const canvasRef = useRef(null);
		const contextRef = useRef(null);
		const [offset, setOffset] = useState();
		let cursors = {
			bucket: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAghJREFUeNrslj1uwjAUx5OKA+QIESeIxMgSRhaUhRE1YmDODSgzAxIbEyMSDDlCOABScoPmBuEGrv9pDK+O43yQTu2THoqesX9+X7YN46+J+eoCjDHrcrl4+J7P52lhTk3TTH9159vtNgSfqm3bbDqdfq5WqyPfmNM308LCMlRWy7LYYrEIERmjj/COx+NYhvi+zyBxHLPdbsccx3mM4f8vwWXo8XjMQfCMwoWEYfgY++DSG1SIDs55uR15bw09n8/+crlUQuvgURTlNtd1WStgsVOmg1K453l5jrMsy21BEOTzZrNZ3ATo8L6M5ALSQVUiwgzd7/eBFsr/7A+Hw0wHRfjgnUowBi/Rz2Ju4YQeKvJUBaVeIG9CVfOEwhFEsTMUUhRJ5YGBcWwOEaEFBzifbpdyWhdeuTeh+EZooaKYdNVenHZPURUS8tSXwIFSS/HduqoQw1ZVQG1F7uU3/JxOp/f7/V7KOWyTycRIkuTl8z1Nv2/JwWDwBBWN/cNbUal9eF6ZY1qlKDDR6LTgusIpdDQaZT9uKOrZ4XDwqqq9LVxupVIfC3DVWdoFXgulYN192QbeCErBt9vNq7s46uCNofTwwGnY5NaicPRnJyhEPNqagFXHK95W9H3VCCoue0xs8xjDwqr+h60J1CTvKYc/wpMO7zB3s9nkkVqv11e+xtX4F4V8CTAA/Hx+caeSjdgAAAAASUVORK5CYII=',
			eraser: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAIAAABLixI0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAE1JREFUeNpiZGXnYKASYAFiAQF+fT19Sky5eOnihw8fGYDucnF1+08ZAJoANIeJgXpg1KxRs0bNGjVr1KzBaxYjsMynVj3ESMX6ESDAANA2TPNF19FGAAAAAElFTkSuQmCC',
			pen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATFJREFUeNrs19FthDAMBuB0A0bICIyQERiB2yAjsEFGyAiMABuEDa5MEDZwceWc0oq6J52dp7MU8YL4sCOiH2N0qzeNazoX0MqtXiAiGEKAZVlgGIaCj5poKGhd4ziW7p0G6unBue97yDlf4eJjj9RR4nAa+10M7boOYoyAVw7HPacXlOkUO8FKKbE47j2N+/VO8cGI4x5yOKFAn9prKCLYzTM4oVEELfUkHkRRDp+mqYzXq6BXuHMOVMbL4dbatigWfs9v9I3+efa2Ri2lhMcB0AI1VTz5F5dEbRXOWFwSxRoKxOHS6HdIw7P1VzD7gWugWIv3/ioVPnANFAvmeb4KZjUeJMEPipvpHKXZ992s62q2bTPHcZR71nPdzvWpkYehiqeROlT/7XBaCZ+rLwEGAPhaImYfzD7mAAAAAElFTkSuQmCC'
		}
		let cursor = isErasing ? cursors.eraser : fillMode ? cursors.bucket : cursors.pen;

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
		}, [brushColor, brushSize]);

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

		return (
			<canvas
				{...rest}
				style={{
					backgroundColor: `${canvasColor}`,
					cursor: `url(${cursor}) 3 27, auto`
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
				onMouseUp={() => finishDrawing({contextRef, setIsDrawing})}
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
				onTouchEnd={() => finishDrawing({contextRef, setIsDrawing})}
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
