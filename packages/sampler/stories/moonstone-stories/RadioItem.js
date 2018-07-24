import RadioItem from '@enact/moonstone/RadioItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('RadioItem', RadioItem);

storiesOf('Moonstone', module)
	.add(
		'RadioItem',
		withInfo({
			propTablesExclude: [RadioItem],
			text: 'Basic usage of RadioItem'
		})(() => (
			<RadioItem
				disabled={boolean('disabled', Config, false)}
				inline={boolean('inline', Config, false)}
				onToggle={action('onToggle')}
			>
				{text('children', Config, 'Hello RadioItem')}
			</RadioItem>
		))
	);
