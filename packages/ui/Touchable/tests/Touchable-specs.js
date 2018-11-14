/* eslint-disable enact/prop-types */
/* eslint-disable react/jsx-no-bind */

import React from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';

import Touchable from '../Touchable';
import {activate, deactivate} from '../state';
import {configure, getConfig, resetDefaultConfig} from '../config';

describe('Touchable', () => {
	const DivComponent = ({onClick, onMouseDown, onMouseLeave, onMouseUp}) => {
		return (
			<div
				onClick={onClick}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onMouseLeave={onMouseLeave}
			>
				Toggle
			</div>
		);
	};
	const preventDefault = (ev) => ev.preventDefault();

	describe('config', () => {

		beforeEach(resetDefaultConfig);
		afterEach(resetDefaultConfig);

		test(
			'should pass active state to the wrapped component when activeProp is configured',
			() => {
				const Component = Touchable({activeProp: 'pressed'}, DivComponent);
				const subject = shallow(
					<Component />
				);
				const wrapped = subject.find(DivComponent);

				const expected = true;
				const actual = 'pressed' in wrapped.props();

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
			const Component = Touchable(DivComponent);
			const handler = sinon.spy();
			const subject = mount(
				<Component onDown={handler} />
			);

			subject.simulate('mousedown', {});

			const expected = true;
			const actual = handler.calledOnce;

			expect(actual).toBe(expected);
		});
	});

	describe('#onUp', () => {
		test('should invoke onUp handle on mouse up', () => {
			const Component = Touchable({activeProp: 'pressed'}, DivComponent);
			const handler = sinon.spy();
			const subject = mount(
				<Component onUp={handler} />
			);

			const ev = {};
			subject.simulate('mousedown', ev);
			subject.simulate('mouseup', ev);

			const expected = true;
			const actual = handler.calledOnce;

			expect(actual).toBe(expected);
		});
	});

	describe('#onTap', () => {
		test('should be called on mouse up', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = sinon.spy();
			const subject = mount(
				<Component onTap={handler} />
			);

			const ev = {};
			subject.simulate('mousedown', ev);
			subject.simulate('mouseup', ev);

			const expected = true;
			const actual = handler.calledOnce;

			expect(actual).toBe(expected);
		});

		test('should be called on click', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = sinon.spy();
			const subject = mount(
				<Component onTap={handler} />
			);

			subject.simulate('click');

			const expected = true;
			const actual = handler.calledOnce;

			expect(actual).toBe(expected);
		});

		test('should be called before onClick on click', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = sinon.spy();
			const subject = mount(
				<Component onTap={handler} onClick={handler} />
			);

			subject.simulate('click');

			const expected = ['onTap', 'click'];
			const actual = handler.getCalls().map(call => call.args[0].type);

			expect(actual).toEqual(expected);
		});

		test('should be called before onCLick on mouse up', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = sinon.spy();
			const subject = mount(
				<Component onTap={handler} onClick={handler} />
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
			const actual = handler.getCalls().map(call => call.args[0].type);

			expect(actual).toEqual(expected);
		});

		test('should be preventable via onUp handler', () => {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = sinon.spy();
			const subject = mount(
				<Component onTap={handler} onUp={preventDefault} />
			);

			const ev = {};
			subject.simulate('mousedown', ev);
			subject.simulate('mouseup', ev);

			const expected = false;
			const actual = handler.calledOnce;

			expect(actual).toBe(expected);
		});
	});

	describe('state management', () => {
		describe('activate', () => {
			test('should return null when active', () => {
				const state = {
					active: 2
				};

				const expected = null;
				const actual = activate(state);

				expect(actual).toBe(expected);
			});

			test('should return updated state when inactive', () => {
				const state = {
					active: 0
				};

				const expected = {active: 2};
				const actual = activate(state);

				expect(actual).toEqual(expected);
			});

			test(
				'should update active state on mouse down when activeProp is configured',
				() => {
					const Component = Touchable({activeProp: 'active'}, DivComponent);
					const handler = sinon.spy();
					const subject = mount(
						<Component onDown={handler} />
					);

					const ev = {};
					const beforeDown = subject.state('active');
					subject.simulate('mousedown', ev);
					const afterDown = subject.state('active');

					const expected = false;
					const actual = beforeDown === afterDown;

					expect(actual).toBe(expected);
				}
			);

			test(
				'should not update active state on mouse down when disabled',
				() => {
					const Component = Touchable({activeProp: 'active'}, DivComponent);
					const handler = sinon.spy();
					const subject = mount(
						<Component onDown={handler} disabled />
					);

					subject.simulate('mousedown', {});

					const expected = 0;
					const actual = subject.state('active');

					expect(actual).toBe(expected);
				}
			);

			test(
				'should not update active state on mouse down when preventDefault is called',
				() => {
					const Component = Touchable({activeProp: 'active'}, DivComponent);
					const handler = (ev) => ev.preventDefault();
					const subject = mount(
						<Component onDown={handler} />
					);

					subject.simulate('mousedown', {});

					const expected = 0;
					const actual = subject.state('active');

					expect(actual).toBe(expected);
				}
			);
		});

		describe('deactivate', () => {
			test('should return null when inactive', () => {
				const state = {
					active: 0
				};

				const expected = null;
				const actual = deactivate(state);

				expect(actual).toBe(expected);
			});

			test('should return updated state when active', () => {
				const state = {
					active: 2
				};

				const expected = {active: 0};
				const actual = deactivate(state);

				expect(actual).toEqual(expected);
			});

			test(
				'should update active state on mouse up when activeProp is configured',
				() => {
					const Component = Touchable({activeProp: 'active'}, DivComponent);
					const handler = sinon.spy();
					const subject = mount(
						<Component onDown={handler} />
					);

					const ev = {};
					subject.simulate('mousedown', ev);

					const beforeUp = subject.state('active');
					subject.simulate('mouseup', ev);
					const afterUp = subject.state('active');

					const expected = false;
					const actual = beforeUp === afterUp;

					expect(actual).toBe(expected);
				}
			);

			test(
				'should not update active state on mouse down when disabled',
				() => {
					const Component = Touchable({activeProp: 'active'}, DivComponent);
					const handler = sinon.spy();
					const subject = mount(
						<Component onDown={handler} disabled />
					);

					const ev = {};
					subject.simulate('mousedown', ev);

					const beforeUp = subject.state('active');
					subject.simulate('mouseup', ev);
					const afterUp = subject.state('active');

					const expected = true;
					const actual = beforeUp === afterUp;

					expect(actual).toBe(expected);
				}
			);

			test(
				'should not update active state on mouse down when preventDefault is called',
				() => {
					const Component = Touchable({activeProp: 'active'}, DivComponent);
					const subject = mount(
						<Component onDown={preventDefault} />
					);

					const ev = {};
					subject.simulate('mousedown', ev);

					const beforeUp = subject.state('active');
					subject.simulate('mouseup', ev);
					const afterUp = subject.state('active');

					const expected = true;
					const actual = beforeUp === afterUp;

					expect(actual).toBe(expected);
				}
			);
		});
	});
});
