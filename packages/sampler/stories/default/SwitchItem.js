import React from 'react';
import {SwitchItem} from '@enact/moonstone/SwitchItem';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('SwitchItem', SwitchItem);

storiesOf('Moonstone', module)
	.add(
		'SwitchItem',
		() => (
			<SwitchItem
				disabled={boolean('disabled', Config)}
				inline={boolean('inline', Config)}
				onToggle={action('onToggle')}
			>
				{text('children', Config, 'Hello SwitchItem')}
			</SwitchItem>
		),
		{
			info: {
				text: 'Basic usage of SwitchItem'
			}
		}
	);
