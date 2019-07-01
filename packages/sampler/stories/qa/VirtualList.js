import Item from '@enact/moonstone/Item';
import SwitchItem from '@enact/moonstone/SwitchItem';
import {ActivityPanels, Panel} from '@enact/moonstone/Panels';
import VirtualList, {VirtualListBase} from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import {VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, number} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualList', VirtualList, VirtualListBase, UiVirtualListBase);

const
	itemStyle = {
		borderBottom: ri.unit(3, 'rem') + ' solid #202328',
		boxSizing: 'border-box'
	},
	items = [],
	defaultDataSize = 1000,
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (ItemComponent, size, onClick) => ({index, ...rest}) => {
		const style = {height: size + 'px', ...itemStyle};
		return (
			<ItemComponent index={index} style={style} onClick={onClick} {...rest}>
				{items[index].item}
			</ItemComponent>
		);
	};

const updateDataSize = (dataSize) => {
	const
		itemNumberDigits = dataSize > 0 ? ((dataSize - 1) + '').length : 0,
		headingZeros = Array(itemNumberDigits).join('0');

	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		items.push({item :'Item ' + (headingZeros + i).slice(-itemNumberDigits), selected: false});
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

class StatefulSwitchItem extends React.Component {
	static propTypes = {
		index: PropTypes.number
	}

	constructor (props) {
		super(props);
		this.state = {
			prevIndex: props.index,
			selected: items[props.index].selected
		};
	}

	static getDerivedStateFromProps (props, state) {
		if (state.prevIndex !== props.index) {
			return {
				prevIndex: props.index,
				selected: items[props.index].selected
			};
		}

		return null;
	}

	onToggle = () => {
		items[this.props.index].selected = !items[this.props.index].selected;
		this.setState(({selected}) => ({
			selected: !selected
		}));
	}

	render () {
		const props = Object.assign({}, this.props);
		delete props.index;

		return (
			<SwitchItem {...props} onToggle={this.onToggle} selected={this.state.selected}>
				{this.props.children}
			</SwitchItem>
		);
	}
}

const InPanels = (props) => {
	const [index, setIndex] = useState(0);
	function handleSelectBreadcrumb (ev) {
		setIndex(ev.index);
	}

	function handleSelectItem () {
		setIndex(index === 0 ? 1 : 0);
	}

	return (
		<ActivityPanels index={index} onSelectBreadcrumb={handleSelectBreadcrumb} noCloseButton>
			<Panel>
				<VirtualList
					id="spotlight-list"
					// eslint-disable-next-line enact/prop-types
					itemRenderer={renderItem(Item, props.itemSize, handleSelectItem)}
					spotlightId="virtual-list"
					{...props}
				/>
			</Panel>
			<Panel>
				<Item onClick={handleSelectItem}>Go Back</Item>
			</Panel>
		</ActivityPanels>
	);
};

storiesOf('VirtualList', module)
	.add(
		'with more items',
		() => {
			const itemSize = ri.scale(number('itemSize', Config, 72));
			return (
				<VirtualList
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					focusableScrollbar={boolean('focusableScrollbar', Config, false)}
					itemRenderer={renderItem(StatefulSwitchItem, itemSize)}
					itemSize={itemSize}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', Config, 0))}
				/>
			);
		},
		{propTables: [Config]}
	)
	.add(
		'in Panels',
		() => (
			<InPanels
				dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
				focusableScrollbar={boolean('focusableScrollbar', Config, false)}
				itemSize={ri.scale(number('itemSize', Config, 72))}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', Config, 0))}
			/>
		)
	);
