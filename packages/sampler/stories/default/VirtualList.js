import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
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

export const _VirtualList = () => {
	return (
		<VirtualList
			dataSize={updateDataSize(
				number('dataSize', VirtualListConfig, defaultDataSize)
			)}
			horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, VirtualListConfig)}
			itemRenderer={uiRenderItem(ri.scale(number('itemSize', VirtualListConfig, 72)))}
			itemSize={ri.scale(number('itemSize', VirtualListConfig, 72))}
			key={select('scrollMode', prop.scrollModeOption, VirtualListConfig)}
			noScrollByWheel={boolean('noScrollByWheel', VirtualListConfig)}
			onScrollStart={action('onScrollStart')}
			onScrollStop={action('onScrollStop')}
			scrollMode={select('scrollMode', prop.scrollModeOption, VirtualListConfig)}
			spacing={ri.scale(number('spacing', VirtualListConfig))}
			verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, VirtualListConfig)}
		/>
	);
};

_VirtualList.storyName = 'VirtualList';
_VirtualList.parameters = {
	info: {
		text: 'Basic usage of VirtualList'
	}
};
