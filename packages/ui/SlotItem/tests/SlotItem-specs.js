import React from 'react';
import {mount} from 'enzyme';

import SlotItem from '../SlotItem';

describe('SlotItem', () => {
	test('should return a DOM node reference for `componentRef`', () => {
		const component = React.forwardRef((props, fn) => <div ref={fn} />);
		const ref = jest.fn();
		mount(
			<SlotItem ref={ref} component={component} />
		);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
