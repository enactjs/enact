import {shallow} from 'enzyme';

import useHandlers from '../useHandlers';

describe('useHandlers', () => {
	const context = {
		value: 1
	};
	function Component (props) {
		const handlers = useHandlers({
			testEvent: (ev, p, c) => {
				return ev(p, c);
			}
		}, props, context);

		return (
			<div {...props} {...handlers} />
		);
	}

	// Sanity test for Component moreso than useHandlers test
	test('should include handlers in props', () => {
		const subject = shallow(<Component />);

		const expected = 'testEvent';
		const actual = subject.props();

		expect(actual).toHaveProperty(expected);
	});

	test('should have the same reference across renders', () => {
		const subject = shallow(<Component />);

		const expected = subject.prop('testEvent');

		subject.setProps({});

		const actual = subject.prop('testEvent');

		expect(actual).toBe(expected);
	});

	test('should receive the event', () => {
		const spy = jest.fn();
		const subject = shallow(<Component />);

		const props = {children: 'updated'};
		subject.setProps(props);

		subject.find('div').invoke('testEvent')(spy);

		expect(spy).toHaveBeenCalled();
	});

	test('should reflect the latest props', () => {
		const spy = jest.fn();
		const subject = shallow(<Component />);

		const props = {children: 'updated'};
		subject.setProps(props);

		subject.find('div').invoke('testEvent')(spy);

		const expected = props;
		const actual = spy.mock.calls[0][0];

		expect(actual).toMatchObject(expected);
	});

	test('should support component-driven context', () => {
		const spy = jest.fn();
		const subject = shallow(<Component />);

		subject.find('div').invoke('testEvent')(spy);

		// defined a "global" context to ease testability but this isn't representative of the
		// expected use case of this feature.
		const expected = context;
		const actual = spy.mock.calls[0][1];

		expect(actual).toMatchObject(expected);
	});

	test('should return the value from the handler', () => {
		const spy = jest.fn().mockImplementation(() => 'ok');
		const subject = shallow(<Component />);

		const returnValue = subject.find('div').invoke('testEvent')(spy);

		// defined a "global" context to ease testability but this isn't representative of the
		// expected use case of this feature.
		const expected = 'ok';
		const actual = returnValue;

		expect(actual).toBe(expected);
	});
});
