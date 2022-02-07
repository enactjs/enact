import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useRef, useEffect} from 'react';

import ForwardRef from '../ForwardRef';

import css from './Drawing.module.less';

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

const DrawingBase = kind({
	name: 'Drawing',

	functional: true,

	propTypes: {
		brushSize: PropTypes.number,
		color: PropTypes.string,
		isDrawing: PropTypes.bool,
		points: PropTypes.array,
		setIsDrawing: PropTypes.func
	},

	defaultProps: {
		brushSize: 5,
		color: '#FFF',
		isDrawing: false,
		points: []
	},

	styles: {
		css
	},

	handlers: {
		// setIsDrawing: (state, {isDrawing}) => {
		// 	isDrawing = true;
		// },

		draw: (event, {isDrawing, points}) => {
			const {beginPointRef,contextRef, ev} = event;
			const nativeEvent = ev.nativeEvent;

			if (!isDrawing) return;
			let offsetX, offsetY;
			if (nativeEvent.type === 'mousemove') {
				offsetX = nativeEvent.offsetX;
				offsetY = nativeEvent.offsetY;
			} else {
				offsetX = nativeEvent.targetTouches[0].pageX;
				offsetY = nativeEvent.targetTouches[0].pageY;
			}
			points.push({ x: offsetX, y: offsetY });

			if (points.length > 3) {
				const lastTwoPoints = points.slice(-2);
				const controlPoint = lastTwoPoints[0];
				const endPoint = {
					x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
					y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
				};
				drawing(beginPointRef.current, controlPoint, endPoint, contextRef);
				beginPointRef.current = endPoint;
			}
		},

		finisDrawing: (event, {setIsDrawing}) => {
			const {contextRef} = event;

			contextRef.current.closePath();
			setIsDrawing(false);
		},

		startDrawing: (event, {points, setIsDrawing}) => {
			const {beginPointRef, contextRef, ev} = event;
			const nativeEvent = ev.nativeEvent;

			const { offsetX, offsetY } = nativeEvent;
			contextRef.current.beginPath(); // start a canvas path
			contextRef.current.moveTo(offsetX, offsetY); //move the starting point to initial position
			points.push({ x: offsetX, y: offsetY });
			beginPointRef.current = { x: offsetX, y: offsetY };
			setIsDrawing(true);
		}
	},

	render: ({startDrawing, finisDrawing, draw, color, brushSize}) => {
		const beginPointRef = useRef(null);
		const canvasRef = useRef(null);
		const contextRef = useRef(null);

		useEffect(() => {
			const canvas = canvasRef.current;
			canvas.height = window.innerHeight / 2;
			canvas.width = window.innerWidth / 2;
			canvas.style.height = `${window.innerHeight / 2}px`;
			canvas.style.width = `${window.innerWidth / 2}px`;

			const context = canvas.getContext('2d');
			context.lineCap = 'round';
			context.lineWidth = brushSize;
			context.strokeStyle = color;

			contextRef.current = context;
		}, []);

		return (
			<canvas
				style={{ margin: '0 auto', width: '70vw', height: '70vh' }}
				className={'drawing-board__canvas'}
				ref={canvasRef}
				onMouseDown={(ev) => startDrawing({ev, contextRef, beginPointRef})}
				onMouseMove={(ev) => draw({contextRef, beginPointRef, ev})}
				onMouseUp={() => finisDrawing({contextRef})}
				onTouchStart={(ev) => startDrawing({ev, contextRef, beginPointRef})}
				onTouchMove={(ev) => draw({contextRef, beginPointRef, ev})}
				onTouchEnd={() => finisDrawing({contextRef})}
			/>
		)
	}
})

const DrawingDecorator = compose(
	ForwardRef({prop: 'canvasRef'}),
);

const Drawing = DrawingDecorator(DrawingBase);

export default Drawing;
