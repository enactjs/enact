import {renderHook} from '@testing-library/react';

import usePublicClassNames from '../usePublicClassNames';

describe('usePublicClassNames', () => {
	const componentCss = {
		test: 'test-class',
		a: 'a-class',
		b: 'b-class'
	};
	const customCss = {
		test: 'test-class-custom',
		a: 'a-class-custom',
		b: 'b-class-custom',
		myClass: 'my-class'
	};

	test('should return `componentCss` if `customCss` is undefined', () => {
		const testComponentCss = {test: 'test-class'};
		const {result} = renderHook(() => usePublicClassNames({componentCss: testComponentCss, customCss: null, publicClassNames: true}));

		expect(result.current).toEqual(testComponentCss);
	});

	test('should return a merged css has all keys from `componentCss` and merged values when `publicClassNames` is true', () => {
		const {result} = renderHook(() => usePublicClassNames({componentCss, customCss, publicClassNames: true}));

		const expected = {
			test: 'test-class test-class-custom',
			a: 'a-class a-class-custom',
			b: 'b-class b-class-custom'
		};

		expect(result.current.test).toBe(expected.test);
		expect(result.current.a).toBe(expected.a);
		expect(result.current.b).toBe(expected.b);
	});

	test('should return a merged css has the keys from `publicClassNames` array and merged values when `publicClassNames` is an array of strings', () => {
		const {result} = renderHook(() => usePublicClassNames({componentCss, customCss, publicClassNames: ['a', 'b']}));

		const expected = {
			a: 'a-class a-class-custom',
			b: 'b-class b-class-custom'
		};

		expect(result.current.a).toBe(expected.a);
		expect(result.current.b).toBe(expected.b);
	});
});
