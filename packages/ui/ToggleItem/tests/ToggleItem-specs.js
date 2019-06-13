
import React from 'react';
import {mount} from 'enzyme';

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
		const handleToggle = jest.fn();
		const subject = mount(
			<ToggleItem component={SlottedItem} onToggle={handleToggle} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);

		tap(subject);

		const expected = 1;
		const actual = handleToggle.mock.calls.length;

		expect(expected).toBe(actual);
	});

	test('should call onClick when clicked', () => {
		const handleClick = jest.fn();
		const subject = mount(
			<ToggleItemBase component={SlottedItem} onClick={handleClick} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItemBase>
		);

		subject.simulate('click');

		const expected = 1;
		const actual = handleClick.mock.calls.length;

		expect(expected).toBe(actual);
	});

	test('should call onTap when tapped', () => {
		const handleTap = jest.fn();
		const subject = mount(
			<ToggleItem component={SlottedItem} onTap={handleTap} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);

		tap(subject);
		const expected = 1;
		const actual = handleTap.mock.calls.length;

		expect(expected).toBe(actual);
	});

	test('should call both onToggle and onTap when tapped', () => {
		const handleBoth = jest.fn();
		const subject = mount(
			<ToggleItem component={SlottedItem} onTap={handleBoth} onToggle={handleBoth} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);

		tap(subject);

		const expected = 2;
		const actual = handleBoth.mock.calls.length;

		expect(expected).toBe(actual);
	});

	test('should receive its value prop in the onToggle handler', () => {
		const handleToggle = jest.fn();
		const value = 100;
		const subject = mount(
			<ToggleItem component={SlottedItem} onToggle={handleToggle} iconComponent={CustomIcon} value={value}>
				Toggle Item
			</ToggleItem>
		);

		tap(subject);

		const expected = value;
		const actual = handleToggle.mock.calls[0][0].value;

		expect(expected).toBe(actual);
	});
});
