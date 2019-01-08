/* eslint-disable react/jsx-no-bind */

import React from 'react';
import {shallow} from 'enzyme';
import Repeater from '../Repeater';

describe('Repeater Specs', () => {
	const stringItems = ['One', 'Two', 'Three'];
	const objItems = stringItems.map((content, key) => ({key, content}));

	// eslint-disable-next-line enact/prop-types, enact/display-name
	const CustomType = (props) => <div>{props.content}</div>;

	test('should have a root span element', () => {
		const subject = shallow(
			<Repeater childComponent="div">{stringItems}</Repeater>
		);

		const expected = 'span';
		const actual = subject.first().name();

		expect(actual).toBe(expected);
	});

	test('should accept a nodeName as childComponent', () => {
		const subject = shallow(
			<Repeater childComponent="div">{stringItems}</Repeater>
		);

		const expected = 3;
		const actual = subject.first().children().length;

		expect(actual).toBe(expected);
	});

	test('should accept a function as childComponent', () => {
		const subject = shallow(
			<Repeater childComponent={CustomType}>{stringItems}</Repeater>
		);

		const expected = 3;
		const actual = subject.first().children().length;

		expect(actual).toBe(expected);
	});

	test(
		'should create a number of children matching the length of items',
		() => {
			const subject = shallow(
				<Repeater childComponent="div">{stringItems}</Repeater>
			);

			const expected = stringItems.length;
			const actual = subject.first().children().length;

			expect(actual).toBe(expected);
		}
	);

	test('should support an array of objects as items', () => {
		const subject = shallow(
			<Repeater childComponent={CustomType}>{objItems}</Repeater>
		);

		const expected = objItems.length;
		const actual = subject.first().children().length;

		expect(actual).toBe(expected);
	});

	test('should support passing itemProps to children', () => {
		const subject = shallow(
			<Repeater childComponent="div" itemProps={{title: 'test'}}>{stringItems}</Repeater>
		);

		const expected = 'test';
		const actual = subject.first().childAt(0).prop('title');

		expect(actual).toBe(expected);
	});

	test('should pass index to each child', () => {
		const subject = shallow(
			<Repeater childComponent="div">{stringItems}</Repeater>
		);

		const expected = 0;
		const actual = subject.first().childAt(0).prop('data-index');

		expect(actual).toBe(expected);
	});

	test('should pass data to each child', () => {
		const subject = shallow(
			<Repeater childComponent="div" childProp="data-str">{stringItems}</Repeater>
		);

		const expected = stringItems[0];
		const actual = subject.first().childAt(0).prop('data-str');

		expect(actual).toBe(expected);
	});

	test('should pass item as children to each child', () => {
		const subject = shallow(
			<Repeater childComponent="div">{stringItems}</Repeater>
		);

		const expected = stringItems[0];
		const actual = subject.first().childAt(0).prop('children');

		expect(actual).toBe(expected);
	});

	test('should set role to list by default', () => {
		const subject = shallow(
			<Repeater childComponent="div">{stringItems}</Repeater>
		);

		const expected = 'list';
		const actual = subject.prop('role');

		expect(actual).toBe(expected);
	});

	test('should allow role to be overridden', () => {
		const subject = shallow(
			<Repeater childComponent="div" role="listbox">{stringItems}</Repeater>
		);

		const expected = 'listbox';
		const actual = subject.prop('role');

		expect(actual).toBe(expected);
	});
});
