import React from 'react';
import {mount, shallow} from 'enzyme';

import Popup from '../Popup';

describe('Popup specs', () => {
	beforeEach(() => {
		const div = document.createElement('div');
		div.setAttribute('id', 'floatLayer');
		document.body.appendChild(div);
	});

	afterEach(() => {
		const div = document.getElementById('floatLayer');
		document.body.removeChild(div);
	});

	it('should be rendered opened if open is set to true', () => {
		const popup = mount(
			<Popup open><div>popup</div></Popup>
		);

		const expected = true;
		const actual = popup.find('FloatingLayer').prop('open');

		expect(actual).to.equal(expected);
	});

	it('should not be rendered if open is set to false', () => {
		const popup = mount(
			<Popup><div>popup</div></Popup>
		);

		const expected = false;
		const actual = popup.find('FloatingLayer').prop('open');

		expect(actual).to.equal(expected);
	});

	it('should set role to alert by default', function () {
		const popup = shallow(
			<Popup><div>popup</div></Popup>
		);

		const expected = 'alert';
		const actual = popup.find('PopupBase').prop('role');

		expect(actual).to.equal(expected);
	});

	it('should allow role to be overridden', function () {
		const popup = shallow(
			<Popup role="dialog"><div>popup</div></Popup>
		);

		const expected = 'dialog';
		const actual = popup.find('PopupBase').prop('role');

		expect(actual).to.equal(expected);
	});
});
