import React from 'react';
import {shallow} from 'enzyme';
import Toggleable from '../Toggleable';
import sinon from 'sinon';

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

	it('should pass selected to Wrapped in configured prop', function () {
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

	it('should pass handler to Wrapped in configured prop', function () {
		const DivComponent = () => <div>Toggle</div>;

		const defaultSelected = 'selectMe';
		const ToggleableDiv = Toggleable({prop: defaultSelected}, DivComponent);
		const wrapped = shallow(
			<ToggleableDiv />
		);

		const expected = defaultSelected;
		const actual = wrapped.find('DivComponent').props();

		expect(actual).to.have.property(expected);
	});

	it('should invoke onClick', function () {
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

	it('should invoke onMouseDown', function () {
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

});
