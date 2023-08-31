import '@testing-library/jest-dom';
import {render} from '@testing-library/react';

import useHandlers from '../useHandlers';

describe('useHandlers', () => {
	let data = {};

	const context = {
		value: 1
	};

	function Component (props) {
		const handlers = useHandlers({
			testEvent: (ev, p, c) => {
				return ev(p, c);
			}
		}, props, context);

		data = {
			handlers
		};

		return (
			<div {...props} data-testid="divComponent" />
		);
	}

	// Sanity test for Component moreso than useHandlers test
	test('should include handlers in props', () => {
		render(<Component />);

		const actual = data.handlers.testEvent;

		expect(actual).toBeDefined();
	});

	test('should have the same reference across renders', () => {
		const {rerender} = render(<Component />);

		const expected = data.handlers.testEvent;

		rerender(<Component />);

		const actual = data.handlers.testEvent;

		expect(actual).toBe(expected);
	});

	test('should receive the event', () => {
		const spy = jest.fn();
		const {rerender} = render(<Component />);

		rerender(<Component>{'updated'}</Component>);

		data.handlers.testEvent(spy);

		expect(spy).toHaveBeenCalled();
	});

	test('should reflect the latest props', () => {
		const spy = jest.fn();
		const {rerender} = render(<Component />);

		rerender(<Component>{'updated'}</Component>);

		data.handlers.testEvent(spy);

		const expected = {children: 'updated'};
		const actual = spy.mock.calls[0][0];

		expect(actual).toMatchObject(expected);
	});

	test('should support component-driven context', () => {
		const spy = jest.fn();
		render(<Component />);

		data.handlers.testEvent(spy);

		// defined a "global" context to ease testability but this isn't representative of the
		// expected use case of this feature.
		const expected = context;
		const actual = spy.mock.calls[0][1];

		expect(actual).toMatchObject(expected);
	});

	test('should return the value from the handler', () => {
		const spy = jest.fn().mockImplementation(() => 'ok');
		render(<Component />);

		const returnValue = data.handlers.testEvent(spy);

		// defined a "global" context to ease testability but this isn't representative of the
		// expected use case of this feature.
		const expected = 'ok';

		expect(returnValue).toBe(expected);
	});
});
