import {shallow, mount} from 'enzyme';
import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import Announce from '../Announce';

describe('Announce', () => {
// 	test('should have an announce method on the component', () => {
// 		const { container } = render(<Announce data-testid="announce" />);
// 		screen.debug();
// 		console.log(container.children.item(0));
// 		//const node = subject.instance();
// //console.log(node);
// 		const expected = 'function';
// 		const actual = typeof node.announce;
//
// 		expect(actual).toBe(expected);
// 	});

// 	test('should update the aria-label with the provided message', () => {
// 		const message = 'message';
// 		//const handleAnnounce = jest.fn();
// 		render(
// 			<Announce
// 				//announce={handleAnnounce}
// 				data-testid="announce" />
// 		);
//
// 		//fireEvent.handleAnnounce(message)
// 		fireEvent(screen.getByTestId('announce'), new CustomEvent('announce', { message }));
//
// 		const node = subject.instance();
// 		//node.announce(message);
// screen.debug();
// 		const expected = message;
// 		// since we're manually updating the node in Announce, we have to manually check the node here
// 		const actual = node.alert.getAttribute('aria-label');
//
// 		expect(actual).toBe(expected);
// 	});
});
