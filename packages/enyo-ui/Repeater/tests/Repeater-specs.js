/* globals describe, it, expect */

import React from 'react';
import {shallow} from 'enzyme';
import Repeater from '../Repeater';

describe('Repeater Specs', () => {
	const stringItems = ['One', 'Two', 'Three'];
	const objItems = stringItems.map((content, key) => ({key, content}));

	// eslint-disable-next-line react/prop-types, react/display-name
	const CustomType = (props) => <div>{props.content}</div>;

	it('Should have a root span element', function () {
		const subject = shallow(
			<Repeater type="div">{stringItems}</Repeater>
		);

		const expected = 'span';
		const actual = subject.first().name();

		expect(actual).to.equal(expected);
	});

	it('Should accept a nodeName as type', function () {
		const subject = shallow(
			<Repeater type="div">{stringItems}</Repeater>
		);

		const expected = 3;
		const actual = subject.first().children().length;

		expect(actual).to.equal(expected);
	});

	it('Should accept a function as type', function () {
		const subject = shallow(
			<Repeater type={CustomType}>{stringItems}</Repeater>
		);

		const expected = 3;
		const actual = subject.first().children().length;

		expect(actual).to.equal(expected);
	});

	it('Should create a number of children matching the length of items', function () {
		const subject = shallow(
			<Repeater type="div">{stringItems}</Repeater>
		);

		const expected = stringItems.length;
		const actual = subject.first().children().length;

		expect(actual).to.equal(expected);
	});

	it('Should support an array of objects as items', function () {
		const subject = shallow(
			<Repeater type={CustomType}>{objItems}</Repeater>
		);

		const expected = objItems.length;
		const actual = subject.first().children().length;

		expect(actual).to.equal(expected);
	});

	it('Should support passing itemProps to children', function () {
		const subject = shallow(
			<Repeater type="div" itemProps={{title: 'test'}}>{stringItems}</Repeater>
		);

		const expected = 'test';
		const actual = subject.first().childAt(0).prop('title');

		expect(actual).to.equal(expected);
	});

	it('Should pass index to each child', function () {
		const subject = shallow(
			<Repeater type="div">{stringItems}</Repeater>
		);

		const expected = 0;
		const actual = subject.first().childAt(0).prop('data-index');

		expect(actual).to.equal(expected);
	});

	it('Should pass data to each child', function () {
		const subject = shallow(
			<Repeater type="div" childProp="data-str">{stringItems}</Repeater>
		);

		const expected = stringItems[0];
		const actual = subject.first().childAt(0).prop('data-str');

		expect(actual).to.equal(expected);
	});

	it('Should pass item as children to each child', function () {
		const subject = shallow(
			<Repeater type="div">{stringItems}</Repeater>
		);

		const expected = stringItems[0];
		const actual = subject.first().childAt(0).prop('children');

		expect(actual).to.equal(expected);
	});

});
