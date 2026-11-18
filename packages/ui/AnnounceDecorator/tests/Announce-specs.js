import {render} from '@testing-library/react';
import {createRef, StrictMode, useLayoutEffect, useRef} from 'react';

import Announce from '../Announce';

describe('Announce', () => {
	test('should have an announce method on the component', () => {
		const ref = createRef();
		render(<Announce ref={ref} />);

		const node = ref.current;

		const expected = 'function';
		const actual = typeof node.announce;

		expect(actual).toBe(expected);
	});

	test('should update the aria-label with the provided message', () => {
		const ref = createRef();
		const message = 'message';

		render(<Announce ref={ref} />);

		const node = ref.current;
		node.announce(message);

		const expected = message;
		// since we're manually updating the node in Announce, we have to manually check the node here
		const actual = node.alert.getAttribute('aria-label');

		expect(actual).toBe(expected);
	});

	test('should replace a pending message when clear is true and remove it after the timeout', () => {
		jest.useFakeTimers();
		const ref = createRef();

		render(<Announce ref={ref} />);

		ref.current.announce('first');
		ref.current.announce('second', true);

		expect(ref.current.alert.getAttribute('aria-label')).toBe('second');

		jest.advanceTimersByTime(500);

		expect(ref.current.alert.hasAttribute('aria-label')).toBe(false);

		jest.useRealTimers();
	});

	test('should not throw when unmounted before the announce timeout', () => {
		jest.useFakeTimers();
		const ref = createRef();

		const {unmount} = render(<Announce ref={ref} />);

		ref.current.announce('message');
		unmount();

		expect(() => {
			jest.advanceTimersByTime(500);
		}).not.toThrow();

		jest.useRealTimers();
	});

	test('should announce again after a strict-mode remount clears a pending timeout', () => {
		jest.useFakeTimers();
		const ref = createRef();

		function Harness () {
			const announceRef = useRef(null);
			const count = useRef(0);

			useLayoutEffect(() => {
				count.current += 1;
				announceRef.current.announce('message-' + count.current);
			});

			return (
				<Announce
					ref={(node) => {
						announceRef.current = node;
						ref.current = node;
					}}
				/>
			);
		}

		render(
			<StrictMode>
				<Harness />
			</StrictMode>
		);

		expect(ref.current.alert.getAttribute('aria-label')).toBe('message-2');

		jest.useRealTimers();
	});
});
