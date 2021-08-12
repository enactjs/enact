import {action} from '@enact/storybook-utils/addons/actions';
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

VirtualListVirtualGridList.storyName = 'VirtualList.VirtualGridList';

VirtualListVirtualGridList.parameters = {
	info: {
		text: 'Basic usage of VirtualGridList'
	}
};

VirtualListVirtualGridList.args = {
	'dataSize': defaultDataSize,
	'direction': VirtualGridListConfig.defaultProps['direction'],
	'horizontalScrollbar': VirtualGridListConfig.defaultProps['horizontalScrollbar'],
	'minWidth': 180,
	'minHeight': 270,
	'scrollMode': VirtualGridListConfig.defaultProps['scrollMode'],
	'noScrollByWheel': VirtualGridListConfig.defaultProps['noScrollByWheel'],
	'spacing': 20,
	'verticalScrollbar': VirtualGridListConfig.defaultProps['verticalScrollbar']
};

VirtualListVirtualGridList.argTypes = {
	'direction': {
		options: prop.direction,
		control: {
			type: 'select'
		}
	},
	'horizontalScrollbar': {
		options: prop.scrollbarOption,
		control: {
			type: 'select'
		}
	},
	'scrollMode': {
		options: prop.scrollModeOption,
		control: {
			type: 'select'
		}
	},
	'verticalScrollbar': {
		options: prop.scrollbarOption,
		control: {
			type: 'select'
		}
	}
};
