import React from 'react';
import {mount, shallow} from 'enzyme';

import LabeledItem from '../LabeledItem';
import css from '../LabeledItem.less';

describe('LabeledItem Specs', () => {

	const labelClass = 'div.' + css.label;

	test('should render a label (<div>) by default', () => {
		const item = mount(
			<LabeledItem label="The Label">I am a labeledItem</LabeledItem>
		);

		const divTag = item.find(labelClass);
		const expected = 1;
		const actual = divTag.length;

		expect(actual).toBe(expected);
	});

	test('should not render a label if there is no \'label\' prop', () => {
		const item = mount(
			<LabeledItem>I am a labeledItem</LabeledItem>
		);

		const divTag = item.find(labelClass);
		const expected = 0;
		const actual = divTag.length;

		expect(actual).toBe(expected);
	});

	test('should create a LabeledItem that is enabled by default', () => {
		const item = mount(
			<LabeledItem>I am a labeledItem</LabeledItem>
		);

		const expected = 0;
		const actual = item.find({disabled: true}).length;

		expect(actual).toBe(expected);
	});

	test(
		'should have \'disabled\' HTML attribute when \'disabled=true\'',
		() => {
			const item = shallow(
				<LabeledItem disabled>I am a disabled labeledItem</LabeledItem>
			);

			const expected = 1;
			const actual = item.find({disabled: true}).length;

			expect(actual).toBe(expected);
		}
	);
});
