import React from 'react';
import {mount} from 'enzyme';
import {FloatLayerBase} from '../FloatLayer';

describe('FloatLayer Specs', () => {
	beforeEach(() => {
		const div = document.createElement('div');
		div.setAttribute('id', 'floatLayer');
		document.body.appendChild(div);
	});

	afterEach(() => {
		const div = document.getElementById('floatLayer');
		document.body.removeChild(div);
	});

	it('should not render if FloatLayer is not open', () => {
		const wrapper = mount(<FloatLayerBase><p>Hi</p></FloatLayerBase>);

		const expected = null;
		const actual = wrapper.instance().node;
		expect(actual).to.equal(expected);
	});

	it('should render if FloatLayer is open', () => {
		const wrapper = mount(<FloatLayerBase open><p>Hi</p></FloatLayerBase>);

		const expected = 'P';
		const actual = wrapper.instance().node.firstElementChild.firstElementChild.tagName;
		expect(actual).to.equal(expected);
	});
});
