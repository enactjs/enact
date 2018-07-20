import React from 'react';
import PropTypes from 'prop-types';
import {mount, shallow} from 'enzyme';

import {Popup, PopupBase} from '../Popup';
import css from '../Popup.less';

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

	it('should be rendered opened if open is set to true', () => {
		const popup = mount(
			<Popup open><div>popup</div></Popup>,
			options
		);

		const expected = true;
		const actual = popup.find('FloatingLayer').prop('open');

		expect(actual).to.equal(expected);
	});

	it('should not be rendered if open is set to false', () => {
		const popup = mount(
			<Popup><div>popup</div></Popup>,
			options
		);

		const expected = false;
		const actual = popup.find('FloatingLayer').prop('open');

		expect(actual).to.equal(expected);
	});

	it('should set popup close button "aria-label" to closeButtonAriaLabel', () => {
		const label = 'custom close button label';
		const popup = mount(
			<Popup open showCloseButton closeButtonAriaLabel={label}><div>popup</div></Popup>,
			options
		);

		const expected = label;
		const actual = popup.find('IconButton').prop('aria-label');

		expect(actual).to.equal(expected);
	});

	it('should set role to alert by default', function () {
		const popup = shallow(
			<PopupBase><div>popup</div></PopupBase>
		);

		const expected = 'alert';
		const actual = popup.find(`.${css.popup}`).prop('role');

		expect(actual).to.equal(expected);
	});

	it('should allow role to be overridden', function () {
		const popup = shallow(
			<PopupBase role="dialog"><div>popup</div></PopupBase>
		);

		const expected = 'dialog';
		const actual = popup.find(`.${css.popup}`).prop('role');

		expect(actual).to.equal(expected);
	});
});
