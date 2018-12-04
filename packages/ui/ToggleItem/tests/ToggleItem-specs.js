
import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';

import ToggleItem, {ToggleItemBase} from '../ToggleItem';
import Icon from '../../Icon';
import SlotItem from '../../SlotItem';
import Item from '../../Item';

const SlottedItem = (props) => <SlotItem {...props} component={Item} />;

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

const CustomIcon = (props) => <Icon {...props}>star</Icon>;

describe('ToggleItem Specs', () => {

	test('should call onToggle, onClick, or both when clicked', () => {
		const handleToggle = sinon.spy();
		const subject = mount(
			<ToggleItem component={SlottedItem} onToggle={handleToggle} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);

		tap(subject);

		const expected = 1;
		const actual = handleToggle.callCount;

		expect(expected).toBe(actual);
	});

	test('should call onClick when clicked', () => {
		const handleClick = sinon.spy();
		const subject = mount(
			<ToggleItemBase component={SlottedItem} onClick={handleClick} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItemBase>
		);

		subject.simulate('click');

		const expected = 1;
		const actual = handleClick.callCount;

		expect(expected).toBe(actual);
	});

	test('should call onTap when tapped', () => {
		const handleTap = sinon.spy();
		const subject = mount(
			<ToggleItem component={SlottedItem} onTap={handleTap} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);

		tap(subject);
		const expected = 1;
		const actual = handleTap.callCount;

		expect(expected).toBe(actual);
	});

	test('should call both onToggle and onTap when tapped', () => {
		const handleBoth = sinon.spy();
		const subject = mount(
			<ToggleItem component={SlottedItem} onTap={handleBoth} onToggle={handleBoth} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);

		tap(subject);

		const expected = 2;
		const actual = handleBoth.callCount;

		expect(expected).toBe(actual);
	});
});
