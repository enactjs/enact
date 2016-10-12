import React from 'react';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import Selectable from '../Selectable';

describe('Selectable', () => {
	const testValue = 3;

	function DivComponent () {
		return <div />;
	}

	it('should pass \'defaultSelected\' prop as \'selected\' to the wrapped component', function () {
		const Component = Selectable(DivComponent);
		const subject = shallow(
			<Component defaultSelected={testValue} />
		);
		const wrapped = subject.find(DivComponent);

		const expected = testValue;
		const actual = wrapped.prop('selected');

		expect(actual).to.equal(expected);
	});

	it('should pass configured \'prop\' as the selected\'s key to the wrapped component', function () {
		const prop = 'items';
		const Component = Selectable({prop: prop}, DivComponent);
		const subject = shallow(
			<Component defaultItems={testValue} />
		);
		const wrapped = subject.find(DivComponent);

		const expected = testValue;
		const actual = wrapped.prop(prop);

		expect(actual).to.equal(expected);
	});

	it('should not pass \'selected\' with configured \'prop\'', function () {
		const prop = 'items';
		const Component = Selectable({prop: prop}, DivComponent);
		const subject = shallow(
			<Component defaultItems={testValue} />
		);
		const wrapped = subject.find(DivComponent);

		const expected = false;
		const actual = 'selected' in wrapped.props();

		expect(actual).to.equal(expected);
	});

	it('should pass \'onSelect\' handler to the wrapped component', function () {
		const Component = Selectable(DivComponent);
		const subject = shallow(
			<Component />
		);
		const wrapped = subject.find(DivComponent);

		const expected = true;
		const actual = (typeof wrapped.prop('onSelect') === 'function');

		expect(actual).to.equal(expected);
	});

	it('should invoke \'onSelect\' handler', function () {
		const handleSelect = sinon.spy();
		const Component = Selectable({prop: 'data-selected'}, DivComponent);
		const subject = shallow(
			<Component onSelect={handleSelect} />
		);
		subject.simulate('select', {});

		const expected = true;
		const actual = handleSelect.called;

		expect(actual).to.equal(expected);
	});

	it('should pass configured handler to the wrapped component', function () {
		const handle = 'onClick';
		const Component = Selectable({select: handle}, DivComponent);
		const subject = shallow(
			<Component />
		);
		const wrapped = subject.find(DivComponent);

		const expected = true;
		const actual = (typeof wrapped.prop(handle) === 'function');

		expect(actual).to.equal(expected);
	});

	it('should not allow new props to change selected when not mutable', function () {
		const Component = Selectable(DivComponent);
		const subject = shallow(
			<Component defaultSelected={testValue} />
		);

		subject.setProps({selected: testValue + 1});

		const wrapped = subject.find(DivComponent);

		const expected = testValue;
		const actual = wrapped.prop('selected');

		expect(actual).to.equal(expected);
	});

	it('should allow new props to change selected when mutable', function () {
		const Component = Selectable({mutable: true}, DivComponent);
		const subject = shallow(
			<Component defaultSelected={testValue} />
		);

		subject.setProps({selected: testValue + 1});

		const wrapped = subject.find(DivComponent);

		const expected = testValue + 1;
		const actual = wrapped.prop('selected');

		expect(actual).to.equal(expected);
	});

});
