import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {ItemBase} from '../Item';

describe('Item', () => {

	it('should create an Item that is enabled by default', function () {
		const item = mount(
			<ItemBase>I am an Item</ItemBase>
		);

		const expected = 0;
		const actual = item.find({disabled: true}).length;

		expect(actual).to.equal(expected);
	});

	it('should have \'disabled\' HTML attribute when \'disabled=true\'', function () {
		const item = mount(
			<ItemBase disabled>I am a disabled Item</ItemBase>
		);

		const expected = 1;
		const actual = item.find({disabled: true}).length;

		expect(actual).to.equal(expected);
	});

	describe('events', () => {
		it('should call onClick when not disabled', function () {
			const handleClick = sinon.spy();
			const item = mount(
				<ItemBase onClick={handleClick}>I am a disabled Item</ItemBase>
			);

			item.simulate('click');

			const expected = true;
			const actual = handleClick.called;

			expect(actual).to.equal(expected);
		});

		it('should not call onClick when disabled', function () {
			const handleClick = sinon.spy();
			const item = mount(
				<ItemBase disabled onClick={handleClick}>I am a disabled Item</ItemBase>
			);

			item.simulate('click');

			const expected = false;
			const actual = handleClick.called;

			expect(actual).to.equal(expected);
		});
	});
});
