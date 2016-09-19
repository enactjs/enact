/* globals describe, it, expect */

import React from 'react';
import {shallow} from 'enzyme';
import ResolutionDecorator from '../ResolutionDecorator';

describe('ResolutionDecorator Specs', () => {

	it.skip('should apply resolution classes to the wrapped component', function () {
		const Component = ResolutionDecorator('div');
		const subject = shallow(
			<Component />
		);
		const wrapped = subject.find('div');

		const expected = true;
		const actual = (wrapped.hasClass('enact-res-standard') && (wrapped.hasClass('enact-orientation-landscape') || wrapped.hasClass('enact-orientation-portrait')));

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
