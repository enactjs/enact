/* eslint-disable enact/prop-types */

import {mount, shallow} from 'enzyme';
import React from 'react';

import useChainRefs from '../useChainRefs';

describe('useChainRefs', () => {
	function Component (props) {
		const ref = useChainRefs(...props.refs);

		return (
			<div ref={ref} />
		);
	}

	test('should call a single functional ref', () => {
		const ref = jest.fn();
		mount(<Component refs={[ref]} />);

		expect(ref).toHaveBeenCalledTimes(1);
	});

	test('should call a single object ref', () => {
		const ref = React.createRef();
		mount(<Component refs={[ref]} />);

		const expected = 'DIV';
		const actual = ref.current.nodeName;

		expect(actual).toBe(expected);
	});

	test('should ignore invalid refs', () => {
		const invalid = {};
		const ref = jest.fn();
		mount(<Component refs={[invalid, ref]} />);

		expect(ref).toHaveBeenCalledTimes(1);
	});
});
