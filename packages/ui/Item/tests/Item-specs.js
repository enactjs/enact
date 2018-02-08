import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Item from '../Item';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

describe('Item', () => {

	it('should create an Item that is enabled by default', function () {
		const item = mount(
			<Item>I am an Item</Item>
		);

		const expected = 0;
		const actual = item.find({disabled: true}).length;

		expect(actual).to.equal(expected);
	});

	it('should have \'disabled\' HTML attribute when \'disabled=true\'', function () {
		const item = mount(
			<Item disabled>I am a disabled Item</Item>
		);

		const expected = 1;
		const actual = item.find('div[disabled=true]').length;

		expect(actual).to.equal(expected);
	});

	describe('events', () => {
		it('should call onTap when tapped', function () {
			const handleClick = sinon.spy();
			const item = mount(
				<Item onTap={handleClick}>I am a normal Item</Item>
			);

			tap(item);

			const expected = true;
			const actual = handleClick.called;

			expect(actual).to.equal(expected);
		});

		it('should not call onTap when tapped and disabled', function () {
			const handleClick = sinon.spy();
			const item = mount(
				<Item disabled onTap={handleClick}>I am a disabled Item</Item>
			);

			tap(item);

			const expected = false;
			const actual = handleClick.called;

			expect(actual).to.equal(expected);
		});
	});

});
