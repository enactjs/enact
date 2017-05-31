import {mount} from 'enzyme';
import React from 'react';

import Scroller from '../Scroller';

describe('Scroller', () => {
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

	describe('Scrollbar visibility', () => {
		it('should render both horizontal and vertical scrollbars when \'horizontalScrollbar\' and \'verticalScrollbar\' are "visible"', () => {
			const subject = mount(
				<Scroller
					horizontalScrollbar="visible"
					verticalScrollbar="visible"
				>
					{contents}
				</Scroller>
			);

			const expected = 2;
			const actual = subject.find('Scrollbar').length;

			expect(actual).to.equal(expected);
		});

		it('should render only vertical scrollbar when \'verticalScrollbar\' is "visible" and \'horizontalScrollbar\' is "hidden"', () => {
			const subject = mount(
				<Scroller
					horizontalScrollbar="hidden"
					verticalScrollbar="visible"
				>
					{contents}
				</Scroller>
			);

			const expected = 1;
			const actual = subject.find('Scrollbar').length;

			expect(actual).to.equal(expected);
		});

		it('should not render any scrollbar when when \'horizontalScrollbar\' and \'verticalScrollbar\' are "hidden"', () => {
			const subject = mount(
				<Scroller
					horizontalScrollbar="hidden"
					verticalScrollbar="hidden"
				>
					{contents}
				</Scroller>
			);

			const expected = 0;
			const actual = subject.find('Scrollbar').length;

			expect(actual).to.equal(expected);
		});
	});
});
