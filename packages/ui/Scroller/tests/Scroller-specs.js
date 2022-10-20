import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import Scroller from '../Scroller';

describe('Scroller', () => {
	let contents;

	beforeEach(() => {
		contents = (
			<div>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
				Aenean id blandit nunc. Donec lacinia nisi vitae mi dictum, eget pulvinar nunc tincidunt. Integer vehicula tempus rutrum. Sed efficitur neque in arcu dignissim cursus.
			</div>
		);
	});

	afterEach(() => {
		contents = null;
	});

	describe('Scrollbar visibility', () => {
		test(
			'should render both horizontal and vertical scrollbars when \'horizontalScrollbar\' and \'verticalScrollbar\' are "visible"',
			() => {
				render(
					<Scroller
						data-testid="scroller"
						horizontalScrollbar="visible"
						verticalScrollbar="visible"
					>
						{contents}
					</Scroller>
				);

				const horizontalScrollbar = screen.getByTestId('scroller').children.item(1);
				const verticalScrollbar = screen.getByTestId('scroller').children.item(0).children.item(1);

				expect(horizontalScrollbar).toBeInTheDocument();
				expect(verticalScrollbar).toBeInTheDocument();
			}
		);

		test(
			'should render only vertical scrollbar when \'verticalScrollbar\' is "visible" and \'horizontalScrollbar\' is "hidden"',
			() => {
				render(
					<Scroller
						data-testid="scroller"
						horizontalScrollbar="hidden"
						verticalScrollbar="visible"
					>
						{contents}
					</Scroller>
				);

				const horizontalScrollbar = screen.getByTestId('scroller').children.item(1);
				const verticalScrollbar = screen.getByTestId('scroller').children.item(0).children.item(1);

				expect(horizontalScrollbar).toBeNull();
				expect(verticalScrollbar).toBeInTheDocument();
			}
		);

		test(
			'should not render any scrollbar when \'horizontalScrollbar\' and \'verticalScrollbar\' are "hidden"',
			() => {
				render(
					<Scroller
						data-testid="scroller"
						horizontalScrollbar="hidden"
						verticalScrollbar="hidden"
					>
						{contents}
					</Scroller>
				);

				const horizontalScrollbar = screen.getByTestId('scroller').children.item(1);
				const verticalScrollbar = screen.getByTestId('scroller').children.item(0).children.item(1);

				expect(horizontalScrollbar).toBeNull();
				expect(verticalScrollbar).toBeNull();
			}
		);
	});
});
