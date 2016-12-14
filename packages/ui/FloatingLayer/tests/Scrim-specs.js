import React from 'react';
import {mount} from 'enzyme';

import Scrim from '../Scrim';
import css from '../Scrim.less';

describe('Scrim Specs', () => {
	it('should be translucent by default', () => {
		const wrapper = mount(<Scrim />);

		const expected = css.translucent;
		const actual = wrapper.find('div').prop('className');
		expect(actual).to.include(expected);
	});

	it('should only render 1 translucent scrim at a time', () => {
		const wrapper = mount(
			<div>
				<Scrim />
				<Scrim />
				<Scrim />
			</div>
		);

		const expected = 1;
		const actual = wrapper.find(`.${css.translucent}`).length;
		expect(actual).to.equal(expected);
	});
});
