import React from 'react';
import {mount} from 'enzyme';
import ProgressBar from '../ProgressBar';
import css from '../ProgressBar.less';

describe('ProgressBar Specs', () => {
	test('should have width of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={0.5}
			/>
		);

		const style = progressBar.find(`.${css.progressBar}`).prop('style');

		const expected = '50%';
		const actual = style['--ui-progressbar-proportion-end'];

		expect(actual).toBe(expected);
	});

	test('should have background width of 75%', () => {
		const progressBar = mount(
			<ProgressBar
				backgroundProgress={0.75}
			/>
		);

		const style = progressBar.find(`.${css.progressBar}`).prop('style');

		const expected = '75%';
		const actual = style['--ui-progressbar-proportion-end-background'];

		expect(actual).toBe(expected);
	});

	test('should have height of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={0.5}
				orientation="vertical"
			/>
		);

		const style = progressBar.find(`.${css.progressBar}`).prop('style');

		const expected = '50%';
		const actual = style['--ui-progressbar-proportion-end'];

		expect(actual).toBe(expected);
	});

	test('should have background height of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={0.5}
				backgroundProgress={0.75}
				orientation="vertical"
			/>
		);

		const style = progressBar.find(`.${css.progressBar}`).prop('style');

		const expected = '75%';
		const actual = style['--ui-progressbar-proportion-end-background'];

		expect(actual).toBe(expected);
	});
});
