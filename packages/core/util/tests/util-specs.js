import {render, renderHook, act} from '@testing-library/react';
import PropTypes from 'prop-types';
import {forwardRef, memo, lazy, Component} from 'react';

import {
	applyDefaultProps,
	cap,
	clamp,
	coerceArray,
	coerceFunction,
	extractAriaProps,
	isRenderable,
	memoize,
	mergeClassNameMaps,
	mapAndFilterChildren,
	normalizePublicClassNames,
	setDefaultProps,
	shallowEqual,
	checkPropTypes,
	usePrevious
} from '../util';

describe('util', () => {
	describe('cap', () => {
		test('should return a capitalized string', () => {
			expect(cap('abc')).toBe('Abc');
		});
	});

	describe('clamp', () => {
		test('should return a value between a min value and a max value', () => {
			expect(clamp(10, 20, 15)).toBe(15);
			expect(clamp(10, 20, 0)).toBe(10);
			expect(clamp(10, 20, 30)).toBe(20);
			expect(clamp(10, 20, 10)).toBe(10);
			expect(clamp(10, 20, 20)).toBe(20);
			expect(clamp(20, 10, 10)).toBe(20); // special case
		});
	});

	describe('checkPropTypes', () => {
		class TestComponent extends Component {
			static displayName = 'TestComponent';

			static propTypes = {
				bool: PropTypes.bool,
				string: PropTypes.string
			};

			constructor (props) {
				super(props);
				checkPropTypes(this, this.props);
			}

			render () {
				return (<div>Test</div>);
			}
		}

		let consoleWarnMock = null;
		let consoleErrorMock = null;

		beforeEach(() => {
			consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
			consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
		});

		afterEach(() => {
			consoleWarnMock.mockRestore();
			consoleErrorMock.mockRestore();
		});

		test('should not call any console.error for a correct prop', () => {
			render(<TestComponent bool string="String" />);

			expect(consoleErrorMock).not.toHaveBeenCalled();
		});

		test('should call console.error for a wrong prop', () => {
			render(<TestComponent bool="true" string="String" />);

			expect(consoleErrorMock).toHaveBeenCalled();
		});
	});

	describe('coerceArray', () => {
		test('should return an array', () => {
			expect(coerceArray(['a'])).toEqual(['a']);
			expect(coerceArray('a')).toEqual(['a']);
		});
	});

	describe('coerceFunction', () => {
		test('should return a function', () => {
			expect(typeof coerceFunction(() => 'function')).toEqual('function');
			expect(typeof coerceFunction('value')).toEqual('function');
			expect(coerceFunction('value')?.()).toEqual('value');
		});
	});

	describe('extractAriaProps', () => {
		test('should extract aria-related props as a return object', () => {
			const testProps = {
				role: 'button',
				'aria-hidden': true,
				value: 'value'
			};
			const expected = {
				role: 'button',
				'aria-hidden': true
			};
			const remaining = {
				value: 'value'
			};

			const actual = extractAriaProps(testProps);

			expect(actual).toMatchObject(expected);
			expect(testProps).toMatchObject(remaining);
		});
	});

	describe('isRenderable', () => {
		test('should return {true} for function', () => {
			const expected = true;
			const view = isRenderable(function () {});

			expect(view).toEqual(expected);
		});

		test('should return {true} for string', () => {
			const expected = true;
			const view = isRenderable('div');

			expect(view).toEqual(expected);
		});

		test('should return {true} for React.forwardRef', () => {
			const expected = true;
			const view = isRenderable(forwardRef(() => {}));

			expect(view).toEqual(expected);
		});

		test('should return {true} for React.memo', () => {
			const expected = true;
			const view = isRenderable(memo(() => {}));

			expect(view).toEqual(expected);
		});

		test('should return {true} for React.lazy', () => {
			const expected = true;
			const view = isRenderable(lazy(() => {}));

			expect(view).toEqual(expected);
		});
	});

	describe('memoize', () => {
		test('should memoize function', () => {
			const obj = {},
				testMethod = key => {
					obj[key] = (obj[key] || 0) + 1;
				},
				memoizedTest = memoize(testMethod);

			expect(obj).not.toHaveProperty('a');
			memoizedTest('a');
			expect(obj).toHaveProperty('a', 1);
			memoizedTest('a');
			memoizedTest('a');
			expect(obj).toHaveProperty('a', 1);
		});

		test('should forward all args to memoized function', () => {
			const spy = jest.fn();
			const memoized = memoize(spy);
			memoized(1, 2);

			const expected = [1, 2];
			const actual = spy.mock.calls[0];

			expect(expected).toEqual(actual);
		});
	});

	describe('mergeClassNameMaps', () => {
		const baseMap = {
			'class-base-only': 'real-class-base-only',
			'class-shared': 'real-class-shared-base',
			'class-shared-another': 'real-class-shared-another-base'
		};
		const additiveMap = {
			'class-shared': 'real-class-shared-additive',
			'class-shared-another': 'real-class-shared-another-additive',
			'class-additive-only': 'real-class-additive-only'
		};

		// Helper function to get an object from the proxy object that has only getters for properties to make testing easier
		const getResultFromProxy = (proxy) => {
			const keys = ['class-base-only', 'class-shared', 'class-shared-another', 'class-additive-only'];
			const obj = {};

			for (let i = 0; i < keys.length; i++) {
				if (keys[i] !== proxy[keys[i]]) {
					obj[keys[i]] = proxy[keys[i]];
				}
			}

			return obj;
		};

		test('should return a base map if an additive map is not given', () => {
			const actual = mergeClassNameMaps(baseMap);

			expect(actual).toEqual(baseMap);
		});

		test('should return a merged map containing shared class names', () => {
			const expected = {
				'class-base-only': 'real-class-base-only',
				'class-shared': 'real-class-shared-base real-class-shared-additive',
				'class-shared-another': 'real-class-shared-another-base real-class-shared-another-additive'
			};

			const actual = getResultFromProxy(mergeClassNameMaps(baseMap, additiveMap));

			expect(actual).toEqual(expected);
		});

		test('should return a merged map containing allowed matching class names', () => {
			const expected = {
				'class-base-only': 'real-class-base-only',
				'class-shared': 'real-class-shared-base real-class-shared-additive',
				'class-shared-another': 'real-class-shared-another-base'
			};

			const actual = getResultFromProxy(mergeClassNameMaps(baseMap, additiveMap, ['class-shared']));

			expect(actual).toEqual(expected);
		});
	});

	describe('mapAndFilterChildren', () => {
		test('Returns null if null passed', () => {
			const expected = null;
			const actual = mapAndFilterChildren(null, val => val);

			expect(actual).toBe(expected);
		});

		test('Returns passed array if identity filter', () => {
			const children = [1, 2, 3];

			const expected = children;
			const actual = mapAndFilterChildren(children, val => val);

			expect(actual).toEqual(expected);
		});

		test('Returns passed array without nullish or false entries with identity filter', () => {
			// eslint-disable-next-line no-undefined
			const children = [1, 2, null, 3, undefined, false];

			const expected = [1, 2, 3];
			const actual = mapAndFilterChildren(children, val => val);

			expect(actual).toEqual(expected);
		});

		test('Does not call filter with nullish or false entries', () => {
			const spy = jest.fn();
			// eslint-disable-next-line no-undefined
			const children = [1, 2, null, 3, undefined, false];

			mapAndFilterChildren(children, spy);

			const expected = 3;
			const actual = spy.mock.calls.length;

			expect(actual).toBe(expected);
		});

		test('Returns without null entries from filter', () => {
			const children = [1, 2, 3];

			const expected = [1, 3];
			const actual = mapAndFilterChildren(children, val => val === 2 ? null : val);

			expect(actual).toEqual(expected);
		});

		test('Runs custom filter', () => {
			const children = [1, 2, 3];

			const expected = [1];
			const actual = mapAndFilterChildren(
				children,
				val => val === 2 ? null : val,
				(val) => val === 1
			);

			expect(actual).toEqual(expected);
		});

		test('should forward value and index to callback', () => {
			const spy = jest.fn();
			mapAndFilterChildren([1], spy);

			const expected = [
				1, // value
				0 // index
			];
			const actual = spy.mock.calls[0];

			expect(expected).toEqual(actual);
		});
	});

	describe('normalizePublicClassNames', () => {
		const css = {a: 'a-class', b: 'b-class'};

		test('should return all css keys when publicClassNames is true', () => {
			expect(normalizePublicClassNames(true, css)).toEqual(['a', 'b']);
		});

		test('should split a string publicClassNames value', () => {
			expect(normalizePublicClassNames('a b', css)).toEqual(['a', 'b']);
		});
	});

	describe('applyDefaultProps', () => {
		test('should return target unchanged when keys are not provided', () => {
			const target = {size: 'small'};

			expect(applyDefaultProps(target, {size: 'large'}, null)).toBe(target);
			expect(target).toEqual({size: 'small'});
		});
	});

	describe('setDefaultProps', () => {
		const props = {
			// eslint-disable-next-line no-undefined
			direction: undefined,
			index: 0,
			size: 'small'
		};
		const defaultProps = {
			direction: 'below',
			selected: true,
			size: 'large'
		};

		test('should set props that are missing or `undefined` to default values', () => {
			const expected = {
				direction: 'below',
				index: 0,
				selected: true,
				size: 'small'
			};
			const actual = setDefaultProps(props, defaultProps);

			expect(expected).toEqual(actual);
		});
	});

	describe('shallowEqual', () => {
		const child = {
			name: 'child'
		};

		test('should return `true` if the values of all keys are strictly equal', () => {
			expect(shallowEqual(child, child)).toBe(true);

			expect(shallowEqual(child, null)).toBe(false);

			const fakeChild = {
				name: 'fake'
			};

			expect(shallowEqual(child, fakeChild)).toBe(false);

			fakeChild.name = 'child';
			expect(shallowEqual(child, fakeChild)).toBe(true);

			child.toString = (...args) => {
				child.toString(...args);
			};
			expect(shallowEqual(child, fakeChild)).toBe(false);
		});
	});

	describe('usePrevious', () => {
		test('should return the initial value on first render', () => {
			const {result} = renderHook(() => usePrevious(1));

			expect(result.current).toBe(1);
		});

		test('should return the previous value after the value changes', () => {
			let value = 1;
			const {result, rerender} = renderHook(() => usePrevious(value));

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				value = 2;
				rerender();
			});

			expect(result.current).toBe(1);
		});

		test('should track the previous value across multiple changes', () => {
			let value = 'a';
			const {result, rerender} = renderHook(() => usePrevious(value));

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				value = 'b';
				rerender();
			});

			expect(result.current).toBe('a');

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				value = 'c';
				rerender();
			});

			expect(result.current).toBe('b');
		});

		test('should not update previous value when value stays the same', () => {
			let value = 42;
			const {result, rerender} = renderHook(() => usePrevious(value));

			// eslint-disable-next-line testing-library/no-unnecessary-act
			act(() => {
				rerender();
			});

			expect(result.current).toBe(42);
		});
	});
});
