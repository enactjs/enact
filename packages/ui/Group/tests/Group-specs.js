/* globals describe, it, expect */

import React from 'react';
import sinon from 'sinon';
import {mount, shallow} from 'enzyme';
import {GroupBase} from '../Group';

describe('Group', () => {
	const stringItems = ['One', 'Two', 'Three'];

	it('should call handler with selected on select', function () {
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

		expect(actual).to.equal(expected);
	});

	it('should call handler with data on select', function () {
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

		expect(actual).to.equal(expected);
	});

	it('should call handler on move when childSelect="onMouseMove"', function () {
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" childSelect="onMouseMove" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		subject.find('div').at(0).simulate('mousemove', {});

		const expected = true;
		const actual = handleClick.called;

		expect(actual).to.equal(expected);
	});

	it('should select the third item with selected=2', function () {
		const selected = 2;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" selected={selected} onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = true;
		const actual = subject.find('div').at(selected).prop('data-selected');

		expect(actual).to.equal(expected);
	});

	it('should set {data-active} on the first item', function () {
		const selected = 0;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" selected={selected} selectedProp="data-active" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = true;
		const actual = subject.find('div').at(selected).prop('data-active');

		expect(actual).to.equal(expected);
	});

	it('should set {children} to be the item by default', function () {
		const selected = 0;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = stringItems[selected];
		const actual = subject.find('div').at(selected).prop('children');

		expect(actual).to.equal(expected);
	});

	it('should set {data-child} to be the item', function () {
		const selected = 0;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase childComponent="div" childProp="data-child" onSelect={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = stringItems[selected];
		const actual = subject.find('div').at(selected).prop('data-child');

		expect(actual).to.equal(expected);
	});

	it('should set aria-multiselectable when select="multiple"', function () {
		const subject = shallow(
			<GroupBase childComponent="div" select="multiple">
				{stringItems}
			</GroupBase>
		);

		const expected = true;
		const actual = subject.prop('aria-multiselectable');

		expect(actual).to.equal(expected);
	});

	it('should set role to group', function () {
		const subject = shallow(
			<GroupBase childComponent="div" select="multiple">
				{stringItems}
			</GroupBase>
		);

		const expected = 'group';
		const actual = subject.prop('role');

		expect(actual).to.equal(expected);
	});

});
