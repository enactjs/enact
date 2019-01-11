import React from 'react';
import {mount} from 'enzyme';
import Breadcrumb from '../Breadcrumb';

describe('Breadcrumb', () => {

	test('should include {index} in the payload of {onSelect}', () => {
		const handleSelect = jest.fn();
		const subject = mount(
			<Breadcrumb index={3} onSelect={handleSelect} />
		);

		subject.simulate('click', {});

		const expected = 3;
		const actual = handleSelect.mock.calls[0][0].index;

		expect(actual).toBe(expected);
	});

	test(
		'should include call both the {onClick} and {onSelect} handlers on click',
		() => {
			const handleSelect = jest.fn();
			const handleClick = jest.fn();
			const subject = mount(
				<Breadcrumb index={3} onClick={handleClick} onSelect={handleSelect} />
			);

			subject.simulate('click', {});

			const expected = true;
			const actual = handleSelect.mock.calls.length === 1 &&
					handleClick.mock.calls.length === 1;

			expect(actual).toBe(expected);
		}
	);
});
