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

		it('should pass active state to the wrapped component when activeProp is configured', function () {
			const Component = Touchable({activeProp: 'pressed'}, DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = 'pressed' in wrapped.props();

			expect(actual).to.equal(expected);
		});

		it('should merge configurations', function () {
			configure({
				flick: {
					maxMoves: 10
				}
			});

			const expected = 10;
			const actual = getConfig().flick.maxMoves;

			expect(actual).to.equal(expected);
		});

		it('should omit unsupported configurations', function () {
			configure({
				flick: {
					notSupported: 10
				}
			});

			// eslint-disable-next-line no-undefined
			const expected = undefined;
			const actual = getConfig().flick.notSupported;

			expect(actual).to.equal(expected);
		});

		it('should not update config when local object is mutated', function () {
			const cfg = {
				flick: {
					maxMoves: 10
				}
			};

			configure(cfg);
			cfg.flick.maxMoves = 20;

			const expected = 10;
			const actual = getConfig().flick.maxMoves;

			expect(actual).to.equal(expected);
		});

		it('should not update config when local hold.events array is mutated', function () {
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

			expect(actual).to.equal(expected);
		});

	});

	describe('#onDown', () => {
		it('should invoke onDown handle on mouse down', function () {
			const Component = Touchable(DivComponent);
			const handler = sinon.spy();
			const subject = mount(
				<Component onDown={handler} />
			);

			subject.simulate('mousedown', {});

			const expected = true;
			const actual = handler.calledOnce;

			expect(actual).to.equal(expected);
		});
	});

	describe('#onUp', () => {
		it('should invoke onUp handle on mouse up', function () {
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

			expect(actual).to.equal(expected);
		});
	});

	describe('#onTap', () => {
		it('should be called on mouse up', function () {
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

			expect(actual).to.equal(expected);
		});

		it.only('should be called on click', function () {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const handler = sinon.spy();
			const subject = mount(
				<Component onTap={handler} />
			);

			subject.simulate('click');

			const expected = true;
			const actual = handler.calledOnce;

			expect(actual).to.equal(expected);
		});

		it('should be preventable via onUp handler', function () {
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

			expect(actual).to.equal(expected);
		});
	});

	describe('state management', () => {
		describe('activate', () => {
			it('should return null when active', () => {
				const state = {
					active: 2
				};

				const expected = null;
				const actual = activate(state);

				expect(actual).to.equal(expected);
			});

			it('should return updated state when inactive', () => {
				const state = {
					active: 0
				};

				const expected = {active: 2};
				const actual = activate(state);

				expect(actual).to.deep.equal(expected);
			});

			it('should update active state on mouse down when activeProp is configured', function () {
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

				expect(actual).to.equal(expected);
			});

			it('should not update active state on mouse down when disabled', function () {
				const Component = Touchable({activeProp: 'active'}, DivComponent);
				const handler = sinon.spy();
				const subject = mount(
					<Component onDown={handler} disabled />
				);

				subject.simulate('mousedown', {});

				const expected = 0;
				const actual = subject.state('active');

				expect(actual).to.equal(expected);
			});

			it('should not update active state on mouse down when preventDefault is called', function () {
				const Component = Touchable({activeProp: 'active'}, DivComponent);
				const handler = (ev) => ev.preventDefault();
				const subject = mount(
					<Component onDown={handler} />
				);

				subject.simulate('mousedown', {});

				const expected = 0;
				const actual = subject.state('active');

				expect(actual).to.equal(expected);
			});
		});

		describe('deactivate', () => {
			it('should return null when inactive', () => {
				const state = {
					active: 0
				};

				const expected = null;
				const actual = deactivate(state);

				expect(actual).to.equal(expected);
			});

			it('should return updated state when active', () => {
				const state = {
					active: 2
				};

				const expected = {active: 0};
				const actual = deactivate(state);

				expect(actual).to.deep.equal(expected);
			});

			it('should update active state on mouse up when activeProp is configured', function () {
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

				expect(actual).to.equal(expected);
			});

			it('should not update active state on mouse down when disabled', function () {
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

				expect(actual).to.equal(expected);
			});

			it('should not update active state on mouse down when preventDefault is called', function () {
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

				expect(actual).to.equal(expected);
			});
		});
	});
});
