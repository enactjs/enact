
import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';

import ToggleItem, {ToggleItemBase} from '../ToggleItem';
import Icon from '../../Icon';
import SlotItem from '../../SlotItem';
import Item from '../../Item';

const SlottedItem = (props) => <SlotItem {...props} component={Item} />;

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

const CustomIcon = (props) => <Icon {...props}>star</Icon>;

describe('ToggleItem Specs', () => {

	it('should call onToggle, onClick, or both when clicked', function () {
		const handleToggle = sinon.spy();
		const subject = mount(
			<ToggleItem component={SlottedItem} onToggle={handleToggle} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);

		tap(subject);

		const expected = 1;
		const actual = handleToggle.callCount;

		expect(expected).to.equal(actual);
	});

	it('should call onClick when clicked', function () {
		const handleClick = sinon.spy();
		const subject = mount(
			<ToggleItemBase component={SlottedItem} onClick={handleClick} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItemBase>
		);

		subject.simulate('click');

		const expected = 1;
		const actual = handleClick.callCount;

		expect(expected).to.equal(actual);
	});

	it('should call onTap when tapped', function () {
		const handleTap = sinon.spy();
		const subject = mount(
			<ToggleItem component={SlottedItem} onTap={handleTap} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);

		tap(subject);
		const expected = 1;
		const actual = handleTap.callCount;

		expect(expected).to.equal(actual);
	});

	it('should call both onToggle and onTap when tapped', function () {
		const handleBoth = sinon.spy();
		const subject = mount(
			<ToggleItem component={SlottedItem} onTap={handleBoth} onToggle={handleBoth} iconComponent={CustomIcon}>
				Toggle Item
			</ToggleItem>
		);

		tap(subject);

		const expected = 2;
		const actual = handleBoth.callCount;

		expect(expected).to.equal(actual);
	});
});
