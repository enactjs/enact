import React from 'react';
import {mount} from 'enzyme';
import SpottablePicker from '../SpottablePicker';

describe('SpottablePicker Specs', () => {
	const Component = SpottablePicker(() => <div />);

	// Using Pressable instead of Spottable because Spottable is currently missing a displayName

	it('should wrap component with Pressable HoC when joined', function () {
		const comp = mount(
			<Component joined />
		);

		const expected = 1;
		const actual = comp.find('Pressable').length;

		expect(actual).to.equal(expected);
	});

	it('should not wrap component with Pressable HoC when not joined', function () {
		const comp = mount(
			<Component />
		);

		const expected = 0;
		const actual = comp.find('Pressable').length;

		expect(actual).to.equal(expected);
	});
});

