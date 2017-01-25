/* globals describe, it, expect */

import React from 'react';
import {shallow} from 'enzyme';

import defaultProps from '../defaultProps';

describe('defaultProps', () => {

	const Simple = (props) => <div {...props} />;
	Simple.defaultProps = {
		color: 'blue',
		children: 'Content'
	};

	it('should assign object to defaultProps on render method', function () {
		const render = () => {};
		const props = {
			value: true
		};

		defaultProps(props, render);

		const expected = true;
		const actual = render.defaultProps.value;

		expect(actual).to.equal(expected);
	});

	it('should add omitted props', function () {
		const subject = shallow(
			<Simple />
		);

		const expected = Simple.defaultProps.children;
		const actual = subject.prop('children');

		expect(actual).to.equal(expected);
	});

	it('should add explicitly undefined props', function () {
		const subject = shallow(
			<Simple color={void 0} />
		);

		const expected = Simple.defaultProps.color;
		const actual = subject.prop('color');

		expect(actual).to.equal(expected);
	});

	it('should allow defaults to be overridden', function () {
		const color = 'green';
		const subject = shallow(
			<Simple color={color} />
		);

		const expected = color;
		const actual = subject.prop('color');

		expect(actual).to.equal(expected);
	});

});
