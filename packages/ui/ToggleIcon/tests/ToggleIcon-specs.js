import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';

import ToggleIcon from '../ToggleIcon';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

describe('ToggleIcon Specs', () => {

	it('should call onToggle when tapped', function () {
		const handleToggle = sinon.spy();
		const subject = mount(
			<ToggleIcon onToggle={handleToggle}>
				star
			</ToggleIcon>
		);

		tap(subject);

		const expected = true;
		const actual = handleToggle.calledOnce;

		expect(expected).to.equal(actual);
	});

	it('should call onClick when clicked', function () {
		const handleClick = sinon.spy();
		const subject = mount(
			<ToggleIcon onClick={handleClick}>
				star
			</ToggleIcon>
		);

		subject.simulate('click');

		const expected = true;
		const actual = handleClick.calledOnce;

		expect(expected).to.equal(actual);
	});

	it('should call onTap when tapped', function () {
		const handleTap = sinon.spy();
		const subject = mount(
			<ToggleIcon onTap={handleTap}>
				star
			</ToggleIcon>
		);

		tap(subject);

		const expected = true;
		const actual = handleTap.calledOnce;

		expect(expected).to.equal(actual);
	});

	it('should call both onToggle and onTap when tapped', function () {
		const handleBoth = sinon.spy();
		const subject = mount(
			<ToggleIcon onTap={handleBoth} onToggle={handleBoth}>
				star
			</ToggleIcon>
		);

		tap(subject);

		const expected = true;
		const actual = handleBoth.calledTwice;

		expect(expected).to.equal(actual);
	});

});
