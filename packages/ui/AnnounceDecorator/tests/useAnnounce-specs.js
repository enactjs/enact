import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';
import {useEffect} from 'react';

import useAnnounce from '../useAnnounce';

describe('useAnnounce', () => {
	let announceType;

	function Base ({children, announce}) {
		useEffect(() => {
			announceType = typeof announce;
		}, [announce]);

		return <div data-testid="announce">{children}</div>;
	}

	function Component () {
		const {announce, children} = useAnnounce();

		return (
			<Base announce={announce}>
				{children}
			</Base>
		);
	}

	test('should return an announce function', () => {
		render(<Component />);

		const expected = 'function';

		expect(announceType).toBe(expected);
	});

	test('should return a single element in children', () => {
		render(<Component />);

		const expected = 1;
		const baseElementChildrenCount = screen.getByTestId('announce').children.length;

		expect(baseElementChildrenCount).toBe(expected);
	});

	test('should set the value passed to announce into the ARIA role="alert" node', () => {
		const text = '__NOTIFY__';
		let announceFn;
		function Announcer () {
			const {announce, children} = useAnnounce();
			announceFn = announce;

			return children;
		}
		render(<Announcer />);

		act(() => announceFn(text));

		expect(screen.getByRole('alert')).toHaveAttribute('aria-label', text);
	});

	test('should ignore announcements when its children are not rendered', () => {
		let announceFn;
		function Announcer () {
			const {announce} = useAnnounce();
			announceFn = announce;

			return null;
		}
		render(<Announcer />);

		expect(() => act(() => announceFn('__NOTIFY__'))).not.toThrow();
		expect(screen.queryByRole('alert')).toBeNull();
	});
});
