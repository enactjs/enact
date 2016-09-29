import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Toggleable from '../Toggleable';

describe('Toggleable Specs', () => {
	it('should accept a default selected prop', function () {
		const DivComponent = () => <div>Toggle</div>;

		const defaultSelected = 'selectMe';
		const ToggleableDiv = Toggleable({prop: defaultSelected}, DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		const expected = wrapped.state('selected');

		const actual = wrapped.find('DivComponent').prop(defaultSelected);

		expect(actual).to.equal(expected);
	});

	it('should pass selected to Wrapped', function () {
		const DivComponent = () => <div>Toggle</div>;

		const ToggleableDiv = Toggleable(DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		const expected = 'selected';
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected);
	});

	it('should pass handler to Wrapped', function () {
		const DivComponent = () => <div>Toggle</div>;

		const ToggleableDiv = Toggleable(DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		const expected = 'onClick';
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected);
	});

	it('should pass custom toggle prop to Wrapped Component in configured prop', function () {
		const DivComponent = () => <div>Toggle</div>;

		const defaultSelected = 'toggleMe';
		const ToggleableDiv = Toggleable({toggle: defaultSelected}, DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		const expected = defaultSelected;
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected);
	});

	it('should pass custom selected prop to Wrapped Component in configured prop', function () {
		const DivComponent = () => <div>Toggle</div>;

		const defaultSelected = 'isSelected';
		const ToggleableDiv = Toggleable({prop: defaultSelected}, DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		const expected = defaultSelected;
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected);
	});

	it('should change selected to true on click event', function () {
		const DivComponent = ({onClick}) => <div onClick={onClick}>Toggle</div>;

		const ToggleableDiv = Toggleable(DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		wrapped.find('DivComponent').simulate('click');

		const expected = true;
		const actual = wrapped.find('DivComponent').prop('selected');

		expect(actual).to.equal(expected);
	});

	it('should change selected to true on mousedown event', function () {
		const DivComponent = ({onMouseDown}) =>
			<div onMouseDown={onMouseDown}>Toggle</div>;

		const ToggleableDiv = Toggleable({toggle: 'onMouseDown'}, DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		wrapped.find('DivComponent').simulate('mousedown');

		const expected = true;
		const actual = wrapped.find('DivComponent').prop('selected');

		expect(actual).to.equal(expected);
	});

	it('should call event handlers from props', function () {
		const handleClick = sinon.spy();

		const Component = Toggleable({prop: 'data-selected'}, 'div');
		const wrapped = shallow(<Component onClick={handleClick} />);

		wrapped.find('div').simulate('click', {});

		expect(handleClick.calledOnce).to.equal(true);
	});

});
