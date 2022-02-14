/* eslint-disable react-hooks/rules-of-hooks, react/jsx-no-bind */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useImperativeHandle, useEffect, useRef, useState} from 'react';

import EnactPropTypes from '../../core/internal/prop-types';
import ForwardRef from '../ForwardRef';

import css from './Drawing.module.less';

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

const DrawingBase = kind({
	name: 'Drawing',

	functional: true,

	propTypes: {
		brushColor: PropTypes.string,
		brushSize: PropTypes.number,
		canvasColor: PropTypes.string,
		disabled: PropTypes.bool,
		drawingRef: EnactPropTypes.ref,
		isErasing: PropTypes.bool,
		points: PropTypes.array,
		setIsDrawing: PropTypes.func
	},

	defaultProps: {
		brushColor: 'green',
		brushSize: 5,
		canvasColor: 'black',
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

		finisDrawing: (event) => {
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
		isErasing,
		finisDrawing,
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

const DrawingDecorator = compose(ForwardRef({prop: 'drawingRef'}));

const Drawing = DrawingDecorator(DrawingBase);

export default Drawing;
