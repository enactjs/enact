/* globals describe, it, expect */

import React from 'react';
import {mount} from 'enzyme';
import MoonstoneDecorator from '../';

describe('MoonstoneDecorator', () => {

	const Div = (props) => <div {...props} />;
	const baseClassCount = 3;
	const hdClassCount = 2;

	it('should add base moonstone classes to wrapped component', function () {
		const config = {ri: false, i18n: false};
		const App = MoonstoneDecorator(config, Div);
		const subject = mount(
			<App />
		);

		const expected = baseClassCount;
		const actual = subject.find('div').prop('className').split(' ').length;

		expect(actual).to.equal(expected);
	});

	it('should add resolution independence classes to wrapped component', function () {
		const config = {i18n: false};
		const App = MoonstoneDecorator(config, Div);
		const subject = mount(
			<App />
		);

		const expected = baseClassCount + hdClassCount;
		const actual = subject.find('div').prop('className').split(' ').length;

		expect(actual).to.equal(expected);
	});

	it('should add custom screen type class to wrapped component', function () {
		const config = {
			i18n: false,
			ri: {
				screenTypes: [
					{name: 'custom', pxPerRem: 16, width: 1280, height: 720, base: true}
				]
			}
		};
		const App = MoonstoneDecorator(config, Div);
		const subject = mount(
			<App />
		);

		const expected = true;
		const actual = subject.find('div').hasClass('enyo-res-custom');

		expect(actual).to.equal(expected);
	});

});
