import React from 'react';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import Changeable from '../Changeable';

describe('Changeable', () => {
	const testValue = 3;

	function DivComponent () {
		return <div />;
	}

	it('should pass \'defaultValue\' prop as \'value\' to the wrapped component', function () {
		const Component = Changeable(DivComponent);
		const subject = shallow(
			<Component defaultValue={testValue} />
		);
		const wrapped = subject.find(DivComponent);

		const expected = testValue;
		const actual = wrapped.prop('value');

		expect(actual).to.equal(expected);
	});

	it('should pass configured \'prop\' as the value\'s key to the wrapped component', function () {
		const prop = 'id';
		const Component = Changeable({prop: prop}, DivComponent);
		const subject = shallow(
			<Component defaultId={testValue} />
		);
		const wrapped = subject.find(DivComponent);

		const expected = testValue;
		const actual = wrapped.prop(prop);

		expect(actual).to.equal(expected);
	});

	it('should not pass \'value\' with configured \'prop\'', function () {
		const prop = 'id';
		const Component = Changeable({prop: prop}, DivComponent);
		const subject = shallow(
			<Component defaultId={testValue} />
		);
		const wrapped = subject.find(DivComponent);

		const expected = void 0;
		const actual = wrapped.prop('value');

		expect(actual).to.equal(expected);
	});

	it('should pass \'onChange\' handler to the wrapped component', function () {
		const Component = Changeable(DivComponent);
		const subject = shallow(
			<Component />
		);
		const wrapped = subject.find(DivComponent);

		const expected = true;
		const actual = (typeof wrapped.prop('onChange') === 'function');

		expect(actual).to.equal(expected);
	});

	it('should invoke \'onChange\' handler', function () {
		const handleChange = sinon.spy();
		const Component = Changeable({prop: 'data-value'}, DivComponent);
		const subject = shallow(
			<Component onChange={handleChange} />
		);
		subject.simulate('change', {});

		const expected = true;
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should pass configured handler to the wrapped component', function () {
		const handle = 'onClick';
		const Component = Changeable({change: handle}, DivComponent);
		const subject = shallow(
			<Component />
		);
		const wrapped = subject.find(DivComponent);

		const expected = true;
		const actual = (typeof wrapped.prop(handle) === 'function');

		expect(actual).to.equal(expected);
	});

	it('should not allow new props to change value when not mutable', function () {
		const Component = Changeable(DivComponent);
		const subject = shallow(
			<Component defaultValue={testValue} />
		);

		subject.setProps({value: testValue + 1});

		const wrapped = subject.find(DivComponent);

		const expected = testValue;
		const actual = wrapped.prop('value');

		expect(actual).to.equal(expected);
	});

	it('should allow new props to change value when mutable', function () {
		const Component = Changeable({mutable: true}, DivComponent);
		const subject = shallow(
			<Component defaultValue={testValue} />
		);

		subject.setProps({value: testValue + 1});

		const wrapped = subject.find(DivComponent);

		const expected = testValue + 1;
		const actual = wrapped.prop('value');

		expect(actual).to.equal(expected);
	});

});
