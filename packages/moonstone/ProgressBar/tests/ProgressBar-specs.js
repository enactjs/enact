import React from 'react';
import {mount} from 'enzyme';
import ProgressBar from '../ProgressBar';
import css from '../ProgressBar.less';

describe('ProgressBar Specs', () => {
	it('Should have width of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={0.5}
			/>
		);

		expect(progressBar.find(`.${css.fill}`).prop('style').width).to.equal('50%');
	});

	it('Should have background width of 75%', () => {
		const progressBar = mount(
			<ProgressBar
				backgroundProgress={0.75}
			/>
		);

		expect(progressBar.find(`.${css.load}`).prop('style').width).to.equal('75%');
	});

	it('Should have height of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={0.50}
				vertical
			/>
		);

		expect(progressBar.find(`.${css.fill}`).prop('style').height).to.equal('50%');
	});

	it('Should have background height of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={0.50}
				backgroundProgress={0.75}
				vertical
			/>
		);

		expect(progressBar.find(`.${css.load}`).prop('style').height).to.equal('75%');
	});
});
