import {mount} from 'enzyme';
import React, {PropTypes} from 'react';

import Item from '../../Item';
import {VirtualGridList} from '../VirtualList';

describe('VirtualGridList Specs', () => {
	const
		dataSize = 10,
		items = [],
		renderItem = ({data, index, key}) => {
			return (
				<Item key={key}>
					<div>{data[index].text}</div>
				</Item>
			);
		};

	renderItem.propTypes = {
		data: PropTypes.any,
		index: PropTypes.number,
		key: PropTypes.any
	};

	for (let i = 0; i < dataSize; i++) {
		items.push({text: 'Account ' + i});
	}

	const subject = mount(
		<VirtualGridList
			component={renderItem}
			data={items}
			dataSize={dataSize}
			itemSize={{minWidth: 30, minHeight: 40}}
		/>
	);

	it('should apply item size', function () {
		const expectedMinHeight = 40;
		const expectedMinWidth = 30;
		const actualMinHeight = subject.find('VirtualListCore').prop('itemSize').minHeight;
		const actualMinWidth = subject.find('VirtualListCore').prop('itemSize').minWidth;

		expect(actualMinHeight).to.equal(expectedMinHeight);
		expect(actualMinWidth).to.equal(expectedMinWidth);
	});
});
