/* global Node */

import {createRef, Fragment} from 'react';
import {render, screen} from '@testing-library/react';

import {fragmentContains, getFragmentBoundingClientRect, getFragmentHostNode} from '../fragmentHost';

describe('getFragmentHostNode', () => {
	test('should return null without a fragment', () => {
		expect(getFragmentHostNode(null)).toBeNull();
	});

	test('should return the fragment\'s host element', () => {
		const ref = createRef();

		render(
			<Fragment ref={ref}>
				<div data-testid="root">Hi</div>
			</Fragment>
		);

		expect(getFragmentHostNode(ref.current)).toBe(screen.getByTestId('root'));
	});

	test('should return the outermost host when a component wraps its root', () => {
		const ref = createRef();
		const Wrapped = (props) => (
			<section data-testid="outer">
				<button {...props} />
			</section>
		);

		render(
			<Fragment ref={ref}>
				<Wrapped data-testid="inner" />
			</Fragment>
		);

		expect(getFragmentHostNode(ref.current)).toBe(screen.getByTestId('outer'));
	});

	test('should skip a leading text node', () => {
		const ref = createRef();

		render(
			<Fragment ref={ref}>
				{'label'}
				<div data-testid="root" />
			</Fragment>
		);

		expect(getFragmentHostNode(ref.current)).toBe(screen.getByTestId('root'));
	});

	test('should return null when the fragment has no host element', () => {
		const ref = createRef();

		render(
			<Fragment ref={ref}>
				{'label'}
			</Fragment>
		);

		expect(getFragmentHostNode(ref.current)).toBeNull();
	});

	test('should skip a host fiber that does not own an element', () => {
		const element = document.createElement('div');
		const fragment = {
			_fragmentFiber: {
				child: {
					tag: 5,
					stateNode: document.createTextNode('x'),
					child: null,
					sibling: {
						tag: 5,
						stateNode: element,
						child: null,
						sibling: null
					}
				}
			}
		};

		expect(getFragmentHostNode(fragment)).toBe(element);
	});

	test('should return a host singleton fiber', () => {
		const element = document.createElement('div');
		const fragment = {
			_fragmentFiber: {
				child: {
					tag: 27,
					stateNode: element,
					child: null,
					sibling: null
				}
			}
		};

		expect(getFragmentHostNode(fragment)).toBe(element);
	});

	test('should skip a hidden withref marker and return the host', () => {
		const marker = document.createElement('div');
		marker.setAttribute('data-withref-target', 'id');
		const element = document.createElement('section');
		const fragment = {
			_fragmentFiber: {
				child: {
					tag: 5,
					stateNode: marker,
					child: null,
					sibling: {
						tag: 5,
						stateNode: element,
						child: null,
						sibling: null
					}
				}
			}
		};

		expect(getFragmentHostNode(fragment)).toBe(element);
	});

	test('should throw when a fragment has no `_fragmentFiber`', () => {
		expect(() => getFragmentHostNode({})).toThrow(/_fragmentFiber/);
	});

	test('should log once in production when a fragment has no `_fragmentFiber`', () => {
		const previous = process.env.NODE_ENV;
		process.env.NODE_ENV = 'production';
		jest.resetModules();
		const {getFragmentHostNode: getHost} = require('../fragmentHost');

		try {
			expect(getHost({})).toBeNull();
			expect(getHost({})).toBeNull();
			// eslint-disable-next-line no-console
			expect(console.error).toHaveBeenCalledTimes(1);
		} finally {
			process.env.NODE_ENV = previous;
			jest.resetModules();
		}
	});

	test('should skip a hidden offscreen fiber', () => {
		const element = document.createElement('div');
		const fragment = {
			_fragmentFiber: {
				child: {
					tag: 22,
					memoizedState: {},
					child: {
						tag: 5,
						stateNode: document.createElement('span'),
						child: null,
						sibling: null
					},
					sibling: {
						tag: 5,
						stateNode: element,
						child: null,
						sibling: null
					}
				}
			}
		};

		expect(getFragmentHostNode(fragment)).toBe(element);
	});
});

describe('getFragmentBoundingClientRect', () => {
	test('should return null when the fragment cannot be measured', () => {
		expect(getFragmentBoundingClientRect(null)).toBeNull();
		expect(getFragmentBoundingClientRect({})).toBeNull();
	});

	test('should return a zero box when there are no client rects', () => {
		expect(getFragmentBoundingClientRect({getClientRects: () => []})).toEqual({
			bottom: 0,
			height: 0,
			left: 0,
			right: 0,
			top: 0,
			width: 0
		});
	});

	test('should keep the position of a zero-size rect', () => {
		const fragment = {
			getClientRects: () => [{
				bottom: 12,
				height: 0,
				left: 40,
				right: 40,
				top: 12,
				width: 0
			}]
		};

		expect(getFragmentBoundingClientRect(fragment)).toEqual({
			bottom: 12,
			height: 0,
			left: 40,
			right: 40,
			top: 12,
			width: 0
		});
	});

	test('should union different rects', () => {
		const fragment = {
			getClientRects: () => [
				{bottom: 10, height: 10, left: 0, right: 20, top: 0, width: 20},
				{bottom: 40, height: 10, left: 40, right: 60, top: 30, width: 20}
			]
		};

		expect(getFragmentBoundingClientRect(fragment)).toEqual({
			bottom: 40,
			height: 40,
			left: 0,
			right: 60,
			top: 0,
			width: 60
		});
	});
});

describe('fragmentContains', () => {
	test('should report when a node is inside the fragment', () => {
		const node = document.createElement('span');
		const fragment = {
			compareDocumentPosition: (target) => (target === node ? Node.DOCUMENT_POSITION_CONTAINED_BY : 0)
		};

		expect(fragmentContains(fragment, node)).toBe(true);
		expect(fragmentContains(fragment, document.createElement('div'))).toBe(false);
		expect(fragmentContains(null, node)).toBe(false);
	});
});
