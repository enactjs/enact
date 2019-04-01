import React from 'react';
import {mount} from 'enzyme';

import ToggleIcon from '../ToggleIcon';
import Touchable from '../../Touchable';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

const touch = (node) => {
	node.simulate('touchstart');
	node.simulate('touchend');
};

const TouchableDiv = Touchable('div');

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

	test.only('should call both onTouchEnd only on the Icon', () => {
		const handleDiv = jest.fn();
		const handleIcon = jest.fn();
		const subject = mount(
			<TouchableDiv onTouchEnd={handleDiv}>
				<ToggleIcon onTouchEnd={handleIcon}>
					star
				</ToggleIcon>
			</TouchableDiv>
		);
		const Icon = subject.find('Toggleable');

		touch(Icon);

		const expectedDiv = 0;
		const actualDiv = handleDiv.mock.calls.length;

		const expectedIcon = 1;
		const actualIcon = handleIcon.mock.calls.length;

		expect(expectedDiv).toBe(actualDiv);
		expect(expectedIcon).toBe(actualIcon);
	});

});
