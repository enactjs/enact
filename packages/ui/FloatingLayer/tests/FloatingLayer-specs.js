import React from 'react';
import {mount} from 'enzyme';
import {FloatingLayerBase} from '../FloatingLayer';

describe('FloatingLayer Specs', () => {
	const context = {
		getFloatingLayer: () => document.getElementById('floatLayer')
	};

	beforeEach(() => {
		const div = document.createElement('div');
		div.setAttribute('id', 'floatLayer');
		document.body.appendChild(div);
	});

	afterEach(() => {
		const div = document.getElementById('floatLayer');
		document.body.removeChild(div);
	});

	test('should not render if FloatingLayer is not open', () => {
		const wrapper = mount(
			<FloatingLayerBase><p>Hi</p></FloatingLayerBase>,
			{context}
		);

		const expected = null;
		const actual = wrapper.instance().node;
		expect(actual).toBe(expected);
	});

	test('should render if FloatingLayer is open', () => {
		const wrapper = mount(
			<FloatingLayerBase open><p>Hi</p></FloatingLayerBase>,
			{context}
		);

		const expected = 1;
		const actual = wrapper.instance().node.querySelectorAll('p').length;
		expect(actual).toBe(expected);
	});
});
