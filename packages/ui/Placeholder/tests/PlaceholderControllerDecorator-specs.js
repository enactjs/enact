/* global HTMLElement */

import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';
import {useEffect} from 'react';

import {PlaceholderControllerDecorator, PlaceholderDecorator} from '../../Placeholder';

describe('PlaceholderControllerDecorator', () => {
	let data;

	const DivComponent = (props) => {
		useEffect(() => {
			data = props;
		}, [props]);

		return <div data-testid="component" {...props} />;
	};

	const Component = PlaceholderControllerDecorator(DivComponent);

	describe('config', () => {
		test('should pass \'onScroll\' handler to the wrapped component', () => {
			render(<Component />);

			expect(data).toHaveProperty('onScroll');

			const expected = 'function';
			const actual = typeof data.onScroll;

			expect(actual).toBe(expected);
		});

		describe('with measured offsets', () => {
			const offsets = ['offsetTop', 'offsetLeft', 'offsetHeight', 'offsetWidth'];
			let originalOffsets;

			const mockOffsets = (values) => {
				Object.keys(values).forEach((name) => {
					Object.defineProperty(HTMLElement.prototype, name, {configurable: true, get: () => values[name]});
				});
			};

			const Item = PlaceholderDecorator(() => <div>ready</div>);
			const List = (props) => (
				<div {...props}>
					<Item />
				</div>
			);

			beforeEach(() => {
				originalOffsets = offsets.map((name) => Object.getOwnPropertyDescriptor(HTMLElement.prototype, name));
			});

			afterEach(() => {
				offsets.forEach((name, index) => {
					if (originalOffsets[index]) {
						Object.defineProperty(HTMLElement.prototype, name, originalOffsets[index]);
					}
				});
			});

			test('should measure bounds from the container offset size', () => {
				mockOffsets({offsetTop: 0, offsetLeft: 0, offsetHeight: 100, offsetWidth: 200});

				const Controller = PlaceholderControllerDecorator(List);

				render(<Controller />);

				// A zero-size container would leave the placeholder in place. The measured size
				// makes the threshold large enough to render the real child.
				expect(screen.getByText('ready')).toBeInTheDocument();
			});

			test('should keep the placeholder for an item beyond the threshold', () => {
				// threshold = 100 * 1.5 = 150, so an item at 1000 stays a placeholder
				mockOffsets({offsetTop: 1000, offsetLeft: 0, offsetHeight: 100, offsetWidth: 100});

				const Controller = PlaceholderControllerDecorator(List);

				render(<Controller />);

				expect(screen.queryByText('ready')).toBeNull();
			});

			test('should use the `bounds` config instead of measuring the container', () => {
				mockOffsets({offsetTop: 1000, offsetLeft: 0, offsetHeight: 100, offsetWidth: 100});

				const Controller = PlaceholderControllerDecorator({bounds: {height: 1000, width: 1000}}, List);

				render(<Controller />);

				expect(screen.getByText('ready')).toBeInTheDocument();
			});

			test('should render the real child once scrolled within the threshold', () => {
				mockOffsets({offsetTop: 1000, offsetLeft: 0, offsetHeight: 100, offsetWidth: 100});

				let handleScroll;
				const ScrollList = ({onScroll, ...rest}) => {
					handleScroll = onScroll;

					return <List {...rest} />;
				};
				const Controller = PlaceholderControllerDecorator(ScrollList);

				render(<Controller />);

				expect(screen.queryByText('ready')).toBeNull();

				act(() => {
					handleScroll({scrollLeft: 0, scrollTop: 800});
				});

				expect(screen.getByText('ready')).toBeInTheDocument();
			});

			test('should forward the notify event to the wrapped component\'s handler', () => {
				const handleScroll = jest.fn();
				let notify;
				const ScrollList = ({onScroll, ...rest}) => {
					notify = onScroll;

					return <List {...rest} />;
				};
				const Controller = PlaceholderControllerDecorator(ScrollList);

				render(<Controller onScroll={handleScroll} />);

				act(() => {
					notify({scrollLeft: 0, scrollTop: 10});
				});

				expect(handleScroll).toHaveBeenCalledTimes(1);
				expect(handleScroll.mock.calls[0][0]).toMatchObject({scrollTop: 10});
			});
		});
	});
});
