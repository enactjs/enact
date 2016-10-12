import React from 'react';
import {mount} from 'enzyme';
import ToggleButton from '../ToggleButton';

describe('ToggleButton', () => {

	const toggleOnLabel = 'It\'s on!';
	const toggleOffLabel = 'It\'s off!';
	const textChild = 'Toggle Me';

	it('should use \'toggleOffLabel\' if toggled off and label provided', function () {
		const toggleButton = mount(
			<ToggleButton toggleOffLabel={toggleOffLabel}>
				{textChild}
			</ToggleButton>
		);

		const button = toggleButton.find('Button');
		const expected = toggleOffLabel.toUpperCase();
		const actual = button.text();

		expect(actual).to.equal(expected);
	});

	it('should use \'toggleOnLabel\' if toggled on and label provided', function () {
		const toggleButton = mount(
			<ToggleButton toggleOnLabel={toggleOnLabel} selected>
				{textChild}
			</ToggleButton>
		);

		const button = toggleButton.find('Button');
		const expected = toggleOnLabel.toUpperCase();
		const actual = button.text();

		expect(actual).to.equal(expected);
	});

	it('should use child node for label when \'toggleOffLabel\' is missing', function () {
		const toggleButton = mount(
			<ToggleButton toggleOnLabel={toggleOnLabel}>
				{textChild}
			</ToggleButton>
		);
		const button = toggleButton.find('Button');

		const expected = textChild.toUpperCase();
		const actual = button.text();

		expect(actual).to.equal(expected);
	});

	it('should use child node for label when \'toggleOnLabel\' is missing', function () {
		const toggleButton = mount(
			<ToggleButton toggleOffLabel={toggleOffLabel} selected>
				{textChild}
			</ToggleButton>
		);
		const button = toggleButton.find('Button');

		const expected = textChild.toUpperCase();
		const actual = button.text();

		expect(actual).to.equal(expected);
	});
});
