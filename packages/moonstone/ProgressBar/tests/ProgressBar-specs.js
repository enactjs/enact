import React from 'react';
import {mount} from 'enzyme';
import ProgressBar from '../ProgressBar';
import css from '../ProgressBar.less';

describe('ProgressBar Specs', () => {
	it('should have width of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={0.5}
			/>
		);

		expect(progressBar.find(`.${css.fill}`).prop('style').width).to.equal('50%');
	});

	it('should have background width of 75%', () => {
		const progressBar = mount(
			<ProgressBar
				backgroundProgress={0.75}
			/>
		);

		expect(progressBar.find(`.${css.load}`).prop('style').width).to.equal('75%');
	});

	it('should have height of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={0.5}
				vertical
			/>
		);

		expect(progressBar.find(`.${css.fill}`).prop('style').height).to.equal('50%');
	});

	it('should have background height of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={0.5}
				backgroundProgress={0.75}
				vertical
			/>
		);

		expect(progressBar.find(`.${css.load}`).prop('style').height).to.equal('75%');
	});
});
