import React from 'react';
import {mount} from 'enzyme';
import ProgressBar from '../ProgressBar';
import css from '../ProgressBar.less';

describe('ProgressBar Specs', () => {
	it('Should have width of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={50}
			/>
		);

		expect(progressBar.find(`.${css.fill}`).prop('style').width).to.equal('50%');
	});

	it('Should have background width of 75%', () => {
		const progressBar = mount(
			<ProgressBar
				backgroundProgress={75}
			/>
		);

		expect(progressBar.find(`.${css.load}`).prop('style').width).to.equal('75%');
	});

	it('Should have height of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={50}
				vertical
			/>
		);

		expect(progressBar.find(`.${css.fill}`).prop('style').height).to.equal('50%');
	});

	it('Should have background height of 50%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={50}
				backgroundProgress={75}
				vertical
			/>
		);

		expect(progressBar.find(`.${css.load}`).prop('style').height).to.equal('75%');
	});

	it('Should have progress height of 25%', () => {
		const progressBar = mount(
			<ProgressBar
				progress={50}
				backgroundProgress={75}
				min={0}
				max={200}
				vertical
			/>
		);

		expect(progressBar.find(`.${css.fill}`).prop('style').height).to.equal('25%');
	});
});
