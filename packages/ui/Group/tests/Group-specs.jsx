import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Group, {GroupBase} from '../Group';

describe('Group', () => {
	const stringItems = ['One', 'Two', 'Three'];

	test('should call handler with selected on select', async () => {
		const handleClick = jest.fn();
		const user = userEvent.setup();
		render(
			<GroupBase childComponent="div" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);
		const selected = screen.getByText('Two');
		await user.click(selected);

		const expected = 1;
		const actual = handleClick.mock.calls[0][0].selected;

		expect(actual).toBe(expected);
	});

	test('should call handler with data on select', async () => {
		const handleClick = jest.fn();
		const user = userEvent.setup();
		render(
			<GroupBase childComponent="div" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);
		const selected = screen.getByText('Two');
		await user.click(selected);

		const expected = stringItems[1];
		const actual = handleClick.mock.calls[0][0].data;

		expect(actual).toBe(expected);
	});

	test('should call handler with data on select stored in the key specified by `selectedEventProp`', async () => {
		const handleClick = jest.fn();
		const user = userEvent.setup();
		render(
			<GroupBase childComponent="div" onSelect={handleClick} selectedEventProp="value">
				{stringItems}
			</GroupBase>
		);
		const selected = screen.getByText('Two');
		await user.click(selected);

		const expected = stringItems[1];
		const actual = handleClick.mock.calls[0][0].value;

		expect(actual).toBe(expected);
	});

	test('should call handler on move when childSelect="onMouseMove"', () => {
		const handleClick = jest.fn();
		render(
			<GroupBase childComponent="div" childSelect="onMouseMove" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);
		const selected = screen.getByText('Two');
		fireEvent.mouseMove(selected);

		const expected = 1;
		const actual = handleClick.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test('should select the third item with selected=2', () => {
		const selected = 2;
		const handleClick = jest.fn();
		render(
			<GroupBase childComponent="div" onSelect={handleClick} selected={selected}>
				{stringItems}
			</GroupBase>
		);

		const expected = 'true';
		const actual = screen.getByText('Three');

		expect(actual).toHaveAttribute('data-selected', expected);
	});

	test('should set {data-active} on the first item', () => {
		const selected = 0;
		const handleClick = jest.fn();
		render(
			<GroupBase childComponent="div" onSelect={handleClick} selected={selected} selectedProp="data-active">
				{stringItems}
			</GroupBase>
		);

		const expected = 'true';
		const actual = screen.getByText('One');

		expect(actual).toHaveAttribute('data-active', expected);
	});

	test('should set {children} to be the item by default', () => {
		const selected = 0;
		const handleClick = jest.fn();
		render(
			<GroupBase childComponent="div" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = stringItems[selected];
		const actual = screen.getByText('One');

		expect(actual).toHaveTextContent(expected);
	});

	test('should set {data-child} to be the item', () => {
		const selected = 0;
		const handleClick = jest.fn();
		render(
			<GroupBase childComponent="div" childProp="data-child" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = stringItems[selected];
		const actual = screen.getByRole('group').firstChild;

		expect(actual).toHaveAttribute('data-child', expected);
	});

	test('should set aria-multiselectable when select="multiple"', () => {
		render(
			<GroupBase childComponent="div" select="multiple">
				{stringItems}
			</GroupBase>
		);

		const expected = 'true';
		const actual = screen.getByRole('group');

		expect(actual).toHaveAttribute('aria-multiselectable', expected);
	});

	test('should set role to group', () => {
		render(
			<GroupBase childComponent="div" select="multiple">
				{stringItems}
			</GroupBase>
		);

		const actual = screen.getByRole('group');

		expect(actual).toBeInTheDocument();
	});

	test('should return a DOM node reference for `componentRef`', () => {
		const ref = jest.fn();
		render(
			<Group childComponent="div" ref={ref}>
				{stringItems}
			</Group>
		);

		const expected = 'SPAN';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});
});
