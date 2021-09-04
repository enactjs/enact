import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, select} from '@enact/storybook-utils/addons/controls';
import {ImageItem as UiImageItem} from '@enact/ui/ImageItem';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import ri from '@enact/ui/resolution';
import {VirtualGridList, VirtualListBasic} from '@enact/ui/VirtualList';

const
	prop = {
		direction: ['horizontal', 'vertical'],
		scrollbarOption: ['auto', 'hidden', 'visible'],
		scrollModeOption: ['native', 'translate']
	},
	items = [],
	defaultDataSize = 1000,
	longContent = 'Lorem ipsum dolor sit amet',
	shouldAddLongContent = ({index, modIndex}) => (
		index % modIndex === 0 ? ` ${longContent}` : ''
	),
	// eslint-disable-next-line enact/prop-types
	uiRenderItem = ({index, ...rest}) => {
		const {text, source} = items[index];

		return (
			<UiImageItem
				{...rest}
				src={source}
				style={{width: '100%'}}
			>
				{text}
			</UiImageItem>
		);
	};

const updateDataSize = (dataSize) => {
	const
		itemNumberDigits = dataSize > 0 ? (dataSize - 1 + '').length : 0,
		headingZeros = Array(itemNumberDigits).join('0');

	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		const
			count = (headingZeros + i).slice(-itemNumberDigits),
			text = `Item ${count}${shouldAddLongContent({index: i, modIndex: 2})}`,
			color = Math.floor(Math.random() * (0x1000000 - 0x101010) + 0x101010).toString(16),
			source = `http://placehold.it/300x300/${color}/ffffff&text=Image ${i}`;

		items.push({text, source});
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

const VirtualGridListConfig = mergeComponentMetadata('VirtualGridList', VirtualListBasic, VirtualGridList);

export default {
	title: 'UI/VirtualList.VirtualGridList',
	component: 'VirtualGridList'
};

export const VirtualListVirtualGridList = (args) => (
	<VirtualGridList
		dataSize={updateDataSize(args['dataSize'])}
		direction={args['direction']}
		horizontalScrollbar={args['horizontalScrollbar']}
		itemRenderer={uiRenderItem}
		itemSize={{
			minWidth: ri.scale(args['minWidth']),
			minHeight: ri.scale(args['minHeight'])
		}}
		key={args['scrollMode']}
		noScrollByWheel={args['noScrollByWheel']}
		onScrollStart={action('onScrollStart')}
		onScrollStop={action('onScrollStop')}
		scrollMode={args['scrollMode']}
		spacing={ri.scale(args['spacing'])}
		verticalScrollbar={args['verticalScrollbar']}
	/>
);

number('dataSize', VirtualListVirtualGridList, VirtualGridListConfig, defaultDataSize);
select('direction', VirtualListVirtualGridList, prop.direction, VirtualGridListConfig);
select('horizontalScrollbar', VirtualListVirtualGridList, prop.scrollbarOption, VirtualGridListConfig);
number('minWidth', VirtualListVirtualGridList, VirtualGridListConfig, 180);
number('minHeight', VirtualListVirtualGridList, VirtualGridListConfig, 270);
select('scrollMode', VirtualListVirtualGridList, prop.scrollModeOption, VirtualGridListConfig);
boolean('noScrollByWheel', VirtualListVirtualGridList, VirtualGridListConfig);
number('spacing', VirtualListVirtualGridList, VirtualGridListConfig, 20);
select('verticalScrollbar', VirtualListVirtualGridList, prop.scrollbarOption, VirtualGridListConfig);

VirtualListVirtualGridList.storyName = 'VirtualList.VirtualGridList';

VirtualListVirtualGridList.parameters = {
	info: {
		text: 'Basic usage of VirtualGridList'
	}
};
