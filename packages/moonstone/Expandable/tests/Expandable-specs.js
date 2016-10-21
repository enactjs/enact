import React from 'react';
import {mount} from 'enzyme';
import Expandable from '../Expandable';

describe('Expandable', () => {
	it('should close when disabled', function () {
		const DivComponent = () => <div>Expand</div>;

		const ExpandableDiv = Expandable(DivComponent);
		const wrapped = mount(
			<ExpandableDiv title="foo" open />
		);

		wrapped.setProps({disabled: true});

		const expected = false;
		const actual = wrapped.find('ExpandableContainer').prop('open');

		expect(actual).to.equal(expected);
	});
});
