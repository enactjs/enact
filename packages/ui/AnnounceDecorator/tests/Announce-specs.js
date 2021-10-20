import {render} from '@testing-library/react';

import Announce from '../Announce';

describe('Announce', () => {
	// TODO: add a new scenario that can work with testing library
	test.skip('should have an announce method on the component', () => {
		const {container} = render(<Announce data-testid="announce" />);

		const node = container.instance();

		const expected = 'function';
		const actual = typeof node.announce;

		expect(actual).toBe(expected);
	});

	// TODO: add a new scenario that can work with testing library
	test.skip('should update the aria-label with the provided message', () => {
		const message = 'message';

		const {container} = render(<Announce data-testid="announce" />);

		const node = container.instance();
		node.announce(message);

		const expected = message;
		// since we're manually updating the node in Announce, we have to manually check the node here
		const actual = node.alert.getAttribute('aria-label');

		expect(actual).toBe(expected);
	});
});
