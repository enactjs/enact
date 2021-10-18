import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {forwardRef} from 'react';

import ToggleItem, {ToggleItemBase} from '../ToggleItem';
import Icon from '../../Icon';
import SlotItem from '../../SlotItem';
import Item from '../../Item';

const SlottedItem = forwardRef((props, ref) => (
	<SlotItem {...props} component={Item} ref={ref} />
));

const tap = (node) => {
	fireEvent.mouseDown(node);
	fireEvent.mouseUp(node);
};

const CustomIcon = (props) => <Icon {...props}>star</Icon>;

describe('ToggleItem Specs', () => {
	test('should call onToggle, onClick, or both when clicked', () => {
		const handleToggle = jest.fn();
		render(<ToggleItem component={SlottedItem} onToggle={handleToggle} iconComponent={CustomIcon}>ToggleItem</ToggleItem>);
		const toggleItem = screen.getByText('star');

		tap(toggleItem);

		const expected = 1;

		expect(handleToggle).toHaveBeenCalledTimes(expected);
	});

	test('should call onClick when clicked', () => {
		const handleClick = jest.fn();
		render(
			<ToggleItemBase component={SlottedItem} onClick={handleClick} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItemBase>
		);
		const toggleItem = screen.getByText('star');

		userEvent.click(toggleItem);

		const expected = 1;

		expect(handleClick).toHaveBeenCalledTimes(expected);
	});

	test('should call onTap when tapped', () => {
		const handleTap = jest.fn();
		render(
			<ToggleItem component={SlottedItem} onTap={handleTap} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);
		const toggleItem = screen.getByText('star');

		tap(toggleItem);

		const expected = 1;

		expect(handleTap).toHaveBeenCalledTimes(expected);
	});

	test('should call both onToggle and onTap when tapped', () => {
		const handleBoth = jest.fn();
		render(
			<ToggleItem component={SlottedItem} onTap={handleBoth} onToggle={handleBoth} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);
		const toggleItem = screen.getByText('star');

		tap(toggleItem);

		const expected = 2;

		expect(handleBoth).toHaveBeenCalledTimes(expected);
	});

	test('should receive its value prop in the onToggle handler', () => {
		const handleToggle = jest.fn();
		const value = 100;
		render(
			<ToggleItem component={SlottedItem} onToggle={handleToggle} iconComponent={CustomIcon} value={value}>
				Toggle Item
			</ToggleItem>
		);
		const toggleItem = screen.getByText('star');

		tap(toggleItem);

		const expected = value;
		const actual = handleToggle.mock.calls[0][0].value;

		expect(expected).toBe(actual);
	});

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(
			<ToggleItem component={SlottedItem} iconComponent={CustomIcon} ref={ref}>
				Toggle Item
			</ToggleItem>
		);

		const expected = 'DIV';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
