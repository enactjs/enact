import {mount} from 'enzyme';
import React from 'react';

import Scroller from '../Scroller';

describe('Scroller Specs', () => {
	let
		contents;

	beforeEach(() => {
		contents = <div>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
			Aenean id blandit nunc. Donec lacinia nisi vitae mi dictum, eget pulvinar nunc tincidunt. Integer vehicula tempus rutrum. Sed efficitur neque in arcu dignissim cursus.
		</div>;
	});

	afterEach(() => {
		contents = null;
	});

	describe('Set props Specs', () => {
		it('should render scrollbar horizontal, vertical', () => {
			const subject = mount(
				<Scroller
					horizontalScrollbar={'visible'}
					verticalScrollbar={'visible'}
				>
					{contents}
				</Scroller>
			);

			const expected = 2;
			const actual = subject.find('Scrollbar').length;

			expect(actual).to.equal(expected);
		});

		it('should render scrollbar vertical', () => {
			const subject = mount(
				<Scroller
					horizontalScrollbar={'hidden'}
					verticalScrollbar={'visible'}
				>
					{contents}
				</Scroller>
			);

			const expected = 1;
			const actual = subject.find('Scrollbar').length;

			expect(actual).to.equal(expected);
		});

		it('should not render scrollbar', () => {
			const subject = mount(
				<Scroller
					horizontalScrollbar={'hidden'}
					verticalScrollbar={'hidden'}
				>
					{contents}
				</Scroller>
			);

			const expected = 0;
			const actual = subject.find('Scrollbar').length;

			expect(actual).to.equal(expected);
		});
	});

	describe('Change props Specs', () => {
		it('should not render scrollbar', () => {
			const subject = mount(
				<Scroller
					horizontalScrollbar={'visible'}
					verticalScrollbar={'visible'}
				>
					{contents}
				</Scroller>
			);

			subject.setProps({horizontalScrollbar: 'hidden', verticalScrollbar: 'hidden'});

			const expected = 0;
			const actual = subject.find('Scrollbar').length;

			expect(actual).to.equal(expected);
		});

		it('should render scrollbar horizontal, vertical', () => {
			const subject = mount(
				<Scroller
					horizontalScrollbar={'hidden'}
					verticalScrollbar={'hidden'}
				>
					{contents}
				</Scroller>
			);

			subject.setProps({horizontalScrollbar: 'visible', verticalScrollbar: 'visible'});

			const expected = 2;
			const actual = subject.find('Scrollbar').length;

			expect(actual).to.equal(expected);
		});
	});
});
