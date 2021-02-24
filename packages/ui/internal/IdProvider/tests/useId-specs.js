import {shallow, mount} from 'enzyme';

import useId from '../useId';

describe('useId', () => {
	function Base () {
		return null;
	}

	// eslint-disable-next-line enact/prop-types
	function Component ({key, prefix, onUnmount}) {
		const provider = useId({prefix});

		return <Base {...provider} id={provider.generateId(key, prefix, onUnmount)} />;
	}

	test('should provide a generateId method', () => {
		const subject = shallow(
			<Component />
		);

		const expected = 'function';
		const actual = typeof subject.find(Base).prop('generateId');

		expect(actual).toBe(expected);
	});

	test('should generate different ids for different instances of the same component', () => {
		const subject = mount(
			<div>
				<Component />
				<Component />
			</div>
		);

		const first = subject.find(Base).first().prop('id');
		const last = subject.find(Base).last().prop('id');

		expect(first).not.toBe(last);
	});

	test('should maintain the same id across renders', () => {
		const subject = shallow(
			<Component />
		);

		const expected = subject.find(Base).prop('id');

		subject.setProps({});

		const actual = subject.find(Base).prop('id');

		expect(actual).toBe(expected);
	});

	test('should prefix the id with the provided value', () => {
		const subject = shallow(
			<Component prefix="my-id" />
		);

		const expected = 'my-id';
		const actual = subject.find(Base).prop('id').substring(0, 5);

		expect(actual).toBe(expected);
	});

	test('should call onUnmount callback', () => {
		const spy = jest.fn();
		const subject = mount(
			<Component onUnmount={spy} />
		);

		subject.unmount();

		expect(spy).toHaveBeenCalledTimes(1);
	});
});
