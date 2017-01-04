
import React from 'react';
import {mount} from 'enzyme';
import ExpandablePicker from '../ExpandablePicker';

describe('ExpandablePicker Specs', () => {

	it('should close onChange', function () {

		const expandablePicker = mount(
			<ExpandablePicker title='Options'>
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		const expandable = expandablePicker.find('MarqueeText').first();
		const checkButton = expandablePicker.find('Icon').last();

		expandable.simulate('click');
		checkButton.simulate('click');

		const expected = false;
		const actual = expandablePicker.find('ExpandableContainer').props().open;

		expect(actual).to.equal(expected);
	});

	it('should include value in onChange', function () {

		const expandablePicker = mount(
			<ExpandablePicker title='Options' onChange={onChange}>
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		function onChange (e) {
			expandablePicker.setState({value: e.value});
		}

		const expandable = expandablePicker.find('MarqueeText').first();
		const nextButton = expandablePicker.find('PickerButton').first();
		const checkButton = expandablePicker.find('Icon').last();

		expandable.simulate('click');
		nextButton.simulate('click');
		checkButton.simulate('click');

		const expected = 1;
		const actual = expandablePicker.state('value');

		expect(actual).to.equal(expected);
	});

	it('should pass 0 to onChange as default', function () {

		const expandablePicker = mount(
			<ExpandablePicker title='Options' onChange={onChange}>
				{['Option one', 'Option two', 'Option three']}
			</ExpandablePicker>
		);

		function onChange (e) {
			expandablePicker.setState({value: e.value});
		}

		const expandable = expandablePicker.find('MarqueeText').first();
		const checkButton = expandablePicker.find('Icon').last();

		expandable.simulate('click');
		checkButton.simulate('click');

		const expected = 0;
		const actual = expandablePicker.state('value');

		expect(actual).to.equal(expected);
	});
});
