import React from 'react';
import {mount} from 'enzyme';
import BodyText from '../BodyText';
import css from '../BodyText.module.less';

describe('BodyText Specs', () => {

	test('should support multi-line content', () => {
		const subject = mount(
			<BodyText />
		);

		const expected = 1;
		const actual = subject.find('p').length;

		expect(actual).toBe(expected);
	});

	test('should support single-line marqueeing content when `noWrap` is true', () => {
		const subject = mount(
			<BodyText noWrap />
		);

		const expected = true;
		const actual = subject.findWhere(c => c.name() === 'ui:Marquee').exists();

		expect(actual).toBe(expected);
	});

	test('should include the noWrap class if `noWrap` is true', () => {
		const subject = mount(
			<BodyText noWrap />
		);

		const expected = 'noWrap';
		const actual = subject.find(`.${css.bodyText}`).prop('className');

		expect(actual).toContain(expected);
	});
});
