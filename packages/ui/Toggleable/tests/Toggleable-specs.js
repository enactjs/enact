import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import Toggleable from '../Toggleable';

describe('Toggleable', () => {
	it('should accept a default active prop', function () {
		const DivComponent = () => <div>Toggle</div>;

		const ToggleableDiv = Toggleable(DivComponent);
		const wrapped = shallow(
			<ToggleableDiv defaultActive />
		);

		const expected = true;
		const actual = wrapped.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should pass active to Wrapped', function () {
		const DivComponent = () => <div>Toggle</div>;

		const ToggleableDiv = Toggleable(DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		const expected = 'active';
		const actual = wrapped.find(DivComponent).props();

		expect(actual).to.have.property(expected);
	});

	it('should pass handler to Wrapped', function () {
		const DivComponent = () => <div>Toggle</div>;

		const ToggleableDiv = Toggleable(DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		const expected = 'onToggle';
		const actual = wrapped.find(DivComponent).props();

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
		const actual = wrapped.find(DivComponent).props();

		expect(actual).to.have.property(expected);
	});

	it('should pass custom active prop to Wrapped Component in configured prop', function () {
		const DivComponent = () => <div>Toggle</div>;

		const defaultSelected = 'isSelected';
		const ToggleableDiv = Toggleable({prop: defaultSelected}, DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		const expected = defaultSelected;
		const actual = wrapped.find(DivComponent).props();

		expect(actual).to.have.property(expected);
	});

	it('should change active to true on click event', function () {
		const DivComponent = ({onToggle}) => <div onClick={onToggle}>Toggle</div>;

		const ToggleableDiv = Toggleable(DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		wrapped.find(DivComponent).simulate('toggle');

		const expected = true;
		const actual = wrapped.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should change active to true on mousedown event', function () {
		const DivComponent = ({onMouseDown}) =>
			<div onMouseDown={onMouseDown}>Toggle</div>;

		const ToggleableDiv = Toggleable({toggle: 'onMouseDown'}, DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		wrapped.find(DivComponent).simulate('mousedown');

		const expected = true;
		const actual = wrapped.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should call event handlers from props', function () {
		const DivComponent = ({onToggle}) => <div onClick={onToggle}>Toggle</div>;
		const handleClick = sinon.spy();

		const Component = Toggleable({prop: 'data-selected'}, DivComponent);
		const wrapped = shallow(<Component onClick={handleClick} />);

		wrapped.find(DivComponent).simulate('click', {});

		const expected = true;
		const actual = handleClick.calledOnce;

		expect(actual).to.equal(expected);
	});

});
