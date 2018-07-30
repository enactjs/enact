import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';

import DaySelector from '../DaySelector';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

describe('DaySelector', () => {

	it('should set selected prop to true for the item that is selected by default', function () {
		const subject = mount(
			<DaySelector defaultSelected={0} />
		);

		const item = subject.find('DaySelectorItem').first();

		const expected = true;
		const actual = item.prop('selected');

		expect(actual).to.equal(expected);
	});

	it('should fire onSelect when a day is selected', function () {
		const handleSelect = sinon.spy();
		const subject = mount(
			<DaySelector onSelect={handleSelect} />
		);

		const item = subject.find('DaySelectorItem').first();
		tap(item);

		const expected = true;
		const actual = handleSelect.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should fire onSelect with the correct content when a day is selected', function () {
		const handleSelect = sinon.spy();
		const content = 'Sat';
		const subject = mount(
			<DaySelector onSelect={handleSelect} />
		);

		const item = subject.find('DaySelectorItem').last();
		tap(item);

		const expected = content;
		const actual = handleSelect.firstCall.args[0].content;

		expect(actual).to.equal(expected);
	});

	it('should use the full string format when dayNameLength is `full`', function () {
		const handleSelect = sinon.spy();
		const content = 'Saturday';
		const subject = mount(
			<DaySelector dayNameLength="full" onSelect={handleSelect} />
		);

		const item = subject.find('DaySelectorItem').last();
		tap(item);

		const expected = content;
		const actual = handleSelect.firstCall.args[0].content;

		expect(actual).to.equal(expected);
	});

	it('should set selected content as Every day when every day is selected', function () {
		const handleSelect = sinon.spy();
		const content = 'Every Day';
		const subject = mount(
			<DaySelector defaultSelected={[0, 1, 2, 3, 4, 5]} onSelect={handleSelect} />
		);

		const item = subject.find('DaySelectorItem').last();
		tap(item);

		const expected = content;
		const actual = handleSelect.firstCall.args[0].content;

		expect(actual).to.equal(expected);
	});

	it('should set selected content as Every weekday when every weekday is selected', function () {
		const handleSelect = sinon.spy();
		const content = 'Every Weekday';
		const subject = mount(
			<DaySelector defaultSelected={[0, 1, 2, 3, 4, 5]} onSelect={handleSelect} />
		);

		const item = subject.find('DaySelectorItem').first();
		tap(item);

		const expected = content;
		const actual = handleSelect.firstCall.args[0].content;

		expect(actual).to.equal(expected);
	});

	it('should set selected content as Every weekend when every weekend is selected', function () {
		const handleSelect = sinon.spy();
		const content = 'Every Weekend';
		const subject = mount(
			<DaySelector defaultSelected={[0]} onSelect={handleSelect} />
		);

		const item = subject.find('DaySelectorItem').last();
		tap(item);

		const expected = content;
		const actual = handleSelect.firstCall.args[0].content;

		expect(actual).to.equal(expected);
	});
});
