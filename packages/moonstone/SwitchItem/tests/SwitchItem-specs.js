import React from 'react';
import {mount} from 'enzyme';
import SwitchItem from '../SwitchItem';

describe('SwitchItem Specs', () => {

	it('should contain a Switch', function () {

		const switchItem = mount(
			<SwitchItem>
				SwitchItem
			</SwitchItem>
		);

		const expected = 1;
		const actual = switchItem.find('Switch').length;

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
