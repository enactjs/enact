import {render} from '@testing-library/react';

import Slider from '../Slider';

describe('Slider', () => {
	function ProgressBar () {
		return <div />;
	}

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(<Slider progressBarComponent={ProgressBar} ref={ref} />);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
