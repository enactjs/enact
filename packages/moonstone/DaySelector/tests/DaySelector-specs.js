import React from 'react';
import {mount} from 'enzyme';

import DaySelector from '../DaySelector';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

describe('DaySelector', () => {

	test(
		'should set selected prop to true for the item that is selected by default',
		() => {
			const subject = mount(
				<DaySelector defaultSelected={0} />
			);

			const item = subject.find('DaySelectorItem').first();

			const expected = true;
			const actual = item.prop('selected');

			expect(actual).toBe(expected);
		}
	);

	test('should fire onSelect when a day is selected', () => {
		const handleSelect = jest.fn();
		const subject = mount(
			<DaySelector onSelect={handleSelect} />
		);

		const item = subject.find('DaySelectorItem').first();
		tap(item);

		const expected = 1;
		const actual = handleSelect.mock.calls.length;

		expect(actual).toBe(expected);
	});

	test(
		'should fire onSelect with the correct content when a day is selected',
		() => {
			const handleSelect = jest.fn();
			const content = 'Sat';
			const subject = mount(
				<DaySelector onSelect={handleSelect} />
			);

			const item = subject.find('DaySelectorItem').last();
			tap(item);

			const expected = content;
			const actual = handleSelect.mock.calls[0][0].content;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should use the full string format when dayNameLength is `full`',
		() => {
			const handleSelect = jest.fn();
			const content = 'Saturday';
			const subject = mount(
				<DaySelector dayNameLength="full" onSelect={handleSelect} />
			);

			const item = subject.find('DaySelectorItem').last();
			tap(item);

			const expected = content;
			const actual = handleSelect.mock.calls[0][0].content;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should set selected content as Every day when every day is selected',
		() => {
			const handleSelect = jest.fn();
			const content = 'Every Day';
			const subject = mount(
				<DaySelector defaultSelected={[0, 1, 2, 3, 4, 5]} onSelect={handleSelect} />
			);

			const item = subject.find('DaySelectorItem').last();
			tap(item);

			const expected = content;
			const actual = handleSelect.mock.calls[0][0].content;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should set selected content as Every weekday when every weekday is selected',
		() => {
			const handleSelect = jest.fn();
			const content = 'Every Weekday';
			const subject = mount(
				<DaySelector defaultSelected={[0, 1, 2, 3, 4, 5]} onSelect={handleSelect} />
			);

			const item = subject.find('DaySelectorItem').first();
			tap(item);

			const expected = content;
			const actual = handleSelect.mock.calls[0][0].content;

			expect(actual).toBe(expected);
		}
	);

	test(
		'should set selected content as Every weekend when every weekend is selected',
		() => {
			const handleSelect = jest.fn();
			const content = 'Every Weekend';
			const subject = mount(
				<DaySelector defaultSelected={[0]} onSelect={handleSelect} />
			);

			const item = subject.find('DaySelectorItem').last();
			tap(item);

			const expected = content;
			const actual = handleSelect.mock.calls[0][0].content;

			expect(actual).toBe(expected);
		}
	);
});
