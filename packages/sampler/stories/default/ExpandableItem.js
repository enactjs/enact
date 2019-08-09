import ExpandableItem, {Expandable, ExpandableItemBase} from '@enact/moonstone/ExpandableItem';
import Icon from '@enact/moonstone/Icon';
import Item from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import {action, mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('ExpandableItem', Expandable, ExpandableItem, ExpandableItemBase);
ExpandableItem.displayName = 'ExpandableItem';
Icon.displayName = 'Icon';
Item.displayName = 'Item';

storiesOf('Moonstone', module)
	.add(
		'ExpandableItem',
		() => (
			<ExpandableItem
				autoClose={boolean('autoClose', Config)}
				disabled={boolean('disabled', Config)}
				label={text('label', Config, 'label')}
				lockBottom={boolean('lockBottom', Config)}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				showLabel={select('showLabel', ['always', 'never', 'auto'], Config)}
				title={text('title', Config, 'title')}
			>
				<Item>
					This can be any type of content you might want to
					render inside a labeled expandable container
				</Item>
				<Item>
					<Icon>star</Icon> You could include other components as well <Icon>star</Icon>
				</Item>
			</ExpandableItem>
		),
		{
			info: {
				text: 'Basic usage of ExpandableItem'
			}
		}
	);
