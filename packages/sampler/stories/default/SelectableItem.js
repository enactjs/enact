import SelectableItem from '@enact/moonstone/SelectableItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('SelectableItem', SelectableItem);
SelectableItem.displayName = 'SelectableItem';

storiesOf('Moonstone', module)
	.add(
		'SelectableItem',
		() => (
			<SelectableItem
				disabled={boolean('disabled', Config)}
				inline={boolean('inline', Config)}
				onToggle={action('onToggle')}
			>
				{text('children', Config, 'Hello SelectableItem')}
			</SelectableItem>
		),
		{
			info: {
				text: 'Basic usage of SelectableItem'
			}
		}
	);
