import React from 'react';
import {mount} from 'enzyme';
import Spinner from '../Spinner';
import css from '../Spinner.less';

describe('Spinner Specs', () => {
	test(
		'should not have client node when Spinner has no children',
		() => {
			const spinner = mount(
				<Spinner />
			);

			const expected = false;
			const actual = spinner.find(`div.${css.client}`).exists();

			expect(actual).toBe(expected);
		}
	);

	test('should have a client node when Spinner has children', () => {
		const spinner = mount(
			<Spinner>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`div.${css.client}`).exists();

		expect(actual).toBe(expected);
	});

	test('should have content class when Spinner has children', () => {
		const spinner = mount(
			<Spinner>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`div.${css.spinner}`).hasClass(css.content);

		expect(actual).toBe(expected);
	});

	test(
		'should have transparent class when transparent prop equals true',
		() => {
			const spinner = mount(
				<Spinner transparent>
					Loading...
				</Spinner>
			);

			const expected = true;
			const actual = spinner.find(`div.${css.spinner}`).hasClass(css.transparent);

			expect(actual).toBe(expected);
		}
	);

	test('should set role to alert by default', () => {
		const spinner = mount(
			<Spinner />
		);

		const expected = 'alert';
		const actual = spinner.find(`div.${css.spinner}`).prop('role');

		expect(actual).toBe(expected);
	});

	test('should set aria-live to off by default', () => {
		const spinner = mount(
			<Spinner />
		);

		const expected = 'off';
		const actual = spinner.find(`div.${css.spinner}`).prop('aria-live');

		expect(actual).toBe(expected);
	});
});
