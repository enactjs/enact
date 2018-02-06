import React from 'react';
import {mount} from 'enzyme';
import ResolutionDecorator from '../ResolutionDecorator';

describe('ResolutionDecorator Specs', () => {

	it('should apply resolution classes to the wrapped component', function () {
		const Component = ResolutionDecorator('div');
		const subject = mount(
			<Component />
		);

		const div = subject.find('div');

		const expected = true;
		const actual = (div.hasClass('enact-res-standard') && (div.hasClass('enact-orientation-landscape') || div.hasClass('enact-orientation-portrait')));

		expect(actual).to.equal(expected);
	});

	it('should allow custom screen types', function () {
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

		expect(actual).to.equal(expected);
	});

	it.skip('should update the resolution when the screen is resized', function () {
		// TODO: write a test
	});

	it.skip('should not allow dynamic resolution updates when \'dynamic\' config option is false', function () {
		// TODO: write a test
	});

});
