import React from 'react';
import {mount, shallow} from 'enzyme';
import BodyText from '../BodyText';
import {MarqueeDecorator} from '../../Marquee';
import css from '../BodyText.module.less';

describe('BodyText Specs', () => {

	// test('should support multi-line content', () => {
	// 	const subject = mount(
	// 		<BodyText />
	// 	);

	// 	const expected = 'p';
	// 	const actual = subject.getElement().type;

	// 	expect(actual).toBe(expected);
	// });

	test('should support single-line marqueeing content when `nowrap` is true', () => {
		const subject = mount(
			<BodyText nowrap />
		);

		const expected = true;



		//
		// Enzyme doesn't support : in component displayName
		//

		// Works when displayName has no colons (changing the name in the component file)
		// const actual = subject.find('uiMarqueeDecorator').html();

		// Doesn't work when using the real name
		const actual = subject.find('ui:MarqueeDecorator').html();



		// const actual = subject.contains(MarqueeDecorator);
		// const actual = subject.find('.marquee').html();
		// const actual = subject.instance(MarqueeDecorator);
		console.log(subject.debug());
		console.log('actual:', actual);

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
