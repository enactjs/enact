import React from 'react';
import {mount} from 'enzyme';
import Divider from '../Divider';

describe('Divider Specs', () => {

	it('should capitalize its content', function () {
		const content = 'uncapped';
		const divider = mount(
			<Divider>{content}</Divider>
		);

		const expected = content.charAt(0).toUpperCase();
		const actual = divider.text().charAt(0);

		expect(actual).to.equal(expected);
	});

	it('should render a Divider with content', function () {
		const content = 'Hello Divider!';

		const divider = mount(
			<Divider>{content}</Divider>
		);

		const expected = content;
		const actual = divider.text();

		expect(actual).to.equal(expected);
	});

	it('should not capitalize content when casing is "preserve"', function () {
		const content = 'uncapped';

		const divider = mount(
			<Divider casing="preserve">{content}</Divider>
		);

		const expected = content;
		const actual = divider.text();

		expect(actual).to.equal(expected);
	});
});
