import React from 'react';
import {mount} from 'enzyme';
import ToggleButton from '../ToggleButton';

describe('ToggleButton', () => {

	const toggleOnLabel = 'It\'s on!';
	const toggleOffLabel = 'It\'s off!';
	const textChild = 'Toggle Me';

	it('should use \'toggleOffLabel\' and \'toggleOnLabel\' when provided', function () {
		const toggleButton = mount(
			<ToggleButton toggleOffLabel={toggleOffLabel} toggleOnLabel={toggleOnLabel}>
				{textChild}
			</ToggleButton>
		);

		const button = toggleButton.find('Button');
		const expected = toggleOffLabel.toUpperCase();
		const actual = button.text();

		expect(actual).to.equal(expected);
	});

	it('should use child node for label when either \'toggleOffLabel\' or \'toggleOnLabel\' are missing', function () {
		const toggleButton1 = mount(
			<ToggleButton toggleOnLabel={toggleOnLabel}>
				{textChild}
			</ToggleButton>
		);
		const toggleButton2 = mount(
			<ToggleButton toggleOffLabel={toggleOffLabel}>
				{textChild}
			</ToggleButton>
		);

		const button1 = toggleButton1.find('Button');
		const button2 = toggleButton2.find('Button');
		const expected = true;
		const actual = (button1.text() === button2.text()) && (button1.text() === textChild.toUpperCase());

		expect(actual).to.equal(expected);
	});
});
