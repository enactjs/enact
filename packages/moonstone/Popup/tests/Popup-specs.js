import React from 'react';
import {mount} from 'enzyme';

import Popup from '../Popup';

describe.only('Popup specs', () => {
	beforeEach(() => {
		const div = document.createElement('div');
		div.setAttribute('id', 'portal');
		document.body.appendChild(div);
	});

	it('should be rendered opened if open is set to true', () => {
		const popup = mount(
			<Popup open><div>popup</div></Popup>
		);

		const expected = true;
		const actual = popup.find('Portal').prop('open');

		expect(actual).to.equal(expected);
	});

	it('should not be rendered if open is set to false', () => {
		const popup = mount(
			<Popup><div>popup</div></Popup>
		);

		const expected = false;
		const actual = popup.find('Portal').prop('open');

		expect(actual).to.equal(expected);
	});
});
