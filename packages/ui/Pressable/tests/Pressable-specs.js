/* eslint-disable enact/prop-types */
import React from 'react';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';

import Pressable from '../Pressable';

describe('Pressable Specs', () => {

	it('Should pass pressed to Wrapped', function () {
		const DivComponent = () => <div>press</div>;

		const PressableDiv = Pressable(DivComponent);
		const wrapped = shallow(<PressableDiv />);

		const expected = 'pressed';
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected);
	});

	it('Should pass mouse event handlers to Wrapped', function () {
		const DivComponent = () => <div>press</div>;

		const PressableDiv = Pressable(DivComponent);
		const wrapped = shallow(<PressableDiv />);

		const expectedMouseDown = 'onMouseDown';
		const expectedMouseUp = 'onMouseUp';
		const actual = wrapped.find('DivComponent').props();
		const expectedType = 'function';

		expect(actual).to.have.property(expectedMouseDown).to.be.a(expectedType);
		expect(actual).to.have.property(expectedMouseUp).to.be.a(expectedType);
	});

	it('Should pass event handlers from array to Wrapped', function () {
		const DivComponent = () => <div>press</div>;

		const expectedMouseDown = 'onMouseDown';
		const expectedMouseUp = 'onMouseUp';
		const expectedTouchStart = 'onTouchStart';
		const expectedTouchEnd = 'onTouchEnd';
		const expectedType = 'function';

		const PressableDiv = Pressable({
			depress: [expectedMouseDown, expectedTouchStart],
			release: [expectedMouseUp, expectedTouchEnd]
		}, DivComponent);
		const wrapped = shallow(<PressableDiv />);

		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expectedMouseDown).to.be.a(expectedType);
		expect(actual).to.have.property(expectedMouseUp).to.be.a(expectedType);
		expect(actual).to.have.property(expectedTouchStart).to.be.a(expectedType);
		expect(actual).to.have.property(expectedTouchEnd).to.be.a(expectedType);
	});

	it('should pass custom pressed prop to Wrapped in configured prop', function () {
		const DivComponent = () => <div>press</div>;

		const propPressed = 'isPressed';
		const PressableDiv = Pressable({prop: propPressed}, DivComponent);
		const wrapped = shallow(
			<PressableDiv />
		);

		const expected = propPressed;
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected);
	});

	it('should pass custom depress prop to Wrapped in configured props', function () {
		const DivComponent = () => <div>press</div>;
		const mouseDownHandle = 'onDown';

		const PressableDiv = Pressable({depress: mouseDownHandle}, DivComponent);
		const wrapped = shallow(<PressableDiv />);

		const expected = mouseDownHandle;
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected).to.be.a('function');
	});

	it('should pass custom release prop to Wrapped in configured props', function () {
		const DivComponent = () => <div>press</div>;
		const mouseUpHandle = 'onUp';

		const PressableDiv = Pressable({release: mouseUpHandle}, DivComponent);
		const wrapped = shallow(<PressableDiv />);

		const expected = mouseUpHandle;
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected).to.be.a('function');
	});

	it('should cause pressed to be true on event', function () {
		const DivComponent = ({onMouseDown}) =>
			<div onMouseDown={onMouseDown}>press</div>;

		const PressableDiv = Pressable(DivComponent);
		const wrapped = mount(<PressableDiv />);
		wrapped.find('DivComponent').simulate('mousedown');

		const expected = true;
		const actual = wrapped.find('DivComponent').prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should cause pressed to be false on event', function () {
		const DivComponent = ({onMouseDown, onMouseUp}) =>
			<div
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
			>
				press
			</div>;

		const PressableDiv = Pressable(DivComponent);
		const wrapped = mount(<PressableDiv />);
		// check that pressed = true on mousedown works
		wrapped.find('DivComponent').simulate('mousedown');

		const expectedDown = true;
		const actualDown = wrapped.find('DivComponent').prop('pressed');

		expect(actualDown).to.equal(expectedDown);

		// check that pressed = false on mouseup works
		wrapped.find('DivComponent').simulate('mouseup');

		const expectedUp = false;
		const actualUp = wrapped.find('DivComponent').prop('pressed');
		expect(actualUp).to.equal(expectedUp);
	});

	it('should invoke custom depress handler', function () {
		const mouseHandle = 'onDepress';
		const DivComponent = () => <div>press</div>;

		const PressableDiv = Pressable({depress: mouseHandle}, DivComponent);
		const wrapped = mount(<PressableDiv />);
		wrapped.find('DivComponent').prop('onDepress')({});

		const expected = true;
		const actual = wrapped.find('DivComponent').prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should invoke custom release handler', function () {
		const mouseHandle = 'onRelease';
		const DivComponent = () => <div>press</div>;

		const PressableDiv = Pressable({release: mouseHandle}, DivComponent);
		const wrapped = shallow(<PressableDiv />);
		wrapped.find('DivComponent').prop('onRelease')({});

		const expected = false;
		const actual = wrapped.find('DivComponent').prop('pressed');

		expect(actual).to.equal(expected);
	});

	it('should call event handlers from props', function () {
		const handleRelease = sinon.spy();
		const handleDepress = sinon.spy();

		const Component = Pressable({prop: 'data-pressed'}, 'div');
		const wrapped = shallow(<Component onMouseUp={handleRelease} onMouseDown={handleDepress} />);

		wrapped.find('div').simulate('mousedown', {});
		wrapped.find('div').simulate('mouseup', {});

		expect(handleRelease.calledOnce).to.equal(true);
		expect(handleDepress.calledOnce).to.equal(true);
	});

});
