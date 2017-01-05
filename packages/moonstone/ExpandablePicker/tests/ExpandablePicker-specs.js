import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import ExpandablePicker from '../ExpandablePicker';

describe('ExpandablePicker Specs', () => {

	it('should close onChange', function () {

		const expandablePicker = mount(
			<ExpandablePicker title='Options' open>
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const checkButton = expandablePicker.find('Icon').last();
		checkButton.simulate('click');

		const expected = false;
		const actual = expandablePicker.find('ExpandableContainer').props().open;

		expect(actual).to.equal(expected);
	});

	it('should include value in onChange', function () {
		const value = 2;
		const handleChange = sinon.spy();
		const expandablePicker = mount(
			<ExpandablePicker title='Options' onChange={handleChange} open value={value}>
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const checkButton = expandablePicker.find('IconButton').last();
		checkButton.simulate('click');

		const expected = value;
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);
	});

	it('should include value in onChange', function () {
		const handleChange = sinon.spy();
		const expandablePicker = mount(
			<ExpandablePicker title='Options' onChange={handleChange} open>
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const checkButton = expandablePicker.find('IconButton').last();
		checkButton.simulate('click');

		const expected = 0;
		const actual = handleChange.firstCall.args[0].value;

		expect(actual).to.equal(expected);
	});
});
