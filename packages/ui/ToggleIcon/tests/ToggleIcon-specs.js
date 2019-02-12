import React from 'react';
import {mount} from 'enzyme';

import ToggleIcon from '../ToggleIcon';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

describe('ToggleIcon Specs', () => {

	test('should call onToggle when tapped', () => {
		const handleToggle = jest.fn();
		const subject = mount(
			<ToggleIcon onToggle={handleToggle}>
				star
			</ToggleIcon>
		);

		tap(subject);

		const expected = 1;
		const actual = handleToggle.mock.calls.length;

		expect(expected).toBe(actual);
	});

	test('should call onClick when clicked', () => {
		const handleClick = jest.fn();
		const subject = mount(
			<ToggleIcon onClick={handleClick}>
				star
			</ToggleIcon>
		);

		subject.simulate('click');

		const expected = 1;
		const actual = handleClick.mock.calls.length;

		expect(expected).toBe(actual);
	});

	test('should call onTap when tapped', () => {
		const handleTap = jest.fn();
		const subject = mount(
			<ToggleIcon onTap={handleTap}>
				star
			</ToggleIcon>
		);

		tap(subject);

		const expected = 1;
		const actual = handleTap.mock.calls.length;

		expect(expected).toBe(actual);
	});

	test('should call both onToggle and onTap when tapped', () => {
		const handleBoth = jest.fn();
		const subject = mount(
			<ToggleIcon onTap={handleBoth} onToggle={handleBoth}>
				star
			</ToggleIcon>
		);

		tap(subject);

		const expected = 2;
		const actual = handleBoth.mock.calls.length;

		expect(expected).toBe(actual);
	});

});
