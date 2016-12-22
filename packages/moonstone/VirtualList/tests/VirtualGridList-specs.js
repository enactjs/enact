import {mount} from 'enzyme';
import React from 'react';

import Item from '../../Item';

import {VirtualGridList} from '../VirtualList';

describe('VirtualGridList Specs', () => {
	const
		data = [],
		dataSize = 10;

	for (let i = 0; i < dataSize; i++) {
		data.push({text: 'Account ' + i});
	}

	const subject = mount(
		<VirtualGridList
			data={data}
			dataSize={dataSize}
			itemSize={{minWidth: 30, minHeight: 40}}
			// eslint-disable-next-line react/jsx-no-bind
			component={({index}) => (<Item><div>{data[index].text}</div></Item>)}
		/>
	);

	it('Should apply item size', function () {
		const expectedMinWidth = 30;
		const expectedMinHeight = 40;
		const actualMinWidth = subject.find('VirtualListCore').prop('itemSize').minWidth;
		const actualMinHeight = subject.find('VirtualListCore').prop('itemSize').minHeight;

		expect(actualMinWidth).to.equal(expectedMinWidth);
		expect(actualMinHeight).to.equal(expectedMinHeight);
	});
});
