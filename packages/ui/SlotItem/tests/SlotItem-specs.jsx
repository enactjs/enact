import {render} from '@testing-library/react';
import {forwardRef} from 'react';

import SlotItem from '../SlotItem';

describe('SlotItem', () => {
	test('should return a DOM node reference for `componentRef`', () => {
		const component = forwardRef((props, fn) => <div ref={fn} />);
		const ref = jest.fn();
		render(
			<SlotItem ref={ref} component={component} />
		);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
