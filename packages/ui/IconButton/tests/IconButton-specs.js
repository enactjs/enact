import {forwardRef} from 'react';
import {mount} from 'enzyme';

import IconButton from '../IconButton';

describe('IconButton', () => {

	const Button = forwardRef((props, fn) => <div ref={fn} />);
	function Icon () {
		return <div />;
	}

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		mount(
			<IconButton ref={ref} buttonComponent={Button} iconComponent={Icon}>
				star
			</IconButton>
		);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});

});
