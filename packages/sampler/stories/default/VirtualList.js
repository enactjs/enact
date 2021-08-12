import {action} from '@enact/storybook-utils/addons/actions';
import {Item as UiItem} from '@enact/ui/Item';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import ri from '@enact/ui/resolution';
import {VirtualList, VirtualListBasic} from '@enact/ui/VirtualList';

const
	prop = {
		scrollbarOption: ['auto', 'hidden', 'visible'],
		scrollModeOption: ['native', 'translate']
	},
	items = [],
	defaultDataSize = 1000,
	// eslint-disable-next-line enact/prop-types, enact/display-name
	uiRenderItem = (size) => ({index, ...rest}) => {
		const itemStyle = {
			borderBottom: ri.unit(3, 'rem') + ' solid #202328',
			boxSizing: 'border-box',
			height: size + 'px'
		};

		return (
			<UiItem {...rest} style={itemStyle}>
				{items[index]}
			</UiItem>
		);
	};

const updateDataSize = (dataSize) => {
	const
		itemNumberDigits = dataSize > 0 ? (dataSize - 1 + '').length : 0,
		headingZeros = Array(itemNumberDigits).join('0');

	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		items.push('Item ' + (headingZeros + i).slice(-itemNumberDigits));
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

const VirtualListConfig = mergeComponentMetadata('VirtualList', VirtualListBasic, VirtualList);

export default {
	title: 'UI/VirtualList',
	component: 'VirtualList'
};

export const _VirtualList = (args) => {
	return (
		<VirtualList
			dataSize={updateDataSize(args['dataSize'])}
			horizontalScrollbar={args['horizontalScrollbar']}
			itemRenderer={uiRenderItem(ri.scale(args['itemSize']))}
			itemSize={ri.scale(args['itemSize'])}
			key={args['scrollMode']}
			noScrollByWheel={args['noScrollByWheel']}
			onScrollStart={action('onScrollStart')}
			onScrollStop={action('onScrollStop')}
			scrollMode={args['scrollMode']}
			spacing={ri.scale(args['spacing'])}
			verticalScrollbar={args['verticalScrollbar']}
		/>
	);
};

_VirtualList.storyName = 'VirtualList';

_VirtualList.parameters = {
	info: {
		text: 'Basic usage of VirtualList'
	}
};

_VirtualList.args = {
	'dataSize': defaultDataSize,
	'horizontalScrollbar': VirtualListConfig.defaultProps['horizontalScrollbar'],
	'itemSize': 72,
	'scrollMode': VirtualListConfig.defaultProps['scrollMode'],
	'noScrollByWheel': VirtualListConfig.defaultProps['noScrollByWheel'],
	'spacing': VirtualListConfig.defaultProps['spacing'],
	'verticalScrollbar': VirtualListConfig.defaultProps['verticalScrollbar']
};

_VirtualList.argTypes = {
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
