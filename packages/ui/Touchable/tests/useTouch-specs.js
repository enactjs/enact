import {createEvent, fireEvent, render, screen} from '@testing-library/react';

import {configure, getConfig, resetDefaultConfig} from '../config';
import useTouch from '../useTouch';

describe('useTouch', () => {
	let data;

	const DivComponent = (props) => {
		data = props;

		return (<div data-testid="component" />);
	};
	const TouchableComponent = ({activeProp, id, ...rest}) => {
		const hook = useTouch({getActive: !!activeProp, ...rest});
		return (
			<div
				id={id}
				{...hook.handlers}
			>
				<DivComponent
					{...{[activeProp]: hook.active}}
				/>
			</div>
		);
	};
	const preventDefault = (ev) => ev.preventDefault();

	describe('config', () => {
		beforeEach(resetDefaultConfig);
		afterEach(resetDefaultConfig);

		test('should return active state when activeProp is configured', () => {
			render(<TouchableComponent activeProp="active" />);
			const expected = data.active;

			expect(expected).toBeDefined();
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
			const handler = jest.fn();
			render(
				<TouchableComponent
					activeProp="active"
					onDown={handler}
				/>
			);
			const component = screen.getByTestId('component');

			fireEvent.mouseDown(component, {});

			const expected = 1;

			expect(handler).toHaveBeenCalledTimes(expected);
		});
	});

	describe('#onUp', () => {
		test('should invoke onUp handle on mouse up', () => {
			const handler = jest.fn();
			render(
				<TouchableComponent
					activeProp="active"
					onUp={handler}
				/>
			);
			const component = screen.getByTestId('component');

			fireEvent.mouseDown(component, {});
			fireEvent.mouseUp(component, {});

			const expected = 1;

			expect(handler).toHaveBeenCalledTimes(expected);
		});
	});

	describe('#onTap', () => {
		test('should be called on mouse up', () => {
			const handler = jest.fn();
			render(
				<TouchableComponent
					activeProp="active"
					onTap={handler}
				/>
			);
			const component = screen.getByTestId('component');

			fireEvent.mouseDown(component, {});
			fireEvent.mouseUp(component, {});

			const expected = 1;

			expect(handler).toHaveBeenCalledTimes(expected);
		});

		test('should be called on click', () => {
			const handler = jest.fn();
			render(
				<TouchableComponent
					activeProp="active"
					onTap={handler}
				/>
			);
			const component = screen.getByTestId('component');

			fireEvent.click(component, {});

			const expected = 1;

			expect(handler).toHaveBeenCalledTimes(expected);
		});

		test('should be called before onClick on click', () => {
			const handler = jest.fn();
			render(
				<TouchableComponent
					activeProp="active"
					onClick={handler}
					onTap={handler}
				/>
			);
			const component = screen.getByTestId('component');

			fireEvent.click(component, {});

			const expected = ['onTap', 'click'];
			const actual = handler.mock.calls.map(call => call[0].type);

			expect(actual).toEqual(expected);
		});

		test('should be called before onClick on mouse up', () => {
			const handler = jest.fn();
			render(
				<TouchableComponent
					activeProp="active"
					onClick={handler}
					onTap={handler}
				/>
			);
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
			const handler = jest.fn();
			render(
				<TouchableComponent
					activeProp="active"
					onTap={handler}
					onUp={preventDefault}
				/>
			);
			const component = screen.getByTestId('component');

			fireEvent.mouseDown(component, {});
			fireEvent.mouseUp(component, {});

			expect(handler).not.toHaveBeenCalled();
		});
	});

	describe('state management', () => {
		describe('activate', () => {
			test('should update active state on mouse down when activeProp is configured', () => {
				const handler = jest.fn();
				render(
					<TouchableComponent
						activeProp="active"
						onDown={handler}
					/>
				);
				const component = screen.getByTestId('component');

				const beforeDown = data.active;
				fireEvent.mouseDown(component, {});
				const afterDown = data.active;

				const expected = false;
				const actual = beforeDown === afterDown;

				expect(actual).toBe(expected);
			});

			test('should not update active state on mouse down when disabled', () => {
				const handler = jest.fn();
				render(
					<TouchableComponent
						activeProp="active"
						disabled
						onDown={handler}
					/>
				);
				const component = screen.getByTestId('component');

				fireEvent.mouseDown(component, {});

				const expected = false;
				const actual = data.active;

				expect(actual).toBe(expected);
			});

			test('should not update active state on mouse down when preventDefault is called', () => {
				render(
					<TouchableComponent
						activeProp="active"
						onDown={preventDefault}
					/>
				);
				const component = screen.getByTestId('component');

				fireEvent.mouseDown(component, {});

				const expected = false;
				const actual = data.active;

				expect(actual).toBe(expected);
			});
		});

		describe('deactivate', () => {
			test('should update active state on mouse up when activeProp is configured', () => {
				const handler = jest.fn();
				render(
					<TouchableComponent
						activeProp="active"
						onDown={handler}
					/>
				);
				const component = screen.getByTestId('component');

				fireEvent.mouseDown(component, {});
				const beforeUp = data.active;
				fireEvent.mouseUp(component, {});
				const afterUp = data.active;

				const expected = false;
				const actual = beforeUp === afterUp;

				expect(actual).toBe(expected);
			});

			test('should not update active state on mouse down when disabled', () => {
				const handler = jest.fn();
				render(
					<TouchableComponent
						activeProp="active"
						disabled
						onDown={handler}
					/>
				);
				const component = screen.getByTestId('component');

				fireEvent.mouseDown(component, {});
				const beforeUp = data.active;
				fireEvent.mouseUp(component, {});
				const afterUp = data.active;

				const expected = true;
				const actual = beforeUp === afterUp;

				expect(actual).toBe(expected);
			});

			test('should not update active state on mouse down when preventDefault is called', () => {
				render(
					<TouchableComponent
						activeProp="active"
						onDown={preventDefault}
					/>
				);
				const component = screen.getByTestId('component');

				fireEvent.mouseDown(component, {});
				const beforeUp = data.active;
				fireEvent.mouseUp(component, {});
				const afterUp = data.active;

				const expected = true;
				const actual = beforeUp === afterUp;

				expect(actual).toBe(expected);
			});
		});
	});

	describe('touch', () => {
		test('should only emit onTap once when tapping an child instance of Touchable', () => {
			const handler = jest.fn();
			const Component = () => {
				const outerHook = useTouch({onTap: handler});
				const innerHook = useTouch();
				return (
					<div
						id="outer"
						{...outerHook.handlers}
					>
						<div
							data-testid="inner"
							{...innerHook.handlers}
						>
							<DivComponent />
						</div>
					</div>
				);
			};
			render(
				<Component />
			);
			const inner = screen.getByTestId('inner');

			const mouseEvent = {
				timeStamp: 1
			};
			const touchEvent = {
				timeStamp: 1,
				changedTouches: [{clientX: 0, clientY: 0}],
				targetTouches: [{clientX: 0, clientY: 0}]
			};

			fireEvent.touchStart(inner, touchEvent);
			fireEvent.touchEnd(inner, touchEvent);
			fireEvent.mouseDown(inner, mouseEvent);
			fireEvent.mouseUp(inner, mouseEvent);

			expect(handler).toHaveBeenCalled();
		});
	});
});
