
import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';

import {ToggleIconBase} from '../ToggleIcon';

const tap = (node) => {
	node.simulate('mousedown');
	node.simulate('mouseup');
};

describe('ToggleIcon Specs', () => {

	it('should call onToggle, onClick, or both when clicked', function () {
		const handleToggle = sinon.spy();
		const subject = mount(
			<ToggleIconBase onToggle={handleToggle}>
				star
			</ToggleIconBase>
		);

		tap(subject);

		const expected = true;
		const actual = handleToggle.calledOnce;

		expect(expected).to.equal(actual);
	});

	it('should call onClick when clicked', function () {
		const handleClick = sinon.spy();
		const subject = mount(
			<ToggleIconBase onClick={handleClick}>
				star
			</ToggleIconBase>
		);

		subject.simulate('click');

		const expected = true;
		const actual = handleClick.calledOnce;

		expect(expected).to.equal(actual);
	});

	it('should call onTap when tapped', function () {
		const handleTap = sinon.spy();
		const subject = mount(
			<ToggleIconBase onTap={handleTap}>
				star
			</ToggleIconBase>
		);

		tap(subject);

		const expected = true;
		const actual = handleTap.calledOnce;

		expect(expected).to.equal(actual);
	});

	it('should call both onToggle and onTap when tapped', function () {
		const handleBoth = sinon.spy();
		const subject = mount(
			<ToggleIconBase onTap={handleBoth} onToggle={handleBoth}>
				star
			</ToggleIconBase>
		);

		tap(subject);

		const expected = true;
		const actual = handleBoth.calledTwice;

		expect(expected).to.equal(actual);
	});

});
