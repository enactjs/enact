import React from 'react';
import {mount, shallow} from 'enzyme';
import Changeable from '../Changeable';

describe('Changeable', () => {
	const testValue = 3;

	function DivComponent () {
		return <div />;
	}

	describe('#config', () => {
		test('should pass \'value\' to the wrapped component', () => {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = 'value' in wrapped.props();

			expect(actual).toBe(expected);
		});

		test(
			'should pass configured \'prop\' as the value\'s key to the wrapped component',
			() => {
				const prop = 'id';
				const Component = Changeable({prop: prop}, DivComponent);
				const subject = shallow(
					<Component defaultId={testValue} />
				);
				const wrapped = subject.find(DivComponent);

				const expected = testValue;
				const actual = wrapped.prop(prop);

				expect(actual).toBe(expected);
			}
		);

		test('should pass \'onChange\' handler to the wrapped component', () => {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = (typeof wrapped.prop('onChange') === 'function');

			expect(actual).toBe(expected);
		});

		test('should pass configured handler to the wrapped component', () => {
			const handle = 'onClick';
			const Component = Changeable({change: handle}, DivComponent);
			const subject = shallow(
				<Component />
			);
			const wrapped = subject.find(DivComponent);

			const expected = true;
			const actual = (typeof wrapped.prop(handle) === 'function');

			expect(actual).toBe(expected);
		});
	});

	describe('#prop', () => {
		test('should use defaultValue prop when value prop is omitted', () => {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component defaultValue={1} />
			);

			const expected = 1;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).toBe(expected);
		});

		test('should use defaultValue prop when value prop is null', () => {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component defaultValue={1} value={null} />
			);

			const expected = 1;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).toBe(expected);
		});

		test('should use defaultValue prop when value prop is undefined', () => {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				// eslint-disable-next-line no-undefined
				<Component defaultValue={1} value={undefined} />
			);

			const expected = 1;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).toBe(expected);
		});

		test('should use value prop when defined but falsy', () => {
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component defaultValue={1} value={0} />
			);

			const expected = 0;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).toBe(expected);
		});

		test(
			'should use value prop when both value and defaultValue are defined',
			() => {
				const Component = Changeable(DivComponent);
				const subject = shallow(
					<Component defaultValue={1} value={2} />
				);

				const expected = 2;
				const actual = subject.find(DivComponent).prop('value');

				expect(actual).toBe(expected);
			}
		);
	});

	test('should invoke passed \'onChange\' handler', () => {
		const handleChange = jest.fn();
		const Component = Changeable(DivComponent);
		const subject = shallow(
			<Component onChange={handleChange} />
		);
		subject.simulate('change', {});

		const expected = 1;
		const actual = handleChange.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test(
		'should not invoke passed \'onChange\' handler when \'disabled\'',
		() => {
			const handleChange = jest.fn();
			const Component = Changeable(DivComponent);
			const subject = shallow(
				<Component onChange={handleChange} disabled />
			);
			subject.simulate('change', {});

			const expected = 0;
			const actual = handleChange.mock.calls.length;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should update \'value\' when \'onChange\' invoked and is not controlled',
		() => {
			const Component = Changeable(DivComponent);
			const subject = mount(
				<Component defaultValue={0} />
			);

			subject.find(DivComponent).prop('onChange')({value: 1});
			subject.update();

			const expected = 1;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not update \'value\' when \'onChange\' invoked and is not controlled but disabled',
		() => {
			const Component = Changeable(DivComponent);
			const subject = mount(
				<Component defaultValue={0} disabled />
			);

			subject.find(DivComponent).prop('onChange')({value: 1});

			const expected = 0;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not update \'value\' when \'onChange\' invoked and is controlled',
		() => {
			const Component = Changeable(DivComponent);
			const subject = mount(
				<Component value={0} />
			);

			subject.find(DivComponent).prop('onChange')({value: 1});

			const expected = 0;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).toBe(expected);
		}
	);

	test('should update \'value\' with new props when is controlled', () => {
		const Component = Changeable(DivComponent);
		const subject = mount(
			<Component value={0} />
		);

		subject.setProps({value: 1});

		const expected = 1;
		const actual = subject.find(DivComponent).prop('value');

		expect(actual).toBe(expected);
	});

	test.skip(
		'should not update \'value\' with new props when is not controlled',
		() => {
			const Component = Changeable(DivComponent);
			const subject = mount(
				<Component defaultValue={0} />
			);

			subject.setProps({value: 1});

			const expected = 0;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not update the value with new defaultProp when is not controlled',
		() => {
			const Component = Changeable(DivComponent);
			const subject = mount(
				<Component defaultValue={0} />
			);

			subject.setProps({defaultValue: 1});

			const expected = 0;
			const actual = subject.find(DivComponent).prop('value');

			expect(actual).toBe(expected);
		}
	);
});
