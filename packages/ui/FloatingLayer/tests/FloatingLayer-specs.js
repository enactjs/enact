import React from 'react';
import {mount} from 'enzyme';
import {FloatingLayerBase} from '../FloatingLayer';
import FloatingLayerDecorator from '../FloatingLayerDecorator';

describe('FloatingLayer Specs', () => {
	const Root = FloatingLayerDecorator('div');

	test('should not render if FloatingLayer is not open', () => {
		const subject = mount(
			<Root>
				<FloatingLayerBase><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		const expected = null;
		const actual = subject.find('FloatingLayer').instance().node;
		expect(actual).toBe(expected);
	});

	test.only('should render if FloatingLayer is open', () => {
		const subject = mount(
			<Root>
				<FloatingLayerBase open><p>Hi</p></FloatingLayerBase>
			</Root>
		);

		console.log(subject.debug())

		const expected = 1;
		const actual = subject.find('FloatingLayer').instance().node.querySelectorAll('p').length;
		expect(actual).toBe(expected);
	});
});
