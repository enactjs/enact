import {isValidElement} from 'react';
import {mount, shallow} from 'enzyme';

import useAnnounce from '../useAnnounce';

describe('useAnnounce', () => {
	function Base ({children}) {
		return <div>{children}</div>;
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
		const subject = shallow(
			<Component />
		);

		const expected = 'function';
		const actual = typeof subject.prop('announce');

		expect(actual).toBe(expected);
	});

	test('should return a single element in children', () => {
		const subject = shallow(
			<Component />
		);

		const expected = true;
		const actual = isValidElement(subject.prop('children'));

		expect(actual).toBe(expected);
	});

	// this might be too specialized to the implmentation but we lack a better way to unit test this
	// capability right now
	test('should set the value passed to announce into the ARIA role="alert" node', () => {
		const text = '__NOTIFY__';
		const subject = mount(
			<Component />
		);

		subject.find(Base).invoke('announce')(text);
		subject.update();

		const expected = text;
		// Have to get the actual DOM node here since Announce updates the DOM directly so the
		// change isn't represented in either the React or Enzyme views
		const actual = subject.find({role: 'alert'}).instance().getAttribute('aria-label');

		expect(actual).toBe(expected);

	});

});
