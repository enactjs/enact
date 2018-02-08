import React from 'react';
import {mount, shallow} from 'enzyme';

import LabeledItem from '../LabeledItem';
import css from '../LabeledItem.less';

describe('LabeledItem Specs', () => {

	const labelClass = 'div.' + css.label;

	it('should render a label (<div>) by default', function () {
		const item = mount(
			<LabeledItem label="The Label">I am a labeledItem</LabeledItem>
		);

		const divTag = item.find(labelClass);
		const expected = 1;
		const actual = divTag.length;

		expect(actual).to.equal(expected);
	});

	it('should not render a label if there is no \'label\' prop', function () {
		const item = mount(
			<LabeledItem>I am a labeledItem</LabeledItem>
		);

		const divTag = item.find(labelClass);
		const expected = 0;
		const actual = divTag.length;

		expect(actual).to.equal(expected);
	});

	it('should create a LabeledItem that is enabled by default', function () {
		const item = mount(
			<LabeledItem>I am a labeledItem</LabeledItem>
		);

		const expected = 0;
		const actual = item.find({disabled: true}).length;

		expect(actual).to.equal(expected);
	});

	it('should have \'disabled\' HTML attribute when \'disabled=true\'', function () {
		const item = shallow(
			<LabeledItem disabled>I am a disabled labeledItem</LabeledItem>
		);

		const expected = 1;
		const actual = item.find({disabled: true}).length;

		expect(actual).to.equal(expected);
	});
});
