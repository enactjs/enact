import React from 'react';
import sinon from 'sinon';
import {mount, shallow} from 'enzyme';
import Changeable from '../Changeable';

describe('Changeable', () => {
	const testValue = 3;

	function DivComponent () {
		return <div />;
	}

	describe('#config', function () {
		it('should pass \'value\' to the wrapped component', function () {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = 'value' in wrapped.props();

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
	});

	describe('#prop', function () {
		it('should use defaultValue prop when value prop is omitted', function () {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component defaultValue={1} />
			);

			const expected = 1;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).to.equal(expected);
		});

		it('should use defaultValue prop when value prop is null', function () {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component defaultValue={1} value={null} />
			);

			const expected = 1;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).to.equal(expected);
		});

		it('should use defaultValue prop when value prop is undefined', function () {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				// eslint-disable-next-line no-undefined
				<Component defaultValue={1} value={undefined} />
			);

			const expected = 1;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).to.equal(expected);
		});

		it('should use value prop when defined but falsy', function () {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component defaultValue={1} value={0} />
			);

			const expected = 0;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).to.equal(expected);
		});

		it('should use value prop when both value and defaultValue are defined', function () {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component defaultValue={1} value={2} />
			);

			const expected = 2;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).to.equal(expected);
		});
	});

	it('should invoke passed \'onChange\' handler', function () {
		const handleChange = sinon.spy();
		const Component = Changeable(DivComponent);
		const subject = shallow(
			<Component onChange={handleChange} />
		);
		subject.simulate('change', {});

		const expected = true;
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should not invoke passed \'onChange\' handler when \'disabled\'', function () {
		const handleChange = sinon.spy();
		const Component = Changeable(DivComponent);
		const subject = shallow(
			<Component onChange={handleChange} disabled />
		);
		subject.simulate('change', {});

		const expected = false;
		const actual = handleChange.called;

		expect(actual).to.equal(expected);
	});

	it('should update \'value\' when \'onChange\' invoked and is not controlled', function () {
		const Component = Changeable(DivComponent);
		const subject = mount(
			<Component defaultValue={0} />
		);

		subject.find(DivComponent).prop('onChange')({value: 1});
		subject.update();

		const expected = 1;
		const actual = subject.find(DivComponent).prop('value');

		expect(actual).to.equal(expected);
	});

	it('should not update \'value\' when \'onChange\' invoked and is not controlled but disabled', function () {
		const Component = Changeable(DivComponent);
		const subject = mount(
			<Component defaultValue={0} disabled />
		);

		subject.find(DivComponent).prop('onChange')({value: 1});

		const expected = 0;
		const actual = subject.find(DivComponent).prop('value');

		expect(actual).to.equal(expected);
	});

	it('should not update \'value\' when \'onChange\' invoked and is controlled', function () {
		const Component = Changeable(DivComponent);
		const subject = mount(
			<Component value={0} />
		);

		subject.find(DivComponent).prop('onChange')({value: 1});

		const expected = 0;
		const actual = subject.find(DivComponent).prop('value');

		expect(actual).to.equal(expected);
	});

	it('should update \'value\' with new props when is controlled', function () {
		const Component = Changeable(DivComponent);
		const subject = mount(
			<Component value={0} />
		);

		subject.setProps({value: 1});

		const expected = 1;
		const actual = subject.find(DivComponent).prop('value');

		expect(actual).to.equal(expected);
	});

	it.skip('should not update \'value\' with new props when is not controlled', function () {
		const Component = Changeable(DivComponent);
		const subject = mount(
			<Component defaultValue={0} />
		);

		subject.setProps({value: 1});

		const expected = 0;
		const actual = subject.find(DivComponent).prop('value');

		expect(actual).to.equal(expected);
	});

	it('should not update the value with new defaultProp when is not controlled', function () {
		const Component = Changeable(DivComponent);
		const subject = mount(
			<Component defaultValue={0} />
		);

		subject.setProps({defaultValue: 1});

		const expected = 0;
		const actual = subject.find(DivComponent).prop('value');

		expect(actual).to.equal(expected);
	});
});
