import React from 'react';
import Button from '@enact/moonstone/Button';
import ContexturePopupDecorator from '@enact/moonstone/ContextualPopupDecorator';
import GridListImageItem from '@enact/moonstone/GridListImageItem';
import Item from '@enact/moonstone/Item';
import {VirtualGridList, VirtualListBase} from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import {ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import {VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList/VirtualListBase';

import {storiesOf} from '@storybook/react';

import {boolean, number, select} from '../../src/enact-knobs';
import {action, mergeComponentMetadata} from '../../src/utils';


const Config = mergeComponentMetadata('VirtualGridList', UiVirtualListBase, UiScrollableBase, VirtualListBase);

const
	defaultDataSize = 1000,
	prop = {
		scrollbarOption: ['auto', 'hidden', 'visible']
	},
	wrapOption = {
		false: false,
		true: true,
		'&quot;noAnimation&quot;': 'noAnimation'
	},
	items = [],
	// eslint-disable-next-line enact/prop-types
	renderItem = ({index, ...rest}) => {
		const {text, subText, source} = items[index];

		return (
			<GridListImageItem
				{...rest}
				caption={text}
				source={source}
				subCaption={subText}
			/>
		);
	};

const updateDataSize = (dataSize) => {
	const
		itemNumberDigits = dataSize > 0 ? ((dataSize - 1) + '').length : 0,
		headingZeros = Array(itemNumberDigits).join('0');

	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		const
			count = (headingZeros + i).slice(-itemNumberDigits),
			text = `Item ${count}`,
			subText = `SubItem ${count}`,
			color = Math.floor((Math.random() * (0x1000000 - 0x101010)) + 0x101010).toString(16),
			source = `http://placehold.it/300x300/${color}/ffffff&text=Image ${i}`;

		items.push({text, subText, source});
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

let itemList = [];
for (let i = 0; i < 60; i++) {
	itemList.push('item' + i);
}

const ContexturePopupButton = ContexturePopupDecorator(Button);

let lastIndex = 0;

class MyVirtualList extends React.Component {
	componentDidMount () {
		this.scrollTo({index: lastIndex, animate: false, focus: true});
	}

	closePopup (index) {
		lastIndex = index;
		// eslint-disable-next-line enact/prop-types
		this.props.closePopup();
	}

	renderItem = ({index, ...rest}) => {
		return (
			/* eslint-disable react/jsx-no-bind */
			<Item key={index} onClick={() => this.closePopup(index)} {...rest}>{itemList[index]}</Item>
		);
	};

	getScrollTo = (scrollTo) => {
		this.scrollTo = scrollTo;
	}

	render () {
		let props = {...this.props};
		delete props.closePopup;

		return (
			<div {...props} style={{width: '915px', height: '600px'}}>
				<VirtualGridList
					dataSize={itemList.length}
					itemRenderer={this.renderItem}
					itemSize={{minWidth: ri.scale(285), minHeight: ri.scale(60)}}
					direction="vertical"
					spacing={ri.scale(0)}
					cbScrollTo={this.getScrollTo}
				/>
			</div>
		);
	}
}

class ButtonAndVirtualGridList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			isPopup: false
		};
	}

	renderPopup = ({...rest}) => {
		return (
			<MyVirtualList {...rest} closePopup={this.closePopup} />
		);
	}

	openPopup = () => {
		this.setState({isPopup: true});
	}

	closePopup = () => {
		this.setState({isPopup: false});
	}

	handleOpen = () => {
		// console.log('onOpen');
	}

	render () {
		return (
			<div>
				<ContexturePopupButton
					open={this.state.isPopup}
					popupComponent={this.renderPopup}
					onClick={this.openPopup}
					direction="right"
					showCloseButton
					spotlightRestrict="self-only"
					onOpen={this.handleOpen}
					onClose={this.closePopup}
				>
					CAT
				</ContexturePopupButton>
			</div>
		);
	}
}

storiesOf('VirtualGridList', module)
	.add(
		'Horizontal VirtualGridList',
		() => (
			<VirtualGridList
				dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
				direction="horizontal"
				focusableScrollbar={boolean('focusableScrollbar', Config)}
				horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, Config)}
				itemRenderer={renderItem}
				itemSize={{
					minWidth: ri.scale(number('minWidth', Config, 180)),
					minHeight: ri.scale(number('minHeight', Config, 270))
				}}
				noScrollByWheel={boolean('noScrollByWheel', Config)}
				onKeyDown={action('onKeyDown')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', Config, 18))}
				spotlightDisabled={boolean('spotlightDisabled', Config, false)}
				verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, Config)}
				wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]}
			/>
		),
		{propTables: [Config]}
	)
	.add(
		'with Button, Spotlight goes to correct target',
		() => (
			<ButtonAndVirtualGridList />
		)
	);
