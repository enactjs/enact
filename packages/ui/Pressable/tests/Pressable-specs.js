import React from 'react';
import {shallow, mount} from 'enzyme';
import Pressable from '../Pressable';
import sinon from 'sinon';

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

	it('Should pass key and mouse event handlers to Wrapped', function () {
		const DivComponent = () => <div>press</div>;

		const PressableDiv = Pressable(DivComponent);
		const wrapped = shallow(<PressableDiv useEnterKey />);

		const expectedMouseDown = 'onMouseDown';
		const expectedMouseUp = 'onMouseUp';
		const expectedKeyDown = 'onKeyDown';
		const expectedKeyUp = 'onKeyUp';
		const actual = wrapped.find('DivComponent').props();
		const expectedType = 'function';

		expect(actual).to.have.property(expectedMouseDown).to.be.a(expectedType);
		expect(actual).to.have.property(expectedMouseUp).to.be.a(expectedType);
		expect(actual).to.have.property(expectedKeyDown).to.be.a(expectedType);
		expect(actual).to.have.property(expectedKeyUp).to.be.a(expectedType);
	});

	it('should pass pressed to Wrapped in configured prop', function () {
		const DivComponent = () => <div>press</div>;

		const propPressed = 'pressed';
		const PressableDiv = Pressable({prop: propPressed}, DivComponent);
		const wrapped = shallow(
			<PressableDiv />
		);

		const expected = 'pressed';
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected);
	});


	it('should pass depress handlers to Wrapped in configured props', function () {
		const DivComponent = () => <div>press</div>;
		const mouseDownHandle = 'onDown';

		const PressableDiv = Pressable({depress: mouseDownHandle}, DivComponent);
		const wrapped = shallow(<PressableDiv />);

		const expected = mouseDownHandle;
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected).to.be.a('function');
	});

	it('should pass release handlers to Wrapped in configured props', function () {
		const DivComponent = () => <div>press</div>;
		const mouseDownHandle = 'onUp';

		const PressableDiv = Pressable({release: mouseDownHandle}, DivComponent);
		const wrapped = shallow(<PressableDiv />);

		const expected = mouseDownHandle;
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected).to.be.a('function');
	});

	it('should pass keyUp handlers to Wrapped in configured props', function () {
		const DivComponent = () => <div>press</div>;
		const keyHandle = 'onUp';

		const PressableDiv = Pressable({keyUp: keyHandle}, DivComponent);
		const wrapped = shallow(<PressableDiv useEnterKey />);

		const expected = keyHandle;
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected).to.be.a('function');
	});

	it('should pass keyDown handlers to Wrapped in configured props', function () {
		const DivComponent = () => <div>press</div>;
		const keyHandle = 'onDown';

		const PressableDiv = Pressable({keyUp: keyHandle}, DivComponent);
		const wrapped = shallow(<PressableDiv useEnterKey />);

		const expected = keyHandle;
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

	it('should invoke depress handler', function () {
		const mouseDownCB = sinon.spy();

		const DivComponent = () =>
			<div onMouseDown={mouseDownCB}>press</div>;

		const PressableDiv = Pressable(DivComponent);
		const wrapped = mount(<PressableDiv onMouseDown={mouseDownCB} />);
		wrapped.find('DivComponent').simulate('mousedown');

		const expected = true;
		const actual = mouseDownCB.called;

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

	it('should invoke release handler', function () {
		const mouseSpy = sinon.spy();

		const DivComponent = () =>
			<div onMouseUp={mouseSpy}>press</div>;

		const PressableDiv = Pressable(DivComponent);
		const wrapped = mount(<PressableDiv onMouseUp={mouseSpy} />);
		wrapped.find('DivComponent').simulate('mouseup');

		const expected = true;
		const actual = mouseSpy.called;

		expect(actual).to.equal(expected);
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
});
