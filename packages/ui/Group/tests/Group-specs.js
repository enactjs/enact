/* globals describe, it, expect */

import React from 'react';
import sinon from 'sinon';
import {mount, shallow} from 'enzyme';
import {GroupBase} from '../Group';

describe('Group', () => {
	const stringItems = ['One', 'Two', 'Three'];

	test('should call handler with selected on select', () => {
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const selected = 1;
		subject.find('div').at(selected).simulate('click', {});

		const expected = selected;
		const actual = handleClick.firstCall.args[0].selected;

		expect(actual).toBe(expected);
	});

	test('should call handler with data on select', () => {
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const selected = 1;
		subject.find('div').at(selected).simulate('click', {});

		const expected = stringItems[selected];
		const actual = handleClick.firstCall.args[0].data;

		expect(actual).toBe(expected);
	});

	test(
		'should call handler on move when childSelect="onMouseMove"',
		() => {
			const handleClick = sinon.spy();
			const subject = mount(
				<GroupBase childComponent="div" childSelect="onMouseMove" onSelect={handleClick}>
					{stringItems}
				</GroupBase>
			);

			subject.find('div').at(0).simulate('mousemove', {});

			const expected = true;
			const actual = handleClick.called;

			expect(actual).toBe(expected);
		}
	);

	test('should select the third item with selected=2', () => {
		const selected = 2;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" selected={selected} onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = true;
		const actual = subject.find('div').at(selected).prop('data-selected');

		expect(actual).toBe(expected);
	});

	test('should set {data-active} on the first item', () => {
		const selected = 0;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" selected={selected} selectedProp="data-active" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = true;
		const actual = subject.find('div').at(selected).prop('data-active');

		expect(actual).toBe(expected);
	});

	test('should set {children} to be the item by default', () => {
		const selected = 0;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = stringItems[selected];
		const actual = subject.find('div').at(selected).prop('children');

		expect(actual).toBe(expected);
	});

	test('should set {data-child} to be the item', () => {
		const selected = 0;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" childProp="data-child" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = stringItems[selected];
		const actual = subject.find('div').at(selected).prop('data-child');

		expect(actual).toBe(expected);
	});

	test('should set aria-multiselectable when select="multiple"', () => {
		const subject = shallow(
			<GroupBase childComponent="div" select="multiple">
				{stringItems}
			</GroupBase>
		);

		const expected = true;
		const actual = subject.prop('aria-multiselectable');

		expect(actual).toBe(expected);
	});

	test('should set role to group', () => {
		const subject = shallow(
			<GroupBase childComponent="div" select="multiple">
				{stringItems}
			</GroupBase>
		);

		const expected = 'group';
		const actual = subject.prop('role');

		expect(actual).toBe(expected);
	});

});
