import {render, screen} from '@testing-library/react';

import useAnnounce from '../useAnnounce';

describe('useAnnounce', () => {
	let announceType;

	function Base ({children, announce}) {
		announceType = typeof announce;
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

	// this might be too specialized to the implementation but we lack a better way to unit test this
	// capability right now
	// TODO: find a relevant scenario that works on testing-library
	test.skip('should set the value passed to announce into the ARIA role="alert" node', () => {
		const text = '__NOTIFY__';
		render(<Component data-testid="announce-test" />);

		const component = screen.getByTestId('announce-test');
		component.find(Base).invoke('announce')(text);
		component.update();

		const expected = text;
		// Have to get the actual DOM node here since Announce updates the DOM directly so the
		// change isn't represented in either the React or Enzyme views
		const actual = component.find({role: 'alert'}).instance().getAttribute('aria-label');

		expect(actual).toBe(expected);
	});
});
