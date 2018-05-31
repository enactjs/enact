import SelectableItem from '@enact/moonstone/SelectableItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

SelectableItem.displayName = 'SelectableItem';

storiesOf('Moonstone', module)
	.add(
		'SelectableItem',
		withInfo({
			propTablesExclude: [SelectableItem],
			text: 'Basic usage of SelectableItem'
		})(() => (
			<SelectableItem
				disabled={boolean('disabled', false)}
				inline={nullify(boolean('inline', false))}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SelectableItem')}
			</SelectableItem>
		))
	);
