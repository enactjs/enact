/* globals describe, it, expect */

import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {GroupBase} from '../Group';

describe('Group', () => {
	const stringItems = ['One', 'Two', 'Three'];

	it('Should call handler with index on activate', function () {
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase type="div" onActivate={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const index = 1;
		subject.first().childAt(index).simulate('click', {});

		const expected = index;
		const actual = handleClick.firstCall.args[0].index;

		expect(actual).to.equal(expected);
	});

	it('Should call handler with data on activate', function () {
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase type="div" onActivate={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const index = 1;
		subject.first().childAt(index).simulate('click', {});

		const expected = stringItems[index];
		const actual = handleClick.firstCall.args[0].data;

		expect(actual).to.equal(expected);
	});

	it('Should call handler on move when activate="onMouseMove"', function () {
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase type="div" activate='onMouseMove' onActivate={handleClick}>
				{stringItems}
			</GroupBase>
		);

		subject.first().childAt(0).simulate('mousemove', {});

		const expected = true;
		const actual = handleClick.called;

		expect(actual).to.equal(expected);
	});

	// TODO: only way I could resolve the first repeated child was using find(). Seems like there
	// should be a better option as this could lead to false positives if the DOM structure changes
	it('Should select the first item by default', function () {
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase type="div" onActivate={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = true;
		const actual = subject.find('div').first().prop('data-selected');

		expect(actual).to.equal(expected);
	});

	it('Should select the third item with index=2', function () {
		const index = 2;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase type="div" index={index} onActivate={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = true;
		const actual = subject.find('div').at(index).prop('data-selected');

		expect(actual).to.equal(expected);
	});

	it('Should set {data-active} on the first item', function () {
		const index = 0;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase type="div" index={index} selectedProp="data-active" onActivate={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = true;
		const actual = subject.find('div').at(index).prop('data-active');

		expect(actual).to.equal(expected);
	});

	it('Should set {children} to be the item by default', function () {
		const index = 0;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase type="div" onActivate={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = stringItems[index];
		const actual = subject.find('div').at(index).prop('children');

		expect(actual).to.equal(expected);
	});

	it('Should set {data-child} to be the item', function () {
		const index = 0;
		const handleClick = sinon.spy();
		const subject = mount(
			<GroupBase type="div" childProp="data-child" onActivate={handleClick}>
				{stringItems}
			</GroupBase>
		);

		const expected = stringItems[index];
		const actual = subject.find('div').at(index).prop('data-child');

		expect(actual).to.equal(expected);
	});

});
