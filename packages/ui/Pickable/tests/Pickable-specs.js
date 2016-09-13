/* globals describe, it, expect */

import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import Pickable from '../Pickable';

describe('Pickable Specs', () => {
	const testValue = 3;

	it('should accept a \'defaultValue\' prop', function () {
		const Component = Pickable('div');
		const subject = mount(
			<Component defaultValue={testValue} />
		);

		const expected = testValue;
		const actual = subject.prop('defaultValue');

		expect(actual).to.equal(expected);
	});

	it('should pass \'defaultValue\' prop as \'value\' to the wrapped component', function () {
		const Component = Pickable('div');
		const subject = mount(
			<Component defaultValue={testValue} />
		);
		const wrapped = subject.find('div');

		const expected = testValue;
		const actual = wrapped.prop('value');

		expect(actual).to.equal(expected);
	});

	it('should pass configured \'prop\' as the value\'s key to the wrapped component', function () {
		const prop = 'id';
		const Component = Pickable({prop: prop}, 'div');
		const subject = mount(
			<Component defaultId={testValue} />
		);
		const wrapped = subject.find('div');

		const expected = testValue;
		const actual = wrapped.prop(prop);

		expect(actual).to.equal(expected);
	});

	it('should pass \'onChange\' handler to the wrapped component', function () {
		const Component = Pickable('div');
		const subject = mount(
			<Component />
		);
		const wrapped = subject.find('div');

		const expected = true;
		const actual = (typeof wrapped.prop('onChange') === 'function');

		expect(actual).to.equal(expected);
	});

	it('should invoke \'onChange\' handler', function() {
		const handleChange = sinon.spy();
		const Component = Pickable('div');
		const subject = mount(
			<Component onChange={handleChange} />
		);
		subject.simulate('change', {});

		const expected = true;
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should pass configured handler to the wrapped component', function () {
		const handle = 'onModify';
		const Component = Pickable({pick: handle}, 'div');
		const subject = mount(
			<Component />
		);
		const wrapped = subject.find('div');

		const expected = true;
		const actual = (typeof wrapped.prop(handle) === 'function');

		expect(actual).to.equal(expected);
	});

});
