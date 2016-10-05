import React from 'react';
import {mount} from 'enzyme';
import ToggleButton from '../ToggleButton';

describe('ToggleButton', () => {
	const toggleOnLabel = 'It is on';
	const toggleOffLabel = 'It is off';
	const childLabel = 'Unchanging';

	it('should use \'toggleOnLabel\' when specified and selected is true', function () {
		const toggleButton = mount(
			<ToggleButton toggleOffLabel={toggleOffLabel} toggleOnLabel={toggleOnLabel} selected />
		);

		const expected = toggleOnLabel.toUpperCase();
		const actual = toggleButton.text();

		expect(actual).to.equal(expected);
	});

	it('should use \'toggleOffLabel\' when specified and selected is false', function () {
		const toggleButton = mount(
			<ToggleButton toggleOffLabel={toggleOffLabel} toggleOnLabel={toggleOnLabel} />
		);

		const expected = toggleOffLabel.toUpperCase();
		const actual = toggleButton.text();

		expect(actual).to.equal(expected);
	});

	it('should use children for label when \'toggleOffLabel\' is falsey', function () {
		const toggleButton = mount(
			<ToggleButton toggleOnLabel={toggleOnLabel}>
				{childLabel}
			</ToggleButton>
		);

		const expected = childLabel.toUpperCase();
		const actual = toggleButton.text();

		expect(actual).to.equal(expected);
	});

	it('should use children for label when \'toggleOnLabel\' is falsey', function () {
		const toggleButton = mount(
			<ToggleButton toggleOffLabel={toggleOffLabel}>
				{childLabel}
			</ToggleButton>
		);

		const expected = childLabel.toUpperCase();
		const actual = toggleButton.text();

		expect(actual).to.equal(expected);
	});
});
