/* globals console */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React from 'react';
import {mount} from 'enzyme';
import kind from '@enact/core/kind';
import Slottable from '../Slottable';
import sinon from 'sinon';

describe('Slottable Specs', () => {

	it('should distribute children with a \'slot\' property', function () {
		const Component = Slottable({slots: ['a', 'b', 'c']}, ({a, b, c}) => (
			<div>
				{c}
				{b}
				{a}
			</div>
		));
		const subject = mount(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'CBA';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

	it('should distribute children with a \'type\' that matches a slot', function () {
		const Component = Slottable({slots: ['a', 'b', 'c', 'custom']}, ({a, b, c, custom}) => (
			<div>
				{c}
				{b}
				{a}
				{custom}
			</div>
		));
		const subject = mount(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<custom>D</custom>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'CBAD';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

	it('should distribute children whose \'type\' has a \'defaultSlot\' property that matches a slot', function () {
		const Custom = kind({
			name: 'Custom',
			render: (props) => {
				return <div>{props.children}</div>;
			}
		});
		Custom.defaultSlot = 'a';

		const Component = Slottable({slots: ['a', 'b', 'c']}, ({a, b, c}) => (
			<div>
				{c}
				{b}
				{a}
			</div>
		));
		const subject = mount(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<Custom>D</Custom>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'CBAD';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

	it('should distribute children with no \'slot\' property to Slottable\'s \'children\'', function () {
		const Component = Slottable({slots: ['a', 'b']}, ({a, b, children}) => (
			<div>
				{children}
				{b}
				{a}
			</div>
		));
		const subject = mount(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<div>C</div>
			</Component>
		);

		const expected = 'CBA';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

	it('should not distribute children with an invalid \'slot\' property', function () {
		// Remove Global Spy and replace with a stub instead
		console.error.restore();
		sinon.stub(console, 'error');

		const Component = Slottable({slots: ['a', 'b']}, ({a, b, c}) => (
			<div>
				{c}
				{b}
				{a}
			</div>
		));

		const subject = mount(
			<Component>
				<div slot="a">A</div>
				<div slot="b">B</div>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'BA';
		const actual = subject.text();

		expect(actual).to.equal(expected);

		// Check to make sure that we only get the one expected error
		const actualErrorsLength = console.error.args.length;
		const expectedErrorLength = 1;

		expect(actualErrorsLength).to.equal(expectedErrorLength);

		const actualError = console.error.args[0][0];
		const expectedError = 'Warning: The slot "c" specified on div does not exist';

		expect(actualError).to.equal(expectedError);
	});

	it('should distribute children with props other than simply \'children\', in entirety, to the matching destination slot', function () {
		const Component = Slottable({slots: ['a', 'b', 'c', 'custom']}, ({a, b, c, custom}) => (
			<div className="root-div">
				{c}
				{b}
				{a}
				{custom}
			</div>
		));
		const subject = mount(
			<Component>
				<div slot="a" title="Div A" />
				<div slot="b">B</div>
				<custom>D</custom>
				<div slot="c">C</div>
			</Component>
		);

		const expected = 'CBD';
		const actual = subject.text();

		expect(actual).to.equal(expected);

		const expectedTitle = 'Div A';
		const actualTitle = subject.find('.root-div').childAt(2).prop('title');
		expect(actualTitle).to.equal(expectedTitle);
	});
});
