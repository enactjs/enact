import React from 'react';
import {mount} from 'enzyme';

import Scrim from '../Scrim';
import css from '../Scrim.module.less';

describe('Scrim Specs', () => {
	test('should be translucent by default', () => {
		const wrapper = mount(<Scrim />);

		const expected = css.translucent;
		const actual = wrapper.find('div').prop('className');
		expect(actual).toContain(expected);
	});

	test('should only render 1 translucent scrim at a time', () => {
		const wrapper = mount(
			<div>
				<Scrim />
				<Scrim />
				<Scrim />
			</div>
		);

		const expected = 1;
		const actual = wrapper.find(`.${css.translucent}`).length;
		expect(actual).toBe(expected);
	});
});
