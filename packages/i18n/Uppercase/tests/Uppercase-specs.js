import React from 'react';
import {mount} from 'enzyme';
import Uppercase from '../Uppercase';

describe('Uppercase', () => {

	// Suite-wide setup

	it('should uppercase content when it contains a single string child', function () {
		const Component = (props) => (
			<div>{props.children}</div>
		);
		const Wrapped = Uppercase(Component);
		const subject = mount(
			<Wrapped>uppercase</Wrapped>
		);

		const expected = 'UPPERCASE';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

	it('should not uppercase content when preserveCase is true', function () {
		const Component = (props) => (
			<div>{props.children}</div>
		);
		const Wrapped = Uppercase(Component);
		const subject = mount(
			<Wrapped preserveCase>uppercase</Wrapped>
		);

		const expected = 'uppercase';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

	it('should not uppercase content when it contains multiple children', function () {
		const Component = (props) => (
			<div>{props.children}</div>
		);
		const Wrapped = Uppercase(Component);
		const subject = mount(
			<Wrapped>
				{[
					'uppercase',
					'uppercase'
				]}
			</Wrapped>
		);

		const expected = 'uppercaseuppercase';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

	it('should not uppercase content when it contains a single non-string child', function () {
		const Component = (props) => (
			<div>{props.children}</div>
		);
		const Wrapped = Uppercase(Component);
		const subject = mount(
			<Wrapped>
				<span>uppercase</span>
			</Wrapped>
		);

		const expected = 'uppercase';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

});
