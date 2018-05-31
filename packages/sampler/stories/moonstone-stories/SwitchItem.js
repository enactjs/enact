import React from 'react';
import {SwitchItem} from '@enact/moonstone/SwitchItem';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

storiesOf('Moonstone', module)
	.add(
		'SwitchItem',
		withInfo({
			propTablesExclude: [SwitchItem],
			text: 'Basic usage of SwitchItem'
		})(() => (
			<SwitchItem
				disabled={boolean('disabled', false)}
				inline={nullify(boolean('inline', false))}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SwitchItem')}
			</SwitchItem>
		))
	);
