import React from 'react';
import {mount} from 'enzyme';
import SwitchItem from '../SwitchItem';
import SwitchCss from '../../Switch/Switch.less';

describe('SwitchItem Specs', () => {

	it('should contain Switch Icon', function () {

		const switchItem = mount(
			<SwitchItem>
				SwitchItem
			</SwitchItem>
		);

		const IconComponent = switchItem.find('Icon');

		const expected = SwitchCss.icon;
		const actual = IconComponent.prop('className');

		expect(actual).to.equal(expected);
	});

	it('should pass selected to Switch element', function () {

		const switchItem = mount(
			<SwitchItem selected>
				SwitchItem
			</SwitchItem>
		);

		const SwitchComponent = switchItem.find('Switch');

		const expected = true;
		const actual = SwitchComponent.prop('selected');

		expect(actual).to.equal(expected);
	});

	it('should pass disabled to Switch element', function () {

		const switchItem = mount(
			<SwitchItem disabled>
				SwitchItem
			</SwitchItem>
		);

		const SwitchComponent = switchItem.find('Switch');

		const expected = true;
		const actual = SwitchComponent.prop('disabled');

		expect(actual).to.equal(expected);
	});
});
