/* eslint-disable enact/prop-types */
import React from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';

import Touchable from '../Touchable';
import {activate, deactivate} from '../state';

describe('Touchable', () => {
	const DivComponent = ({onMouseDown, onMouseLeave, onMouseUp}) => {
		return (
			<div
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onMouseLeave={onMouseLeave}
			>
				Toggle
			</div>
		);
	};
	const fn = () => true;
	const preventDefault = (ev) => ev.preventDefault();

	describe('config', () => {
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
	});

	describe('#onDown', () => {
		it('should pass onMouseDown prop when onDown prop is provided', function () {
			const Component = Touchable(DivComponent);
			const subject = shallow(
				<Component onDown={fn} />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = 'onMouseDown' in wrapped.props();

			expect(actual).to.equal(expected);
		});

		it('should pass onMouseDown prop when activeProp is configured', function () {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = 'onMouseDown' in wrapped.props();

			expect(actual).to.equal(expected);
		});

		it('should not pass onMouseDown prop when neither activeProp is configured nor onDown prop is provided', function () {
			const Component = Touchable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = false;
			const actual = 'onMouseDown' in wrapped.props();

			expect(actual).to.equal(expected);
		});

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
		it('should pass onMouseUp prop when onUp prop is provided', function () {
			const Component = Touchable(DivComponent);
			const subject = shallow(
				<Component onUp={fn} />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = 'onMouseUp' in wrapped.props();

			expect(actual).to.equal(expected);
		});

		it('should pass onMouseUp prop when activeProp is configured', function () {
			const Component = Touchable({activeProp: 'active'}, DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = 'onMouseUp' in wrapped.props();

			expect(actual).to.equal(expected);
		});

		it('should not pass onMouseUp prop when neither activeProp is configured nor onUp prop is provided', function () {
			const Component = Touchable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = false;
			const actual = 'onMouseUp' in wrapped.props();

			expect(actual).to.equal(expected);
		});

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

			it('should update active state on mouse leave when cancelOnLeave is set and activeProp is configured', function () {
				const Component = Touchable({activeProp: 'active'}, DivComponent);
				const handler = sinon.spy();
				const subject = mount(
					<Component onDown={handler} cancelOnLeave />
				);

				const ev = {};
				subject.simulate('mousedown', ev);

				const beforeUp = subject.state('active');
				subject.simulate('mouseleave', ev);
				const afterUp = subject.state('active');

				const expected = false;
				const actual = beforeUp === afterUp;

				expect(actual).to.equal(expected);
			});

			it('should not update active state on mouse leave when cancelOnLeave is not set and activeProp is configured', function () {
				const Component = Touchable({activeProp: 'active'}, DivComponent);
				const handler = sinon.spy();
				const subject = mount(
					<Component onDown={handler} />
				);

				const ev = {};
				subject.simulate('mousedown', ev);

				const beforeUp = subject.state('active');
				subject.simulate('mouseleave', ev);
				const afterUp = subject.state('active');

				const expected = true;
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
