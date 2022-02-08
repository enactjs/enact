import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import { useRef, useEffect, useState } from 'react';
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
        brushColor: PropTypes.string,
		canvasColor: PropTypes.string,
        points: PropTypes.array,
        setIsDrawing: PropTypes.func,
    },

    defaultProps: {
        brushSize: 5,
        brushColor: 'green',
		canvasColor: 'black',
        points: [],
    },

    styles: {
        css,
    },

    handlers: {
        clearCanvas: () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
        },

        draw: (event, { points }) => {
            const { beginPointRef, contextRef, ev, isDrawing, setIsDrawing } =
                event;
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
            if (
                offsetY > window.innerHeight / 2 ||
                offsetX > window.innerWidth / 2 ||
                offsetX < 0 ||
                offsetY < 0
            ) {
                setIsDrawing(false);
                return;
            }
            points.push({ x: offsetX, y: offsetY });

            if (points.length > 3) {
                const lastTwoPoints = points.slice(-2);
                const controlPoint = lastTwoPoints[0];
                const endPoint = {
                    x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
                    y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
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

        finisDrawing: (event) => {
            const { contextRef, setIsDrawing } = event;

            contextRef.current.closePath();
            setIsDrawing(false);
        },

        startDrawing: (event, { points }) => {
            const { beginPointRef, contextRef, ev, setIsDrawing } = event;
            const nativeEvent = ev.nativeEvent;

            const { offsetX, offsetY } = nativeEvent;
            contextRef.current.beginPath(); // start a canvas path
            contextRef.current.moveTo(offsetX, offsetY); //move the starting point to initial position
            points.push({ x: offsetX, y: offsetY });
            beginPointRef.current = { x: offsetX, y: offsetY };
            setIsDrawing(true);
        },
    },

    render: ({ startDrawing, finisDrawing, draw, brushColor, brushSize, canvasColor }) => {
        const [isDrawing, setIsDrawing] = useState(false);

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
            context.strokeStyle = brushColor;

            contextRef.current = context;
        }, []);

        useEffect(() => {
            const canvas = canvasRef.current;

            const context = canvas.getContext('2d');
            context.lineWidth = brushSize;
            context.strokeStyle = brushColor;
        }, [brushSize, brushColor]);

        return (
            <canvas
                style={{
                    margin: '0 auto',
                    width: '70vw',
                    height: '70vh',
                    border: '2px solid black',
					backgroundColor: `${canvasColor}`
                }}
                className={'drawing-board__canvas'}
                ref={canvasRef}
                onMouseDown={(ev) =>
                    startDrawing({
                        setIsDrawing,
                        ev,
                        contextRef,
                        beginPointRef,
                    })
                }
                onMouseMove={(ev) =>
                    draw({
                        isDrawing,
                        contextRef,
                        beginPointRef,
                        ev,
                        setIsDrawing,
                    })
                }
                onMouseUp={() => finisDrawing({ contextRef, setIsDrawing })}
                onTouchStart={(ev) =>
                    startDrawing({
                        setIsDrawing,
                        ev,
                        contextRef,
                        beginPointRef,
                    })
                }
                onTouchMove={(ev) =>
                    draw({
                        isDrawing,
                        contextRef,
                        beginPointRef,
                        ev,
                        setIsDrawing,
                    })
                }
                onTouchEnd={() => finisDrawing({ contextRef })}
            />
        );
    },
});

const DrawingDecorator = compose(ForwardRef({ prop: 'canvasRef' }));

const Drawing = DrawingDecorator(DrawingBase);

export default Drawing;
