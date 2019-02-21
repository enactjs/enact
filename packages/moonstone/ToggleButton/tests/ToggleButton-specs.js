import React from 'react';
import {mount} from 'enzyme';
import ToggleButton from '../ToggleButton';

describe('ToggleButton', () => {

	const toggleOnLabel = 'It\'s on!';
	const toggleOffLabel = 'It\'s off!';
	const textChild = 'Toggle Me';

	test(
		'should use \'toggleOffLabel\' if toggled off and label provided',
		() => {
			const toggleButton = mount(
				<ToggleButton toggleOffLabel={toggleOffLabel}>
					{textChild}
				</ToggleButton>
			);

			const button = toggleButton.find('Button');
			const expected = toggleOffLabel.toUpperCase();
			const actual = button.text();

			expect(actual).toBe(expected);
		}
	);

	test(
		'should use \'toggleOnLabel\' if toggled on and label provided',
		() => {
			const toggleButton = mount(
				<ToggleButton toggleOnLabel={toggleOnLabel} selected>
					{textChild}
				</ToggleButton>
			);

			const button = toggleButton.find('Button');
			const expected = toggleOnLabel.toUpperCase();
			const actual = button.text();

			expect(actual).toBe(expected);
		}
	);

	test(
		'should use child node for label when \'toggleOffLabel\' is missing',
		() => {
			const toggleButton = mount(
				<ToggleButton toggleOnLabel={toggleOnLabel}>
					{textChild}
				</ToggleButton>
			);
			const button = toggleButton.find('Button');

			const expected = textChild.toUpperCase();
			const actual = button.text();

			expect(actual).toBe(expected);
		}
	);

	test(
		'should use child node for label when \'toggleOnLabel\' is missing',
		() => {
			const toggleButton = mount(
				<ToggleButton toggleOffLabel={toggleOffLabel} selected>
					{textChild}
				</ToggleButton>
			);
			const button = toggleButton.find('Button');

			const expected = textChild.toUpperCase();
			const actual = button.text();

			expect(actual).toBe(expected);
		}
	);

	test('should set "aria-pressed" to the value of "selected"', () => {
		const toggleButton = mount(
			<ToggleButton toggleOffLabel={toggleOffLabel} selected={false}>
				{textChild}
			</ToggleButton>
		);

		const expected = false;
		const actual = toggleButton.find({role: 'button'}).prop('aria-pressed');

		expect(actual).toBe(expected);
	});
});
