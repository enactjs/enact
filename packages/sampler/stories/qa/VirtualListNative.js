import React from 'react';
import {VirtualListNative} from '@enact/moonstone/VirtualList';
import Item from '@enact/moonstone/Item';
import {Panel} from '@enact/moonstone/Panels';

import {storiesOf} from '@storybook/react';

let items = [];
for (let i = 0; i < 10; i++) {
	const
		count = ('00' + i).slice(-3),
		text = `Item ${count}`;

	items.push({text});
}

class VirtualListWithExtraItems extends React.PureComponent {
	constructor (props) {
		super(props);
	}

	renderItem = ({index, ...rest}) => {
		const text = `Item ${('00' + index).slice(-3)}`;
		return (<Item {...rest}>{text}</Item>);
	};

	render () {
		return (
			<Panel>
				<VirtualListNative
					focusableScrollbar
					itemRenderer={this.renderItem}
					dataSize={10}
					direction="vertical"
					horizontalScrollbar="hidden"
					verticalScrollbar="visible"
					itemSize={60}
					spacing={20}
					style={{height: 400}}
				/>
				<Item>extra item1</Item>
				<Item>extra item2</Item>
				<Item>extra item3</Item>
			</Panel>
		);
	}
}

storiesOf('VirtualListNative', module)
	.add(
		'with extra items',
		() => (
			<VirtualListWithExtraItems />
		)
	);
