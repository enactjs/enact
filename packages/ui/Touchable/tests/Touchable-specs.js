import {act, createEvent, fireEvent, render, screen} from '@testing-library/react';

import {configure, getConfig, resetDefaultConfig} from '../config';
import Touchable from '../Touchable';

describe('Touchable', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	let data;

	const DivComponent = ({children = 'Toggle', id, onClick, onMouseDown, onMouseEnter, onMouseLeave, onMouseMove, onMouseUp, onTouchStart, onTouchEnd, ...props}) => {
		data = props;
		return (
			<div
				data-testid="component"
				id={id}
				onClick={onClick}
				onMouseDown={onMouseDown}
				onMouseEnter={onMouseEnter}
				onMouseMove={onMouseMove}
				onMouseUp={onMouseUp}
				onMouseLeave={onMouseLeave}
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
			>
				{children}
			</div>
		);
	};
	const preventDefault = (ev) => ev.preventDefault();

	describe('config', () => {
		beforeEach(resetDefaultConfig);
		afterEach(resetDefaultConfig);

		test('should pass active state to the wrapped component when activeProp is configured', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			render(<Component />);

			const expected = data.active;

			expect(expected).toBeDefined();
		});

		test('should update state configurations onHold events', (done) => {
			const holdConfig = {
				events: [
					{name: 'hold', time: 10}
				],
				frequency: 10
			};

			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			const {rerender} = render(<Component onHoldStart={() => {}} holdConfig={holdConfig} />);
			const component = screen.getByTestId('component');

			const ev = {};
			fireEvent.mouseDown(component, ev);
			rerender(<Component holdConfig={holdConfig} onHold={handler} onHoldStart={() => {}} />);

			jest.runOnlyPendingTimers();

			expect(handler).toHaveBeenCalled();
			done();
		});

		test('should update state configurations onHoldStart events', (done) => {
			const holdConfig = {
				events: [
					{name: 'hold', time: 10}
				],
				frequency: 10
			};

			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			const {rerender} = render(<Component holdConfig={holdConfig} onHold={() => {}} />);
			const component = screen.getByTestId('component');

			const ev = {};
			fireEvent.mouseDown(component, ev);
			rerender(<Component holdConfig={holdConfig} onHold={() => {}} onHoldStart={handler} />);

			jest.runOnlyPendingTimers();

			expect(handler).toHaveBeenCalled();
			done();
		});

		test('should not call onHoldStart if mouse leaved', (done) => {
			const holdConfig = {
				events: [
					{name: 'hold', time: 10}
				],
				frequency: 10
			};

			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			const {rerender} = render(<Component holdConfig={holdConfig} onHold={() => {}} />);
			const component = screen.getByTestId('component');

			const ev = {};
			fireEvent.mouseDown(component, ev);
			fireEvent.mouseLeave(component, ev);
			rerender(<Component holdConfig={holdConfig} onHold={() => {}} onHoldStart={handler} />);

			jest.runOnlyPendingTimers();

			expect(handler).not.toHaveBeenCalled();
			done();
		});

		test('should update state configurations onHoldEnd events', (done) => {
			const holdConfig = {
				events: [
					{name: 'hold', time: 10}
				],
				frequency: 10
			};

			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			const {rerender} = render(<Component holdConfig={holdConfig} onHold={() => {}} />);
			const component = screen.getByTestId('component');

			const ev = {currentTarget: {}};
			fireEvent.mouseDown(component, ev);
			fireEvent.mouseEnter(component, ev);
			rerender(<Component holdConfig={holdConfig} onHold={() => {}} onHoldEnd={handler} />);

			jest.runOnlyPendingTimers();

			fireEvent.mouseUp(component, ev);
			expect(handler).toHaveBeenCalled();
			done();
		});

		test('should update state configurations onHoldEnd events if holdConfig.cancelOnMove is true', (done) => {
			const holdConfig = {
				cancelOnMove: true,
				events: [
					{name: 'hold', time: 10}
				],
				frequency: 10
			};

			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			const {rerender} = render(<Component holdConfig={holdConfig} onHold={() => {}} />);
			const component = screen.getByTestId('component');

			const ev = {currentTarget: {}};
			fireEvent.mouseDown(component, ev);
			fireEvent.mouseMove(component, ev);
			rerender(<Component holdConfig={holdConfig} onHold={() => {}} onHoldEnd={handler} />);

			jest.runOnlyPendingTimers();

			fireEvent.mouseUp(component, ev);
			expect(handler).toHaveBeenCalled();
			done();
		});

		test('should update state configurations onPinchStart events', (done) => {
			const pinchConfig = {
				global: true,
				moveTolerance: 0
			};

			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			const {rerender} = render(<Component pinchConfig={pinchConfig} onPinch={() => {}} />);
			const component = screen.getByTestId('component');

			const touchEvent = {
				timeStamp: 1,
				type: 'touch',
				clientX: 0, clientY: 0,
				changedTouches: [{clientX: 0, clientY: 0}, {clientX: 10, clientY: 10}],
				targetTouches: [{clientX: 0, clientY: 0}, {clientX: 10, clientY: 10}]
			};

			rerender(<Component pinchConfig={pinchConfig} onPinch={() => {}} onPinchStart={handler} />);

			fireEvent.touchStart(component, touchEvent);
			fireEvent.mouseDown(component, touchEvent);

			jest.runOnlyPendingTimers();

			expect(handler).toHaveBeenCalled();
			done();
		});

		test('should update state configurations onPinchEnd events', (done) => {
			const pinchConfig = {
				global: true,
				moveTolerance: 0
			};

			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			const {rerender} = render(<Component pinchConfig={pinchConfig} onPinch={() => {}} />);
			const component = screen.getByTestId('component');

			const touchEvent = {
				timeStamp: 1,
				type: 'touch',
				clientX: 0, clientY: 0,
				changedTouches: [{clientX: 0, clientY: 0}, {clientX: 10, clientY: 10}],
				targetTouches: [{clientX: 0, clientY: 0}, {clientX: 10, clientY: 10}]
			};

			fireEvent.touchStart(component, touchEvent);
			fireEvent.mouseDown(component, touchEvent);

			rerender(<Component pinchConfig={pinchConfig} onPinch={() => {}} onPinchEnd={handler} />);

			jest.runOnlyPendingTimers();

			fireEvent.touchEnd(component, touchEvent);
			fireEvent.mouseUp(component, touchEvent);

			expect(handler).toHaveBeenCalled();
			done();
		});

		test('should merge configurations', () => {
			configure({
				flick: {
					maxMoves: 10
				}
			});

			const expected = 10;
			const actual = getConfig().flick.maxMoves;

			expect(actual).toBe(expected);
		});

		test('should omit unsupported configurations', () => {
			configure({
				flick: {
					notSupported: 10
				}
			});

			// eslint-disable-next-line no-undefined
			const expected = undefined;
			const actual = getConfig().flick.notSupported;

			expect(actual).toBe(expected);
		});

		test('should call onFlick event', (done) => {
			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			render(<Component onFlick={handler} />);

			const component = screen.getByTestId('component');

			fireEvent.mouseDown(component, {clientX: 10, clientY: 20});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 20, clientY: 30});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 30, clientY: 40});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 40, clientY: 50});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseUp(component, {clientX: 40, clientY: 50});

			jest.runOnlyPendingTimers();

			expect(handler).toHaveBeenCalled();
			done();
		});

		test('should not update config when local object is mutated', () => {
			const cfg = {
				flick: {
					maxMoves: 10
				}
			};

			configure(cfg);
			cfg.flick.maxMoves = 20;

			const expected = 10;
			const actual = getConfig().flick.maxMoves;

			expect(actual).toBe(expected);
		});

		test('should not update config when local hold.events array is mutated', () => {
			const cfg = {
				hold: {
					events: [
						{name: 'hold', time: 600}
					]
				}
			};

			configure(cfg);
			cfg.hold.events[0].time = 2000;

			const expected = 600;
			const actual = getConfig().hold.events[0].time;

			expect(actual).toBe(expected);
		});

		test('should call onDragStart event', (done) => {
			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			const {rerender} = render(<Component onDrag={() => {}} />);

			const component = screen.getByTestId('component');

			fireEvent.mouseDown(component, {clientX: 10, clientY: 20});
			act(() => jest.advanceTimersByTime(20));

			rerender(<Component onDrag={() => {}} onDragStart={handler} />);

			jest.runOnlyPendingTimers();

			fireEvent.mouseEnter(component, {clientX: 10, clientY: 20});
			fireEvent.mouseMove(component, {clientX: 20, clientY: 30});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 30, clientY: 40});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 40, clientY: 50});
			fireEvent.mouseUp(component, {clientX: 40, clientY: 50});

			expect(handler).toHaveBeenCalled();
			done();
		});

		test('should call onDragEnd event', (done) => {
			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			const {rerender} = render(<Component onDrag={() => {}} />);

			const component = screen.getByTestId('component');

			fireEvent.mouseDown(component, {clientX: 10, clientY: 20});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 20, clientY: 30});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 30, clientY: 40});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 40, clientY: 50});
			rerender(<Component onDrag={() => {}} onDragEnd={handler} />);

			jest.runOnlyPendingTimers();

			fireEvent.mouseUp(component, {clientX: 40, clientY: 50});
			expect(handler).toHaveBeenCalled();
			done();
		});

		test('should not call onDragEnd on mouseLeave', (done) => {
			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			const {rerender} = render(<Component onDrag={() => {}} />);

			const component = screen.getByTestId('component');

			fireEvent.mouseDown(component, {clientX: 10, clientY: 20});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 20, clientY: 30});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 30, clientY: 40});
			act(() => jest.advanceTimersByTime(20));
			fireEvent.mouseMove(component, {clientX: 40, clientY: 50});
			rerender(<Component onDrag={() => {}} onDragEnd={handler} />);

			jest.runOnlyPendingTimers();

			fireEvent.mouseLeave(component);
			expect(handler).not.toHaveBeenCalled();
			done();
		});
	});

	describe('#onDown', () => {
		test('should invoke onDown handle on mouse down', () => {
			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			render(<Component onDown={handler} />);
			const component = screen.getByTestId('component');

			fireEvent.mouseDown(component, {});

			const expected = 1;

			expect(handler).toHaveBeenCalledTimes(expected);
		});
	});

	describe('#onUp', () => {
		test('should invoke onUp handle on mouse up', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = jest.fn();
			render(<Component onUp={handler} />);
			const component = screen.getByTestId('component');

			const ev = {};
			fireEvent.mouseDown(component, ev);
			fireEvent.mouseUp(component, ev);

			const expected = 1;

			expect(handler).toHaveBeenCalledTimes(expected);
		});
	});

	describe('#onTap', () => {
		test('should be called on mouse up', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = jest.fn();
			render(<Component onTap={handler} />);
			const component = screen.getByTestId('component');

			const ev = {};
			fireEvent.mouseDown(component, ev);
			fireEvent.mouseUp(component, ev);

			const expected = 1;

			expect(handler).toHaveBeenCalledTimes(expected);
		});

		test('should be called on click', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = jest.fn();
			render(<Component onTap={handler} />);
			const component = screen.getByTestId('component');

			fireEvent.click(component, {});

			const expected = 1;

			expect(handler).toHaveBeenCalledTimes(expected);
		});

		test('should be called before onClick on click', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = jest.fn();
			render(<Component onClick={handler} onTap={handler} />);
			const component = screen.getByTestId('component');

			fireEvent.click(component, {});

			const expected = ['onTap', 'click'];
			const actual = handler.mock.calls.map(call => call[0].type);

			expect(actual).toEqual(expected);
		});

		test('should be called before onClick on mouse up', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = jest.fn();
			render(<Component onClick={handler} onTap={handler} />);
			const component = screen.getByTestId('component');

			const mouseDownEvent = createEvent.mouseDown(component, {});
			const mouseUpEvent = createEvent.mouseUp(component, {});
			const clickEvent = createEvent.click(component, {});

			// a matching timeStamp is used by Touchable to prevent multiple onTaps on "true"
			// click (mouseup + click)
			Object.defineProperty(mouseDownEvent, 'timeStamp', {value: 1});
			Object.defineProperty(mouseUpEvent, 'timeStamp', {value: 1});
			Object.defineProperty(clickEvent, 'timeStamp', {value: 1});

			fireEvent(component, mouseDownEvent);
			fireEvent(component, mouseUpEvent);
			fireEvent(component, clickEvent);

			const expected = ['onTap', 'click'];
			const actual = handler.mock.calls.map(call => call[0].type);

			expect(actual).toEqual(expected);
		});

		test('should be preventable via onUp handler', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = jest.fn();
			render(<Component onTap={handler} onUp={preventDefault} />);
			const component = screen.getByTestId('component');

			const ev = {};
			fireEvent.mouseDown(component, ev);
			fireEvent.mouseUp(component, ev);

			expect(handler).not.toHaveBeenCalled();
		});
	});

	describe('state management', () => {
		describe('activate', () => {
			test('should update active state on mouse down when activeProp is configured', () => {
				const Component = Touchable({activeProp: 'active'}, DivComponent);
				const handler = jest.fn();
				render(<Component onDown={handler} />);
				const component = screen.getByTestId('component');

				const ev = {};
				const beforeDown = data.active;
				fireEvent.mouseDown(component, ev);
				const afterDown = data.active;

				const expected = false;
				const actual = beforeDown === afterDown;

				expect(actual).toBe(expected);
			});

			test('should not update active state on mouse down when disabled', () => {
				const Component = Touchable({activeProp: 'active'}, DivComponent);
				const handler = jest.fn();
				render(<Component disabled onDown={handler} />);
				const component = screen.getByTestId('component');

				fireEvent.mouseDown(component, {});

				const expected = false;
				const actual = data.active;

				expect(actual).toBe(expected);
			});

			test('should not update active state on mouse down when preventDefault is called', () => {
				const Component = Touchable({activeProp: 'active'}, DivComponent);
				const handler = (ev) => ev.preventDefault();
				render(<Component onDown={handler} />);
				const component = screen.getByTestId('component');

				fireEvent.mouseDown(component, {});

				const expected = false;
				const actual = data.active;

				expect(actual).toBe(expected);
			});
		});

		describe('deactivate', () => {
			test('should update active state on mouse up when activeProp is configured', () => {
				const Component = Touchable({activeProp: 'active'}, DivComponent);
				const handler = jest.fn();
				render(<Component onDown={handler} />);
				const component = screen.getByTestId('component');

				const ev = {};
				fireEvent.mouseDown(component, ev);

				const beforeUp = data.active;
				fireEvent.mouseUp(component, ev);
				const afterUp = data.active;

				const expected = false;
				const actual = beforeUp === afterUp;

				expect(actual).toBe(expected);
			});

			test('should not update active state on mouse down when disabled', () => {
				const Component = Touchable({activeProp: 'active'}, DivComponent);
				const handler = jest.fn();
				render(<Component disabled onDown={handler} />);
				const component = screen.getByTestId('component');

				const ev = {};
				fireEvent.mouseDown(component, ev);

				const beforeUp = data.active;
				fireEvent.mouseUp(component, ev);
				const afterUp = data.active;

				const expected = true;
				const actual = beforeUp === afterUp;

				expect(actual).toBe(expected);
			});

			test('should not update active state on mouse down when preventDefault is called', () => {
				const Component = Touchable({activeProp: 'active'}, DivComponent);
				render(<Component onDown={preventDefault} />);
				const component = screen.getByTestId('component');

				const ev = {};
				fireEvent.mouseDown(component, ev);

				const beforeUp = data.active;
				fireEvent.mouseUp(component, ev);
				const afterUp = data.active;

				const expected = true;
				const actual = beforeUp === afterUp;

				expect(actual).toBe(expected);
			});
		});
	});

	describe('touch', () => {
		test('should only emit onTap once when tapping an child instance of Touchable', () => {
			const Component = Touchable(DivComponent);
			const handler = jest.fn();
			render(
				<Component id="outer" onTap={handler}>
					<Component id="inner" />
				</Component>
			);
			const innerComponent = screen.getAllByTestId('component')[1];

			const mouseEvent = {
				timeStamp: 1
			};
			const touchEvent = {
				timeStamp: 1,
				changedTouches: [{clientX: 0, clientY: 0}],
				targetTouches: [{clientX: 0, clientY: 0}]
			};

			fireEvent.touchStart(innerComponent, touchEvent);
			fireEvent.touchEnd(innerComponent, touchEvent);
			fireEvent.mouseDown(innerComponent, mouseEvent);
			fireEvent.mouseUp(innerComponent, mouseEvent);

			expect(handler).toHaveBeenCalled();
		});
	});
});
