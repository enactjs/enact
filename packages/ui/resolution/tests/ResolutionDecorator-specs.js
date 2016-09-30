import React from 'react';
import {shallow} from 'enzyme';
import ResolutionDecorator from '../ResolutionDecorator';

describe('ResolutionDecorator Specs', () => {

	it('should apply resolution classes to the wrapped component', function () {
		const Component = ResolutionDecorator('div');
		const subject = shallow(
			<Component />
		);

		const expected = true;
		const actual = (subject.hasClass('enact-res-standard') && (subject.hasClass('enact-orientation-landscape') || subject.hasClass('enact-orientation-portrait')));

		expect(actual).to.equal(expected);
	});

	it('should allow custom screen types', function () {
		const name = 'mhd';
		const screens = [
			{name: name, pxPerRem: 36, width: 1440, height: 920, aspectRatioName: 'hdtv', base: true}
		];
		const Component = ResolutionDecorator({screenTypes: screens}, 'div');
		const subject = shallow(
			<Component />
		);

		const expected = true;
		const actual = subject.find('div').hasClass('enact-res-mhd');

		expect(actual).to.equal(expected);
	});

	it.skip('should update the resolution when the screen is resized', function () {
		//TODO: write a test
	});

	it.skip('should not allow dynamic resolution updates when \'dynamic\' config option is false', function () {
		//TODO: write a test
	});

});
