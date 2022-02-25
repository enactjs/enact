import {createEvent, fireEvent, render, screen} from '@testing-library/react';

import {configure, getConfig, resetDefaultConfig} from '../config';
import Touchable from '../Touchable';

describe('Touchable', () => {
	let data;

	const DivComponent = ({children = 'Toggle', id, onClick, onMouseDown, onMouseLeave, onMouseUp, onTouchStart, onTouchEnd, ...props}) => {
		data = props;
		return (
			<div
				data-testid="component"
				id={id}
				onClick={onClick}
				onMouseDown={onMouseDown}
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

			setTimeout(() => {
				expect(handler).toHaveBeenCalled();
				done();
			}, 20);
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

			setTimeout(() => {
				expect(handler).toHaveBeenCalled();
				done();
			}, 20);
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
			rerender(<Component holdConfig={holdConfig} onHold={() => {}} onHoldEnd={handler} />);

			setTimeout(() => {
				fireEvent.mouseUp(component, ev);
				expect(handler).toHaveBeenCalled();
				done();
			}, 30);
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
