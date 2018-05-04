import {VirtualGridList, VirtualListBase} from '@enact/moonstone/VirtualList';
import {VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList/VirtualListBase';
import GridListImageItem from '@enact/moonstone/GridListImageItem';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, number} from '@storybook/addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('VirtualGridList', VirtualGridList, VirtualListBase, UiVirtualListBase);

const
	dataSize = 1000,
	getItem = (index) => {
		const
			count = ('00' + index).slice(-3),
			text = `Item ${count}`,
			subText = `SubItem ${count}`,
			color = Math.floor((Math.random() * (0x1000000 - 0x101010)) + 0x101010).toString(16),
			source = `http://placehold.it/300x300/${color}/ffffff&text=Image ${index}`;

		return {text, subText, source};
	},
	// eslint-disable-next-line enact/prop-types
	renderItem = ({index, ...rest}) => {
		const {text, subText, source} = getItem(index);

		return (
			<GridListImageItem
				{...rest}
				caption={text}
				source={source}
				subCaption={subText}
			/>
		);
	};

storiesOf('VirtualList.VirtualGridList', module)
	.add(
		'Horizontal VirtualGridList',
		() => (
			<VirtualGridList
				dataSize={number('dataSize', dataSize)}
				direction="horizontal"
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				itemRenderer={renderItem}
				itemSize={{
					minWidth: ri.scale(number('minWidth', 180)),
					minHeight: ri.scale(number('minHeight', 270))
				}}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				spacing={ri.scale(number('spacing', 18))}
				style={{
					height: ri.unit(552, 'rem')
				}}
			/>
		),
		{propTables: [Config]}
	);
