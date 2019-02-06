import React from 'react';
import {shallow} from 'enzyme';
import Spinner from '../Spinner';
import css from '../Spinner.module.less';

describe('Spinner Specs', () => {
	test('should have centered class when centered prop equals true', () => {
		const spinner = shallow(
			<Spinner component="div" centered>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`.${css.spinner}`).hasClass(css.centered);

		expect(actual).toBe(expected);
	});

	test(
		'should not have content class when Spinner has no children',
		() => {
			const spinner = shallow(
				<Spinner component="div" />
			);

			const expected = false;
			const actual = spinner.find(`.${css.spinner}`).hasClass(css.content);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should have no scrim class when blockClickOn prop equals container',
		() => {
			const spinner = shallow(
				<Spinner component="div" blockClickOn="container" />
			);

			const expected = false;
			const actual = spinner.find(`.${css.scrim}`).exists();

			expect(actual).toBe(expected);
		}
	);

	test(
		'should have scrim class when blockClickOn prop equals container and when scrim prop equals true',
		() => {
			const spinner = shallow(
				<Spinner component="div" blockClickOn="container" scrim />
			);

			const expected = true;
			const actual = spinner.find(`.${css.scrim}`).exists();

			expect(actual).toBe(expected);
		}
	);

	test(
		'should have FloatingLayer when blockClickOn prop equals screen',
		() => {
			const spinner = shallow(
				<Spinner component="div" blockClickOn="screen" />
			);

			const expected = true;
			// FloatingLayer is wrapped by Cancelable so it's undiscoverable by name with shallow
			// mounting
			const actual = spinner.find('Cancelable').exists();

			expect(actual).toBe(expected);
		}
	);
});
