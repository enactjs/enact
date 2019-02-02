import React from 'react';
import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import {mount, shallow} from 'enzyme';

import {Popup, PopupBase} from '../Popup';
import css from '../Popup.module.less';

const FloatingLayerController = FloatingLayerDecorator('div');

describe('Popup specs', () => {
	test('should be rendered opened if open is set to true', () => {
		const popup = mount(
			<FloatingLayerController>
				<Popup open><div>popup</div></Popup>
			</FloatingLayerController>
		);

		const expected = true;
		const actual = popup.find('FloatingLayer').prop('open');

		expect(actual).toBe(expected);
	});

	test('should not be rendered if open is set to false', () => {
		const popup = mount(
			<FloatingLayerController>
				<Popup><div>popup</div></Popup>
			</FloatingLayerController>
		);

		const expected = false;
		const actual = popup.find('FloatingLayer').prop('open');

		expect(actual).toBe(expected);
	});

	test(
		'should set popup close button "aria-label" to closeButtonAriaLabel',
		() => {
			const label = 'custom close button label';
			const popup = shallow(
				<PopupBase showCloseButton closeButtonAriaLabel={label}><div>popup</div></PopupBase>
			);

			const expected = label;
			const actual = popup.find(`.${css.closeButton}`).prop('aria-label');

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
			<FloatingLayerController>
				<Popup open><div>popup</div></Popup>
			</FloatingLayerController>
		);

		const expected = true;
		const actual = popup.find(`.${css.popup}`).prop('data-webos-voice-exclusive');

		expect(actual).toBe(expected);
	});

	test('should set "data-webos-voice-disabled" when voice control is disabled', () => {
		const popup = shallow(
			<PopupBase open data-webos-voice-disabled><div>popup</div></PopupBase>
		);

		const expected = true;
		const actual = popup.find(`.${css.popup}`).prop('data-webos-voice-disabled');

		expect(actual).toBe(expected);
	});
});
