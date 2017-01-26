/* eslint-disable enact/prop-types */
import React from 'react';
import {mount, shallow} from 'enzyme';
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

	it('should not accept change to default active prop', function () {
		const DivComponent = () => <div>Toggle</div>;

		const ToggleableDiv = Toggleable(DivComponent);
		const wrapped = shallow(
			<ToggleableDiv defaultActive />
		);

		wrapped.setProps({defaultActive: false});

		const expected = true;
		const actual = wrapped.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should not accept active prop if not mutable', function () {
		const DivComponent = () => <div>Toggle</div>;

		const ToggleableDiv = Toggleable(DivComponent);
		const wrapped = shallow(
			<ToggleableDiv active />
		);

		const expected = false;
		const actual = wrapped.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should accept active prop if mutable', function () {
		const DivComponent = () => <div>Toggle</div>;

		const MutableToggleableDiv = Toggleable({mutable: true}, DivComponent);
		const wrapped = shallow(
			<MutableToggleableDiv active />
		);

		const expected = true;
		const actual = wrapped.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	it('should accept change to active prop if mutable', function () {
		const DivComponent = () => <div>Toggle</div>;

		const MutableToggleableDiv = Toggleable({mutable: true}, DivComponent);
		const wrapped = shallow(
			<MutableToggleableDiv active />
		);

		wrapped.setProps({active: false});

		const expected = false;
		const actual = wrapped.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
	});

	// Note: Active will be false, but should be passed in any case
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

	it('should pass deactivate handler to Wrapped if configured', function () {
		const DivComponent = () => <div>Toggle</div>;

		const DeactivatableToggleableDiv = Toggleable({deactivate: 'onDone'}, DivComponent);
		const wrapped = shallow(
			<DeactivatableToggleableDiv />
		);

		const expected = 'onDone';
		const actual = wrapped.find(DivComponent).props();

		expect(actual).to.have.property(expected);
	});

	it('should deactivate Wrapped on deactivate event', function () {
		const DivComponent = () => <div>Toggle</div>;

		const DeactivatableToggleableDiv = Toggleable({deactivate: 'onDone'}, DivComponent);
		const wrapped = shallow(
			<DeactivatableToggleableDiv defaultActive />
		);

		wrapped.find(DivComponent).simulate('done');

		const expected = false;
		const actual = wrapped.find(DivComponent).prop('active');

		expect(actual).to.equal(expected);
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

	it('should change active to true on configured event event', function () {
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
		const Component = Toggleable({prop: 'data-selected'}, DivComponent);

		const handleClick = sinon.spy();
		const wrapped = shallow(<Component onClick={handleClick} />);

		wrapped.find(DivComponent).simulate('click', {});

		const expected = true;
		const actual = handleClick.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should pass through configured event', function () {
		const DivComponent = ({onToggle}) => <div onClick={onToggle}>Toggle</div>;
		const Component = Toggleable({prop: 'data-selected'}, DivComponent);

		const handleToggle = sinon.spy();
		const wrapped = mount(<Component onToggle={handleToggle} />);

		wrapped.find(DivComponent).simulate('click', {});

		const expected = true;
		const actual = handleToggle.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should not call event for props changes when mutable', function () {
		const DivComponent = ({onToggle}) => <div onClick={onToggle}>Toggle</div>;
		const handleToggle = sinon.spy();

		const Component = Toggleable({prop: 'data-selected', mutable: true}, DivComponent);
		const wrapped = shallow(<Component onToggle={handleToggle} />);

		wrapped.setProps({active: true});

		const expected = false;
		const actual = handleToggle.called;

		expect(actual).to.equal(expected);
	});

});
