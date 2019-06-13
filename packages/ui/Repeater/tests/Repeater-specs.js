/* eslint-disable react/jsx-no-bind */

import React from 'react';
import {shallow} from 'enzyme';
import {RepeaterBase} from '../Repeater';

describe('Repeater Specs', () => {
	const stringItems = ['One', 'Two', 'Three'];
	const objItems = stringItems.map((content, key) => ({key, content}));

	const CustomRootType = (props) => <div {...props} />;
	// eslint-disable-next-line enact/prop-types, enact/display-name
	const CustomType = (props) => <div>{props.content}</div>;

	test('should have a root span element', () => {
		const subject = shallow(
			<RepeaterBase childComponent="div">{stringItems}</RepeaterBase>
		);

		const expected = 'span';
		const actual = subject.first().name();

		expect(actual).toBe(expected);
	});

	test('should accept a nodeName as root element', () => {
		const subject = shallow(
			<RepeaterBase component="div" childComponent="div">{stringItems}</RepeaterBase>
		);

		const expected = 'div';
		const actual = subject.first().name();

		expect(actual).toBe(expected);
	});

	test('should accept a function as root element', () => {
		const subject = shallow(
			<RepeaterBase component={CustomRootType} childComponent="div">{stringItems}</RepeaterBase>
		);

		const expected = 'CustomRootType';
		const actual = subject.first().name();

		expect(actual).toBe(expected);
	});

	test('should accept a nodeName as childComponent', () => {
		const subject = shallow(
			<RepeaterBase childComponent="div">{stringItems}</RepeaterBase>
		);

		const expected = 3;
		const actual = subject.first().children().length;

		expect(actual).toBe(expected);
	});

	test('should accept a function as childComponent', () => {
		const subject = shallow(
			<RepeaterBase childComponent={CustomType}>{stringItems}</RepeaterBase>
		);

		const expected = 3;
		const actual = subject.first().children().length;

		expect(actual).toBe(expected);
	});

	test(
		'should create a number of children matching the length of items',
		() => {
			const subject = shallow(
				<RepeaterBase childComponent="div">{stringItems}</RepeaterBase>
			);

			const expected = stringItems.length;
			const actual = subject.first().children().length;

			expect(actual).toBe(expected);
		}
	);

	test('should support an array of objects as items', () => {
		const subject = shallow(
			<RepeaterBase childComponent={CustomType}>{objItems}</RepeaterBase>
		);

		const expected = objItems.length;
		const actual = subject.first().children().length;

		expect(actual).toBe(expected);
	});

	test('should support passing itemProps to children', () => {
		const subject = shallow(
			<RepeaterBase childComponent="div" itemProps={{title: 'test'}}>{stringItems}</RepeaterBase>
		);

		const expected = 'test';
		const actual = subject.first().childAt(0).prop('title');

		expect(actual).toBe(expected);
	});

	test('should pass index to each child', () => {
		const subject = shallow(
			<RepeaterBase childComponent="div">{stringItems}</RepeaterBase>
		);

		const expected = 0;
		const actual = subject.first().childAt(0).prop('data-index');

		expect(actual).toBe(expected);
	});

	test('should pass data to each child', () => {
		const subject = shallow(
			<RepeaterBase childComponent="div" childProp="data-str">{stringItems}</RepeaterBase>
		);

		const expected = stringItems[0];
		const actual = subject.first().childAt(0).prop('data-str');

		expect(actual).toBe(expected);
	});

	test('should pass item as children to each child', () => {
		const subject = shallow(
			<RepeaterBase childComponent="div">{stringItems}</RepeaterBase>
		);

		const expected = stringItems[0];
		const actual = subject.first().childAt(0).prop('children');

		expect(actual).toBe(expected);
	});

	test('should set role to list by default', () => {
		const subject = shallow(
			<RepeaterBase childComponent="div">{stringItems}</RepeaterBase>
		);

		const expected = 'list';
		const actual = subject.prop('role');

		expect(actual).toBe(expected);
	});

	test('should allow role to be overridden', () => {
		const subject = shallow(
			<RepeaterBase childComponent="div" role="listbox">{stringItems}</RepeaterBase>
		);

		const expected = 'listbox';
		const actual = subject.prop('role');

		expect(actual).toBe(expected);
	});
});
