/* eslint-disable enact/prop-types */
/* eslint-disable react/jsx-no-bind */

import {shallow, mount} from 'enzyme';

import useTouch from '../useTouch';
import {configure, getConfig, resetDefaultConfig} from '../config';

describe('useTouch', () => {

	const DivComponent = () => (<div />);
	const TouchableComponent = ({id, activeProp, ...rest}) => {
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

		test(
			'should return active state when activeProp is configured',
			() => {
				const subject = shallow(
					<TouchableComponent activeProp="active" />
				);
				const wrapped = subject.find(DivComponent);

				const expected = true;
				const actual = 'active' in wrapped.props();

				expect(actual).toBe(expected);
			}
		);

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

		test(
			'should not update config when local hold.events array is mutated',
			() => {
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
			}
		);

	});

	describe('#onDown', () => {
		test('should invoke onDown handle on mouse down', () => {
			const handler = jest.fn();
			const subject = mount(
				<TouchableComponent
					activeProp="active"
					onDown={handler}
				/>
			);
			subject.simulate('mousedown', {});

			const expected = 1;
			const actual = handler.mock.calls.length;

			expect(actual).toBe(expected);
		});
	});

	describe('#onUp', () => {
		test('should invoke onUp handle on mouse up', () => {
			const handler = jest.fn();
			const subject = mount(
				<TouchableComponent
					activeProp="active"
					onUp={handler}
				/>
			);
			subject.simulate('mousedown', {});
			subject.simulate('mouseup', {});

			const expected = 1;
			const actual = handler.mock.calls.length;

			expect(actual).toBe(expected);
		});
	});

	describe('#onTap', () => {
		test('should be called on mouse up', () => {
			const handler = jest.fn();
			const subject = mount(
				<TouchableComponent
					activeProp="active"
					onTap={handler}
				/>
			);
			subject.simulate('mousedown', {});
			subject.simulate('mouseup', {});

			const expected = 1;
			const actual = handler.mock.calls.length;

			expect(actual).toBe(expected);
		});

		test('should be called on click', () => {
			const handler = jest.fn();
			const subject = mount(
				<TouchableComponent
					activeProp="active"
					onTap={handler}
				/>
			);
			subject.simulate('click');

			const expected = 1;
			const actual = handler.mock.calls.length;

			expect(actual).toBe(expected);
		});

		test('should be called before onClick on click', () => {
			const handler = jest.fn();
			const subject = mount(
				<TouchableComponent
					activeProp="active"
					onClick={handler}
					onTap={handler}
				/>
			);
			subject.simulate('click');

			const expected = ['onTap', 'click'];
			const actual = handler.mock.calls.map(call => call[0].type);

			expect(actual).toEqual(expected);
		});

		test('should be called before onCLick on mouse up', () => {
			const handler = jest.fn();
			const subject = mount(
				<TouchableComponent
					activeProp="active"
					onClick={handler}
					onTap={handler}
				/>
			);
			const ev = {
				// a matching timeStamp is used by Touchable to prevent multiple onTaps on "true"
				// click (mouseup + click)
				timeStamp: 1
			};
			subject.simulate('mousedown', ev);
			subject.simulate('mouseup', ev);
			subject.simulate('click', ev);

			const expected = ['onTap', 'click'];
			const actual = handler.mock.calls.map(call => call[0].type);

			expect(actual).toEqual(expected);
		});

		test('should be preventable via onUp handler', () => {
			const handler = jest.fn();
			const subject = mount(
				<TouchableComponent
					activeProp="active"
					onTap={handler}
					onUp={preventDefault}
				/>
			);
			subject.simulate('mousedown', {});
			subject.simulate('mouseup', {});

			const expected = 0;
			const actual = handler.mock.calls.length;

			expect(actual).toBe(expected);
		});
	});

	describe('state management', () => {
		describe('activate', () => {
			test(
				'should update active state on mouse down when activeProp is configured',
				() => {
					const handler = jest.fn();
					const subject = mount(
						<TouchableComponent
							activeProp="active"
							onDown={handler}
						/>
					);
					const beforeDown = subject.find(DivComponent).prop('active');
					subject.simulate('mousedown', {});
					const afterDown = subject.find(DivComponent).prop('active');

					const expected = false;
					const actual = beforeDown === afterDown;

					expect(actual).toBe(expected);
				}
			);

			test(
				'should not update active state on mouse down when disabled',
				() => {
					const handler = jest.fn();
					const subject = mount(
						<TouchableComponent
							activeProp="active"
							disabled
							onDown={handler}
						/>
					);
					subject.simulate('mousedown', {});

					const expected = false;
					const actual = subject.find(DivComponent).prop('active');

					expect(actual).toBe(expected);
				}
			);

			test(
				'should not update active state on mouse down when preventDefault is called',
				() => {
					const subject = mount(
						<TouchableComponent
							activeProp="active"
							onDown={preventDefault}
						/>
					);
					subject.simulate('mousedown', {});

					const expected = false;
					const actual = subject.find(DivComponent).prop('active');

					expect(actual).toBe(expected);
				}
			);
		});

		describe('deactivate', () => {
			test(
				'should update active state on mouse up when activeProp is configured',
				() => {
					const handler = jest.fn();
					const subject = mount(
						<TouchableComponent
							activeProp="active"
							onDown={handler}
						/>
					);
					subject.simulate('mousedown', {});
					const beforeUp = subject.find(DivComponent).prop('active');
					subject.simulate('mouseup', {});
					const afterUp = subject.find(DivComponent).prop('active');

					const expected = false;
					const actual = beforeUp === afterUp;

					expect(actual).toBe(expected);
				}
			);

			test(
				'should not update active state on mouse down when disabled',
				() => {
					const handler = jest.fn();
					const subject = mount(
						<TouchableComponent
							activeProp="active"
							disabled
							onDown={handler}
						/>
					);
					subject.simulate('mousedown', {});
					const beforeUp = subject.find(DivComponent).prop('active');
					subject.simulate('mouseup', {});
					const afterUp = subject.find(DivComponent).prop('active');

					const expected = true;
					const actual = beforeUp === afterUp;

					expect(actual).toBe(expected);
				}
			);

			test(
				'should not update active state on mouse down when preventDefault is called',
				() => {
					const subject = mount(
						<TouchableComponent
							activeProp="active"
							onDown={preventDefault}
						/>
					);
					subject.simulate('mousedown', {});
					const beforeUp = subject.find(DivComponent).prop('active');
					subject.simulate('mouseup', {});
					const afterUp = subject.find(DivComponent).prop('active');

					const expected = true;
					const actual = beforeUp === afterUp;

					expect(actual).toBe(expected);
				}
			);
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
							id="inner"
							{...innerHook.handlers}
						>
							<DivComponent />
						</div>
					</div>
				);
			};
			const subject = mount(
				<Component />
			);
			const mouseEvent = {
				timeStamp: 1
			};
			const touchEvent = {
				timeStamp: 1,
				changedTouches: [{clientX: 0, clientY: 0}],
				targetTouches: [{clientX: 0, clientY: 0}]
			};
			const inner = subject.find('div#inner');
			inner.simulate('touchstart', touchEvent);
			inner.simulate('touchend', touchEvent);
			inner.simulate('mousedown', mouseEvent);
			inner.simulate('mouseup', mouseEvent);

			const expected = 1;
			const actual = handler.mock.calls.length;

			expect(actual).toBe(expected);
		});
	});
});
