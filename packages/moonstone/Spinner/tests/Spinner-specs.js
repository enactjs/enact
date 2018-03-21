import React from 'react';
import {mount} from 'enzyme';
import Spinner from '../Spinner';
import css from '../Spinner.less';

describe('Spinner Specs', () => {
	it('should have not have client node when Spinner has no children', function () {
		const spinner = mount(
			<Spinner />
		);

		const expected = false;
		const actual = spinner.find(`div.${css.client}`).exists();

		expect(actual).to.equal(expected);
	});

	it('should have a client node when Spinner has children', function () {
		const spinner = mount(
			<Spinner>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`div.${css.client}`).exists();

		expect(actual).to.equal(expected);
	});

	it('should have content class when Spinner has children', function () {
		const spinner = mount(
			<Spinner>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`div.${css.spinner}`).hasClass(css.content);

		expect(actual).to.equal(expected);
	});

	it('should have transparent class when transparent prop equals true', function () {
		const spinner = mount(
			<Spinner transparent>
				Loading...
			</Spinner>
		);

		const expected = true;
		const actual = spinner.find(`div.${css.spinner}`).hasClass(css.transparent);

		expect(actual).to.equal(expected);
	});

	it('should set role to alert by default', function () {
		const spinner = mount(
			<Spinner />
		);

		const expected = 'alert';
		const actual = spinner.find(`div.${css.spinner}`).prop('role');

		expect(actual).to.equal(expected);
	});

	it('should set aria-live to off by default', function () {
		const spinner = mount(
			<Spinner />
		);

		const expected = 'off';
		const actual = spinner.find(`div.${css.spinner}`).prop('aria-live');

		expect(actual).to.equal(expected);
	});
});
