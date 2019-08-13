import Item from '@enact/moonstone/Item';
import {ActivityPanels, Panel, Header} from '@enact/moonstone/Panels';
import Scroller from '@enact/moonstone/Scroller';
import SwitchItem from '@enact/moonstone/SwitchItem';
import VirtualList, {VirtualListBase} from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import {ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import {VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, number, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualList', UiVirtualListBase, UiScrollableBase, VirtualListBase);

const
	itemStyle = {
		boxSizing: 'border-box',
		display: 'flex'
	},
	listStyle = {
		height: '200px'
	},
	borderStyle = ri.unit(3, 'rem') + ' solid #202328',
	items = [],
	defaultDataSize = 1000,
	prop = {
		scrollbarOption: ['auto', 'hidden', 'visible']
	},
	wrapOption = {
		false: false,
		true: true,
		'&quot;noAnimation&quot;': 'noAnimation'
	},
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (ItemComponent, size, vertical, onClick) => ({index, ...rest}) => {
		const style = {
			...(
				vertical ?
					{borderBottom: borderStyle, height: size + 'px'} :
					{borderRight: borderStyle, height: '100%', width: size + 'px', writingMode: 'vertical-lr'}
			),
			...itemStyle
		};
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

// eslint-disable-next-line enact/prop-types
const InPanels = ({className, title, ...rest}) => {
	const [index, setIndex] = useState(0);
	function handleSelectBreadcrumb (ev) {
		setIndex(ev.index);
	}

	function handleSelectItem () {
		setIndex(index === 0 ? 1 : 0);
	}

	return (
		<ActivityPanels className={className} index={index} onSelectBreadcrumb={handleSelectBreadcrumb} noCloseButton>
			<Panel>
				<Header type="compact" title={`${title} Panel 0`} key="header" />
				<VirtualList
					id="spotlight-list"
					// eslint-disable-next-line enact/prop-types
					itemRenderer={renderItem(Item, rest.itemSize, true, handleSelectItem)}
					spotlightId="virtual-list"
					{...rest}
				/>
			</Panel>
			<Panel title={`${title} Panel 1`}>
				<Header type="compact" title={`${title} Panel 1`} key="header" />
				<Item onClick={handleSelectItem}>Go Back</Item>
			</Panel>
		</ActivityPanels>
	);
};

storiesOf('VirtualList', module)
	.add(
		'horizontal scroll in Scroller',
		() => {
			const listProps = {
				dataSize: updateDataSize(number('dataSize', Config, defaultDataSize)),
				direction: 'horizontal',
				focusableScrollbar: boolean('focusableScrollbar', Config),
				horizontalScrollbar: select('horizontalScrollbar', prop.scrollbarOption, Config),
				itemRenderer: renderItem(Item, ri.scale(number('itemSize', Config, 72)), false),
				itemSize: ri.scale(number('itemSize', Config, 72)),
				noScrollByWheel: boolean('noScrollByWheel', Config),
				onKeyDown: action('onKeyDown'),
				onScrollStart: action('onScrollStart'),
				onScrollStop: action('onScrollStop'),
				spacing: ri.scale(number('spacing', Config)),
				style: listStyle,
				verticalScrollbar: select('verticalScrollbar', prop.scrollbarOption, Config),
				wrap: wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]
			};

			return (
				<Scroller >
					<VirtualList {...listProps} key="1" />
					<VirtualList {...listProps} key="2" />
					<VirtualList {...listProps} key="3" />
				</Scroller>
			);
		},
		{propTables: [Config]}
	)
	.add(
		'with more items',
		() => {
			return (
				<VirtualList
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					focusableScrollbar={boolean('focusableScrollbar', Config)}
					horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, Config)}
					itemRenderer={renderItem(StatefulSwitchItem, ri.scale(number('itemSize', Config, 72)), true)}
					itemSize={ri.scale(number('itemSize', Config, 72))}
					noScrollByWheel={boolean('noScrollByWheel', Config)}
					onKeyDown={action('onKeyDown')}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', Config))}
					spotlightDisabled={boolean('spotlightDisabled', Config, false)}
					verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, Config)}
					wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]}
				/>
			);
		},
		{propTables: [Config]}
	)
	.add(
		'in Panels',
		context => {
			context.noPanels = true;
			const title = `${context.kind} ${context.story}`.trim();
			return (
				<InPanels
					title={title}
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					focusableScrollbar={boolean('focusableScrollbar', Config)}
					horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, Config)}
					itemSize={ri.scale(number('itemSize', Config, 72))}
					noScrollByWheel={boolean('noScrollByWheel', Config)}
					onKeyDown={action('onKeyDown')}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', Config))}
					spotlightDisabled={boolean('spotlightDisabled', Config, false)}
					verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, Config)}
					wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]}
				/>
			);
		}
	);
