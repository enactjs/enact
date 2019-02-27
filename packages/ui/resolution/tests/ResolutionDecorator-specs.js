import React from 'react';
import {mount} from 'enzyme';
import ResolutionDecorator from '../ResolutionDecorator';

describe('ResolutionDecorator Specs', () => {

	test('should apply resolution classes to the wrapped component', () => {
		const Component = ResolutionDecorator('div');
		const subject = mount(
			<Component />
		);

		const div = subject.find('div');

		const expected = true;
		const actual = (div.hasClass('enact-res-standard') && (div.hasClass('enact-orientation-landscape') || div.hasClass('enact-orientation-portrait')));

		expect(actual).toBe(expected);
	});

	test('should allow custom screen types', () => {
		const name = 'mhd';
		const screens = [
			{name: name, pxPerRem: 36, width: 1440, height: 920, aspectRatioName: 'hdtv', base: true}
		];
		const Component = ResolutionDecorator({screenTypes: screens}, 'div');
		const subject = mount(
			<Component />
		);

		const expected = true;
		const actual = subject.find('div').hasClass('enact-res-mhd');

		expect(actual).toBe(expected);
	});

	test.skip('should update the resolution when the screen is resized', function () {
		// TODO: write a test
	});

	test.skip(
		'should not allow dynamic resolution updates when \'dynamic\' config option is false',
		function () {
			// TODO: write a test
		}
	);

});
