import ExpandableItem from '@enact/moonstone/ExpandableItem';
import Icon from '@enact/moonstone/Icon';
import Item from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

ExpandableItem.displayName = 'ExpandableItem';
Icon.displayName = 'Icon';
Item.displayName = 'Item';

storiesOf('Moonstone', module)
	.add(
		'ExpandableItem',
		withInfo({
			propTablesExclude: [ExpandableItem, Icon, Item],
			text: 'Basic usage of ExpandableItem'
		})(() => (
			<ExpandableItem
				autoClose={nullify(boolean('autoClose', false))}
				disabled={boolean('disabled', false)}
				label={text('label', 'label')}
				lockBottom={nullify(boolean('lockBottom', false))}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				showLabel={select('showLabel', ['always', 'never', 'auto'], 'auto')}
				title={text('title', 'title')}
			>
				<Item>
					This can be any type of content you might want to
					render inside a labeled expandable container
				</Item>
				<Item>
					<Icon>star</Icon> You could include other components as well <Icon>star</Icon>
				</Item>
			</ExpandableItem>
		))
	);
