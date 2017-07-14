
import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';

import {ToggleItemBase} from '../ToggleItem';

describe('ToggleItem Specs', () => {

	it('should call onToggle, onClick, or both when clicked', function () {
		const handleToggle = sinon.spy();
		const subject = mount(
			<ToggleItemBase onToggle={handleToggle} icon="star">
				Toggle Item
			</ToggleItemBase>
		);

		subject.simulate('click');

		const expected = true;
		const actual = handleToggle.calledOnce;

		expect(expected).to.equal(actual);
	});

	it('should call onClick when clicked', function () {
		const handleClick = sinon.spy();
		const subject = mount(
			<ToggleItemBase onClick={handleClick} icon="star">
				Toggle Item
			</ToggleItemBase>
		);

		subject.simulate('click');

		const expected = true;
		const actual = handleClick.calledOnce;

		expect(expected).to.equal(actual);
	});

	it('should call both onToggle and onClick when clicked', function () {
		const handleBoth = sinon.spy();
		const subject = mount(
			<ToggleItemBase onClick={handleBoth} onToggle={handleBoth} icon="star">
				Toggle Item
			</ToggleItemBase>
		);

		subject.simulate('click');

		const expected = true;
		const actual = handleBoth.calledTwice;

		expect(expected).to.equal(actual);
	});

	it('should create an <Icon> when a non-element is passed to \'icon\'', function () {
		const toggleItem = mount(
			<ToggleItemBase icon="star">
				Toggle Item
			</ToggleItemBase>
		);

		const expected = 1;
		const actual = toggleItem.find('ToggleIcon').length;

		expect(actual).to.equal(expected);
	});

	it('should not create an <Icon> when an element is passed to \'icon\'', function () {
		const icon = <span>*</span>;
		const toggleItem = mount(
			<ToggleItemBase icon={icon}>
				Toggle Item
			</ToggleItemBase>
		);
		const expected = 0;
		const actual = toggleItem.find('Icon').length;

		expect(actual).to.equal(expected);
	});

});
