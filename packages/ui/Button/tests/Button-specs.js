import React from 'react';
import {mount} from 'enzyme';

import Button from '../Button';

describe('Button', () => {

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		mount(<Button ref={ref} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});

});
