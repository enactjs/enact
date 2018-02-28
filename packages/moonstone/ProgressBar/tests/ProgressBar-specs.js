import React from 'react';
import {mount} from 'enzyme';
import ProgressBar from '../ProgressBar';
import css from '../ProgressBar.less';

describe('ProgressBar Specs', () => {
	it('should only show tooltip when tooltip is true', function () {
		const progressBar = mount(
			<ProgressBar percentageTooltip />
		);

		const expected = 1;
		const actual = progressBar.find('ProgressBarTooltip').length;

		expect(actual).to.equal(expected);
	});

	it('should set emphasized class when emphasized is true', function () {
		const progressBar = mount(
			<ProgressBar emphasized />
		);

		const expected = 1;
		const actual = progressBar.find(`div.${css.emphasized}`).length;

		expect(actual).to.equal(expected);
	});
});
