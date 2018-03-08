import React from 'react';
import {mount} from 'enzyme';
import ProgressBar from '../ProgressBar';
import css from '../ProgressBar.less';

describe('ProgressBar Specs', () => {
	it('should only show tooltip when tooltip is true', function () {
		const progressBar = mount(
			<ProgressBar tooltip />
		);

		const expected = 1;
		const actual = progressBar.find('ProgressBarTooltip').length;

		expect(actual).to.equal(expected);
	});
});
