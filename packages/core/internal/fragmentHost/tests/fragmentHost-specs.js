import {createRef, Fragment} from 'react';
import {render, screen} from '@testing-library/react';

import {createFragmentFallbackId, getFragmentHostNode} from '../fragmentHost';

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

	test('should walk the hidden marker when the ref is that element', () => {
		const parent = document.createElement('div');
		const host = document.createElement('section');
		const inner = document.createElement('button');
		const marker = document.createElement('div');
		inner.setAttribute('data-withref-id', 'marker-id');
		marker.setAttribute('data-withref-target', 'marker-id');
		host.appendChild(inner);
		parent.appendChild(host);
		parent.appendChild(marker);
		document.body.appendChild(parent);

		expect(getFragmentHostNode(marker)).toBe(host);

		parent.remove();
	});

	test('should return null when the marker id matches no host', () => {
		const parent = document.createElement('div');
		const marker = document.createElement('div');
		marker.setAttribute('data-withref-target', 'missing-host');
		parent.appendChild(marker);

		expect(getFragmentHostNode(marker)).toBeNull();
	});

	test('should mint marker ids that are safe in a selector', () => {
		const first = createFragmentFallbackId();
		const second = createFragmentFallbackId();

		expect(first).toMatch(/^fragment-host-\d+$/);
		expect(second).not.toBe(first);
	});

	test('should warn and use the hidden marker when the fiber field is missing', () => {
		const parent = document.createElement('div');
		const host = document.createElement('section');
		const marker = document.createElement('div');
		host.setAttribute('data-withref-id', 'missing-fiber');
		marker.setAttribute('data-withref-target', 'missing-fiber');
		parent.appendChild(host);
		parent.appendChild(marker);
		document.body.appendChild(parent);

		expect(getFragmentHostNode({}, marker)).toBe(host);
		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalled();

		parent.remove();
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
