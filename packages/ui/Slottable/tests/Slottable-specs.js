/* globals console */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React from 'react';
import {mount} from 'enzyme';
import kind from '@enact/core/kind';
import Slottable from '../Slottable';
import sinon from 'sinon';

describe('Slottable Specs', () => {

	test('should distribute children with a \'slot\' property', () => {
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

		expect(actual).toBe(expected);
	});

	test(
		'should distribute children with a \'type\' that matches a slot',
		() => {
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

			expect(actual).toBe(expected);
		}
	);

	test(
		'should distribute children whose \'type\' has a \'defaultSlot\' property that matches a slot',
		() => {
			const Custom = kind({
				name: 'Custom',
				render: ({children}) => {
					return <div>{children}</div>;
				}
			});
			Custom.defaultSlot = 'c';

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
					<Custom>C</Custom>
				</Component>
			);

			const expected = 'CBA';
			const actual = subject.text();

			expect(actual).toBe(expected);
		}
	);

	test(
		'should distribute children with no \'slot\' property to Slottable\'s \'children\'',
		() => {
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

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not distribute children with an invalid \'slot\' property',
		() => {
			// Remove Global Spy and replace with a stub instead
			console.error.mockRestore();
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

			expect(actual).toBe(expected);

			// Check to make sure that we only get the one expected error
			const actualErrorsLength = console.error.args.length;
			const expectedErrorLength = 1;

			expect(actualErrorsLength).toBe(expectedErrorLength);

			const actualError = console.error.args[0][0];
			const expectedError = 'Warning: The slot "c" specified on div does not exist';

			expect(actualError).toBe(expectedError);
		}
	);

	test(
		'should distribute children with props other than simply \'children\', in entirety, to the matching destination slot',
		() => {
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

			expect(actual).toBe(expected);

			const expectedTitle = 'Div A';
			const actualTitle = subject.find('.root-div').childAt(2).prop('title');
			expect(actualTitle).toBe(expectedTitle);
		}
	);
});
