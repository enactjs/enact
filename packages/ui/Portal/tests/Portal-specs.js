import React from 'react';
import {mount} from 'enzyme';
import Portal from '../Portal';

describe('Portal Specs', () => {
	beforeEach(() => {
		const div = document.createElement('div');
		div.setAttribute('id', 'portal');
		document.body.appendChild(div);
	});

	it('should not render if portal is not open', () => {
		const wrapper = mount(<Portal><p>Hi</p></Portal>);

		const expected = null;
		const actual = wrapper.instance().node;
		expect(actual).to.equal(expected);
	});

	it('should render if portal is open', () => {
		const wrapper = mount(<Portal open><p>Hi</p></Portal>);

		const expected = 'P';
		const actual = wrapper.instance().node.firstElementChild.tagName;
		expect(actual).to.equal(expected);
	});
});
