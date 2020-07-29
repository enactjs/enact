import React from 'react';
import {mount} from 'enzyme';
import ProgressBar from '../ProgressBar';
import css from '../ProgressBar.module.less';

describe('ProgressBar Specs', () => {

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		mount(
			<ProgressBar ref={ref} />
		);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});

	describe('horizontal', () => {
		test('should have width of 0.5', () => {
			const progressBar = mount(
				<ProgressBar
					progress={0.5}
				/>
			);

			const style = progressBar.find(`.${css.progressBar}`).prop('style');

			const expected = 0.5;
			const actual = style['--ui-progressbar-proportion-end'];

			expect(actual).toBe(expected);
		});

		test('should have background width of 0.75', () => {
			const progressBar = mount(
				<ProgressBar
					backgroundProgress={0.75}
				/>
			);

			const style = progressBar.find(`.${css.progressBar}`).prop('style');

			const expected = 0.75;
			const actual = style['--ui-progressbar-proportion-end-background'];

			expect(actual).toBe(expected);
		});
	});

	describe('vertical', () => {
		test('should have height of 0.5', () => {
			const progressBar = mount(
				<ProgressBar
					progress={0.5}
					orientation="vertical"
				/>
			);

			const style = progressBar.find(`.${css.progressBar}`).prop('style');

			const expected = 0.5;
			const actual = style['--ui-progressbar-proportion-end'];

			expect(actual).toBe(expected);
		});

		test('should have background height of 0.75', () => {
			const progressBar = mount(
				<ProgressBar
					progress={0.5}
					backgroundProgress={0.75}
					orientation="vertical"
				/>
			);

			const style = progressBar.find(`.${css.progressBar}`).prop('style');

			const expected = 0.75;
			const actual = style['--ui-progressbar-proportion-end-background'];

			expect(actual).toBe(expected);
		});
	});

	describe('radial', () => {
		test('should have a radius of 0.5', () => {
			const progressBar = mount(
				<ProgressBar
					progress={0.5}
					orientation="radial"
				/>
			);

			const style = progressBar.find(`.${css.progressBar}`).prop('style');

			const expected = 0.5;
			const actual = style['--ui-progressbar-proportion-end'];

			expect(actual).toBe(expected);
		});

		test('should have background radius of 0.75', () => {
			const progressBar = mount(
				<ProgressBar
					progress={0.5}
					backgroundProgress={0.75}
					orientation="radial"
				/>
			);

			const style = progressBar.find(`.${css.progressBar}`).prop('style');

			const expected = 0.75;
			const actual = style['--ui-progressbar-proportion-end-background'];

			expect(actual).toBe(expected);
		});
	});
});
