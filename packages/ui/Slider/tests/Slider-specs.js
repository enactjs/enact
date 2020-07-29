import React from 'react';
import {mount} from 'enzyme';

import Slider from '../Slider';

describe('Slider', () => {
	function ProgressBar () {
		return <div />;
	}

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		mount(
			<Slider ref={ref} progressBarComponent={ProgressBar} />
		);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
