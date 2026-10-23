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

		test('should not render a withref marker', () => {
			render(<Component />);

			expect(document.querySelector('[data-withref-target]')).toBeNull();
			expect(document.querySelector('[data-withref-id]')).toBeNull();
		});

		test('should measure bounds from the fragment client rects', () => {
			const rect = {bottom: 100, height: 100, left: 0, right: 200, top: 0, width: 200};
			const originalGetClientRects = global.Element.prototype.getClientRects;
			global.Element.prototype.getClientRects = () => [rect];

			const Item = PlaceholderDecorator(() => <div>ready</div>);
			const List = (props) => (
				<div {...props}>
					<Item />
				</div>
			);
			const Controller = PlaceholderControllerDecorator(List);

			render(<Controller />);

			// A zero-height container would leave the placeholder in place. The fragment rect
			// makes the threshold large enough to render the real child.
			expect(screen.getByText('ready')).toBeInTheDocument();

			global.Element.prototype.getClientRects = originalGetClientRects;
		});

		test('should correct a scaled client rect with the layout border box', () => {
			const rect = {bottom: 50, height: 50, left: 0, right: 100, top: 0, width: 100};
			const originalGetClientRects = global.Element.prototype.getClientRects;
			const originalResizeObserver = global.ResizeObserver;
			const offsets = ['offsetTop', 'offsetLeft', 'offsetHeight', 'offsetWidth'];
			const originalOffsets = offsets.map((name) => Object.getOwnPropertyDescriptor(HTMLElement.prototype, name));
			let resizeCallback = null;

			global.Element.prototype.getClientRects = () => [rect];
			Object.defineProperty(HTMLElement.prototype, 'offsetTop', {configurable: true, get: () => 160});
			Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {configurable: true, get: () => 0});
			Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {configurable: true, get: () => 10});
			Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {configurable: true, get: () => 10});
			global.ResizeObserver = class {
				constructor (callback) {
					resizeCallback = callback;
				}
				observe () {}
				unobserve () {}
				disconnect () {}
			};

			try {
				const Item = PlaceholderDecorator(() => <div>ready</div>);
				const List = (props) => (
					<div {...props}>
						<Item />
					</div>
				);
				const Controller = PlaceholderControllerDecorator(List);

				render(
					<div style={{transform: 'scale(0.5)'}}>
						<Controller />
					</div>
				);

				// 50 * 1.5 is below the placeholder, so the scaled estimate must not show it.
				expect(screen.queryByText('ready')).toBeNull();

				act(() => {
					resizeCallback([{}]);
				});

				expect(screen.queryByText('ready')).toBeNull();

				act(() => {
					resizeCallback([{borderBoxSize: [{blockSize: 200, inlineSize: 400}]}]);
				});

				expect(screen.getByText('ready')).toBeInTheDocument();

				act(() => {
					resizeCallback([{borderBoxSize: [{blockSize: 200, inlineSize: 400}]}]);
				});

				expect(screen.getByText('ready')).toBeInTheDocument();
			} finally {
				global.Element.prototype.getClientRects = originalGetClientRects;
				global.ResizeObserver = originalResizeObserver;
				offsets.forEach((name, index) => {
					if (originalOffsets[index]) {
						Object.defineProperty(HTMLElement.prototype, name, originalOffsets[index]);
					}
				});
			}
		});
	});
});
