import kind from '../../core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {createRef} from 'react';

import css from './Drawing.module.less';
import Changeable from "../Changeable";

import { useEffect, useRef, useState } from 'react';

const DrawingBase = (props) => {
	console.log('App rerenders');
	const canvasRef = useRef(null);
	const contextRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [brushSize, setBrushSize] = useState(5);
	const [color, setColor] = useState('#fff');
	let points = [];
	const beginPointRef = useRef(null);
	useEffect(() => {
		// console.log('from useEffect');
		// console.log(window.innerHeight);
		// console.log(window.innerWidth);
		const canvas = canvasRef.current;
		canvas.width = window.innerWidth / 2;
		canvas.height = window.innerHeight / 2;
		canvas.style.width = `${window.innerWidth / 2}px`;
		canvas.style.height = `${window.innerHeight / 2}px`;

		const context = canvas.getContext('2d');
		// context.scale(2, 2);
		context.lineCap = 'round';
		context.strokeStyle = color;
		context.lineWidth = brushSize;

		contextRef.current = context;
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;

		const context = canvas.getContext('2d');
		context.lineWidth = brushSize;
		context.strokeStyle = color;
	}, [brushSize, color]);

	const clearCanvas = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		context.fillStyle = 'white';
		context.fillRect(0, 0, canvas.width, canvas.height);
	};

	const drawLine = (beginPoint, controlPoint, endPoint) => {
		// console.log('drawLine ....');
		// console.log(beginPoint);
		// console.log(controlPoint);
		// console.log(endPoint);
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

	const draw = ({ nativeEvent, ...rest }) => {
		// console.log(rest.targetTouches);
		// console.log('from draw');
		// console.log(rest.type);
		if (!isDrawing) return;
		let offsetX, offsetY;
		if (rest.type == 'mousemove') {
			offsetX = nativeEvent.offsetX;
			offsetY = nativeEvent.offsetY;
		} else {
			offsetX = rest.targetTouches[0].pageX;
			offsetY = rest.targetTouches[0].pageY;
		}
		points.push({ x: offsetX, y: offsetY });

		if (points.length > 3) {
			const lastTwoPoints = points.slice(-2);
			const controlPoint = lastTwoPoints[0];
			const endPoint = {
				x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
				y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
			};
			drawLine(beginPointRef.current, controlPoint, endPoint);
			beginPointRef.current = endPoint;
		}
		// console.log(points);
		// contextRef.current.lineTo(offsetX, offsetY); //keep creating points to the next coordinate
		// contextRef.current.stroke(); // paint previous points
		// console.log('draw');
		// console.log('x: ', offsetX, 'y: ', offsetY);
	};

	const startDrawing = ({ nativeEvent }) => {
		const { offsetX, offsetY } = nativeEvent;
		console.log('startDrawinh');
		console.log('x: ', offsetX, 'y: ', offsetY);
		contextRef.current.beginPath(); // start a canvas path
		contextRef.current.moveTo(offsetX, offsetY); //move the starting point to initial position
		points.push({ x: offsetX, y: offsetY });
		beginPointRef.current = { x: offsetX, y: offsetY };
		console.log('begin point');
		console.log(beginPointRef.current);
		setIsDrawing(true);
	};

	const finisDrawing = () => {
		console.log('finish');
		console.log(points);
		contextRef.current.closePath();
		setIsDrawing(false);
	};

	return (
		<canvas
			style={{ magin: '0 auto', width: '70vw', height: '70vh' }}
			className={'drawing-board__canvas'}
			ref={canvasRef}
			onMouseDown={startDrawing}
			onMouseMove={draw}
			onMouseUp={finisDrawing}
			onTouchStart={startDrawing}
			onTouchMove={draw}
			onTouchEnd={finisDrawing}
		/>
	);
}


const DrawingDecorator = compose(
	Changeable({change: 'startDrawing', prop: 'isDrawing'}),
	Changeable({change: 'finishDrawing', prop: 'isDrawing'})
);

const Drawing = DrawingDecorator(DrawingBase);

export default Drawing;