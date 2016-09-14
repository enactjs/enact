/* globals describe, it, expect */

import React from 'react';
import sinon from 'sinon';
import {mount} from 'enzyme';
import Slottable from '../Slottable';

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
				<div slot='a'>A</div>
				<div slot='b'>B</div>
				<div slot='c'>C</div>
			</Component>
		);
		console.log("SLOTTABLE", subject.debug());
		console.log("CHILDREN:", subject.prop('children').length);

		const expected = 'CBA';
		const actual = subject.text();

		expect(actual).to.equal(expected);
	});

});

