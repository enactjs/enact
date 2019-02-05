import React from 'react';
import PropTypes from 'prop-types';
import {mount, shallow} from 'enzyme';

import {Popup, PopupBase} from '../Popup';
import css from '../Popup.module.less';

describe('Popup specs', () => {
	const options = {
		context: {
			getFloatingLayer: () => document.getElementById('floatLayer')
		},
		childContextTypes: {
			getFloatingLayer: PropTypes.func
		}
	};

	beforeEach(() => {
		const div = document.createElement('div');
		div.setAttribute('id', 'floatLayer');
		document.body.appendChild(div);
	});

	afterEach(() => {
		const div = document.getElementById('floatLayer');
		document.body.removeChild(div);
	});

	test('should be rendered opened if open is set to true', () => {
		const popup = mount(
			<Popup open><div>popup</div></Popup>,
			options
		);

		const expected = true;
		const actual = popup.find('FloatingLayer').prop('open');

		expect(actual).toBe(expected);
	});

	test('should not be rendered if open is set to false', () => {
		const popup = mount(
			<Popup><div>popup</div></Popup>,
			options
		);

		const expected = false;
		const actual = popup.find('FloatingLayer').prop('open');

		expect(actual).toBe(expected);
	});

	test(
		'should set popup close button "aria-label" to closeButtonAriaLabel',
		() => {
			const label = 'custom close button label';
			const popup = mount(
				<Popup open showCloseButton closeButtonAriaLabel={label}><div>popup</div></Popup>,
				options
			);

			const expected = label;
			const actual = popup.find('IconButton').prop('aria-label');

			expect(actual).toBe(expected);
		}
	);

	test('should set role to alert by default', () => {
		const popup = shallow(
			<PopupBase><div>popup</div></PopupBase>
		);

		const expected = 'alert';
		const actual = popup.find(`.${css.popup}`).prop('role');

		expect(actual).toBe(expected);
	});

	test('should allow role to be overridden', () => {
		const popup = shallow(
			<PopupBase role="dialog"><div>popup</div></PopupBase>
		);

		const expected = 'dialog';
		const actual = popup.find(`.${css.popup}`).prop('role');

		expect(actual).toBe(expected);
	});

	test('should set "data-webos-voice-exclusive" when popup is open', () => {
		const popup = mount(
			<Popup open><div>popup</div></Popup>,
			options
		);

		const expected = true;
		const actual = popup.find(`.${css.popup}`).prop('data-webos-voice-exclusive');

		expect(actual).toBe(expected);
	});

	test('should set "data-webos-voice-disabled" when voice control is disabled', () => {
		const popup = mount(
			<Popup open data-webos-voice-disabled><div>popup</div></Popup>,
			options
		);

		const expected = true;
		const actual = popup.find(`.${css.popup}`).prop('data-webos-voice-disabled');

		expect(actual).toBe(expected);
	});
});
