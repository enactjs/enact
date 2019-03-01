import React from 'react';
import {mount, shallow} from 'enzyme';
import BodyText from '../BodyText';
import {MarqueeDecorator} from '../../Marquee';
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

	test('should support single-line marqueeing content when `nowrap` is true', () => {
		const subject = mount(
			<BodyText nowrap />
		);

		const expected = true;
		const actual = subject.findWhere(c => c.name() === 'ui:Marquee').exists();

		expect(actual).toBe(expected);
	});

	test('should include the nowrap class if `nowrap` is true', () => {
		const subject = mount(
			<BodyText nowrap />
		);

		const expected = 'nowrap';
		const actual = subject.find(`.${css.bodyText}`).prop('className');

		expect(actual).toContain(expected);
	});
});
